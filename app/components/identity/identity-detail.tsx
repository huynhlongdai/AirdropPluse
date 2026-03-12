import React from "react";
import { X, Eye, EyeOff, Shield, Mail, Twitter, MessageCircle, Smartphone, Globe, Wallet, FileText, AlertTriangle, ExternalLink } from "lucide-react";
import classNames from "classnames";
import type { IdentityProfile } from "~/data/identities";
import { mockWallets } from "~/data/wallets";
import { SecretField } from "./secret-field";
import { TotpGenerator } from "./totp-generator";
import styles from "./identity-detail.module.css";

type DetailTab = "email" | "social" | "security" | "info";

interface IdentityDetailProps {
  profile: IdentityProfile;
  onClose: () => void;
  onEdit: () => void;
}

function StatusBadge({ status }: { status: IdentityProfile["status"] }) {
  const map: Record<string, { label: string; badgeClass: string; dotClass: string }> = {
    active: { label: "Active", badgeClass: styles.statusActive, dotClass: styles.statusActiveDot },
    locked: { label: "Locked", badgeClass: styles.statusLocked, dotClass: styles.statusLockedDot },
    shadowbanned: { label: "Shadowbanned", badgeClass: styles.statusShadowbanned, dotClass: styles.statusShadowbannedDot },
    paused: { label: "Paused", badgeClass: styles.statusPaused, dotClass: styles.statusPausedDot },
    archived: { label: "Archived", badgeClass: styles.statusArchived, dotClass: styles.statusArchivedDot },
  };
  const cfg = map[status] ?? map.paused;
  return (
    <span className={classNames(styles.statusBadge, cfg.badgeClass)}>
      <span className={classNames(styles.statusDot, cfg.dotClass)} />
      {cfg.label}
    </span>
  );
}

function getWarnings(profile: IdentityProfile): string[] {
  const warns: string[] = [];
  if (!profile.email?.backupEmail) warns.push("No backup/recovery email set");
  if (!profile.twitter?.twoFaSecret && profile.twitter) warns.push("Twitter: no 2FA secret stored");
  if (!profile.discord?.twoFaSecret && profile.discord) warns.push("Discord: no 2FA secret stored");
  if (!profile.telegram && !profile.discord && !profile.twitter) warns.push("No social platforms connected");
  if (profile.linkedWallets.length === 0) warns.push("No wallets linked to this profile");
  return warns;
}

