import React from "react";
import {
  Zap,
  Brain,
  Tags,
  Shield,
  CheckCircle2,
  AlertCircle,
  XCircle,
  AlertTriangle,
  Eye,
  EyeOff,
  RefreshCw,
  Plus,
  Trash2,
  ChevronDown,
  ExternalLink,
  Copy,
  Activity,
  Clock,
} from "lucide-react";
import type { Route } from "./+types/settings";
import {
  mockIntegrations,
  mockAiMappings,
  mockTaxonomy,
  mockIngestionSettings,
  mockApiLogs,
  AI_MODELS,
  type ApiIntegration,
  type AiFeatureMapping,
  type TaxonomyItem,
  type TaxonomyType,
  type IngestionSettings,
} from "~/data/settings";
import { useStore } from "~/hooks/use-store";
import styles from "./settings.module.css";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Settings — AirdropPulse" }];
}

type Tab = "integrations" | "ai-config" | "categories" | "security";

const TAB_CONFIG: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: "integrations", label: "Integrations", icon: Zap },
  { id: "ai-config", label: "AI Configuration", icon: Brain },
  { id: "categories", label: "Category Manager", icon: Tags },
  { id: "security", label: "Security & Logs", icon: Shield },
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
        {activeTab === "ai-config" && <AiConfigTab />}
        {activeTab === "categories" && <CategoriesTab />}
        {activeTab === "security" && <SecurityTab />}
      </div>
    </div>
  );
}

/* ─── Integration Status Helpers ─────────────────────────────────── */

function StatusBadge({ status }: { status: ApiIntegration["status"] }) {
  const map = {
    connected: { icon: CheckCircle2, label: "Connected", cls: styles.statusConnected },
    error: { icon: XCircle, label: "Error", cls: styles.statusError },
    disconnected: { icon: AlertCircle, label: "Disconnected", cls: styles.statusDisconnected },
    limited: { icon: AlertTriangle, label: "Limited", cls: styles.statusLimited },
  };
  const { icon: Icon, label, cls } = map[status];
  return (
    <span className={`${styles.statusBadge} ${cls}`}>
      <Icon className={styles.statusBadgeIcon} />
      {label}
    </span>
  );
}

function UsageBar({ percent, cls }: { percent: number; cls?: string }) {
  const barCls =
    percent >= 90 ? styles.usageBarFill_danger
    : percent >= 70 ? styles.usageBarFill_warn
    : styles.usageBarFill_ok;
  return (
    <div className={`${styles.usageBar} ${cls ?? ""}`}>
      <div className={`${styles.usageBarFill} ${barCls}`} style={{ width: `${percent}%` }} />
    </div>
  );
}

/* ─── INTEGRATIONS TAB ───────────────────────────────────────────── */

