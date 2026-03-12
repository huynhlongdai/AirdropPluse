import React from "react";
import { Link, useParams, useNavigate } from "react-router";
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
  Pencil,
  Trash2,
  Plus,
} from "lucide-react";
import classNames from "classnames";
import { toast } from "sonner";
import type { Route } from "./+types/project-detail";
import type { Project } from "~/data/projects";
import { useStore } from "~/hooks/use-store";
import type { WalletTaskStatus } from "~/data/tasks";
import ProjectFormDrawer from "~/components/projects/project-form-drawer";
import ConfirmDeleteDialog from "~/components/confirm-delete-dialog";
import styles from "./project-detail.module.css";

export function meta({ params }: Route.MetaArgs) {
  return [{ title: "Project - AirdropPulse" }];
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
  const navigate = useNavigate();
  const { projects, tasks, updateProject, deleteProject } = useStore();
  const [activeTab, setActiveTab] = React.useState<Tab>("general");
  const [showEditForm, setShowEditForm] = React.useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);

  const project = projects.find((p) => p.id === id);

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

  const safeProject = project;
  const completedTasks = safeProject.tasks.filter((t) => t.completed).length;
  const totalTasks = safeProject.tasks.length;
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  function handleSave(updated: Project) {
    updateProject(updated);
  }

  function handleDelete() {
    deleteProject(safeProject.id);
    toast.success(`"${safeProject.name}" deleted.`);
    navigate("/projects");
  }

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        {/* Back nav */}
        <div className={styles.topBar}>
          <Link to="/projects" className={styles.backLink}>
            <ArrowLeft size={16} />
            Back to Projects
          </Link>
          <div className={styles.topActions}>
            <button className={styles.editBtn} onClick={() => setShowEditForm(true)} type="button">
              <Pencil size={14} /> Edit
            </button>
            <button className={styles.deleteBtn} onClick={() => setShowDeleteConfirm(true)} type="button">
              <Trash2 size={14} /> Delete
            </button>
          </div>
        </div>

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
          {activeTab === "general" && <GeneralTab project={project} />}
          {activeTab === "tasks" && <TasksTab project={project} onUpdate={updateProject} />}
          {activeTab === "wallets" && <WalletsTab project={project} projectTasks={tasks.filter((t) => t.projectId === project.id)} />}
          {activeTab === "updates" && <UpdatesTab project={project} />}
        </div>
      </div>

      {showEditForm && (
        <ProjectFormDrawer
          project={project}
          onClose={() => setShowEditForm(false)}
          onSave={handleSave}
        />
      )}

      {showDeleteConfirm && (
        <ConfirmDeleteDialog
          title={`Delete "${project.name}"?`}
          description="This will permanently remove the project and all associated data. This action cannot be undone."
          onCancel={() => setShowDeleteConfirm(false)}
          onConfirm={handleDelete}
        />
      )}
    </main>
  );
}

// ---- Sub-components ----

