import React from "react";
import { Plus, Search, Eye, EyeOff, Pencil, Trash2, AlertTriangle, Users, LayoutGrid, List, Bot, Shield, Twitter, MessageCircle } from "lucide-react";
import classNames from "classnames";
import type { Route } from "./+types/identities";
import { mockIdentities } from "~/data/identities";
import type { IdentityProfile, ProfileStatus } from "~/data/identities";
import { IdentityDetail } from "~/components/identity/identity-detail";
import { IdentityForm } from "~/components/identity/identity-form";
import styles from "./identities.module.css";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Identities — AirdropPulse" },
    { name: "description", content: "Manage social profiles for airdrop farming" },
  ];
}

type FilterStatus = "all" | ProfileStatus;
type FilterPlatform = "all" | "twitter" | "discord" | "telegram" | "tiktok";
type ViewMode = "table" | "cards";

function getWarningCount(p: IdentityProfile) {
  let c = 0;
  if (!p.email?.backupEmail) c++;
  if (!p.twitter?.twoFaSecret && p.twitter) c++;
  if (!p.discord?.twoFaSecret && p.discord) c++;
  if (!p.telegram && !p.discord && !p.twitter) c++;
  if (p.linkedWallets.length === 0) c++;
  return c;
}

function getInitials(alias: string) {
  return alias.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}

// Avatar color per alias
const AVATAR_COLORS = ["#6366f1","#22c55e","#f59e0b","#ef4444","#8b5cf6","#06b6d4","#ec4899","#14b8a6"];
function getAvatarColor(alias: string) {
  let h = 0;
  for (let i = 0; i < alias.length; i++) h = alias.charCodeAt(i) + ((h << 5) - h);
  return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length];
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  active:       { label: "Active",       color: "#16a34a", bg: "#dcfce7" },
  locked:       { label: "Locked",       color: "#dc2626", bg: "#fee2e2" },
  shadowbanned: { label: "Shadowbanned", color: "#d97706", bg: "#fef3c7" },
  paused:       { label: "Paused",       color: "#7c3aed", bg: "#ede9fe" },
  archived:     { label: "Archived",     color: "#71717a", bg: "#f4f4f5" },
};

const PLATFORM_CONFIG = [
  { key: "twitter" as const,  label: "𝕏",  full: "Twitter/X",  color: "#1c1c1e", bg: "#f0f0f0" },
  { key: "discord" as const,  label: "DC", full: "Discord",     color: "#5865F2", bg: "#eef0fd" },
  { key: "telegram" as const, label: "TG", full: "Telegram",    color: "#229ED9", bg: "#e6f4fb" },
  { key: "tiktok" as const,   label: "TT", full: "TikTok",      color: "#ff0050", bg: "#fff0f3" },
];

function StatusPill({ status }: { status: ProfileStatus }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.paused;
  return (
    <span className={styles.statusPill} style={{ color: cfg.color, background: cfg.bg }}>
      <span className={styles.statusDot} style={{ background: cfg.color }} />
      {cfg.label}
    </span>
  );
}

function PlatformBadge({ has, label, color, bg, full }: { has: boolean; label: string; color: string; bg: string; full: string }) {
  return (
    <span
      className={styles.platformBadge}
      style={has ? { color, background: bg, borderColor: `${color}44`, opacity: 1 } : { color: "#c4c4c8", background: "#f9f9fb", borderColor: "#e8e8ec", opacity: 0.6 }}
      title={`${full}: ${has ? "configured" : "not set"}`}
    >
      {label}
    </span>
  );
}

