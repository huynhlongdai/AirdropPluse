import React from "react";
import { Plus, Search, Eye, EyeOff, Pencil, Trash2, AlertTriangle, Users } from "lucide-react";
import classNames from "classnames";
import type { Route } from "./+types/identities";
import { mockIdentities } from "~/data/identities";
import type { IdentityProfile, ProfileStatus } from "~/data/identities";
import { mockWallets } from "~/data/wallets";
import { IdentityDetail } from "~/components/identity/identity-detail";
import { IdentityForm } from "~/components/identity/identity-form";
import styles from "./identities.module.css";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Identity Manager - AirdropPulse" },
    { name: "description", content: "Manage social profiles and identity accounts for airdrop farming" },
  ];
}

type FilterStatus = "all" | ProfileStatus;
type FilterPlatform = "all" | "twitter" | "discord" | "telegram" | "tiktok";

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

function StatusBadge({ status }: { status: ProfileStatus }) {
  const map: Record<string, { label: string; badge: string; dot: string }> = {
    active: { label: "Active", badge: styles.statusActive, dot: styles.statusActiveDot },
    locked: { label: "Locked", badge: styles.statusLocked, dot: styles.statusLockedDot },
    shadowbanned: { label: "Shadowbanned", badge: styles.statusShadowbanned, dot: styles.statusShadowbannedDot },
    paused: { label: "Paused", badge: styles.statusPaused, dot: styles.statusPausedDot },
    archived: { label: "Archived", badge: styles.statusArchived, dot: styles.statusArchivedDot },
  };
  const cfg = map[status] ?? map.paused;
  return (
    <span className={classNames(styles.statusBadge, cfg.badge)}>
      <span className={classNames(styles.statusDot, cfg.dot)} />
      {cfg.label}
    </span>
  );
}

const PLATFORM_LABELS: { key: FilterPlatform; short: string; full: string }[] = [
  { key: "twitter", short: "𝕏", full: "Twitter/X" },
  { key: "discord", short: "DC", full: "Discord" },
  { key: "telegram", short: "TG", full: "Telegram" },
  { key: "tiktok", short: "TT", full: "TikTok" },
];

