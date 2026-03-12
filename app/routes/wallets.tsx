import React from "react";
import { Wallet, Twitter, MessageCircle, Mail, CheckCircle2, Circle } from "lucide-react";
import classNames from "classnames";
import type { Route } from "./+types/wallets";
import { mockWallets, mockSocialProfiles } from "~/data/wallets";
import { mockProjects } from "~/data/projects";
import styles from "./wallets.module.css";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Wallet & Identity Manager - AirdropPulse" },
    {
      name: "description",
      content: "Manage your crypto wallets and social profiles",
    },
  ];
}

export default function Wallets() {
  const [activeTab, setActiveTab] = React.useState<"wallets" | "socials" | "matrix">("wallets");

  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case "twitter":
        return Twitter;
      case "discord":
      case "telegram":
        return MessageCircle;
      case "email":
        return Mail;
      default:
        return MessageCircle;
    }
  };

  return (
    <main className={styles.wallets}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>Wallet & Identity Manager</h1>
          <p className={styles.subtitle}>Manage your crypto wallets, social profiles, and participation tracking</p>
        </header>

        <div className={styles.tabs}>
          <button
            className={classNames(styles.tab, { [styles.tabActive]: activeTab === "wallets" })}
            onClick={() => setActiveTab("wallets")}
          >
            Wallet Groups
          </button>
          <button
            className={classNames(styles.tab, { [styles.tabActive]: activeTab === "socials" })}
            onClick={() => setActiveTab("socials")}
          >
            Social Profiles
          </button>
          <button
            className={classNames(styles.tab, { [styles.tabActive]: activeTab === "matrix" })}
            onClick={() => setActiveTab("matrix")}
          >
            Participation Matrix
          </button>
        </div>

        {activeTab === "wallets" && (
          <div className={styles.walletsGrid}>
            {mockWallets.map((wallet) => {
              const walletTasks = mockProjects.flatMap((p) => p.tasks.filter((t) => t.walletId === wallet.id));
              const completedTasks = walletTasks.filter((t) => t.completed).length;
              const activeProjects = new Set(
                mockProjects.filter((p) => p.tasks.some((t) => t.walletId === wallet.id)).map((p) => p.id),
              ).size;

              return (
                <div key={wallet.id} className={styles.walletCard}>
                  <div className={styles.walletHeader}>
                    <div className={styles.walletInfo}>
                      <h3 className={styles.walletName}>{wallet.name}</h3>
                      <span className={styles.walletGroup}>{wallet.group}</span>
                    </div>
                    <Wallet className={styles.walletIcon} />
                  </div>

                  <div className={styles.walletAddress}>{wallet.address}</div>

                  <div className={styles.walletChains}>
                    {wallet.chain.map((chain) => (
                      <span key={chain} className={styles.chainBadge}>
                        {chain}
                      </span>
                    ))}
                  </div>

                  <div className={styles.walletStats}>
                    <div className={styles.stat}>
                      <div className={styles.statValue}>{activeProjects}</div>
                      <div className={styles.statLabel}>Active Projects</div>
                    </div>
                    <div className={styles.stat}>
                      <div className={styles.statValue}>{completedTasks}</div>
                      <div className={styles.statLabel}>Tasks Done</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === "socials" && (
          <div className={styles.socialsList}>
            {mockSocialProfiles.map((profile) => {
              const SocialIcon = getSocialIcon(profile.platform);
              const linkedWalletNames = profile.linkedWallets
                .map((wId) => mockWallets.find((w) => w.id === wId)?.name)
                .filter(Boolean);

              return (
                <div key={profile.id} className={styles.socialCard}>
                  <div className={styles.socialHeader}>
                    <SocialIcon className={styles.socialIcon} />
                    <div className={styles.socialInfo}>
                      <div className={styles.socialPlatform}>{profile.platform}</div>
                      <div className={styles.socialUsername}>{profile.username}</div>
                    </div>
                  </div>

                  <div className={styles.socialMeta}>
                    {profile.browserProfile && (
                      <div className={styles.metaRow}>
                        <span className={styles.metaLabel}>Browser Profile</span>
                        <span className={styles.metaValue}>{profile.browserProfile}</span>
                      </div>
                    )}
                    <div className={styles.metaRow}>
                      <span className={styles.metaLabel}>Linked Wallets</span>
                      <div className={styles.linkedWallets}>
                        {linkedWalletNames.map((name) => (
                          <span key={name} className={styles.walletBadge}>
                            {name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === "matrix" && (
          <div className={styles.matrixSection}>
            <h2 className={styles.matrixTitle}>Participation Matrix</h2>
            <div className={styles.matrix}>
              <div className={styles.matrixHeader}>
                <div className={styles.matrixHeaderCell}>Project</div>
                {mockWallets.slice(0, 5).map((wallet) => (
                  <div key={wallet.id} className={styles.matrixHeaderCell}>
                    {wallet.name}
                  </div>
                ))}
              </div>

              {mockProjects.slice(0, 6).map((project) => (
                <div key={project.id} className={styles.matrixRow}>
                  <div className={styles.matrixProjectName}>{project.name}</div>
                  {mockWallets.slice(0, 5).map((wallet) => {
                    const hasParticipated = project.tasks.some((t) => t.walletId === wallet.id && t.completed);
                    return (
                      <div key={wallet.id} className={styles.matrixCell}>
                        {hasParticipated ? (
                          <CheckCircle2 className={styles.checkIcon} />
                        ) : (
                          <Circle className={styles.emptyIcon} />
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