function IntegrationsTab() {
  const [integrations, setIntegrations] = React.useState(mockIntegrations);
  const [visibleKeys, setVisibleKeys] = React.useState<Set<string>>(new Set());
  const [testing, setTesting] = React.useState<Set<string>>(new Set());
  const [editingKey, setEditingKey] = React.useState<string | null>(null);
  const [keyDraft, setKeyDraft] = React.useState("");
  const { addInboxItem } = useStore();

  const toggleKey = (id: string) =>
    setVisibleKeys((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const testConnection = async (id: string) => {
    setTesting((prev) => new Set(prev).add(id));
    await new Promise((r) => setTimeout(r, 1500));
    setTesting((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    setIntegrations((prev) =>
      prev.map((i) =>
        i.id === id
          ? { ...i, status: i.apiKeyMasked ? "connected" : "error", lastChecked: new Date().toISOString() }
          : i
      )
    );
  };

  const saveKey = (id: string) => {
    if (!keyDraft.trim()) return;
    const masked = keyDraft.slice(0, 6) + "••••••••••••••••••••••••••" + keyDraft.slice(-4);
    setIntegrations((prev) =>
      prev.map((i) => (i.id === id ? { ...i, apiKeyMasked: masked, status: "connected" } : i))
    );
    setEditingKey(null);
    setKeyDraft("");
  };

  const categories: { label: string; ids: string[] }[] = [
    { label: "Artificial Intelligence", ids: ["int-1", "int-2", "int-3", "int-4"] },
    { label: "Data Collection", ids: ["int-5", "int-6"] },
  ];

  return (
    <div className={styles.tabSection}>
      <div className={styles.sectionDescription}>
        Manage API keys for AI models and data ingestion services. Keys are masked at rest —
        click <strong>Show</strong> to reveal temporarily.
      </div>

      {categories.map(({ label, ids }) => (
        <div key={label} className={styles.integrationGroup}>
          <h3 className={styles.groupTitle}>{label}</h3>
          <div className={styles.integrationList}>
            {integrations
              .filter((i) => ids.includes(i.id))
              .map((integration) => (
                <IntegrationCard
                  key={integration.id}
                  integration={integration}
                  showKey={visibleKeys.has(integration.id)}
                  isTesting={testing.has(integration.id)}
                  isEditing={editingKey === integration.id}
                  keyDraft={keyDraft}
                  onToggleKey={() => toggleKey(integration.id)}
                  onTest={() => testConnection(integration.id)}
                  onEditKey={() => { setEditingKey(integration.id); setKeyDraft(""); }}
                  onKeyDraftChange={setKeyDraft}
                  onSaveKey={() => saveKey(integration.id)}
                  onCancelEdit={() => { setEditingKey(null); setKeyDraft(""); }}
                />
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}

interface IntegrationCardProps {
  integration: ApiIntegration;
  showKey: boolean;
  isTesting: boolean;
  isEditing: boolean;
  keyDraft: string;
  onToggleKey: () => void;
  onTest: () => void;
  onEditKey: () => void;
  onKeyDraftChange: (v: string) => void;
  onSaveKey: () => void;
  onCancelEdit: () => void;
}

function IntegrationCard({
  integration,
  showKey,
  isTesting,
  isEditing,
  keyDraft,
  onToggleKey,
  onTest,
  onEditKey,
  onKeyDraftChange,
  onSaveKey,
  onCancelEdit,
}: IntegrationCardProps) {
  const { name, provider, description, apiKeyMasked, status, usagePercent, usageLabel, quotaLimit, lastChecked, iconColor, docsUrl } = integration;

  return (
    <div className={`${styles.integrationCard} ${status === "error" ? styles.integrationCardError : status === "limited" ? styles.integrationCardLimited : ""}`}>
      <div className={styles.integrationCardHeader}>
        <div className={styles.integrationIcon} style={{ background: iconColor }}>
          {name.charAt(0)}
        </div>
        <div className={styles.integrationInfo}>
          <div className={styles.integrationName}>
            {name}
            <span className={styles.integrationProvider}>{provider}</span>
          </div>
          <p className={styles.integrationDesc}>{description}</p>
        </div>
        <div className={styles.integrationActions}>
          <StatusBadge status={status} />
          {docsUrl && (
            <a href={docsUrl} target="_blank" rel="noopener noreferrer" className={styles.docsLink} title="Documentation">
              <ExternalLink className={styles.docsLinkIcon} />
            </a>
          )}
        </div>
      </div>

      {/* API Key section */}
      <div className={styles.apiKeyRow}>
        <span className={styles.apiKeyLabel}>API Key</span>
        {isEditing ? (
          <div className={styles.apiKeyEditRow}>
            <input
              type="password"
              className={styles.apiKeyInput}
              value={keyDraft}
              onChange={(e) => onKeyDraftChange(e.target.value)}
              placeholder="Paste your API key here..."
              autoFocus
            />
            <button className={styles.btnSm} onClick={onSaveKey}>Save</button>
            <button className={`${styles.btnSm} ${styles.btnSmGhost}`} onClick={onCancelEdit}>Cancel</button>
          </div>
        ) : (
          <div className={styles.apiKeyDisplay}>
            <code className={styles.apiKeyCode}>
              {apiKeyMasked ? (showKey ? apiKeyMasked : apiKeyMasked.replace(/[^•]/g, "•").substring(0, 32) + "••••") : "Not configured"}
            </code>
            {apiKeyMasked && (
              <button className={styles.iconBtn} onClick={onToggleKey} title={showKey ? "Hide key" : "Show key"}>
                {showKey ? <EyeOff className={styles.iconBtnIcon} /> : <Eye className={styles.iconBtnIcon} />}
              </button>
            )}
            <button className={styles.btnSm} onClick={onEditKey}>
              {apiKeyMasked ? "Update" : "Add Key"}
            </button>
          </div>
        )}
      </div>

      {/* Usage bar */}
      {usagePercent !== undefined && (
        <div className={styles.usageRow}>
          <span className={styles.usageLabel}>{usageLabel}</span>
          <span className={styles.usageQuota}>{quotaLimit}</span>
        </div>
      )}
      {usagePercent !== undefined && <UsageBar percent={usagePercent} />}

      {/* Footer */}
      <div className={styles.integrationFooter}>
        {lastChecked && (
          <span className={styles.lastChecked}>
            <Clock className={styles.lastCheckedIcon} />
            Last checked: {new Date(lastChecked).toLocaleTimeString()}
          </span>
        )}
        <button
          className={`${styles.btnSm} ${styles.btnSmAccent}`}
          onClick={onTest}
          disabled={isTesting}
        >
          {isTesting ? (
            <><RefreshCw className={`${styles.spinIcon}`} /> Testing...</>
          ) : (
            "Test Connection"
          )}
        </button>
      </div>
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
