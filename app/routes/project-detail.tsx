import React from "react";
import { Link, useParams } from "react-router";
import {
  ArrowLeft,
  Globe,
  Twitter,
  MessageCircle,
  ExternalLink,
  CheckCircle2,
  Circle,
  Flame,
  AlertTriangle,
  TrendingUp,
  Users,
  Wallet,
  Clock,
  Calendar,
  FileText,
  Zap,
  Star,
  Shield,
  DollarSign,
} from "lucide-react";
import classNames from "classnames";
import type { Route } from "./+types/project-detail";
import { mockProjects } from "~/data/projects";
import styles from "./project-detail.module.css";

export function meta({ params }: Route.MetaArgs) {
  const project = mockProjects.find((p) => p.id === params.id);
  return [{ title: project ? `${project.name} - AirdropPulse` : "Project - AirdropPulse" }];
}

const STATUS_LABELS: Record<string, string> = {
  discovery: "Discovery",
  active: "Active",
  snapshot: "Snapshot",
  claiming: "Claiming",
  claimed: "Claimed",
  archived: "Archived",
};

const RISK_COLORS: Record<string, string> = {
  low: "riskLow",
  medium: "riskMedium",
  high: "riskHigh",
  critical: "riskCritical",
};

const SENTIMENT_ICONS = {
  bullish: "📈",
  neutral: "➡️",
  bearish: "📉",
};

type Tab = "general" | "tasks" | "wallets" | "updates";

