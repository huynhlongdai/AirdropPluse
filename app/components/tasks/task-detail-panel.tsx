import React from "react";
import {
  X, ExternalLink, Zap, Twitter, RefreshCw, Flame, CheckCircle2,
  AlertCircle, Link2, CalendarClock, Activity, FileText, Wallet,
  ListChecks, GitBranch, Hash
} from "lucide-react";
import classNames from "classnames";
import type { Task, Subtask, TaskNote } from "~/data/tasks";
import { TASK_TYPE_LABELS } from "~/data/tasks";
import ExecutionMatrixTab from "./execution-matrix-tab";
import styles from "./task-detail-panel.module.css";

interface TaskDetailPanelProps {
  task: Task;
  onClose: () => void;
  onTaskUpdate?: (updatedTask: Task) => void;
}

type TabId = "overview" | "subtasks" | "execution" | "notes" | "activity";

const TYPE_ICONS: Record<Task["type"], React.ReactNode> = {
  onchain: <Zap size={11} />,
  social: <Twitter size={11} />,
  "daily-checkin": <RefreshCw size={11} />,
  "one-time": <Flame size={11} />,
};

const TYPE_STYLE: Record<Task["type"], string> = {
  onchain: styles.badgeOnchain,
  social: styles.badgeSocial,
  "daily-checkin": styles.badgeDaily,
  "one-time": styles.badgeOneTime,
};

const STATUS_STYLE: Record<Task["status"], string> = {
  backlog: styles.statusBacklog,
  "in-progress": styles.statusInProgress,
  review: styles.statusReview,
  completed: styles.statusCompleted,
};

