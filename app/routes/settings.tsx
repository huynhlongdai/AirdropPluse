import React from "react";
import {
  Zap, Brain, Tags, Shield, CheckCircle2, AlertCircle, XCircle,
  AlertTriangle, Eye, EyeOff, RefreshCw, Plus, Trash2, ChevronDown,
  ExternalLink, Activity, Clock, Key, Star, Bot, Globe, Cpu, Sliders,
} from "lucide-react";
import type { Route } from "./+types/settings";
import {
  mockProviders,
  mockAiMappings,
  mockTaxonomy,
  mockIngestionSettings,
  mockApiLogs,
  AI_MODELS,
  type ProviderIntegration,
  type ApiKey,
  type KeyStatus,
  type AiFeatureMapping,
  type TaxonomyItem,
  type TaxonomyType,
  type IngestionSettings,
} from "~/data/settings";
import styles from "./settings.module.css";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Settings — AirdropPulse" }];
}

type Tab = "integrations" | "ai-config" | "categories" | "agent" | "security";

const TAB_CONFIG: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: "integrations", label: "Integrations",    icon: Zap },
  { id: "ai-config",   label: "AI Configuration", icon: Brain },
  { id: "categories",  label: "Category Manager", icon: Tags },
  { id: "agent",       label: "Agent Settings",   icon: Bot },
  { id: "security",    label: "Security & Logs",  icon: Shield },
];

export default function Settings() {
  const [activeTab, setActiveTab] = React.useState<Tab>("integrations");

  return (
    <div className={styles.page}>
      <header className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Settings & Integrations</h1>
        <p className={styles.pageSubtitle}>
          Manage API connections, AI model routing, taxonomy, and system logs
        </p>
      </header>

      <div className={styles.tabBar}>
        {TAB_CONFIG.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            className={`${styles.tabBtn}${activeTab === id ? ` ${styles.tabBtnActive}` : ""}`}
            onClick={() => setActiveTab(id)}
          >
            <Icon className={styles.tabBtnIcon} />
            {label}
          </button>
        ))}
      </div>

      <div className={styles.tabContent}>
        {activeTab === "integrations" && <IntegrationsTab />}
        {activeTab === "ai-config"    && <AiConfigTab />}
        {activeTab === "categories"   && <CategoriesTab />}
        {activeTab === "agent"        && <AgentSettingsTab />}
        {activeTab === "security"     && <SecurityTab />}
      </div>
    </div>
  );
}

/* ─── Key Status Helpers ─────────────────────────────────────────── */

function KeyStatusBadge({ status }: { status: KeyStatus }) {
  const map: Record<KeyStatus, { icon: React.ElementType; label: string; cls: string }> = {
    active: { icon: CheckCircle2, label: "Active", cls: styles.statusConnected },
    error: { icon: XCircle, label: "Error", cls: styles.statusError },
    exhausted: { icon: AlertTriangle, label: "Exhausted", cls: styles.statusLimited },
    untested: { icon: AlertCircle, label: "Untested", cls: styles.statusDisconnected },
  };
  const { icon: Icon, label, cls } = map[status];
  return (
    <span className={`${styles.statusBadge} ${cls}`}>
      <Icon className={styles.statusBadgeIcon} />
      {label}
    </span>
  );
}

function UsageBar({ percent }: { percent: number }) {
  const barCls =
    percent >= 90 ? styles.usageBarFill_danger
    : percent >= 70 ? styles.usageBarFill_warn
    : styles.usageBarFill_ok;
  return (
    <div className={styles.usageBar}>
      <div className={`${styles.usageBarFill} ${barCls}`} style={{ width: `${percent}%` }} />
    </div>
  );
}

/* ─── INTEGRATIONS TAB ───────────────────────────────────────────── */