function IdentityCard({ profile, privacyMode, onSelect, onEdit, onDelete }: {
  profile: IdentityProfile;
  privacyMode: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const warnings = getWarningCount(profile);
  const cfg = STATUS_CONFIG[profile.status] ?? STATUS_CONFIG.paused;
  const avatarColor = getAvatarColor(profile.alias);

  return (
    <div className={styles.identityCard} onClick={onSelect}>
      <div className={styles.cardTop}>
        <div className={styles.cardAvatar} style={{ background: avatarColor }}>
          {profile.alias.slice(0, 2).toUpperCase()}
        </div>
        <div className={styles.cardInfo}>
          <div className={styles.cardAlias}>{profile.alias}</div>
          <StatusPill status={profile.status} />
        </div>
        {warnings > 0 && (
          <span className={styles.cardWarning}>
            <AlertTriangle size={11} /> {warnings}
          </span>
        )}
      </div>

      <div className={styles.cardEmail}>
        {profile.email
          ? (privacyMode ? "••••••••@••••.••" : profile.email.address)
          : <span className={styles.cardEmailNone}>No email</span>}
      </div>

      <div className={styles.cardPlatforms}>
        {PLATFORM_CONFIG.map((p) => {
          const has = p.key === "twitter" ? !!profile.twitter
            : p.key === "discord" ? !!profile.discord
            : p.key === "telegram" ? !!profile.telegram
            : !!profile.tiktok;
          return <PlatformBadge key={p.key} has={has} label={p.label} color={p.color} bg={p.bg} full={p.full} />;
        })}
      </div>

      <div className={styles.cardFooter}>
        <div className={styles.cardWallets}>
          {profile.linkedWallets.length > 0
            ? <span className={styles.cardWalletCount}>{profile.linkedWallets.length} wallet{profile.linkedWallets.length > 1 ? "s" : ""}</span>
            : <span className={styles.cardWalletNone}>No wallet</span>}
        </div>
        <div className={styles.cardActions}>
          <button className={styles.cardActBtn} onClick={(e) => { e.stopPropagation(); onEdit(); }} title="Edit"><Pencil size={13}/></button>
          <button className={styles.cardActBtn} title="Run Agent"><Bot size={13}/></button>
          <button className={classNames(styles.cardActBtn, styles.cardActDanger)} onClick={(e) => { e.stopPropagation(); onDelete(); }} title="Delete"><Trash2 size={13}/></button>
        </div>
      </div>
    </div>
  );
}

export default function Identities() {
  const [profiles, setProfiles] = React.useState<IdentityProfile[]>(mockIdentities);
  const [search, setSearch] = React.useState("");
  const [filterStatus, setFilterStatus] = React.useState<FilterStatus>("all");
  const [filterPlatform, setFilterPlatform] = React.useState<FilterPlatform>("all");
  const [privacyMode, setPrivacyMode] = React.useState(true);
  const [viewMode, setViewMode] = React.useState<ViewMode>("table");
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [editingProfile, setEditingProfile] = React.useState<IdentityProfile | null | undefined>(undefined);

  const filtered = profiles.filter((p) => {
    if (filterStatus !== "all" && p.status !== filterStatus) return false;
    if (filterPlatform !== "all") {
      if (filterPlatform === "twitter" && !p.twitter) return false;
      if (filterPlatform === "discord" && !p.discord) return false;
      if (filterPlatform === "telegram" && !p.telegram) return false;
      if (filterPlatform === "tiktok" && !p.tiktok) return false;
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        p.alias.toLowerCase().includes(q) ||
        (p.email?.address.toLowerCase().includes(q) ?? false) ||
        (p.twitter?.username.toLowerCase().includes(q) ?? false) ||
        (p.discord?.username.toLowerCase().includes(q) ?? false)
      );
    }
    return true;
  });

  const selectedProfile = profiles.find((p) => p.id === selectedId) ?? null;
  const totalActive = profiles.filter((p) => p.status === "active").length;
  const totalWarnings = profiles.reduce((acc, p) => acc + getWarningCount(p), 0);
  const totalPlatforms = profiles.reduce((acc, p) => acc + [p.twitter, p.discord, p.telegram, p.tiktok].filter(Boolean).length, 0);

  const handleSave = (profile: IdentityProfile) => {
    setProfiles((prev) => {
      const exists = prev.find((p) => p.id === profile.id);
      return exists ? prev.map((p) => (p.id === profile.id ? profile : p)) : [profile, ...prev];
    });
    setEditingProfile(undefined);
  };

  const handleDelete = (id: string) => {
    if (!confirm("Delete this profile?")) return;
    setProfiles((prev) => prev.filter((p) => p.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  return (
    <main className={styles.page}>
      <div className={styles.container}>

        {/* ── Header ── */}
        <div className={styles.topBar}>
          <div>
            <h1 className={styles.title}>Identity Manager</h1>
            <p className={styles.subtitle}>Manage social profiles, credentials & 2FA</p>
          </div>
          <button className={styles.addBtn} onClick={() => setEditingProfile(null)}>
            <Plus size={14} /> New Profile
          </button>
        </div>

        {/* ── Stat cards ── */}
        <div className={styles.statRow}>
          <div className={styles.statCard}>
            <div className={styles.statTop}>
              <span className={styles.statLabel}>Total Profiles</span>
              <span className={styles.statIcon} style={{ background: "#ede9fe", color: "#7c3aed" }}><Users size={15}/></span>
            </div>
            <div className={styles.statNum}>{profiles.length}</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statTop}>
              <span className={styles.statLabel}>Active</span>
              <span className={styles.statIcon} style={{ background: "#dcfce7", color: "#16a34a" }}><Shield size={15}/></span>
            </div>
            <div className={styles.statNum} style={{ color: "#16a34a" }}>{totalActive}</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statTop}>
              <span className={styles.statLabel}>Platforms Connected</span>
              <span className={styles.statIcon} style={{ background: "#dbeafe", color: "#2563eb" }}><MessageCircle size={15}/></span>
            </div>
            <div className={styles.statNum} style={{ color: "#2563eb" }}>{totalPlatforms}</div>
          </div>
          <div className={styles.statCard} style={{ borderColor: totalWarnings > 0 ? "#fecaca" : undefined }}>
            <div className={styles.statTop}>
              <span className={styles.statLabel}>Security Warnings</span>
              <span className={styles.statIcon} style={{ background: "#fee2e2", color: "#dc2626" }}><AlertTriangle size={15}/></span>
            </div>
            <div className={styles.statNum} style={{ color: totalWarnings > 0 ? "#dc2626" : "#22c55e" }}>
              {totalWarnings > 0 ? totalWarnings : "✓"}
            </div>
          </div>
        </div>

        {/* ── Toolbar ── */}
        <div className={styles.toolbar}>
          <div className={styles.searchBox}>
            <Search size={14} className={styles.searchIcon} />
            <input className={styles.searchInput} placeholder="Search alias, email, username…" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>

          <select className={styles.filterSelect} value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}>
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="locked">Locked</option>
            <option value="shadowbanned">Shadowbanned</option>
            <option value="archived">Archived</option>
          </select>

          <select className={styles.filterSelect} value={filterPlatform} onChange={(e) => setFilterPlatform(e.target.value as FilterPlatform)}>
            <option value="all">All Platforms</option>
            <option value="twitter">Has Twitter</option>
            <option value="discord">Has Discord</option>
            <option value="telegram">Has Telegram</option>
            <option value="tiktok">Has TikTok</option>
          </select>

          <button className={classNames(styles.iconBtn, privacyMode && styles.iconBtnActive)} onClick={() => setPrivacyMode((v) => !v)} title={privacyMode ? "Show credentials" : "Hide credentials"}>
            {privacyMode ? <EyeOff size={15}/> : <Eye size={15}/>}
          </button>

          {/* View toggle */}
          <div className={styles.viewToggle}>
            <button className={classNames(styles.viewBtn, viewMode === "table" && styles.viewBtnActive)} onClick={() => setViewMode("table")}><List size={14}/></button>
            <button className={classNames(styles.viewBtn, viewMode === "cards" && styles.viewBtnActive)} onClick={() => setViewMode("cards")}><LayoutGrid size={14}/></button>
          </div>
        </div>

        {/* ── Summary ── */}
        <div className={styles.summary}>
          <span className={styles.sumChip}>{filtered.length} result{filtered.length !== 1 ? "s" : ""}</span>
          {filterStatus !== "all" && <span className={styles.sumChip}>Status: {filterStatus}</span>}
          {filterPlatform !== "all" && <span className={styles.sumChip}>Platform: {filterPlatform}</span>}
        </div>

        {/* ── Card view ── */}
        {viewMode === "cards" ? (
          <div className={styles.cardGrid}>
            {filtered.map((profile) => (
              <IdentityCard
                key={profile.id}
                profile={profile}
                privacyMode={privacyMode}
                onSelect={() => setSelectedId(profile.id === selectedId ? null : profile.id)}
                onEdit={() => setEditingProfile(profile)}
                onDelete={() => handleDelete(profile.id)}
              />
            ))}
          </div>
        ) : (
          /* ── Table view ── */
          <div className={styles.tableWrap}>
            {filtered.length === 0 ? (
              <div className={styles.empty}><Users size={32} style={{ color: "#c4c4c8" }}/><p>No profiles found</p></div>
            ) : (
              <table className={styles.table}>
                <thead>
                  <tr className={styles.tableHead}>
                    <th className={styles.th}>Profile</th>
                    <th className={styles.th}>Status</th>
                    <th className={styles.th}>Email</th>
                    <th className={styles.th}>Platforms</th>
                    <th className={styles.th}>Wallets</th>
                    <th className={styles.th}>Security</th>
                    <th className={styles.th}></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((profile) => {
                    const warnings = getWarningCount(profile);
                    const avatarColor = getAvatarColor(profile.alias);
                    return (
                      <tr
                        key={profile.id}
                        className={classNames(styles.tr, selectedId === profile.id && styles.trSelected)}
                        onClick={() => setSelectedId(profile.id === selectedId ? null : profile.id)}
                      >
                        <td className={styles.td}>
                          <div className={styles.cellProfile}>
                            <span className={styles.avatar} style={{ background: avatarColor }}>
                              {getInitials(profile.alias)}
                            </span>
                            <span className={styles.alias}>{profile.alias}</span>
                          </div>
                        </td>
                        <td className={styles.td}><StatusPill status={profile.status} /></td>
                        <td className={styles.td}>
                          <span className={styles.emailCell}>
                            {profile.email
                              ? (privacyMode ? "••••••••@••••.••" : profile.email.address)
                              : <span className={styles.none}>—</span>}
                          </span>
                        </td>
                        <td className={styles.td}>
                          <div className={styles.platformRow}>
                            {PLATFORM_CONFIG.map((p) => {
                              const has = p.key === "twitter" ? !!profile.twitter
                                : p.key === "discord" ? !!profile.discord
                                : p.key === "telegram" ? !!profile.telegram
                                : !!profile.tiktok;
                              return <PlatformBadge key={p.key} has={has} label={p.label} color={p.color} bg={p.bg} full={p.full} />;
                            })}
                          </div>
                        </td>
                        <td className={styles.td}>
                          <span className={styles.walletCount}>
                            {profile.linkedWallets.length > 0 ? `${profile.linkedWallets.length} linked` : <span className={styles.none}>None</span>}
                          </span>
                        </td>
                        <td className={styles.td}>
                          {warnings > 0
                            ? <span className={styles.warnBadge}><AlertTriangle size={11}/> {warnings}</span>
                            : <span className={styles.okBadge}>✓ OK</span>}
                        </td>
                        <td className={styles.td} onClick={(e) => e.stopPropagation()}>
                          <div className={styles.rowActions}>
                            <button className={styles.actionBtn} onClick={() => setEditingProfile(profile)} title="Edit"><Pencil size={13}/></button>
                            <button className={styles.actionBtn} title="Run Agent"><Bot size={13}/></button>
                            <button className={classNames(styles.actionBtn, styles.actionBtnDanger)} onClick={() => handleDelete(profile.id)} title="Delete"><Trash2 size={13}/></button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>

      {selectedProfile && (
        <IdentityDetail
          profile={selectedProfile}
          onClose={() => setSelectedId(null)}
          onEdit={() => { setEditingProfile(selectedProfile); setSelectedId(null); }}
        />
      )}
      {editingProfile !== undefined && (
        <IdentityForm key={editingProfile?.id ?? "new"} initial={editingProfile} onSave={handleSave} onClose={() => setEditingProfile(undefined)} />
      )}
    </main>
  );
}