const ACTIVITY_DOT_STYLE: Record<string, string> = {
  "status-change": styles.activityDotStatus,
  "wallet-update": styles.activityDotWallet,
  "note-added": styles.activityDotNote,
  "subtask-completed": styles.activityDotStatus,
  "deadline-changed": styles.activityDotNote,
  "project-update": styles.activityDotProject,
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function TaskDetailPanel({ task: initialTask, onClose, onTaskUpdate }: TaskDetailPanelProps) {
  const [activeTab, setActiveTab] = React.useState<TabId>("overview");
  const [task, setTask] = React.useState<Task>(initialTask);
  const [newNote, setNewNote] = React.useState("");

  // Sync if prop changes (e.g. parent updates)
  React.useEffect(() => { setTask(initialTask); }, [initialTask]);

  const doneCount = task.executions.filter((e) => e.status === "completed").length;
  const totalCount = task.executions.length;
  const execProgress = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;

  const subtasksDone = (task.subtasks ?? []).filter((s) => s.completed).length;
  const subtasksTotal = (task.subtasks ?? []).length;
  const subtaskProgress = subtasksTotal > 0 ? Math.round((subtasksDone / subtasksTotal) * 100) : 0;

  function handleSubtaskToggle(subtaskId: string) {
    const updated: Task = {
      ...task,
      subtasks: (task.subtasks ?? []).map((s) =>
        s.id === subtaskId
          ? { ...s, completed: !s.completed, completedAt: !s.completed ? new Date().toISOString().split("T")[0] : undefined }
          : s
      ),
    };
    setTask(updated);
    onTaskUpdate?.(updated);
  }

  function handleAddNote() {
    if (!newNote.trim()) return;
    const note: TaskNote = {
      id: `note-${Date.now()}`,
      content: newNote.trim(),
      createdAt: new Date().toISOString().split("T")[0],
    };
    const updated: Task = { ...task, notes: [note, ...(task.notes ?? [])] };
    setTask(updated);
    onTaskUpdate?.(updated);
    setNewNote("");
  }

  function handleOverlayClick(e: React.MouseEvent) {
    if (e.target === e.currentTarget) onClose();
  }

  const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
    { id: "overview", label: "Overview", icon: <FileText size={13} /> },
    { id: "subtasks", label: `Subtasks ${subtasksTotal > 0 ? `(${subtasksDone}/${subtasksTotal})` : ""}`, icon: <ListChecks size={13} /> },
    { id: "execution", label: `Execution (${totalCount})`, icon: <Wallet size={13} /> },
    { id: "notes", label: "Notes", icon: <FileText size={13} /> },
    { id: "activity", label: "Activity", icon: <Activity size={13} /> },
  ];

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.panel} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <h2 className={styles.title}>{task.title}</h2>
            <div className={styles.metaRow}>
              <span className={classNames(styles.badge, TYPE_STYLE[task.type])}>
                {TYPE_ICONS[task.type]} {TASK_TYPE_LABELS[task.type]}
              </span>
              <span className={classNames(styles.statusBadge, STATUS_STYLE[task.status])}>
                {task.status.replace("-", " ")}
              </span>
              <span
                className={classNames(styles.priorityDot, {
                  [styles.priorityHigh]: task.priority === "high",
                  [styles.priorityMedium]: task.priority === "medium",
                  [styles.priorityLow]: task.priority === "low",
                })}
              />
              {task.isOverdue && (
                <span className={styles.overdueTag}>
                  <AlertCircle size={11} /> Overdue
                </span>
              )}
              {task.projectName && (
                <span style={{ fontSize: "0.75rem", color: "var(--color-neutral-9)", display: "flex", alignItems: "center", gap: "4px" }}>
                  <Link2 size={11} /> {task.projectName}
                </span>
              )}
            </div>
          </div>
          <button className={styles.closeButton} onClick={onClose} type="button" aria-label="Close">
            <X size={18} />
          </button>
        </div>

        {/* Tabs */}
        <div className={styles.tabs}>
          {tabs.map((t) => (
            <button
              key={t.id}
              className={classNames(styles.tab, { [styles.tabActive]: activeTab === t.id })}
              onClick={() => setActiveTab(t.id)}
              type="button"
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className={styles.body}>
          {activeTab === "overview" && <OverviewTab task={task} subtaskProgress={subtaskProgress} subtasksDone={subtasksDone} subtasksTotal={subtasksTotal} execProgress={execProgress} doneCount={doneCount} totalCount={totalCount} />}
          {activeTab === "subtasks" && <SubtasksTab task={task} onToggle={handleSubtaskToggle} subtasksDone={subtasksDone} subtasksTotal={subtasksTotal} subtaskProgress={subtaskProgress} />}
          {activeTab === "execution" && <ExecutionMatrixTab task={task} onTaskUpdate={(updated) => { setTask(updated); onTaskUpdate?.(updated); }} />}
          {activeTab === "notes" && <NotesTab task={task} newNote={newNote} onNewNoteChange={setNewNote} onAddNote={handleAddNote} />}
          {activeTab === "activity" && <ActivityTab task={task} />}
        </div>
      </div>
    </div>
  );
}

/* ── Tab: Overview ───────────────────────────────────────── */
function OverviewTab({ task, subtaskProgress, subtasksDone, subtasksTotal, execProgress, doneCount, totalCount }: {
  task: Task;
  subtaskProgress: number;
  subtasksDone: number;
  subtasksTotal: number;
  execProgress: number;
  doneCount: number;
  totalCount: number;
}) {
  return (
    <>
      {/* Description */}
      {task.description && (
        <div className={styles.section}>
          <p className={styles.sectionTitle}><FileText size={13} /> Description</p>
          <p className={styles.description}>{task.description}</p>
        </div>
      )}

      {/* Guide Link */}
      {task.guideUrl && (
        <div className={styles.section}>
          <p className={styles.sectionTitle}><ExternalLink size={13} /> Guide</p>
          <a href={task.guideUrl} target="_blank" rel="noopener noreferrer" className={styles.guideLink}>
            <ExternalLink size={13} /> Open Official Guide / Docs
          </a>
        </div>
      )}

      {/* Meta grid */}
      <div className={styles.section}>
        <p className={styles.sectionTitle}><Hash size={13} /> Metadata</p>
        <div className={styles.metaGrid}>
          {task.estimatedGasFee && (
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Est. Gas Fee</span>
              <span className={classNames(styles.metaValue, styles.metaValueWarning)}>~{task.estimatedGasFee} {task.gasCurrency}</span>
            </div>
          )}
          {task.deadline && (
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Deadline</span>
              <span className={classNames(styles.metaValue, { [styles.metaValueError]: task.isOverdue })}>
                <CalendarClock size={13} style={{ verticalAlign: "middle", marginRight: 4 }} />
                {formatDate(task.deadline)}
              </span>
            </div>
          )}
          {task.chainId && (
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Chain</span>
              <span className={styles.metaValue}>{task.chainId}</span>
            </div>
          )}
          {task.recurring && (
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Recurring</span>
              <span className={styles.metaValue}>{task.recurring}</span>
            </div>
          )}
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Created</span>
            <span className={styles.metaValue}>{formatDate(task.createdAt)}</span>
          </div>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Priority</span>
            <span className={classNames(styles.metaValue, {
              [styles.metaValueError]: task.priority === "high",
              [styles.metaValueWarning]: task.priority === "medium",
              [styles.metaValueSuccess]: task.priority === "low",
            })}>
              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
            </span>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className={styles.section}>
        <p className={styles.sectionTitle}><Activity size={13} /> Progress</p>
        <div className={styles.progressSummary}>
          <div className={styles.progressInfo}>
            <span className={styles.progressLabel}>Wallet Execution ({doneCount}/{totalCount} done)</span>
            <div className={styles.progressBar}>
              <div className={classNames(styles.progressFill, { [styles.progressFillComplete]: execProgress === 100 })} style={{ width: `${execProgress}%` }} />
            </div>
          </div>
          <span className={styles.progressPercent}>{execProgress}%</span>
        </div>
        {subtasksTotal > 0 && (
          <div className={styles.progressSummary}>
            <div className={styles.progressInfo}>
              <span className={styles.progressLabel}>Subtask Completion ({subtasksDone}/{subtasksTotal} done)</span>
              <div className={styles.progressBar}>
                <div className={classNames(styles.progressFill, { [styles.progressFillComplete]: subtaskProgress === 100 })} style={{ width: `${subtaskProgress}%` }} />
              </div>
            </div>
            <span className={styles.progressPercent}>{subtaskProgress}%</span>
          </div>
        )}
      </div>

      {/* Tags */}
      {task.tags && task.tags.length > 0 && (
        <div className={styles.section}>
          <p className={styles.sectionTitle}><GitBranch size={13} /> Tags</p>
          <div className={styles.tagsList}>
            {task.tags.map((tag) => <span key={tag} className={styles.tag}>#{tag}</span>)}
          </div>
        </div>
      )}
    </>
  );
}

/* ── Tab: Subtasks ───────────────────────────────────────── */
function SubtasksTab({ task, onToggle, subtasksDone, subtasksTotal, subtaskProgress }: {
  task: Task;
  onToggle: (id: string) => void;
  subtasksDone: number;
  subtasksTotal: number;
  subtaskProgress: number;
}) {
  const subtasks = task.subtasks ?? [];
  if (subtasks.length === 0) {
    return <p className={styles.emptyState}>No subtasks defined for this task.</p>;
  }
  return (
    <>
      <div className={styles.progressSummary}>
        <div className={styles.progressInfo}>
          <span className={styles.progressLabel}>Overall progress — {subtasksDone} of {subtasksTotal} steps completed</span>
          <div className={styles.progressBar}>
            <div className={classNames(styles.progressFill, { [styles.progressFillComplete]: subtaskProgress === 100 })} style={{ width: `${subtaskProgress}%` }} />
          </div>
        </div>
        <span className={styles.progressPercent}>{subtaskProgress}%</span>
      </div>
      <div className={styles.subtaskList}>
        {subtasks.map((subtask) => (
          <SubtaskRow key={subtask.id} subtask={subtask} onToggle={onToggle} />
        ))}
      </div>
    </>
  );
}

function SubtaskRow({ subtask, onToggle }: { subtask: Subtask; onToggle: (id: string) => void }) {
  return (
    <div className={styles.subtaskItem} onClick={() => onToggle(subtask.id)}>
      <div className={classNames(styles.subtaskCheckbox, { [styles.subtaskCheckboxDone]: subtask.completed })}>
        {subtask.completed && <CheckCircle2 size={12} color="white" />}
      </div>
      <span className={classNames(styles.subtaskTitle, { [styles.subtaskTitleDone]: subtask.completed })}>
        {subtask.title}
      </span>
      {subtask.completedAt && (
        <span className={styles.subtaskDate}>{formatDate(subtask.completedAt)}</span>
      )}
    </div>
  );
}



/* ── Tab: Notes ──────────────────────────────────────────── */
function NotesTab({ task, newNote, onNewNoteChange, onAddNote }: {
  task: Task;
  newNote: string;
  onNewNoteChange: (v: string) => void;
  onAddNote: () => void;
}) {
  return (
    <>
      <div className={styles.section}>
        <p className={styles.sectionTitle}><FileText size={13} /> Add Note</p>
        <div className={styles.noteForm}>
          <textarea
            className={styles.noteTextarea}
            placeholder="Record gas costs, issues encountered, tips for next time..."
            value={newNote}
            onChange={(e) => onNewNoteChange(e.target.value)}
            rows={3}
          />
          <div className={styles.noteActions}>
            <button
              className={styles.btnAddNote}
              onClick={onAddNote}
              disabled={!newNote.trim()}
              type="button"
            >
              Add Note
            </button>
          </div>
        </div>
      </div>
      <div className={styles.notesArea}>
        {(task.notes ?? []).length === 0 ? (
          <p className={styles.emptyState}>No notes yet. Add one above.</p>
        ) : (
          (task.notes ?? []).map((note) => (
            <div key={note.id} className={styles.noteItem}>
              <p className={styles.noteContent}>{note.content}</p>
              <span className={styles.noteDate}>{formatDate(note.createdAt)}</span>
            </div>
          ))
        )}
      </div>
    </>
  );
}

/* ── Tab: Activity ───────────────────────────────────────── */
function ActivityTab({ task }: { task: Task }) {
  const logs = task.activityLog ?? [];
  if (logs.length === 0) {
    return <p className={styles.emptyState}>No activity recorded yet.</p>;
  }
  return (
    <div className={styles.activityList}>
      {logs.map((log) => (
        <div key={log.id} className={styles.activityItem}>
          <div className={classNames(styles.activityDot, ACTIVITY_DOT_STYLE[log.type] ?? "")}>
            {log.type === "status-change" && <Activity size={10} color="var(--color-accent-11)" />}
            {log.type === "wallet-update" && <Wallet size={10} color="var(--color-success-11)" />}
            {log.type === "note-added" && <FileText size={10} color="var(--amber-11)" />}
            {log.type === "project-update" && <ExternalLink size={10} color="var(--violet-11)" />}
            {(log.type === "subtask-completed" || log.type === "deadline-changed") && <CheckCircle2 size={10} color="var(--color-accent-11)" />}
          </div>
          <div className={styles.activityContent}>
            <p className={styles.activityMessage}>{log.message}</p>
            <span className={styles.activityTime}>{formatDate(log.timestamp)}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