function GeneralTab({ project }: { project: Project }) {
  return (
    <div className={styles.generalLayout}>
      <div className={styles.generalMain}>
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

interface TasksTabProps {
  project: Project;
  onUpdate: (p: Project) => void;
}

function TasksTab({ project, onUpdate }: TasksTabProps) {
  const [newTaskDesc, setNewTaskDesc] = React.useState("");
  const [newTaskPriority, setNewTaskPriority] = React.useState<"low" | "medium" | "high">("medium");
  const [newTaskDue, setNewTaskDue] = React.useState("");
  const [deletingTaskId, setDeletingTaskId] = React.useState<string | null>(null);

  const pending = project.tasks.filter((t) => !t.completed);
  const done = project.tasks.filter((t) => t.completed);
  const progress = project.tasks.length > 0 ? Math.round((done.length / project.tasks.length) * 100) : 0;

  function toggleTask(taskId: string) {
    const updated: Project = {
      ...project,
      tasks: project.tasks.map((t) =>
        t.id === taskId
          ? { ...t, completed: !t.completed, completedAt: !t.completed ? new Date().toISOString().slice(0, 10) : undefined }
          : t
      ),
      updatedAt: new Date().toISOString().slice(0, 10),
    };
    onUpdate(updated);
  }

  function addTask() {
    if (!newTaskDesc.trim()) return;
    const newTask = {
      id: `t-${Date.now()}`,
      description: newTaskDesc.trim(),
      completed: false,
      priority: newTaskPriority,
      dueDate: newTaskDue || undefined,
    };
    const updated: Project = {
      ...project,
      tasks: [...project.tasks, newTask],
      updatedAt: new Date().toISOString().slice(0, 10),
    };
    onUpdate(updated);
    setNewTaskDesc("");
    setNewTaskDue("");
    toast.success("Task added to project.");
  }

  function deleteTask(taskId: string) {
    const updated: Project = {
      ...project,
      tasks: project.tasks.filter((t) => t.id !== taskId),
      updatedAt: new Date().toISOString().slice(0, 10),
    };
    onUpdate(updated);
    setDeletingTaskId(null);
    toast.success("Task removed.");
  }

  return (
    <div className={styles.tasksTab}>
      <div className={styles.tasksSummary}>
        <div className={styles.tasksProgressBar}>
          <div className={styles.tasksProgressFill} style={{ width: `${progress}%` }} />
        </div>
        <span className={styles.tasksProgressLabel}>{done.length} of {project.tasks.length} completed ({progress}%)</span>
      </div>

      {/* Add task form */}
      <div className={styles.addTaskForm}>
        <input
          className={styles.addTaskInput}
          value={newTaskDesc}
          onChange={(e) => setNewTaskDesc(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTask()}
          placeholder="Add a new task to this project..."
        />
        <select className={styles.addTaskSelect} value={newTaskPriority} onChange={(e) => setNewTaskPriority(e.target.value as "low" | "medium" | "high")}>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        <input type="date" className={styles.addTaskDate} value={newTaskDue} onChange={(e) => setNewTaskDue(e.target.value)} />
        <button className={styles.addTaskBtn} onClick={addTask} type="button"><Plus size={14} /> Add Task</button>
      </div>

      {pending.length > 0 && (
        <div className={styles.taskGroup}>
          <h3 className={styles.taskGroupTitle}>Pending ({pending.length})</h3>
          {pending.map((task) => (
            <div key={task.id} className={styles.taskItem}>
              <button className={styles.taskToggleBtn} onClick={() => toggleTask(task.id)} type="button">
                <Circle size={18} className={styles.taskIconPending} />
              </button>
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
              <button className={styles.taskDeleteBtn} onClick={() => setDeletingTaskId(task.id)} type="button">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {done.length > 0 && (
        <div className={styles.taskGroup}>
          <h3 className={styles.taskGroupTitle}>Completed ({done.length})</h3>
          {done.map((task) => (
            <div key={task.id} className={classNames(styles.taskItem, styles.taskItemDone)}>
              <button className={styles.taskToggleBtn} onClick={() => toggleTask(task.id)} type="button">
                <CheckCircle2 size={18} className={styles.taskIconDone} />
              </button>
              <div className={styles.taskBody}>
                <span className={styles.taskDesc}>{task.description}</span>
                {task.completedAt && (
                  <div className={styles.taskMeta}>
                    <span className={styles.taskDue}>Completed {new Date(task.completedAt).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
              <button className={styles.taskDeleteBtn} onClick={() => setDeletingTaskId(task.id)} type="button">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {deletingTaskId && (
        <ConfirmDeleteDialog
          title="Remove task?"
          description="This task will be permanently removed from the project."
          onCancel={() => setDeletingTaskId(null)}
          onConfirm={() => deleteTask(deletingTaskId)}
        />
      )}
    </div>
  );
}

import type { Task } from "~/data/tasks";

function WalletsTab({ project, projectTasks }: { project: Project; projectTasks: Task[] }) {
  // Build wallet participation from live task executions
  const walletMap = React.useMemo(() => {
    const map = new Map<string, {
      walletId: string;
      walletName: string;
      address: string;
      completed: number;
      total: number;
      failed: number;
      lastInteraction?: string;
      statusByTask: { taskId: string; taskTitle: string; status: WalletTaskStatus | null }[];
    }>();

    projectTasks.forEach((task) => {
      task.executions.forEach((exec) => {
        if (!map.has(exec.walletId)) {
          map.set(exec.walletId, {
            walletId: exec.walletId,
            walletName: exec.walletName,
            address: exec.address,
            completed: 0,
            total: 0,
            failed: 0,
            lastInteraction: exec.completedAt,
            statusByTask: [],
          });
        }
        const entry = map.get(exec.walletId)!;
        entry.total += 1;
        if (exec.status === "completed") {
          entry.completed += 1;
          if (exec.completedAt && (!entry.lastInteraction || exec.completedAt > entry.lastInteraction)) {
            entry.lastInteraction = exec.completedAt;
          }
        }
        if (exec.status === "failed") entry.failed += 1;
        entry.statusByTask.push({ taskId: task.id, taskTitle: task.title, status: exec.status });
      });
    });

    return Array.from(map.values());
  }, [projectTasks]);

  // Also include wallets from linkedWallets that don't have task data
  const legacyOnly = project.linkedWallets.filter(
    (w) => !walletMap.find((m) => m.walletId === w.walletId)
  );

  const STATUS_COLOR: Record<string, string> = {
    completed: "var(--color-success-9)",
    "in-progress": "var(--color-accent-9)",
    "not-started": "var(--color-neutral-6)",
    failed: "var(--color-error-9)",
  };

  return (
    <div className={styles.walletsTab}>
      {walletMap.length > 0 ? (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <Wallet size={16} /> Wallet Participation ({walletMap.length} wallets)
          </h2>
          <div className={styles.walletCards}>
            {walletMap.map((w) => {
              const pct = w.total > 0 ? Math.round((w.completed / w.total) * 100) : 0;
              return (
                <div key={w.walletId} className={styles.walletCard}>
                  <div className={styles.walletCardHeader}>
                    <div className={styles.walletAvatar}><Wallet size={18} /></div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className={styles.walletName}>{w.walletName}</div>
                      <div className={styles.walletAddress}>{w.address}</div>
                    </div>
                    <div className={classNames(styles.walletPct, { [styles.walletPctFull]: pct === 100 })}>{pct}%</div>
                  </div>
                  <div className={styles.walletProgress}>
                    <div className={styles.walletProgressBar}>
                      <div
                        className={styles.walletProgressFill}
                        style={{
                          width: `${pct}%`,
                          background: pct === 100 ? "var(--color-success-9)" : "var(--color-accent-9)",
                        }}
                      />
                    </div>
                    <span>{w.completed}/{w.total} tasks</span>
                    {w.failed > 0 && (
                      <span style={{ color: "var(--color-error-11)", fontSize: "0.72rem", fontWeight: 600 }}>
                        {w.failed} failed
                      </span>
                    )}
                  </div>
                  {/* Task status row */}
                  <div className={styles.taskStatusRow}>
                    {w.statusByTask.map(({ taskId, taskTitle, status }) => (
                      <div
                        key={taskId}
                        className={styles.taskStatusDot}
                        style={{ background: status ? STATUS_COLOR[status] : "var(--color-neutral-5)" }}
                        title={`${taskTitle}: ${status ?? "not assigned"}`}
                      />
                    ))}
                  </div>
                  {w.lastInteraction && (
                    <div className={styles.walletLastSeen}>
                      Last interaction: {new Date(w.lastInteraction).toLocaleDateString()}
                    </div>
                  )}
                </div>
              );
            })}

            {legacyOnly.map((w) => {
              const pct = w.totalTasks > 0 ? Math.round((w.tasksCompleted / w.totalTasks) * 100) : 0;
              return (
                <div key={w.walletId} className={styles.walletCard}>
                  <div className={styles.walletCardHeader}>
                    <div className={styles.walletAvatar}><Wallet size={18} /></div>
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
          <p>No wallet executions found for this project&#39;s tasks.</p>
          <p style={{ fontSize: "0.78rem", color: "var(--color-neutral-8)" }}>Assign wallets to tasks in the Execution tab to track progress here.</p>
        </div>
      )}

      {project.linkedIdentities.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <Users size={16} /> Linked Profiles ({project.linkedIdentities.length})
          </h2>
          <div className={styles.identityCards}>
            {project.linkedIdentities.map((ident) => (
              <div key={ident.identityId} className={styles.identityCard}>
                <div className={styles.identityAvatar}><Users size={16} /></div>
                <div className={styles.identityInfo}>
                  <div className={styles.identityUsername}>{ident.username}</div>
                  <div className={styles.identityPlatform}>{ident.platform}</div>
                </div>
                <div className={styles.identityTasks}>{ident.tasksCompleted} tasks done</div>
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