export default function ProjectDetail() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = React.useState<Tab>("general");

  const project = mockProjects.find((p) => p.id === id);

  if (!project) {
    return (
      <main className={styles.notFound}>
        <h1>Project not found</h1>
        <Link to="/projects" className={styles.backLink}>
          <ArrowLeft size={16} /> Back to Projects
        </Link>
      </main>
    );
  }

  const completedTasks = project.tasks.filter((t) => t.completed).length;
  const totalTasks = project.tasks.length;
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        {/* Back nav */}
        <Link to="/projects" className={styles.backLink}>
          <ArrowLeft size={16} />
          Back to Projects
        </Link>

        {/* Hero */}
        <div className={styles.hero}>
          <div className={styles.heroImage}>
            <img src={project.imageUrl} alt={project.name} />
            <div className={styles.heroOverlay} />
          </div>
          <div className={styles.heroContent}>
            <div className={styles.heroTop}>
              <div className={styles.heroBadges}>
                <span className={classNames(styles.statusBadge, styles[`status_${project.status}`])}>
                  {STATUS_LABELS[project.status]}
                </span>
                {project.isHot && (
                  <span className={styles.hotBadge}>
                    <Flame size={12} /> Hot
                  </span>
                )}
                {project.isNew && (
                  <span className={styles.newBadge}>
                    <Zap size={12} /> New
                  </span>
                )}
              </div>
              <div className={styles.heroLinks}>
                {project.sourceUrl && (
                  <a href={project.sourceUrl} target="_blank" rel="noopener noreferrer" className={styles.heroLink}>
                    <Globe size={16} />
                  </a>
                )}
                {project.twitterUrl && (
                  <a href={project.twitterUrl} target="_blank" rel="noopener noreferrer" className={styles.heroLink}>
                    <Twitter size={16} />
                  </a>
                )}
                {project.discordUrl && (
                  <a href={project.discordUrl} target="_blank" rel="noopener noreferrer" className={styles.heroLink}>
                    <MessageCircle size={16} />
                  </a>
                )}
              </div>
            </div>
            <h1 className={styles.heroTitle}>{project.name}</h1>
            <p className={styles.heroDesc}>{project.description}</p>
            <div className={styles.heroTags}>
              {project.ecosystem.map((e) => (
                <span key={e} className={styles.ecoTag}>{e}</span>
              ))}
              {project.chain.map((c) => (
                <span key={c} className={styles.chainTag}>{c}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Summary Dashboard */}
        <div className={styles.summaryGrid}>
          <div className={styles.summaryCard}>
            <div className={styles.summaryLabel}>
              <TrendingUp size={14} /> Hype Score
            </div>
            <div className={styles.hypeScore}>
              <div className={styles.hypeValue}>{project.hypeScore}</div>
              <div className={styles.hypeBar}>
                <div className={styles.hypeBarFill} style={{ width: `${project.hypeScore}%` }} />
              </div>
            </div>
          </div>

          <div className={styles.summaryCard}>
            <div className={styles.summaryLabel}>
              <DollarSign size={14} /> Total Funding
            </div>
            <div className={styles.summaryValue}>{project.fundingAmount ?? "Unknown"}</div>
            {project.costType === "paid" && (
              <div className={styles.summarySubtext}>Est. cost: {project.estimatedCost}</div>
            )}
          </div>

          <div className={styles.summaryCard}>
            <div className={styles.summaryLabel}>
              <CheckCircle2 size={14} /> Your Progress
            </div>
            <div className={styles.progressDisplay}>
              <div className={styles.progressValue}>{progress}%</div>
              <div className={styles.progressBar}>
                <div className={styles.progressFill} style={{ width: `${progress}%` }} />
              </div>
              <div className={styles.progressText}>{completedTasks}/{totalTasks} tasks</div>
            </div>
          </div>

          <div className={styles.summaryCard}>
            <div className={styles.summaryLabel}>
              <Shield size={14} /> Risk Level
            </div>
            <div className={classNames(styles.riskBadge, styles[RISK_COLORS[project.riskLevel]])}>
              {project.riskLevel}
            </div>
            {project.riskFactors.length > 0 && (
              <div className={styles.summarySubtext}>{project.riskFactors.length} risk factor(s)</div>
            )}
          </div>

          <div className={styles.summaryCard}>
            <div className={styles.summaryLabel}>
              <Star size={14} /> Sentiment
            </div>
            <div className={styles.sentimentDisplay}>
              <span className={styles.sentimentIcon}>{SENTIMENT_ICONS[project.sentiment]}</span>
              <span className={classNames(styles.sentimentLabel, styles[`sentiment_${project.sentiment}`])}>
                {project.sentiment.charAt(0).toUpperCase() + project.sentiment.slice(1)}
              </span>
            </div>
          </div>

          {project.tgeDate && (
            <div className={styles.summaryCard}>
              <div className={styles.summaryLabel}>
                <Calendar size={14} /> TGE Date
              </div>
              <div className={styles.summaryValue}>{project.tgeDate}</div>
              {project.vestingInfo && (
                <div className={styles.summarySubtext}>{project.vestingInfo}</div>
              )}
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className={styles.tabs}>
          {(["general", "tasks", "wallets", "updates"] as Tab[]).map((tab) => (
            <button
              key={tab}
              className={classNames(styles.tab, { [styles.tabActive]: activeTab === tab })}
              onClick={() => setActiveTab(tab)}
            >
              {tab === "general" && <FileText size={14} />}
              {tab === "tasks" && <CheckCircle2 size={14} />}
              {tab === "wallets" && <Wallet size={14} />}
              {tab === "updates" && <Clock size={14} />}
              {tab === "general" && "General"}
              {tab === "tasks" && `Tasks (${totalTasks})`}
              {tab === "wallets" && `Wallets & Profiles`}
              {tab === "updates" && `Updates`}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className={styles.tabContent}>
          {activeTab === "general" && (
            <GeneralTab project={project} />
          )}
          {activeTab === "tasks" && (
            <TasksTab project={project} />
          )}
          {activeTab === "wallets" && (
            <WalletsTab project={project} />
          )}
          {activeTab === "updates" && (
            <UpdatesTab project={project} />
          )}
        </div>
      </div>
    </main>
  );
}

// ---- Sub-components ----

import type { Project } from "~/data/projects";

function GeneralTab({ project }: { project: Project }) {
  return (
    <div className={styles.generalLayout}>
      <div className={styles.generalMain}>
        {/* Funding Rounds */}
        {project.fundingRounds && project.fundingRounds.length > 0 && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Funding Rounds</h2>
            <div className={styles.fundingTable}>
              <div className={styles.fundingHeader}>
                <span>Round</span>
                <span>Amount</span>
                <span>Date</span>
                <span>Lead Investors</span>
              </div>
              {project.fundingRounds.map((round, i) => (
                <div key={i} className={styles.fundingRow}>
                  <span className={styles.roundBadge}>{round.round}</span>
                  <span className={styles.fundingAmount}>{round.amount}</span>
                  <span className={styles.fundingDate}>{round.date}</span>
                  <span className={styles.investorList}>{round.leadInvestors.join(", ")}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Milestones / Roadmap */}
        {project.milestones.length > 0 && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Roadmap & Milestones</h2>
            <div className={styles.milestones}>
              {project.milestones.map((m, i) => (
                <div key={m.id} className={classNames(styles.milestone, { [styles.milestoneCompleted]: m.completed })}>
                  <div className={styles.milestoneConnector}>
                    <div className={styles.milestoneDot}>
                      {m.completed ? <CheckCircle2 size={16} /> : <Circle size={16} />}
                    </div>
                    {i < project.milestones.length - 1 && <div className={styles.milestoneLine} />}
                  </div>
                  <div className={styles.milestoneContent}>
                    <div className={styles.milestoneTitle}>{m.title}</div>
                    <div className={styles.milestoneDate}>{m.date}</div>
                    {m.description && <div className={styles.milestoneDesc}>{m.description}</div>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Risk Factors */}
        {project.riskFactors.length > 0 && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Risk Assessment</h2>
            <div className={styles.riskFactors}>
              {project.riskFactors.map((r, i) => (
                <div key={i} className={styles.riskFactor}>
                  <AlertTriangle size={14} />
                  {r}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      <aside className={styles.generalSidebar}>
        {/* Tokenomics */}
        {(project.totalSupply || project.tgeDate) && (
          <div className={styles.sideCard}>
            <h3 className={styles.sideCardTitle}>Tokenomics</h3>
            {project.totalSupply && (
              <div className={styles.sideRow}>
                <span className={styles.sideLabel}>Total Supply</span>
                <span className={styles.sideValue}>{project.totalSupply}</span>
              </div>
            )}
            {project.tgeDate && (
              <div className={styles.sideRow}>
                <span className={styles.sideLabel}>TGE</span>
                <span className={styles.sideValue}>{project.tgeDate}</span>
              </div>
            )}
            {project.vestingInfo && (
              <div className={styles.sideRow}>
                <span className={styles.sideLabel}>Vesting</span>
                <span className={styles.sideValue}>{project.vestingInfo}</span>
              </div>
            )}
          </div>
        )}

        {/* Investors */}
        {project.investors && project.investors.length > 0 && (
          <div className={styles.sideCard}>
            <h3 className={styles.sideCardTitle}>Backers</h3>
            <div className={styles.investorChips}>
              {project.investors.map((inv) => (
                <span key={inv} className={styles.investorChip}>{inv}</span>
              ))}
            </div>
          </div>
        )}

        {/* Important Dates */}
        <div className={styles.sideCard}>
          <h3 className={styles.sideCardTitle}>Key Dates</h3>
          {project.snapshotDate && (
            <div className={styles.sideRow}>
              <span className={styles.sideLabel}>📸 Snapshot</span>
              <span className={styles.sideValue}>{new Date(project.snapshotDate).toLocaleDateString()}</span>
            </div>
          )}
          {project.claimDate && (
            <div className={styles.sideRow}>
              <span className={styles.sideLabel}>🎁 Claim</span>
              <span className={styles.sideValue}>{new Date(project.claimDate).toLocaleDateString()}</span>
            </div>
          )}
          {project.expiryDate && (
            <div className={styles.sideRow}>
              <span className={styles.sideLabel}>⏰ Expiry</span>
              <span className={styles.sideValue}>{new Date(project.expiryDate).toLocaleDateString()}</span>
            </div>
          )}
          {!project.snapshotDate && !project.claimDate && !project.expiryDate && (
            <div className={styles.sideEmpty}>No dates scheduled yet</div>
          )}
        </div>

        {/* Notes */}
        {project.notes && (
          <div className={styles.sideCard}>
            <h3 className={styles.sideCardTitle}>Personal Notes</h3>
            <p className={styles.noteText}>{project.notes}</p>
          </div>
        )}
      </aside>
    </div>
  );
}

function TasksTab({ project }: { project: Project }) {
  const pending = project.tasks.filter((t) => !t.completed);
  const done = project.tasks.filter((t) => t.completed);
  const progress = project.tasks.length > 0 ? Math.round((done.length / project.tasks.length) * 100) : 0;

  return (
    <div className={styles.tasksTab}>
      <div className={styles.tasksSummary}>
        <div className={styles.tasksProgressBar}>
          <div className={styles.tasksProgressFill} style={{ width: `${progress}%` }} />
        </div>
        <span className={styles.tasksProgressLabel}>{done.length} of {project.tasks.length} completed ({progress}%)</span>
      </div>

      {pending.length > 0 && (
        <div className={styles.taskGroup}>
          <h3 className={styles.taskGroupTitle}>Pending ({pending.length})</h3>
          {pending.map((task) => (
            <div key={task.id} className={styles.taskItem}>
              <Circle size={18} className={styles.taskIconPending} />
              <div className={styles.taskBody}>
                <span className={styles.taskDesc}>{task.description}</span>
                <div className={styles.taskMeta}>
                  {task.dueDate && (
                    <span className={styles.taskDue}>
                      <Clock size={12} /> Due {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                  )}
                  {task.priority && (
                    <span className={classNames(styles.taskPriority, styles[`priority_${task.priority}`])}>
                      {task.priority}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {done.length > 0 && (
        <div className={styles.taskGroup}>
          <h3 className={styles.taskGroupTitle}>Completed ({done.length})</h3>
          {done.map((task) => (
            <div key={task.id} className={classNames(styles.taskItem, styles.taskItemDone)}>
              <CheckCircle2 size={18} className={styles.taskIconDone} />
              <div className={styles.taskBody}>
                <span className={styles.taskDesc}>{task.description}</span>
                {task.completedAt && (
                  <div className={styles.taskMeta}>
                    <span className={styles.taskDue}>Completed {new Date(task.completedAt).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function WalletsTab({ project }: { project: Project }) {
  return (
    <div className={styles.walletsTab}>
      {project.linkedWallets.length > 0 ? (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <Wallet size={16} /> Linked Wallets ({project.linkedWallets.length})
          </h2>
          <div className={styles.walletCards}>
            {project.linkedWallets.map((w) => {
              const pct = w.totalTasks > 0 ? Math.round((w.tasksCompleted / w.totalTasks) * 100) : 0;
              return (
                <div key={w.walletId} className={styles.walletCard}>
                  <div className={styles.walletCardHeader}>
                    <div className={styles.walletAvatar}>
                      <Wallet size={18} />
                    </div>
                    <div>
                      <div className={styles.walletName}>{w.walletName}</div>
                      <div className={styles.walletAddress}>{w.address}</div>
                    </div>
                    <div className={styles.walletPct}>{pct}%</div>
                  </div>
                  <div className={styles.walletProgress}>
                    <div className={styles.walletProgressBar}>
                      <div className={styles.walletProgressFill} style={{ width: `${pct}%` }} />
                    </div>
                    <span>{w.tasksCompleted}/{w.totalTasks} tasks</span>
                  </div>
                  {w.lastInteraction && (
                    <div className={styles.walletLastSeen}>
                      Last interaction: {new Date(w.lastInteraction).toLocaleDateString()}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      ) : (
        <div className={styles.emptyTab}>
          <Wallet size={40} />
          <p>No wallets linked to this project yet.</p>
        </div>
      )}

      {project.linkedIdentities.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <Users size={16} /> Linked Profiles ({project.linkedIdentities.length})
          </h2>
          <div className={styles.identityCards}>
            {project.linkedIdentities.map((id) => (
              <div key={id.identityId} className={styles.identityCard}>
                <div className={styles.identityAvatar}>
                  <Users size={16} />
                </div>
                <div className={styles.identityInfo}>
                  <div className={styles.identityUsername}>{id.username}</div>
                  <div className={styles.identityPlatform}>{id.platform}</div>
                </div>
                <div className={styles.identityTasks}>{id.tasksCompleted} tasks done</div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function UpdatesTab({ project }: { project: Project }) {
  const TYPE_ICONS: Record<string, string> = {
    news: "📰",
    milestone: "🏆",
    "status-change": "🔄",
    announcement: "📢",
  };

  return (
    <div className={styles.updatesTab}>
      {project.updates.length > 0 ? (
        <div className={styles.updatesList}>
          {project.updates.map((update) => (
            <div key={update.id} className={styles.updateItem}>
              <div className={styles.updateIcon}>{TYPE_ICONS[update.type]}</div>
              <div className={styles.updateContent}>
                <div className={styles.updateHeader}>
                  <h3 className={styles.updateTitle}>{update.title}</h3>
                  <span className={styles.updateDate}>{new Date(update.date).toLocaleDateString()}</span>
                </div>
                <p className={styles.updateBody}>{update.content}</p>
                {update.source && (
                  <div className={styles.updateSource}>
                    <ExternalLink size={12} /> Source: {update.source}
                  </div>
                )}
                <span className={styles.updateTypeBadge}>{update.type.replace("-", " ")}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.emptyTab}>
          <Clock size={40} />
          <p>No updates yet. Check back later.</p>
        </div>
      )}
    </div>
  );
}