export function IdentityDetail({ profile, onClose, onEdit }: IdentityDetailProps) {
  const [tab, setTab] = React.useState<DetailTab>("email");
  const [privacyMode, setPrivacyMode] = React.useState(true);

  const linkedWalletNames = profile.linkedWallets
    .map((id) => mockWallets.find((w) => w.id === id)?.name)
    .filter(Boolean) as string[];

  const warnings = getWarnings(profile);
  const initials = profile.alias.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

  return (
    <>
      <div className={styles.overlay} onClick={onClose} />
      <aside className={styles.panel}>
        <div className={styles.panelHeader}>
          <div className={styles.avatar}>{initials}</div>
          <div className={styles.headerInfo}>
            <div className={styles.headerAlias}>{profile.alias}</div>
            <div className={styles.headerMeta}>
              <StatusBadge status={profile.status} />
              {warnings.length > 0 && (
                <span className={classNames(styles.statusBadge, styles.statusLocked)} title={`${warnings.length} warning(s)`}>
                  <AlertTriangle size={11} /> {warnings.length} warning{warnings.length > 1 ? "s" : ""}
                </span>
              )}
            </div>
          </div>
          <div className={styles.headerActions}>
            <button
              className={styles.iconBtn}
              onClick={() => setPrivacyMode((v) => !v)}
              title={privacyMode ? "Show sensitive data" : "Hide sensitive data"}
            >
              {privacyMode ? <Eye size={16} /> : <EyeOff size={16} />}
            </button>
            <button className={styles.iconBtn} onClick={onEdit} title="Edit profile">
              <FileText size={16} />
            </button>
            <button className={styles.iconBtn} onClick={onClose} title="Close">
              <X size={16} />
            </button>
          </div>
        </div>

        <div className={styles.tabs}>
          {(["email", "social", "security", "info"] as DetailTab[]).map((t) => (
            <button
              key={t}
              className={classNames(styles.tab, { [styles.tabActive]: tab === t })}
              onClick={() => setTab(t)}
            >
              {t === "email" ? "Email" : t === "social" ? "Social" : t === "security" ? "Security" : "Info"}
            </button>
          ))}
        </div>

        <div className={styles.body}>
          {tab === "email" && (
            <div className={styles.section}>
              <div className={styles.sectionTitle}>
                <Mail className={styles.sectionIcon} /> Email Accounts
              </div>
              {profile.email ? (
                <div className={styles.fieldGroup}>
                  <div className={styles.fieldRow}>
                    <span className={styles.fieldLabel}>Address</span>
                    <SecretField value={profile.email.address} isGlobalHidden={false} />
                  </div>
                  <div className={styles.fieldRow}>
                    <span className={styles.fieldLabel}>Password</span>
                    <SecretField value={profile.email.password} isGlobalHidden={privacyMode} />
                  </div>
                  <div className={styles.fieldRow}>
                    <span className={styles.fieldLabel}>Recovery</span>
                    <SecretField value={profile.email.backupEmail} isGlobalHidden={false} placeholder="Not set" />
                  </div>
                </div>
              ) : (
                <p className={styles.emptySection}>No email account configured</p>
              )}

              {warnings.filter((w) => w.toLowerCase().includes("email")).map((w) => (
                <div key={w} className={styles.warning}>
                  <AlertTriangle className={styles.warningIcon} /> {w}
                </div>
              ))}
            </div>
          )}

          {tab === "social" && (
            <>
              {profile.twitter && (
                <div className={styles.section}>
                  <div className={styles.sectionTitle}>
                    <Twitter className={styles.sectionIcon} /> X (Twitter)
                  </div>
                  <div className={styles.fieldGroup}>
                    <div className={styles.fieldRow}>
                      <span className={styles.fieldLabel}>Username</span>
                      <SecretField value={profile.twitter.username} isGlobalHidden={false} />
                    </div>
                    <div className={styles.fieldRow}>
                      <span className={styles.fieldLabel}>Password</span>
                      <SecretField value={profile.twitter.password} isGlobalHidden={privacyMode} />
                    </div>
                    {profile.twitter.token && (
                      <div className={styles.fieldRow}>
                        <span className={styles.fieldLabel}>Token</span>
                        <SecretField value={profile.twitter.token} isGlobalHidden={privacyMode} />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {profile.discord && (
                <div className={styles.section}>
                  <div className={styles.sectionTitle}>
                    <MessageCircle className={styles.sectionIcon} /> Discord
                  </div>
                  <div className={styles.fieldGroup}>
                    <div className={styles.fieldRow}>
                      <span className={styles.fieldLabel}>Username</span>
                      <SecretField value={profile.discord.username} isGlobalHidden={false} />
                    </div>
                    {profile.discord.token && (
                      <div className={styles.fieldRow}>
                        <span className={styles.fieldLabel}>Token</span>
                        <SecretField value={profile.discord.token} isGlobalHidden={privacyMode} />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {profile.telegram && (
                <div className={styles.section}>
                  <div className={styles.sectionTitle}>
                    <Smartphone className={styles.sectionIcon} /> Telegram
                  </div>
                  <div className={styles.fieldGroup}>
                    <div className={styles.fieldRow}>
                      <span className={styles.fieldLabel}>Phone</span>
                      <SecretField value={profile.telegram.phone} isGlobalHidden={privacyMode} />
                    </div>
                    {profile.telegram.username && (
                      <div className={styles.fieldRow}>
                        <span className={styles.fieldLabel}>Username</span>
                        <SecretField value={profile.telegram.username} isGlobalHidden={false} />
                      </div>
                    )}
                    {profile.telegram.twoFaPassword && (
                      <div className={styles.fieldRow}>
                        <span className={styles.fieldLabel}>2FA Pass</span>
                        <SecretField value={profile.telegram.twoFaPassword} isGlobalHidden={privacyMode} />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {profile.tiktok && (
                <div className={styles.section}>
                  <div className={styles.sectionTitle}>
                    <Globe className={styles.sectionIcon} /> TikTok
                  </div>
                  <div className={styles.fieldGroup}>
                    <div className={styles.fieldRow}>
                      <span className={styles.fieldLabel}>Username</span>
                      <SecretField value={profile.tiktok.username} isGlobalHidden={false} />
                    </div>
                    <div className={styles.fieldRow}>
                      <span className={styles.fieldLabel}>Password</span>
                      <SecretField value={profile.tiktok.password} isGlobalHidden={privacyMode} />
                    </div>
                  </div>
                </div>
              )}

              {profile.others.length > 0 && (
                <div className={styles.section}>
                  <div className={styles.sectionTitle}>
                    <Globe className={styles.sectionIcon} /> Other Platforms
                  </div>
                  <div className={styles.othersList}>
                    {profile.others.map((o, i) => (
                      <div key={i} className={styles.otherItem}>
                        <span className={styles.otherPlatform}>{o.platform}</span>
                        <span className={styles.otherUsername}>{o.username}</span>
                        {o.url && (
                          <a href={o.url} target="_blank" rel="noopener noreferrer" className={styles.otherLink}>
                            <ExternalLink size={14} />
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {!profile.twitter && !profile.discord && !profile.telegram && !profile.tiktok && profile.others.length === 0 && (
                <p className={styles.emptySection}>No social accounts configured</p>
              )}
            </>
          )}

          {tab === "security" && (
            <>
              <div className={styles.section}>
                <div className={styles.sectionTitle}>
                  <Shield className={styles.sectionIcon} /> 2FA Codes (Live TOTP)
                </div>
                <div className={styles.fieldGroup}>
                  {profile.twitter?.twoFaSecret && (
                    <div className={styles.totpRow}>
                      <div className={styles.totpLabel}>Twitter / X</div>
                      <TotpGenerator secret={profile.twitter.twoFaSecret} />
                    </div>
                  )}
                  {profile.discord?.twoFaSecret && (
                    <div className={styles.totpRow}>
                      <div className={styles.totpLabel}>Discord</div>
                      <TotpGenerator secret={profile.discord.twoFaSecret} />
                    </div>
                  )}
                  {!profile.twitter?.twoFaSecret && !profile.discord?.twoFaSecret && (
                    <div className={styles.totpRow}>
                      <p className={styles.emptySection}>No 2FA secrets stored for this profile</p>
                    </div>
                  )}
                </div>
              </div>

              <div className={styles.section}>
                <div className={styles.sectionTitle}>
                  <Shield className={styles.sectionIcon} /> 2FA Secret Keys
                </div>
                <div className={styles.fieldGroup}>
                  {profile.twitter?.twoFaSecret && (
                    <div className={styles.fieldRow}>
                      <span className={styles.fieldLabel}>Twitter 2FA</span>
                      <SecretField value={profile.twitter.twoFaSecret} isGlobalHidden={privacyMode} />
                    </div>
                  )}
                  {profile.discord?.twoFaSecret && (
                    <div className={styles.fieldRow}>
                      <span className={styles.fieldLabel}>Discord 2FA</span>
                      <SecretField value={profile.discord.twoFaSecret} isGlobalHidden={privacyMode} />
                    </div>
                  )}
                  {!profile.twitter?.twoFaSecret && !profile.discord?.twoFaSecret && (
                    <div className={styles.fieldRow}>
                      <span className={styles.fieldLabel}>—</span>
                      <span style={{ fontSize: "var(--font-size-1)", color: "var(--color-neutral-8)", fontStyle: "italic" }}>None stored</span>
                    </div>
                  )}
                </div>
              </div>

              {warnings.length > 0 && (
                <div className={styles.section}>
                  <div className={styles.sectionTitle}>
                    <AlertTriangle className={styles.sectionIcon} /> Security Warnings
                  </div>
                  <div className={styles.warnings}>
                    {warnings.map((w) => (
                      <div key={w} className={styles.warning}>
                        <AlertTriangle className={styles.warningIcon} /> {w}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {tab === "info" && (
            <>
              <div className={styles.section}>
                <div className={styles.sectionTitle}>
                  <Wallet className={styles.sectionIcon} /> Linked Wallets
                </div>
                {linkedWalletNames.length > 0 ? (
                  <div className={styles.walletTags}>
                    {linkedWalletNames.map((name) => (
                      <span key={name} className={styles.walletTag}>{name}</span>
                    ))}
                  </div>
                ) : (
                  <p className={styles.emptySection}>No wallets linked</p>
                )}
              </div>

              {profile.notes && (
                <div className={styles.section}>
                  <div className={styles.sectionTitle}>
                    <FileText className={styles.sectionIcon} /> Notes
                  </div>
                  <div className={styles.notesBox}>{profile.notes}</div>
                </div>
              )}

              <div className={styles.section}>
                <div className={styles.sectionTitle}>
                  <FileText className={styles.sectionIcon} /> Metadata
                </div>
                <div className={styles.fieldGroup}>
                  <div className={styles.fieldRow}>
                    <span className={styles.fieldLabel}>Created</span>
                    <span style={{ fontSize: "var(--font-size-1)", color: "var(--color-neutral-11)" }}>{profile.createdAt}</span>
                  </div>
                  <div className={styles.fieldRow}>
                    <span className={styles.fieldLabel}>Updated</span>
                    <span style={{ fontSize: "var(--font-size-1)", color: "var(--color-neutral-11)" }}>{profile.updatedAt}</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </aside>
    </>
  );
}
