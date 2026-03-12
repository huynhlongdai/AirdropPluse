import React from "react";
import { X, Plus, Trash2, BookOpen, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import classNames from "classnames";
import type { Task, TaskType, TaskPriority, TaskStatus, RecurringCycle, Subtask, GuideSource } from "~/data/tasks";
import type { Project } from "~/data/projects";
import styles from "./task-form-drawer.module.css";

interface Props {
  task?: Task | null;
  projects: Project[];
  onClose: () => void;
  onSave: (task: Task) => void;
}

function generateId() {
  return `task-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function generateSubId() {
  return `st-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`;
}

export default function TaskFormDrawer({ task, projects, onClose, onSave }: Props) {
  const isEdit = !!task;

  const [title, setTitle] = React.useState(task?.title ?? "");
  const [description, setDescription] = React.useState(task?.description ?? "");
  const [guideUrl, setGuideUrl] = React.useState(task?.guideUrl ?? "");
  const [guide, setGuide] = React.useState(task?.guide ?? "");
  const [guideSource] = React.useState<GuideSource>(task?.guideSource ?? "manual");
  const [guideSourceLabel] = React.useState(task?.guideSourceLabel ?? "");
  const [type, setType] = React.useState<TaskType>(task?.type ?? "onchain");
  const [priority, setPriority] = React.useState<TaskPriority>(task?.priority ?? "medium");
  const [status, setStatus] = React.useState<TaskStatus>(task?.status ?? "backlog");
  const [projectId, setProjectId] = React.useState(task?.projectId ?? "");
  const [recurring, setRecurring] = React.useState<RecurringCycle>(task?.recurring ?? null);
  const [isDailyReset, setIsDailyReset] = React.useState(task?.isDailyReset ?? false);
  const [estimatedGasFee, setEstimatedGasFee] = React.useState(task?.estimatedGasFee ?? "");
  const [gasCurrency, setGasCurrency] = React.useState(task?.gasCurrency ?? "ETH");
  const [deadline, setDeadline] = React.useState(task?.deadline ?? "");
  const [subtasks, setSubtasks] = React.useState<Subtask[]>(task?.subtasks ?? []);
  const [newSubtask, setNewSubtask] = React.useState("");
  const [tagInput, setTagInput] = React.useState("");
  const [tags, setTags] = React.useState<string[]>(task?.tags ?? []);
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  function validate() {
    const e: Record<string, string> = {};
    if (!title.trim()) e.title = "Task title is required.";
    return e;
  }

  const selectedProject = projects.find((p) => p.id === projectId);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    const now = new Date().toISOString().slice(0, 10);
    const saved: Task = {
      id: task?.id ?? generateId(),
      title: title.trim(),
      description: description.trim() || undefined,
      guideUrl: guideUrl.trim() || undefined,
      guide: guide.trim() || undefined,
      guideSource: guide.trim() ? guideSource : undefined,
      guideSourceLabel: guideSourceLabel || undefined,
      type,
      priority,
      status,
      recurring,
      projectId: projectId || undefined,
      projectName: selectedProject?.name ?? task?.projectName,
      chainId: task?.chainId,
      estimatedGasFee: estimatedGasFee || undefined,
      gasCurrency: gasCurrency || undefined,
      deadline: deadline || undefined,
      createdAt: task?.createdAt ?? now,
      executions: task?.executions ?? [],
      linkedIdentityIds: task?.linkedIdentityIds ?? [],
      tags,
      isDailyReset,
      subtasks,
      notes: task?.notes ?? [],
      activityLog: task?.activityLog ?? [
        { id: `al-${Date.now()}`, type: "status-change", message: `Task created with status: ${status}`, timestamp: now },
      ],
      isOverdue: task?.isOverdue,
    };
    onSave(saved);
    toast.success(isEdit ? `Task "${saved.title}" updated.` : `Task "${saved.title}" created.`);
    onClose();
  }

  function addSubtask() {
    if (!newSubtask.trim()) return;
    setSubtasks((prev) => [...prev, { id: generateSubId(), title: newSubtask.trim(), completed: false }]);
    setNewSubtask("");
  }

  function removeSubtask(id: string) {
    setSubtasks((prev) => prev.filter((s) => s.id !== id));
  }

  function handleSubtaskKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") { e.preventDefault(); addSubtask(); }
  }

  function addTag(e: React.KeyboardEvent) {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      const val = tagInput.trim().toLowerCase();
      if (!tags.includes(val)) setTags((prev) => [...prev, val]);
      setTagInput("");
    }
  }

  return (
    <>
      <div className={styles.overlay} onClick={onClose} />
      <aside className={styles.drawer}>
        <div className={styles.header}>
          <h2 className={styles.title}>{isEdit ? "Edit Task" : "Add New Task"}</h2>
          <button className={styles.closeButton} onClick={onClose} type="button" aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <form className={styles.body} onSubmit={handleSubmit} noValidate>
          {/* Core Info */}
          <div className={styles.section}>
            <div className={styles.sectionTitle}>Core Information</div>
            <div className={styles.field}>
              <label className={styles.label}>Task Title <span className={styles.required}>*</span></label>
              <input
                className={classNames(styles.input, { [styles.error]: errors.title })}
                value={title}
                onChange={(e) => { setTitle(e.target.value); setErrors((p) => ({ ...p, title: "" })); }}
                placeholder="e.g. Swap tokens on SyncSwap"
              />
              {errors.title && <span className={styles.errorText}>{errors.title}</span>}
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Description</label>
              <textarea className={styles.textarea} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Detailed instructions..." />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Guide URL</label>
              <input className={styles.input} value={guideUrl} onChange={(e) => setGuideUrl(e.target.value)} placeholder="https://..." />
            </div>
          </div>

          <div className={styles.guideSection}>
            <div className={styles.guideSectionHeader}>
              <label className={styles.label}>
                <BookOpen size={14} style={{ verticalAlign: "middle", marginRight: "4px" }} />
                Step-by-Step Guide
              </label>
              {task?.guideSource === "ai-extracted" && (
                <span className={styles.guideSourceBadge}>
                  AI \ {task?.guideSourceLabel ?? "Inbox"}
                </span>
              )}
              {task?.guideSource === "manual" && guide && (
                <span className={classNames(styles.guideSourceBadge, styles.guideSourceManual)}>
                  Manual
                </span>
              )}
            </div>
            <textarea
              className={classNames(styles.textarea, styles.guideTextarea)}
              value={guide}
              onChange={(e) => setGuide(e.target.value)}
              placeholder={"Write step-by-step instructions here. Markdown is supported:\n\n## Title\n\n1. First step\n2. Second step\n\n**Bold**, *italic*, [link](https://...)"}
              rows={8}
            />
            <p className={styles.guideHint}>
              Supports Markdown. Use <code>**bold**</code>, <code>*italic*</code>, numbered lists, and <code>[link](url)</code>.
            </p>
          </div>

          {/* Classification */}
          <div className={styles.section}>
            <div className={styles.sectionTitle}>Classification & Priority</div>
            <div className={styles.fieldRow}>
              <div className={styles.field}>
                <label className={styles.label}>Task Type</label>
                <select className={styles.select} value={type} onChange={(e) => setType(e.target.value as TaskType)}>
                  <option value="onchain">On-chain</option>
                  <option value="social">Social</option>
                  <option value="daily-checkin">Daily Check-in</option>
                  <option value="one-time">One-time</option>
                </select>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Priority</label>
                <select className={styles.select} value={priority} onChange={(e) => setPriority(e.target.value as TaskPriority)}>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>
            <div className={styles.fieldRow}>
              <div className={styles.field}>
                <label className={styles.label}>Status</label>
                <select className={styles.select} value={status} onChange={(e) => setStatus(e.target.value as TaskStatus)}>
                  <option value="backlog">Backlog</option>
                  <option value="in-progress">In Progress</option>
                  <option value="review">Review</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Linked Project</label>
                <select className={styles.select} value={projectId} onChange={(e) => setProjectId(e.target.value)}>
                  <option value="">— None —</option>
                  {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Recurring */}
          <div className={styles.section}>
            <div className={styles.sectionTitle}>Recurring Settings</div>
            <div className={styles.fieldRow}>
              <div className={styles.field}>
                <label className={styles.label}>Repeat Cycle</label>
                <select className={styles.select} value={recurring ?? ""} onChange={(e) => setRecurring((e.target.value || null) as RecurringCycle)}>
                  <option value="">No repeat</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Deadline</label>
                <input type="date" className={styles.input} value={deadline} onChange={(e) => setDeadline(e.target.value)} />
              </div>
            </div>
            {recurring === "daily" && (
              <label className={styles.checkboxLabel}>
                <input type="checkbox" checked={isDailyReset} onChange={(e) => setIsDailyReset(e.target.checked)} />
                Auto-reset wallets to pending at 00:00 UTC daily
              </label>
            )}
          </div>

          {/* Financial */}
          {type === "onchain" && (
            <div className={styles.section}>
              <div className={styles.sectionTitle}>Financial Estimate</div>
              <div className={styles.fieldRow}>
                <div className={styles.field}>
                  <label className={styles.label}>Estimated Gas Fee</label>
                  <input className={styles.input} value={estimatedGasFee} onChange={(e) => setEstimatedGasFee(e.target.value)} placeholder="e.g. 0.005" type="number" step="0.0001" />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Gas Currency</label>
                  <select className={styles.select} value={gasCurrency} onChange={(e) => setGasCurrency(e.target.value)}>
                    <option value="ETH">ETH</option>
                    <option value="SUI">SUI</option>
                    <option value="SOL">SOL</option>
                    <option value="BNB">BNB</option>
                    <option value="MATIC">MATIC</option>
                    <option value="AVAX">AVAX</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Subtasks */}
          <div className={styles.section}>
            <div className={styles.sectionTitle}>Subtasks / Steps</div>
            <div className={styles.subtaskList}>
              {subtasks.map((s) => (
                <div key={s.id} className={styles.subtaskItem}>
                  <span className={styles.subtaskText}>{s.title}</span>
                  <button type="button" className={styles.removeBtn} onClick={() => removeSubtask(s.id)}><Trash2 size={14} /></button>
                </div>
              ))}
            </div>
            <div className={styles.addRowForm}>
              <input
                className={styles.input}
                style={{ flex: 1 }}
                value={newSubtask}
                onChange={(e) => setNewSubtask(e.target.value)}
                onKeyDown={handleSubtaskKeyDown}
                placeholder="Add a step... (Enter to add)"
              />
              <button type="button" className={styles.addRowBtn} onClick={addSubtask}><Plus size={14} /> Add</button>
            </div>
          </div>

          {/* Tags */}
          <div className={styles.section}>
            <div className={styles.sectionTitle}>Tags</div>
            <div className={styles.field}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)", padding: "var(--space-2) var(--space-3)", background: "var(--color-neutral-3)", border: "var(--border-size-1) solid var(--color-neutral-6)", borderRadius: "var(--radius-3)", minHeight: 42 }}>
                {tags.map((t) => (
                  <span key={t} style={{ display: "inline-flex", alignItems: "center", gap: "var(--space-1)", padding: "1px var(--space-2)", background: "var(--color-accent-4)", color: "var(--color-accent-11)", borderRadius: "var(--radius-round)", fontSize: "var(--font-size-0)", fontWeight: 500 }}>
                    {t}
                    <button type="button" onClick={() => setTags((p) => p.filter((x) => x !== t))} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-accent-9)", fontSize: 14, padding: 0, lineHeight: 1 }}>×</button>
                  </span>
                ))}
                <input
                  style={{ border: "none", background: "transparent", outline: "none", color: "var(--color-neutral-12)", fontSize: "var(--font-size-1)", minWidth: 80, flex: 1 }}
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={addTag}
                  placeholder="bridge, defi... (Enter)"
                />
              </div>
            </div>
          </div>

          <div className={styles.footer}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>Cancel</button>
            <button type="submit" className={styles.submitBtn}>{isEdit ? "Save Changes" : "Create Task"}</button>
          </div>
        </form>
      </aside>
    </>
  );
}