export default function Identities() {
  const [profiles, setProfiles] = React.useState<IdentityProfile[]>(mockIdentities);
  const [search, setSearch] = React.useState("");
  const [filterStatus, setFilterStatus] = React.useState<FilterStatus>("all");
  const [filterPlatform, setFilterPlatform] = React.useState<FilterPlatform>("all");
  const [privacyMode, setPrivacyMode] = React.useState(true);
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
        p.email?.address.toLowerCase().includes(q) ||
        p.twitter?.username.toLowerCase().includes(q) ||
        p.discord?.username.toLowerCase().includes(q) ||
        false
      );
    }
    return true;
  });

  const selectedProfile = profiles.find((p) => p.id === selectedId) ?? null;

  const handleSave = (profile: IdentityProfile) => {
    setProfiles((prev) => {
      const exists = prev.find((p) => p.id === profile.id);
      return exists ? prev.map((p) => (p.id === profile.id ? profile : p)) : [profile, ...prev];
    });
    setEditingProfile(undefined);
  };

  const handleDelete = (id: string) => {
    if (!confirm("Delete this profile permanently?")) return;
    setProfiles((prev) => prev.filter((p) => p.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  const handleArchive = (id: string) => {
    setProfiles((prev) => prev.map((p) => (p.id === id ? { ...p, status: "archived" as ProfileStatus } : p)));
  };

  const totalActive = profiles.filter((p) => p.status === "active").length;
  const totalWarnings = profiles.reduce((acc, p) => acc + getWarningCount(p), 0);

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.headerText}>
            <h1 className={styles.title}>Identity Manager</h1>
            <p className={styles.subtitle}>
              Centrally manage social profiles, credentials, and 2FA for every farming identity
            </p>
          </div>
          <button className={styles.addBtn} onClick={() => setEditingProfile(null)}>
            <Plus size={18} />
            New Profile
          </button>
        </header>

        <div className={styles.toolbar}>
          <div className={styles.searchWrapper}>
            <Search className={styles.searchIcon} />
            <input
              className={styles.searchInput}
              placeholder="Search by alias, email, username…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            className={styles.filterSelect}
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="locked">Locked</option>
            <option value="shadowbanned">Shadowbanned</option>
            <option value="archived">Archived</option>
          </select>

          <select
            className={styles.filterSelect}
            value={filterPlatform}
            onChange={(e) => setFilterPlatform(e.target.value as FilterPlatform)}
          >
            <option value="all">All Platforms</option>
            <option value="twitter">Has Twitter</option>
            <option value="discord">Has Discord</option>
            <option value="telegram">Has Telegram</option>
            <option value="tiktok">Has TikTok</option>
          </select>

          <button
            className={classNames(styles.privacyToggle, { [styles.privacyToggleActive]: privacyMode })}
            onClick={() => setPrivacyMode((v) => !v)}
          >
            {privacyMode ? <EyeOff size={16} /> : <Eye size={16} />}
            {privacyMode ? "Hidden" : "Visible"}
          </button>
        </div>

        <div className={styles.summary}>
          <span className={styles.summaryChip}>
            <Users size={14} />
            <span className={styles.summaryChipCount}>{profiles.length}</span> total profiles
          </span>
          <span className={styles.summaryChip}>
            <span className={classNames(styles.statusDot, styles.statusActiveDot)} />
            <span className={styles.summaryChipCount}>{totalActive}</span> active
          </span>
          {totalWarnings > 0 && (
            <span className={classNames(styles.summaryChip, styles.warnBadge)}>
              <AlertTriangle size={13} />
              <span className={styles.summaryChipCount}>{totalWarnings}</span> security warnings
            </span>
          )}
          <span className={styles.summaryChip}>
            Showing <span className={styles.summaryChipCount}>&nbsp;{filtered.length}</span>&nbsp; results
          </span>
        </div>

        <div className={styles.tableWrapper}>
          {filtered.length === 0 ? (
            <div className={styles.empty}>
              <Users className={styles.emptyIcon} />
              <div className={styles.emptyTitle}>No profiles found</div>
              <div className={styles.emptyText}>Adjust your filters or create a new profile</div>
            </div>
          ) : (
            <table className={styles.table}>
              <thead className={styles.tableHead}>
                <tr>
                  <th className={styles.th}>Profile</th>
                  <th className={styles.th}>Status</th>
                  <th className={styles.th}>Email</th>
                  <th className={styles.th}>Platforms</th>
                  <th className={styles.th}>Linked Wallets</th>
                  <th className={styles.th}>Security</th>
                  <th className={styles.th}></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((profile) => {
                  const warnings = getWarningCount(profile);
                  const linkedNames = profile.linkedWallets
                    .map((id) => mockWallets.find((w) => w.id === id)?.name)
                    .filter(Boolean) as string[];

                  return (
                    <tr
                      key={profile.id}
                      className={classNames(styles.tr, { [styles.trSelected]: selectedId === profile.id })}
                      onClick={() => setSelectedId(profile.id === selectedId ? null : profile.id)}
                    >
                      <td className={styles.td}>
                        <div className={styles.cellProfile}>
                          <div className={styles.avatar}>{getInitials(profile.alias)}</div>
                          <span className={styles.alias}>{profile.alias}</span>
                        </div>
                      </td>
                      <td className={styles.td}>
                        <StatusBadge status={profile.status} />
                      </td>
                      <td className={styles.td}>
                        {profile.email ? (
                          <span style={{ fontFamily: "var(--font-monospace-code)", fontSize: "var(--font-size-1)", color: "var(--color-neutral-11)" }}>
                            {privacyMode ? "••••••••@••••.••" : profile.email.address}
                          </span>
                        ) : (
                          <span style={{ fontSize: "var(--font-size-1)", color: "var(--color-neutral-8)", fontStyle: "italic" }}>None</span>
                        )}
                      </td>
                      <td className={styles.td}>
                        <div className={styles.platforms}>
                          {PLATFORM_LABELS.map(({ key, short, full }) => {
                            const has = key === "twitter" ? !!profile.twitter
                              : key === "discord" ? !!profile.discord
                              : key === "telegram" ? !!profile.telegram
                              : !!profile.tiktok;
                            return (
                              <span
                                key={key}
                                className={classNames(styles.platformDot, has ? styles.platformDotHas : styles.platformDotMissing)}
                                title={`${full}: ${has ? "configured" : "not set"}`}
                              >
                                {short}
                              </span>
                            );
                          })}
                        </div>
                      </td>
                      <td className={styles.td}>
                        <div className={styles.walletTags}>
                          {linkedNames.length > 0
                            ? linkedNames.map((n) => <span key={n} className={styles.walletTag}>{n}</span>)
                            : <span style={{ fontSize: "var(--font-size-0)", color: "var(--color-neutral-8)" }}>None</span>
                          }
                        </div>
                      </td>
                      <td className={styles.td}>
                        {warnings > 0 ? (
                          <span className={styles.warnBadge}>
                            <AlertTriangle size={12} /> {warnings}
                          </span>
                        ) : (
                          <span style={{ fontSize: "var(--font-size-0)", color: "var(--color-success-10)", fontWeight: 600 }}>✓ OK</span>
                        )}
                      </td>
                      <td className={styles.td} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.rowActions}>
                          <button
                            className={styles.actionBtn}
                            title="Edit"
                            onClick={() => setEditingProfile(profile)}
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            className={styles.actionBtn}
                            title="Archive"
                            onClick={() => handleArchive(profile.id)}
                          >
                            <EyeOff size={14} />
                          </button>
                          <button
                            className={classNames(styles.actionBtn, styles.actionBtnDanger)}
                            title="Delete"
                            onClick={() => handleDelete(profile.id)}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {selectedProfile && (
        <IdentityDetail
          profile={selectedProfile}
          onClose={() => setSelectedId(null)}
          onEdit={() => {
            setEditingProfile(selectedProfile);
            setSelectedId(null);
          }}
        />
      )}

      {editingProfile !== undefined && (
        <IdentityForm
          key={editingProfile?.id ?? "new"}
          initial={editingProfile}
          onSave={handleSave}
          onClose={() => setEditingProfile(undefined)}
        />
      )}
    </main>
  );
}
