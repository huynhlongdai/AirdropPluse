import React from "react";
import { X } from "lucide-react";
import classNames from "classnames";
import type { IdentityProfile, ProfileStatus } from "~/data/identities";
import { mockWallets } from "~/data/wallets";
import styles from "./identity-form.module.css";

type FormTab = "basic" | "email" | "twitter" | "discord" | "telegram" | "tiktok" | "info";

interface IdentityFormProps {
  initial?: IdentityProfile | null;
  onSave: (profile: IdentityProfile) => void;
  onClose: () => void;
}

function genId() {
  return `id${Date.now()}`;
}

function emptyProfile(): IdentityProfile {
  return {
    id: genId(),
    alias: "",
    status: "active",
    others: [],
    linkedWallets: [],
    createdAt: new Date().toISOString().slice(0, 10),
    updatedAt: new Date().toISOString().slice(0, 10),
  };
}

export function IdentityForm({ initial, onSave, onClose }: IdentityFormProps) {
  const [tab, setTab] = React.useState<FormTab>("basic");
  const [form, setForm] = React.useState<IdentityProfile>(initial ? { ...initial } : emptyProfile());

  const set = <K extends keyof IdentityProfile>(key: K, val: IdentityProfile[K]) =>
    setForm((f) => ({ ...f, [key]: val }));

  const setNested = <K extends keyof IdentityProfile>(section: K, field: string, val: string) => {
    setForm((f) => {
      const existing = (f[section] as Record<string, unknown> | undefined) ?? {};
      return { ...f, [section]: { ...existing, [field]: val } };
    });
  };

  const toggleWallet = (wid: string) =>
    setForm((f) => ({
      ...f,
      linkedWallets: f.linkedWallets.includes(wid)
        ? f.linkedWallets.filter((id) => id !== wid)
        : [...f.linkedWallets, wid],
    }));

  const handleSave = () => {
    if (!form.alias.trim()) return;
    onSave({ ...form, updatedAt: new Date().toISOString().slice(0, 10) });
  };

  const TABS: { key: FormTab; label: string }[] = [
    { key: "basic", label: "Basic" },
    { key: "email", label: "Email" },
    { key: "twitter", label: "Twitter" },
    { key: "discord", label: "Discord" },
    { key: "telegram", label: "Telegram" },
    { key: "tiktok", label: "TikTok" },
    { key: "info", label: "Info" },
  ];

  return (
    <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.dialog}>
        <div className={styles.dialogHeader}>
          <span className={styles.dialogTitle}>{initial ? "Edit Profile" : "New Profile"}</span>
          <button className={styles.closeBtn} onClick={onClose}><X size={18} /></button>
        </div>

        <div className={styles.tabs}>
          {TABS.map(({ key, label }) => (
            <button
              key={key}
              className={classNames(styles.tab, { [styles.tabActive]: tab === key })}
              onClick={() => setTab(key)}
            >
              {label}
            </button>
          ))}
        </div>

        <div className={styles.body}>
          {tab === "basic" && (
            <div className={styles.formSection}>
              <div className={styles.sectionLabel}>Identity</div>
              <div className={styles.formGrid}>
                <div className={classNames(styles.field, styles.formGridFull)}>
                  <label className={styles.label}>Profile Alias <span className={styles.required}>*</span></label>
                  <input
                    className={styles.input}
                    value={form.alias}
                    onChange={(e) => set("alias", e.target.value)}
                    placeholder="e.g. Alpha Farmer, Sybil Runner 1"
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Status</label>
                  <select
                    className={styles.select}
                    value={form.status}
                    onChange={(e) => set("status", e.target.value as ProfileStatus)}
                  >
                    <option value="active">Active</option>
                    <option value="paused">Paused</option>
                    <option value="locked">Locked</option>
                    <option value="shadowbanned">Shadowbanned</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {tab === "email" && (
            <div className={styles.formSection}>
              <div className={styles.sectionLabel}>Email Account</div>
              <div className={styles.formGrid}>
                <div className={classNames(styles.field, styles.formGridFull)}>
                  <label className={styles.label}>Email Address</label>
                  <input
                    className={styles.input}
                    type="email"
                    value={form.email?.address ?? ""}
                    onChange={(e) => setNested("email", "address", e.target.value)}
                    placeholder="you@example.com"
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Password</label>
                  <input
                    className={styles.input}
                    value={form.email?.password ?? ""}
                    onChange={(e) => setNested("email", "password", e.target.value)}
                    placeholder="Email password"
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Backup / Recovery Email</label>
                  <input
                    className={styles.input}
                    type="email"
                    value={form.email?.backupEmail ?? ""}
                    onChange={(e) => setNested("email", "backupEmail", e.target.value)}
                    placeholder="backup@example.com"
                  />
                </div>
              </div>
            </div>
          )}

          {tab === "twitter" && (
            <div className={styles.formSection}>
              <div className={styles.sectionLabel}>X (Twitter)</div>
              <div className={styles.formGrid}>
                <div className={styles.field}>
                  <label className={styles.label}>Username</label>
                  <input
                    className={styles.input}
                    value={form.twitter?.username ?? ""}
                    onChange={(e) => setNested("twitter", "username", e.target.value)}
                    placeholder="@username"
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Password</label>
                  <input
                    className={styles.input}
                    value={form.twitter?.password ?? ""}
                    onChange={(e) => setNested("twitter", "password", e.target.value)}
                    placeholder="Password"
                  />
                </div>
                <div className={classNames(styles.field, styles.formGridFull)}>
                  <label className={styles.label}>Auth Token / Cookie</label>
                  <input
                    className={styles.input}
                    value={form.twitter?.token ?? ""}
                    onChange={(e) => setNested("twitter", "token", e.target.value)}
                    placeholder="Bearer token or auth_token cookie"
                  />
                </div>
                <div className={classNames(styles.field, styles.formGridFull)}>
                  <label className={styles.label}>2FA Secret Key (TOTP)</label>
                  <input
                    className={styles.input}
                    value={form.twitter?.twoFaSecret ?? ""}
                    onChange={(e) => setNested("twitter", "twoFaSecret", e.target.value)}
                    placeholder="Base32 secret e.g. JBSWY3DPEHPK3PXP"
                  />
                </div>
              </div>
            </div>
          )}

          {tab === "discord" && (
            <div className={styles.formSection}>
              <div className={styles.sectionLabel}>Discord</div>
              <div className={styles.formGrid}>
                <div className={styles.field}>
                  <label className={styles.label}>Username</label>
                  <input
                    className={styles.input}
                    value={form.discord?.username ?? ""}
                    onChange={(e) => setNested("discord", "username", e.target.value)}
                    placeholder="Username#0000"
                  />
                </div>
                <div className={classNames(styles.field, styles.formGridFull)}>
                  <label className={styles.label}>User Token</label>
                  <input
                    className={styles.input}
                    value={form.discord?.token ?? ""}
                    onChange={(e) => setNested("discord", "token", e.target.value)}
                    placeholder="Discord user token"
                  />
                </div>
                <div className={classNames(styles.field, styles.formGridFull)}>
                  <label className={styles.label}>2FA Secret Key (TOTP)</label>
                  <input
                    className={styles.input}
                    value={form.discord?.twoFaSecret ?? ""}
                    onChange={(e) => setNested("discord", "twoFaSecret", e.target.value)}
                    placeholder="Base32 secret"
                  />
                </div>
              </div>
            </div>
          )}

          {tab === "telegram" && (
            <div className={styles.formSection}>
              <div className={styles.sectionLabel}>Telegram</div>
              <div className={styles.formGrid}>
                <div className={styles.field}>
                  <label className={styles.label}>Phone Number</label>
                  <input
                    className={styles.input}
                    type="tel"
                    value={form.telegram?.phone ?? ""}
                    onChange={(e) => setNested("telegram", "phone", e.target.value)}
                    placeholder="+84901234567"
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Username</label>
                  <input
                    className={styles.input}
                    value={form.telegram?.username ?? ""}
                    onChange={(e) => setNested("telegram", "username", e.target.value)}
                    placeholder="@username"
                  />
                </div>
                <div className={classNames(styles.field, styles.formGridFull)}>
                  <label className={styles.label}>2FA Password</label>
                  <input
                    className={styles.input}
                    value={form.telegram?.twoFaPassword ?? ""}
                    onChange={(e) => setNested("telegram", "twoFaPassword", e.target.value)}
                    placeholder="Two-step verification password"
                  />
                </div>
              </div>
            </div>
          )}

          {tab === "tiktok" && (
            <div className={styles.formSection}>
              <div className={styles.sectionLabel}>TikTok</div>
              <div className={styles.formGrid}>
                <div className={styles.field}>
                  <label className={styles.label}>Username</label>
                  <input
                    className={styles.input}
                    value={form.tiktok?.username ?? ""}
                    onChange={(e) => setNested("tiktok", "username", e.target.value)}
                    placeholder="@username"
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Password</label>
                  <input
                    className={styles.input}
                    value={form.tiktok?.password ?? ""}
                    onChange={(e) => setNested("tiktok", "password", e.target.value)}
                    placeholder="Password"
                  />
                </div>
              </div>
            </div>
          )}

          {tab === "info" && (
            <div className={styles.formSection}>
              <div className={styles.sectionLabel}>Linked Wallets</div>
              <div className={styles.walletOptions}>
                {mockWallets.map((w) => (
                  <label key={w.id} className={styles.walletOption}>
                    <input
                      type="checkbox"
                      checked={form.linkedWallets.includes(w.id)}
                      onChange={() => toggleWallet(w.id)}
                    />
                    {w.name}
                  </label>
                ))}
              </div>

              <div className={styles.sectionLabel} style={{ marginTop: "var(--space-4)" }}>Notes</div>
              <textarea
                className={styles.textarea}
                value={form.notes ?? ""}
                onChange={(e) => set("notes", e.target.value)}
                placeholder="Any notes about this profile, strategy, etc."
                rows={4}
              />
            </div>
          )}
        </div>

        <div className={styles.footer}>
          <button className={styles.btnSecondary} onClick={onClose}>Cancel</button>
          <button className={styles.btnPrimary} onClick={handleSave} disabled={!form.alias.trim()}>
            {initial ? "Save Changes" : "Create Profile"}
          </button>
        </div>
      </div>
    </div>
  );
}