function IntegrationsTab() {
  const [providers, setProviders] = React.useState<ProviderIntegration[]>(mockProviders);

  const updateProvider = (providerId: string, updater: (p: ProviderIntegration) => ProviderIntegration) =>
    setProviders((prev) => prev.map((p) => (p.id === providerId ? updater(p) : p)));

  const updateKey = (providerId: string, keyId: string, updater: (k: ApiKey) => ApiKey) =>
    updateProvider(providerId, (p) => ({
      ...p,
      keys: p.keys.map((k) => (k.id === keyId ? updater(k) : k)),
    }));

  const addKey = (providerId: string) =>
    updateProvider(providerId, (p) => ({
      ...p,
      keys: [
        ...p.keys,
        {
          id: `${providerId}-k${Date.now()}`,
          label: `Backup #${p.keys.length}`,
          status: "untested" as KeyStatus,
          isPrimary: false,
        },
      ],
    }));

  const removeKey = (providerId: string, keyId: string) =>
    updateProvider(providerId, (p) => ({
      ...p,
      keys: p.keys.filter((k) => k.id !== keyId),
    }));

  const testKey = async (providerId: string, keyId: string) => {
    updateKey(providerId, keyId, (k) => ({ ...k, status: "untested" }));
    await new Promise((r) => setTimeout(r, 1500));
    updateKey(providerId, keyId, (k) => ({
      ...k,
      status: k.valueMasked ? "active" : "error",
      lastChecked: new Date().toISOString(),
    }));
  };

  const saveKeyValue = (providerId: string, keyId: string, raw: string) => {
    if (!raw.trim()) return;
    const masked = raw.slice(0, 6) + "••••••••••••••••••••••••" + raw.slice(-4);
    updateKey(providerId, keyId, (k) => ({ ...k, valueMasked: masked, status: "untested" }));
  };

  const setPrimary = (providerId: string, keyId: string) =>
    updateProvider(providerId, (p) => ({
      ...p,
      keys: p.keys.map((k) => ({ ...k, isPrimary: k.id === keyId })),
    }));

  const aiProviders = providers.filter((p) => p.category === "ai");
  const scraperProviders = providers.filter((p) => p.category === "scraper");

  return (
    <div className={styles.tabSection}>
      <div className={styles.sectionDescription}>
        Each provider supports <strong>multiple API keys</strong> — the system automatically
        rotates to a backup key when the primary is exhausted or returns an error.
        Mark a key as <strong>Primary</strong> to set the preferred rotation order.
      </div>

      <div className={styles.integrationGroup}>
        <h3 className={styles.groupTitle}>AI Providers</h3>
        <div className={styles.integrationList}>
          {aiProviders.map((provider) => (
            <ProviderCard
              key={provider.id}
              provider={provider}
              onAddKey={() => addKey(provider.id)}
              onRemoveKey={(keyId) => removeKey(provider.id, keyId)}
              onTestKey={(keyId) => testKey(provider.id, keyId)}
              onSaveKeyValue={(keyId, raw) => saveKeyValue(provider.id, keyId, raw)}
              onSetPrimary={(keyId) => setPrimary(provider.id, keyId)}
            />
          ))}
        </div>
      </div>

      <div className={styles.integrationGroup}>
        <h3 className={styles.groupTitle}>Scraper</h3>
        <div className={styles.integrationList}>
          {scraperProviders.map((provider) => (
            <ProviderCard
              key={provider.id}
              provider={provider}
              onAddKey={() => addKey(provider.id)}
              onRemoveKey={(keyId) => removeKey(provider.id, keyId)}
              onTestKey={(keyId) => testKey(provider.id, keyId)}
              onSaveKeyValue={(keyId, raw) => saveKeyValue(provider.id, keyId, raw)}
              onSetPrimary={(keyId) => setPrimary(provider.id, keyId)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

interface ProviderCardProps {
  provider: ProviderIntegration;
  onAddKey: () => void;
  onRemoveKey: (keyId: string) => void;
  onTestKey: (keyId: string) => void;
  onSaveKeyValue: (keyId: string, raw: string) => void;
  onSetPrimary: (keyId: string) => void;
}

function ProviderCard({ provider, onAddKey, onRemoveKey, onTestKey, onSaveKeyValue, onSetPrimary }: ProviderCardProps) {
  const [testing, setTesting] = React.useState<Set<string>>(new Set());
  const [visibleKeys, setVisibleKeys] = React.useState<Set<string>>(new Set());
  const [editingKey, setEditingKey] = React.useState<string | null>(null);
  const [keyDraft, setKeyDraft] = React.useState("");

  const handleTest = async (keyId: string) => {
    setTesting((p) => new Set(p).add(keyId));
    await onTestKey(keyId);
    setTesting((p) => { const n = new Set(p); n.delete(keyId); return n; });
  };

  const toggleVisible = (keyId: string) =>
    setVisibleKeys((p) => {
      const n = new Set(p);
      n.has(keyId) ? n.delete(keyId) : n.add(keyId);
      return n;
    });

  const startEdit = (keyId: string) => { setEditingKey(keyId); setKeyDraft(""); };
  const cancelEdit = () => { setEditingKey(null); setKeyDraft(""); };
  const confirmEdit = (keyId: string) => {
    onSaveKeyValue(keyId, keyDraft);
    cancelEdit();
  };

  // Derive overall provider status from keys
  const hasActive = provider.keys.some((k) => k.status === "active");
  const hasError = provider.keys.every((k) => k.status === "error" || k.status === "exhausted");
  const allUntested = provider.keys.every((k) => k.status === "untested" || !k.valueMasked);
  const providerStatusCls = hasError
    ? styles.integrationCardError
    : allUntested
    ? ""
    : !hasActive
    ? styles.integrationCardLimited
    : "";

  return (
    <div className={`${styles.integrationCard} ${providerStatusCls}`}>
      {/* Provider header */}
      <div className={styles.integrationCardHeader}>
        <div className={styles.integrationIcon} style={{ background: provider.iconColor }}>
          {provider.name.charAt(0)}
        </div>
        <div className={styles.integrationInfo}>
          <div className={styles.integrationName}>
            {provider.name}
            <span className={styles.integrationProvider}>{provider.provider}</span>
          </div>
          <p className={styles.integrationDesc}>{provider.description}</p>
        </div>
        <div className={styles.integrationActions}>
          <span className={styles.keyCountBadge}>
            <Key className={styles.keyCountIcon} />
            {provider.keys.filter((k) => k.valueMasked).length} / {provider.keys.length} keys
          </span>
          {provider.docsUrl && (
            <a href={provider.docsUrl} target="_blank" rel="noopener noreferrer" className={styles.docsLink} title="Documentation">
              <ExternalLink className={styles.docsLinkIcon} />
            </a>
          )}
        </div>
      </div>

      {/* Keys list */}
      <div className={styles.keyList}>
        {provider.keys.map((apiKey, idx) => (
          <div
            key={apiKey.id}
            className={`${styles.keyRow} ${apiKey.isPrimary ? styles.keyRowPrimary : ""}`}
          >
            <div className={styles.keyRowTop}>
              {/* Order indicator */}
              <span className={styles.keyOrder}>{idx + 1}</span>

              {/* Label + primary badge */}
              <div className={styles.keyMeta}>
                <span className={styles.keyLabel}>{apiKey.label}</span>
                {apiKey.isPrimary && (
                  <span className={styles.primaryBadge}>
                    <Star className={styles.primaryBadgeIcon} />
                    Primary
                  </span>
                )}
              </div>

              {/* Key value */}
              {editingKey === apiKey.id ? (
                <div className={styles.apiKeyEditRow}>
                  <input
                    type="password"
                    className={styles.apiKeyInput}
                    value={keyDraft}
                    onChange={(e) => setKeyDraft(e.target.value)}
                    placeholder="Paste API key..."
                    autoFocus
                    onKeyDown={(e) => e.key === "Enter" && confirmEdit(apiKey.id)}
                  />
                  <button className={styles.btnSm} onClick={() => confirmEdit(apiKey.id)}>Save</button>
                  <button className={`${styles.btnSm} ${styles.btnSmGhost}`} onClick={cancelEdit}>Cancel</button>
                </div>
              ) : (
                <div className={styles.apiKeyDisplay}>
                  <code className={styles.apiKeyCode}>
                    {apiKey.valueMasked
                      ? visibleKeys.has(apiKey.id)
                        ? apiKey.valueMasked
                        : "••••••••••••••••••••••••••••"
                      : "Not configured"}
                  </code>
                  {apiKey.valueMasked && (
                    <button className={styles.iconBtn} onClick={() => toggleVisible(apiKey.id)} title={visibleKeys.has(apiKey.id) ? "Hide" : "Show"}>
                      {visibleKeys.has(apiKey.id) ? <EyeOff className={styles.iconBtnIcon} /> : <Eye className={styles.iconBtnIcon} />}
                    </button>
                  )}
                </div>
              )}

              {/* Status */}
              <KeyStatusBadge status={apiKey.status} />

              {/* Actions */}
              <div className={styles.keyActions}>
                {editingKey !== apiKey.id && (
                  <button className={styles.btnSm} onClick={() => startEdit(apiKey.id)}>
                    {apiKey.valueMasked ? "Update" : "Add Key"}
                  </button>
                )}
                <button
                  className={`${styles.btnSm} ${styles.btnSmAccent}`}
                  onClick={() => handleTest(apiKey.id)}
                  disabled={testing.has(apiKey.id)}
                >
                  {testing.has(apiKey.id)
                    ? <><RefreshCw className={styles.spinIcon} /> Testing...</>
                    : "Test"}
                </button>
                {!apiKey.isPrimary && (
                  <button
                    className={`${styles.btnSm} ${styles.btnSmGhost}`}
                    onClick={() => onSetPrimary(apiKey.id)}
                    title="Set as primary"
                  >
                    <Star className={styles.btnIcon} />
                    Set Primary
                  </button>
                )}
                {provider.keys.length > 1 && (
                  <button
                    className={styles.keyDeleteBtn}
                    onClick={() => onRemoveKey(apiKey.id)}
                    title="Remove key"
                  >
                    <Trash2 className={styles.keyDeleteIcon} />
                  </button>
                )}
              </div>
            </div>

            {/* Usage info */}
            {apiKey.usagePercent !== undefined && (
              <div className={styles.keyUsageRow}>
                <div className={styles.usageRow}>
                  <span className={styles.usageLabel}>{apiKey.usageLabel}</span>
                  {apiKey.quotaLimit && <span className={styles.usageQuota}>{apiKey.quotaLimit}</span>}
                </div>
                <UsageBar percent={apiKey.usagePercent} />
              </div>
            )}

            {/* Last checked */}
            {apiKey.lastChecked && (
              <span className={styles.lastChecked}>
                <Clock className={styles.lastCheckedIcon} />
                Checked {new Date(apiKey.lastChecked).toLocaleTimeString()}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Add key button */}
      <button className={styles.addKeyBtn} onClick={onAddKey}>
        <Plus className={styles.btnIcon} />
        Add API Key
      </button>
    </div>
  );
}

/* ─── AI CONFIG TAB ──────────────────────────────────────────────── */

function AiConfigTab() {
  const [mappings, setMappings] = React.useState<AiFeatureMapping[]>(mockAiMappings);
  const [saved, setSaved] = React.useState<string | null>(null);

  const update = (feature: string, field: keyof AiFeatureMapping, value: string | number) => {
    setMappings((prev) => prev.map((m) => (m.feature === feature ? { ...m, [field]: value } : m)));
  };

  const save = (feature: string) => {
    setSaved(feature);
    setTimeout(() => setSaved(null), 2000);
  };

  return (
    <div className={styles.tabSection}>
      <div className={styles.sectionDescription}>
        Assign specific AI models to each application feature. Configure temperature and token limits
        to optimize output quality and cost. A <strong>fallback model</strong> is used automatically
        if the primary fails or exceeds quota.
      </div>

      <div className={styles.aiGrid}>
        {mappings.map((mapping) => (
          <AiMappingCard
            key={mapping.feature}
            mapping={mapping}
            onUpdate={(field, value) => update(mapping.feature, field, value)}
            isSaved={saved === mapping.feature}
            onSave={() => save(mapping.feature)}
          />
        ))}
      </div>
    </div>
  );
}

interface AiMappingCardProps {
  mapping: AiFeatureMapping;
  onUpdate: (field: keyof AiFeatureMapping, value: string | number) => void;
  isSaved: boolean;
  onSave: () => void;
}

function AiMappingCard({ mapping, onUpdate, isSaved, onSave }: AiMappingCardProps) {
  return (
    <div className={styles.aiCard}>
      <div className={styles.aiCardHeader}>
        <div>
          <div className={styles.aiCardTitle}>{mapping.featureLabel}</div>
          <div className={styles.aiCardDesc}>{mapping.featureDescription}</div>
        </div>
        {isSaved && <span className={styles.savedBadge}><CheckCircle2 className={styles.savedBadgeIcon} /> Saved</span>}
      </div>

      <div className={styles.aiFields}>
        <div className={styles.aiField}>
          <label className={styles.aiFieldLabel}>Primary Model</label>
          <div className={styles.selectWrapper}>
            <select
              className={styles.aiSelect}
              value={mapping.primaryModel}
              onChange={(e) => onUpdate("primaryModel", e.target.value)}
            >
              {AI_MODELS.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
            <ChevronDown className={styles.selectChevron} />
          </div>
        </div>

        <div className={styles.aiField}>
          <label className={styles.aiFieldLabel}>Fallback Model</label>
          <div className={styles.selectWrapper}>
            <select
              className={styles.aiSelect}
              value={mapping.fallbackModel}
              onChange={(e) => onUpdate("fallbackModel", e.target.value)}
            >
              {AI_MODELS.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
            <ChevronDown className={styles.selectChevron} />
          </div>
        </div>

        <div className={styles.aiFieldRow}>
          <div className={styles.aiField}>
            <label className={styles.aiFieldLabel}>Temperature <span className={styles.paramValue}>{mapping.temperature}</span></label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={mapping.temperature}
              onChange={(e) => onUpdate("temperature", parseFloat(e.target.value))}
              className={styles.rangeInput}
            />
            <div className={styles.rangeLabels}><span>Precise</span><span>Creative</span></div>
          </div>

          <div className={styles.aiField}>
            <label className={styles.aiFieldLabel}>Max Tokens <span className={styles.paramValue}>{mapping.maxTokens.toLocaleString()}</span></label>
            <input
              type="range"
              min="256"
              max="8192"
              step="256"
              value={mapping.maxTokens}
              onChange={(e) => onUpdate("maxTokens", parseInt(e.target.value))}
              className={styles.rangeInput}
            />
            <div className={styles.rangeLabels}><span>256</span><span>8,192</span></div>
          </div>
        </div>
      </div>

      <button className={styles.btnPrimary} onClick={onSave}>Save Configuration</button>
    </div>
  );
}

/* ─── CATEGORIES TAB ─────────────────────────────────────────────── */

const TAXONOMY_SECTIONS: { type: TaxonomyType; label: string; description: string }[] = [
  { type: "project-category", label: "Project Categories", description: "Ecosystem tags applied to projects (L1, L2, DeFi, etc.)" },
  { type: "task-tag", label: "Task Tags", description: "Labels used to classify task types (On-chain, Social, KYC, etc.)" },
  { type: "project-status", label: "Project Statuses", description: "Lifecycle states for projects." },
];

const TAG_COLORS = ["#3e63dd", "#8e4ec6", "#d6409f", "#e5484d", "#e54d2e", "#f76b15", "#46a758", "#12a594", "#00a2c7", "#ffc53d"];

function CategoriesTab() {
  const [items, setItems] = React.useState<TaxonomyItem[]>(mockTaxonomy);
  const [adding, setAdding] = React.useState<TaxonomyType | null>(null);
  const [newLabel, setNewLabel] = React.useState("");
  const [newColor, setNewColor] = React.useState(TAG_COLORS[0]);

  const addItem = () => {
    if (!newLabel.trim() || !adding) return;
    const item: TaxonomyItem = {
      id: `tax-${Date.now()}`,
      type: adding,
      label: newLabel.trim(),
      color: newColor,
      builtIn: false,
      usageCount: 0,
    };
    setItems((prev) => [...prev, item]);
    setNewLabel("");
    setAdding(null);
  };

  const removeItem = (id: string) => setItems((prev) => prev.filter((i) => i.id !== id));

  return (
    <div className={styles.tabSection}>
      <div className={styles.sectionDescription}>
        Define and manage the taxonomy used across projects and tasks. Built-in items cannot be
        deleted but can be used freely. Custom items can be removed when no longer needed.
      </div>

      {TAXONOMY_SECTIONS.map(({ type, label, description }) => {
        const sectionItems = items.filter((i) => i.type === type);
        return (
          <div key={type} className={styles.taxonomySection}>
            <div className={styles.taxonomyHeader}>
              <div>
                <h3 className={styles.taxonomyTitle}>{label}</h3>
                <p className={styles.taxonomyDesc}>{description}</p>
              </div>
              <button
                className={styles.btnOutline}
                onClick={() => { setAdding(type); setNewLabel(""); setNewColor(TAG_COLORS[0]); }}
              >
                <Plus className={styles.btnIcon} />
                Add
              </button>
            </div>

            <div className={styles.tagList}>
              {sectionItems.map((item) => (
                <div key={item.id} className={styles.tagItem}>
                  <span className={styles.tagDot} style={{ background: item.color }} />
                  <span className={styles.tagLabel}>{item.label}</span>
                  <span className={styles.tagUsage}>{item.usageCount} uses</span>
                  {item.builtIn
                    ? <span className={styles.tagBuiltIn}>Built-in</span>
                    : (
                      <button className={styles.tagDelete} onClick={() => removeItem(item.id)} title="Delete">
                        <Trash2 className={styles.tagDeleteIcon} />
                      </button>
                    )
                  }
                </div>
              ))}

              {adding === type && (
                <div className={styles.tagAddRow}>
                  <div className={styles.colorPicker}>
                    {TAG_COLORS.map((c) => (
                      <button
                        key={c}
                        className={`${styles.colorDot}${newColor === c ? ` ${styles.colorDotActive}` : ""}`}
                        style={{ background: c }}
                        onClick={() => setNewColor(c)}
                      />
                    ))}
                  </div>
                  <input
                    className={styles.tagInput}
                    placeholder="Label name..."
                    value={newLabel}
                    onChange={(e) => setNewLabel(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addItem()}
                    autoFocus
                  />
                  <button className={styles.btnSm} onClick={addItem}>Add</button>
                  <button className={`${styles.btnSm} ${styles.btnSmGhost}`} onClick={() => setAdding(null)}>Cancel</button>
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* Ingestion Settings */}
      <IngestionSettingsSection />
    </div>
  );
}

function IngestionSettingsSection() {
  const [settings, setSettings] = React.useState<IngestionSettings>(mockIngestionSettings);
  const [domainInput, setDomainInput] = React.useState("");
  const [saved, setSaved] = React.useState(false);

  const addDomain = () => {
    if (!domainInput.trim()) return;
    setSettings((p) => ({ ...p, priorityDomains: [...p.priorityDomains, domainInput.trim()] }));
    setDomainInput("");
  };

  const removeDomain = (d: string) =>
    setSettings((p) => ({ ...p, priorityDomains: p.priorityDomains.filter((x) => x !== d) }));

  const saveSettings = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className={styles.ingestionSection}>
      <div className={styles.taxonomyHeader}>
        <div>
          <h3 className={styles.taxonomyTitle}>Ingestion Settings</h3>
          <p className={styles.taxonomyDesc}>Configure Firecrawl and CometAPI data collection behavior.</p>
        </div>
        {saved && <span className={styles.savedBadge}><CheckCircle2 className={styles.savedBadgeIcon} /> Saved</span>}
      </div>

      <div className={styles.ingestionGrid}>
        <label className={styles.ingestionToggle}>
          <input
            type="checkbox"
            className={styles.ingestionCheckbox}
            checked={settings.autoScrapeEnabled}
            onChange={(e) => setSettings((p) => ({ ...p, autoScrapeEnabled: e.target.checked }))}
          />
          <span className={styles.ingestionToggleText}>
            <span className={styles.ingestionToggleLabel}>Auto-scrape enabled</span>
            <span className={styles.ingestionToggleDesc}>Automatically fetch new data on schedule</span>
          </span>
        </label>

        <label className={styles.ingestionToggle}>
          <input
            type="checkbox"
            className={styles.ingestionCheckbox}
            checked={settings.skipImages}
            onChange={(e) => setSettings((p) => ({ ...p, skipImages: e.target.checked }))}
          />
          <span className={styles.ingestionToggleText}>
            <span className={styles.ingestionToggleLabel}>Skip images</span>
            <span className={styles.ingestionToggleDesc}>Ignore image assets during crawl</span>
          </span>
        </label>

        <label className={styles.ingestionToggle}>
          <input
            type="checkbox"
            className={styles.ingestionCheckbox}
            checked={settings.deduplication}
            onChange={(e) => setSettings((p) => ({ ...p, deduplication: e.target.checked }))}
          />
          <span className={styles.ingestionToggleText}>
            <span className={styles.ingestionToggleLabel}>Deduplication</span>
            <span className={styles.ingestionToggleDesc}>Skip already-ingested URLs</span>
          </span>
        </label>

        <div className={styles.ingestionField}>
          <label className={styles.ingestionFieldLabel}>
            Crawl Depth <span className={styles.paramValue}>{settings.crawlDepth}</span>
          </label>
          <input
            type="range" min="1" max="10" step="1"
            value={settings.crawlDepth}
            onChange={(e) => setSettings((p) => ({ ...p, crawlDepth: parseInt(e.target.value) }))}
            className={styles.rangeInput}
          />
        </div>

        <div className={styles.ingestionField}>
          <label className={styles.ingestionFieldLabel}>
            Scrape Interval <span className={styles.paramValue}>{settings.scrapeIntervalHours}h</span>
          </label>
          <input
            type="range" min="1" max="24" step="1"
            value={settings.scrapeIntervalHours}
            onChange={(e) => setSettings((p) => ({ ...p, scrapeIntervalHours: parseInt(e.target.value) }))}
            className={styles.rangeInput}
          />
        </div>

        <div className={styles.ingestionField}>
          <label className={styles.ingestionFieldLabel}>
            Max Items/Run <span className={styles.paramValue}>{settings.maxItemsPerRun}</span>
          </label>
          <input
            type="range" min="10" max="200" step="10"
            value={settings.maxItemsPerRun}
            onChange={(e) => setSettings((p) => ({ ...p, maxItemsPerRun: parseInt(e.target.value) }))}
            className={styles.rangeInput}
          />
        </div>
      </div>

      <div className={styles.priorityDomains}>
        <div className={styles.ingestionFieldLabel}>Priority Domains</div>
        <div className={styles.domainList}>
          {settings.priorityDomains.map((d) => (
            <span key={d} className={styles.domainTag}>
              {d}
              <button className={styles.domainRemove} onClick={() => removeDomain(d)}>×</button>
            </span>
          ))}
        </div>
        <div className={styles.domainAddRow}>
          <input
            className={styles.tagInput}
            placeholder="e.g. blog.arbitrum.io"
            value={domainInput}
            onChange={(e) => setDomainInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addDomain()}
          />
          <button className={styles.btnSm} onClick={addDomain}>Add Domain</button>
        </div>
      </div>

      <button className={styles.btnPrimary} onClick={saveSettings}>Save Ingestion Settings</button>
    </div>
  );
}

/* ─── SECURITY & LOGS TAB ────────────────────────────────────────── */

function SecurityTab() {
  const [logs] = React.useState(mockApiLogs);
  const [filter, setFilter] = React.useState<"all" | "success" | "error">("all");

  const filtered = filter === "all" ? logs : logs.filter((l) => (filter === "success" ? l.success : !l.success));

  const totalCost = logs.reduce((s, l) => s + (l.costUsd ?? 0), 0);
  const totalTokens = logs.reduce((s, l) => s + (l.tokensUsed ?? 0), 0);
  const errorCount = logs.filter((l) => !l.success).length;

  return (
    <div className={styles.tabSection}>
      <div className={styles.sectionDescription}>
        Monitor all API requests made to external services. Track costs, latency, and errors to
        optimize your integration usage.
      </div>

      <div className={styles.logStats}>
        <div className={styles.logStat}>
          <Activity className={styles.logStatIcon} />
          <div>
            <div className={styles.logStatValue}>{logs.length}</div>
            <div className={styles.logStatLabel}>Total Requests</div>
          </div>
        </div>
        <div className={styles.logStat}>
          <CheckCircle2 className={`${styles.logStatIcon} ${styles.logStatIconSuccess}`} />
          <div>
            <div className={styles.logStatValue}>{logs.length - errorCount}</div>
            <div className={styles.logStatLabel}>Successful</div>
          </div>
        </div>
        <div className={styles.logStat}>
          <XCircle className={`${styles.logStatIcon} ${styles.logStatIconError}`} />
          <div>
            <div className={styles.logStatValue}>{errorCount}</div>
            <div className={styles.logStatLabel}>Errors</div>
          </div>
        </div>
        <div className={styles.logStat}>
          <Brain className={styles.logStatIcon} />
          <div>
            <div className={styles.logStatValue}>{totalTokens.toLocaleString()}</div>
            <div className={styles.logStatLabel}>Tokens Used</div>
          </div>
        </div>
        <div className={styles.logStat}>
          <span className={styles.logStatIconDollar}>$</span>
          <div>
            <div className={styles.logStatValue}>${totalCost.toFixed(3)}</div>
            <div className={styles.logStatLabel}>Est. Cost</div>
          </div>
        </div>
      </div>

      <div className={styles.logFilterRow}>
        {(["all", "success", "error"] as const).map((f) => (
          <button
            key={f}
            className={`${styles.filterBtn}${filter === f ? ` ${styles.filterBtnActive}` : ""}`}
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div className={styles.logTable}>
        <div className={styles.logTableHeader}>
          <span>Timestamp</span>
          <span>Service</span>
          <span>Endpoint</span>
          <span>Status</span>
          <span>Latency</span>
          <span>Tokens</span>
          <span>Cost</span>
        </div>
        {filtered.map((log) => (
          <div key={log.id} className={`${styles.logRow}${!log.success ? ` ${styles.logRowError}` : ""}`}>
            <span className={styles.logTime}>{new Date(log.timestamp).toLocaleTimeString()}</span>
            <span className={styles.logService}>{log.service}</span>
            <span className={styles.logEndpoint}>
              <code>{log.endpoint}</code>
            </span>
            <span>
              <span className={`${styles.logStatus} ${log.success ? styles.logStatusOk : styles.logStatusErr}`}>
                {log.statusCode}
              </span>
            </span>
            <span className={styles.logMeta}>{log.latencyMs}ms</span>
            <span className={styles.logMeta}>{log.tokensUsed ? log.tokensUsed.toLocaleString() : "—"}</span>
            <span className={styles.logMeta}>{log.costUsd ? `$${log.costUsd.toFixed(3)}` : "—"}</span>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className={styles.logEmpty}>No {filter} logs found.</div>
        )}
      </div>

      {filtered.some((l) => l.errorMessage) && (
        <div className={styles.errorDetails}>
          <h4 className={styles.errorDetailsTitle}>Error Details</h4>
          {filtered.filter((l) => l.errorMessage).map((l) => (
            <div key={l.id} className={styles.errorDetailItem}>
              <span className={styles.errorDetailService}>{l.service}</span>
              <span className={styles.errorDetailMsg}>{l.errorMessage}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── AGENT SETTINGS TAB ─────────────────────────────────────────── */

function AgentSettingsTab() {
  const [browserEndpoint, setBrowserEndpoint]         = React.useState("https://connect.browserbase.com");
  const [apiKey, setApiKey]                           = React.useState("bb_live_••••••••••••••••");
  const [showApiKey, setShowApiKey]                   = React.useState(false);
  const [concurrentJobs, setConcurrentJobs]           = React.useState(3);
  const [jobTimeout, setJobTimeout]                   = React.useState(300);
  const [retryOnFail, setRetryOnFail]                 = React.useState(true);
  const [maxRetries, setMaxRetries]                   = React.useState(2);
  const [screenshotOnFail, setScreenshotOnFail]       = React.useState(true);
  const [proxyEnabled, setProxyEnabled]               = React.useState(false);
  const [proxyHost, setProxyHost]                     = React.useState("");
  const [proxyPort, setProxyPort]                     = React.useState("8080");
  const [proxyUser, setProxyUser]                     = React.useState("");
  const [humanDelay, setHumanDelay]                   = React.useState(true);
  const [delayMin, setDelayMin]                       = React.useState(1000);
  const [delayMax, setDelayMax]                       = React.useState(4000);
  const [webhookUrl, setWebhookUrl]                   = React.useState("");
  const [notifyOnComplete, setNotifyOnComplete]       = React.useState(true);
  const [notifyOnFail, setNotifyOnFail]               = React.useState(true);

  function save() { /* TODO: persist */ }

  return (
    <div className={styles.agentPage}>
      {/* ── Status banner ── */}
      <div className={styles.agentStatusBanner}>
        <div className={styles.agentStatusLeft}>
          <span className={styles.agentStatusDot} />
          <div>
            <div className={styles.agentStatusTitle}>Agent Runner Status</div>
            <div className={styles.agentStatusSub}>0 active jobs · Browserbase connected</div>
          </div>
        </div>
        <button className={styles.agentTestBtn}>
          <RefreshCw size={13}/> Test Connection
        </button>
      </div>

      <div className={styles.agentGrid}>

        {/* ── Browser / Session ── */}
        <div className={styles.agentCard}>
          <div className={styles.agentCardHeader}>
            <span className={styles.agentCardIcon} style={{ background: "#dbeafe", color: "#2563eb" }}><Globe size={15}/></span>
            <div>
              <div className={styles.agentCardTitle}>Browser Session</div>
              <div className={styles.agentCardSub}>Browserbase Chromium configuration</div>
            </div>
          </div>
          <div className={styles.agentFields}>
            <div className={styles.agentField}>
              <label className={styles.agentLabel}>Browserbase Endpoint</label>
              <input className={styles.agentInput} value={browserEndpoint} onChange={e => setBrowserEndpoint(e.target.value)} />
            </div>
            <div className={styles.agentField}>
              <label className={styles.agentLabel}>API Key</label>
              <div className={styles.agentInputRow}>
                <input
                  className={styles.agentInput}
                  type={showApiKey ? "text" : "password"}
                  value={apiKey}
                  onChange={e => setApiKey(e.target.value)}
                  style={{ flex: 1 }}
                />
                <button className={styles.agentIconBtn} onClick={() => setShowApiKey(v => !v)}>
                  {showApiKey ? <EyeOff size={14}/> : <Eye size={14}/>}
                </button>
              </div>
            </div>
            <div className={styles.agentFieldRow}>
              <div className={styles.agentField}>
                <label className={styles.agentLabel}>Max Concurrent Jobs</label>
                <input className={styles.agentInput} type="number" min={1} max={10} value={concurrentJobs} onChange={e => setConcurrentJobs(+e.target.value)} />
              </div>
              <div className={styles.agentField}>
                <label className={styles.agentLabel}>Job Timeout (sec)</label>
                <input className={styles.agentInput} type="number" min={60} max={3600} value={jobTimeout} onChange={e => setJobTimeout(+e.target.value)} />
              </div>
            </div>
          </div>
        </div>

        {/* ── Proxy ── */}
        <div className={styles.agentCard}>
          <div className={styles.agentCardHeader}>
            <span className={styles.agentCardIcon} style={{ background: "#ede9fe", color: "#7c3aed" }}><Sliders size={15}/></span>
            <div>
              <div className={styles.agentCardTitle}>Proxy Settings</div>
              <div className={styles.agentCardSub}>Route agent traffic through proxy (optional)</div>
            </div>
            <label className={styles.agentToggle}>
              <input type="checkbox" checked={proxyEnabled} onChange={e => setProxyEnabled(e.target.checked)} />
              <span className={styles.agentToggleSlider} />
            </label>
          </div>
          {proxyEnabled && (
            <div className={styles.agentFields}>
              <div className={styles.agentFieldRow}>
                <div className={styles.agentField} style={{ flex: 2 }}>
                  <label className={styles.agentLabel}>Proxy Host</label>
                  <input className={styles.agentInput} value={proxyHost} onChange={e => setProxyHost(e.target.value)} placeholder="proxy.example.com" />
                </div>
                <div className={styles.agentField} style={{ flex: 1 }}>
                  <label className={styles.agentLabel}>Port</label>
                  <input className={styles.agentInput} value={proxyPort} onChange={e => setProxyPort(e.target.value)} placeholder="8080" />
                </div>
              </div>
              <div className={styles.agentField}>
                <label className={styles.agentLabel}>Username (optional)</label>
                <input className={styles.agentInput} value={proxyUser} onChange={e => setProxyUser(e.target.value)} placeholder="proxyuser" />
              </div>
            </div>
          )}
          {!proxyEnabled && (
            <div className={styles.agentDisabledMsg}>Enable to route agent browser traffic through a proxy server</div>
          )}
        </div>

        {/* ── Behavior ── */}
        <div className={styles.agentCard}>
          <div className={styles.agentCardHeader}>
            <span className={styles.agentCardIcon} style={{ background: "#dcfce7", color: "#16a34a" }}><Cpu size={15}/></span>
            <div>
              <div className={styles.agentCardTitle}>Execution Behavior</div>
              <div className={styles.agentCardSub}>How the agent interacts with pages</div>
            </div>
          </div>
          <div className={styles.agentFields}>
            <label className={styles.agentCheckRow}>
              <input type="checkbox" checked={humanDelay} onChange={e => setHumanDelay(e.target.checked)} />
              <div>
                <div className={styles.agentCheckLabel}>Human-like delay</div>
                <div className={styles.agentCheckSub}>Random pause between actions to avoid bot detection</div>
              </div>
            </label>
            {humanDelay && (
              <div className={styles.agentFieldRow}>
                <div className={styles.agentField}>
                  <label className={styles.agentLabel}>Min delay (ms)</label>
                  <input className={styles.agentInput} type="number" value={delayMin} onChange={e => setDelayMin(+e.target.value)} />
                </div>
                <div className={styles.agentField}>
                  <label className={styles.agentLabel}>Max delay (ms)</label>
                  <input className={styles.agentInput} type="number" value={delayMax} onChange={e => setDelayMax(+e.target.value)} />
                </div>
              </div>
            )}
            <label className={styles.agentCheckRow}>
              <input type="checkbox" checked={retryOnFail} onChange={e => setRetryOnFail(e.target.checked)} />
              <div>
                <div className={styles.agentCheckLabel}>Retry on failure</div>
                <div className={styles.agentCheckSub}>Automatically retry failed steps</div>
              </div>
            </label>
            {retryOnFail && (
              <div className={styles.agentField}>
                <label className={styles.agentLabel}>Max retries</label>
                <input className={styles.agentInput} type="number" min={1} max={5} value={maxRetries} onChange={e => setMaxRetries(+e.target.value)} style={{ maxWidth: 100 }} />
              </div>
            )}
            <label className={styles.agentCheckRow}>
              <input type="checkbox" checked={screenshotOnFail} onChange={e => setScreenshotOnFail(e.target.checked)} />
              <div>
                <div className={styles.agentCheckLabel}>Screenshot on failure</div>
                <div className={styles.agentCheckSub}>Save screenshot when a step fails for debugging</div>
              </div>
            </label>
          </div>
        </div>

        {/* ── Notifications / Webhook ── */}
        <div className={styles.agentCard}>
          <div className={styles.agentCardHeader}>
            <span className={styles.agentCardIcon} style={{ background: "#fef3c7", color: "#c9a028" }}><Zap size={15}/></span>
            <div>
              <div className={styles.agentCardTitle}>Notifications & Webhook</div>
              <div className={styles.agentCardSub}>Get notified when agent jobs complete</div>
            </div>
          </div>
          <div className={styles.agentFields}>
            <div className={styles.agentField}>
              <label className={styles.agentLabel}>Webhook URL (optional)</label>
              <input className={styles.agentInput} value={webhookUrl} onChange={e => setWebhookUrl(e.target.value)} placeholder="https://your-server.com/webhook" />
              <span className={styles.agentFieldHint}>POST request sent with job result JSON when job completes</span>
            </div>
            <label className={styles.agentCheckRow}>
              <input type="checkbox" checked={notifyOnComplete} onChange={e => setNotifyOnComplete(e.target.checked)} />
              <div>
                <div className={styles.agentCheckLabel}>Notify on completion</div>
                <div className={styles.agentCheckSub}>Fire webhook when job succeeds</div>
              </div>
            </label>
            <label className={styles.agentCheckRow}>
              <input type="checkbox" checked={notifyOnFail} onChange={e => setNotifyOnFail(e.target.checked)} />
              <div>
                <div className={styles.agentCheckLabel}>Notify on failure</div>
                <div className={styles.agentCheckSub}>Fire webhook when job fails or times out</div>
              </div>
            </label>
          </div>
        </div>
      </div>

      <div className={styles.agentFooter}>
        <button className={styles.agentSaveBtn} onClick={save}>
          Save Agent Settings
        </button>
      </div>
    </div>
  );
}
