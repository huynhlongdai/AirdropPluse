import React from "react";
import {
  X, Plus, Trash2, BookOpen, RefreshCw, Bot, Users, Wallet,
  ChevronRight, Zap, Twitter, Flame, Check, AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import classNames from "classnames";
import type { Task, TaskType, TaskPriority, TaskStatus, RecurringCycle, Subtask, GuideSource } from "~/data/tasks";
import type { Project } from "~/data/projects";
import type { IdentityProfile } from "~/data/identities";
import type { MainWallet, SubWallet } from "~/data/wallets";
import { mockIdentities } from "~/data/identities";
import { mockMainWallets } from "~/data/wallets";
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

const TYPE_OPTIONS: { value: TaskType; label: string; icon: React.ReactNode; color: string; bg: string }[] = [
  { value: "onchain",       label: "On-chain",    icon: <Zap size={13}/>,        color: "#2563eb", bg: "#dbeafe" },
  { value: "social",        label: "Social",       icon: <Twitter size={13}/>,    color: "#be185d", bg: "#fce7f3" },
  { value: "daily-checkin", label: "Daily",        icon: <RefreshCw size={13}/>,  color: "#0f766e", bg: "#ccfbf1" },
  { value: "one-time",      label: "One-time",     icon: <Flame size={13}/>,      color: "#9333ea", bg: "#f3e8ff" },
];

const STATUS_OPTIONS: { value: TaskStatus; label: string; color: string }[] = [
  { value: "backlog",     label: "Backlog",     color: "#71717a" },
  { value: "in-progress", label: "In Progress", color: "#2563eb" },
  { value: "review",      label: "Review",      color: "#d97706" },
  { value: "completed",   label: "Completed",   color: "#16a34a" },
];

const PRIORITY_OPTIONS: { value: TaskPriority; label: string; color: string }[] = [
  { value: "high",   label: "High",   color: "#ef4444" },
  { value: "medium", label: "Medium", color: "#c9a028" },
  { value: "low",    label: "Low",    color: "#22c55e" },
];

const AVATAR_COLORS = ["#6366f1","#22c55e","#f59e0b","#ef4444","#8b5cf6","#06b6d4","#ec4899","#14b8a6"];
function getAvatarColor(alias: string) {
  let h = 0;
  for (let i = 0; i < alias.length; i++) h = alias.charCodeAt(i) + ((h << 5) - h);
  return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length];
}

export default function TaskFormDrawer({ task, projects, onClose, onSave }: Props) {
  const isEdit = !!task;

  // ── Core fields ──────────────────────────────────────────────
  const [title, setTitle]             = React.useState(task?.title ?? "");
  const [description, setDescription] = React.useState(task?.description ?? "");
  const [guideUrl, setGuideUrl]       = React.useState(task?.guideUrl ?? "");
  const [guide, setGuide]             = React.useState(task?.guide ?? "");
  const [type, setType]               = React.useState<TaskType>(task?.type ?? "onchain");
  const [priority, setPriority]       = React.useState<TaskPriority>(task?.priority ?? "medium");
  const [status, setStatus]           = React.useState<TaskStatus>(task?.status ?? "backlog");
  const [projectId, setProjectId]     = React.useState(task?.projectId ?? "");
  const [recurring, setRecurring]     = React.useState<RecurringCycle>(task?.recurring ?? null);
  const [isDailyReset, setIsDailyReset] = React.useState(task?.isDailyReset ?? false);
  const [estimatedGasFee, setEstimatedGasFee] = React.useState(task?.estimatedGasFee ?? "");
  const [gasCurrency, setGasCurrency] = React.useState(task?.gasCurrency ?? "ETH");
  const [deadline, setDeadline]       = React.useState(task?.deadline ?? "");
  const [subtasks, setSubtasks]       = React.useState<Subtask[]>(task?.subtasks ?? []);
  const [newSubtask, setNewSubtask]   = React.useState("");
  const [tagInput, setTagInput]       = React.useState("");
  const [tags, setTags]               = React.useState<string[]>(task?.tags ?? []);

  // ── Profile & Wallet assignment ──────────────────────────────
  const [selectedIdentityIds, setSelectedIdentityIds] = React.useState<string[]>(task?.linkedIdentityIds ?? []);
  const [selectedWalletIds, setSelectedWalletIds]     = React.useState<string[]>(
    task?.executions.map((e) => e.walletId) ?? []
  );

  const [errors, setErrors] = React.useState<Record<string, string>>({});

  // All identities & sub-wallets for picker
  const allIdentities: IdentityProfile[] = mockIdentities;
  const allSubWallets: (SubWallet & { mainName: string })[] = mockMainWallets.flatMap((m) =>
    m.subWallets.map((s) => ({ ...s, mainName: m.name }))
  );

  // Pre-filter wallets relevant to selected project
  const selectedProject = projects.find((p) => p.id === projectId);
  const relevantWalletIds = new Set(selectedProject?.participatingWalletIds ?? []);
  const relevantWallets = allSubWallets.filter((sw) =>
    relevantWalletIds.size === 0 || relevantWalletIds.has(sw.id)
  );
  const displayWallets = relevantWallets.length > 0 ? relevantWallets : allSubWallets;

  function toggleIdentity(id: string) {
    setSelectedIdentityIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  function toggleWallet(id: string) {
    setSelectedWalletIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!title.trim()) e.title = "Task title is required.";
    return e;
  }

  function addSubtask() {
    if (!newSubtask.trim()) return;
    setSubtasks((prev) => [...prev, { id: generateSubId(), title: newSubtask.trim(), completed: false }]);
    setNewSubtask("");
  }

  function addTag(e: React.KeyboardEvent) {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      const val = tagInput.trim().toLowerCase();
      if (!tags.includes(val)) setTags((prev) => [...prev, val]);
      setTagInput("");
    }
  }

  function buildExecutions() {
    return selectedWalletIds.map((wid) => {
      const sw = allSubWallets.find((s) => s.id === wid);
      const existing = task?.executions.find((e) => e.walletId === wid);
      return existing ?? {
        walletId: wid,
        walletName: sw?.name ?? wid,
        address: sw?.address ?? "",
        status: "not-started" as const,
      };
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    const now = new Date().toISOString().slice(0, 10);
    const saved: Task = {
      id: task?.id ?? generateId(),
      title: title.trim(),
      description: description.trim() || undefined,
      guideUrl: guideUrl.trim() || undefined,
      guide: guide.trim() || undefined,
      guideSource: guide.trim() ? (task?.guideSource ?? "manual") : undefined,
      guideSourceLabel: task?.guideSourceLabel,
      type, priority, status, recurring,
      projectId: projectId || undefined,
      projectName: selectedProject?.name ?? task?.projectName,
      chainId: task?.chainId,
      estimatedGasFee: estimatedGasFee || undefined,
      gasCurrency: gasCurrency || undefined,
      deadline: deadline || undefined,
      createdAt: task?.createdAt ?? now,
      executions: buildExecutions(),
      linkedIdentityIds: selectedIdentityIds,
      tags,
      isDailyReset,
      subtasks,
      notes: task?.notes ?? [],
      activityLog: task?.activityLog ?? [
        { id: `al-${Date.now()}`, type: "status-change", message: `Task created — status: ${status}`, timestamp: now },
      ],
      isOverdue: task?.isOverdue,
    };
    onSave(saved);
    toast.success(isEdit ? `"${saved.title}" updated` : `"${saved.title}" created`, {
      description: selectedIdentityIds.length > 0
        ? `${selectedIdentityIds.length} profile(s) assigned`
        : undefined,
    });
    onClose();
  }

  return (
    <>
      <div className={styles.overlay} onClick={onClose} />
      <aside className={styles.drawer}>

        {/* ── Header ── */}
        <div className={styles.header}>
          <div>
            <h2 className={styles.headerTitle}>{isEdit ? "Edit Task" : "New Task"}</h2>
            <div className={styles.headerSub}>
              {selectedIdentityIds.length > 0 && (
                <span className={styles.headerChip} style={{ color: "#7c3aed", background: "#ede9fe" }}>
                  <Users size={11}/> {selectedIdentityIds.length} profile{selectedIdentityIds.length > 1 ? "s" : ""}
                </span>
              )}
              {selectedWalletIds.length > 0 && (
                <span className={styles.headerChip} style={{ color: "#2563eb", background: "#dbeafe" }}>
                  <Wallet size={11}/> {selectedWalletIds.length} wallet{selectedWalletIds.length > 1 ? "s" : ""}
                </span>
              )}
            </div>
          </div>
          <button className={styles.closeBtn} onClick={onClose} type="button"><X size={17}/></button>
        </div>

        <form className={styles.body} onSubmit={handleSubmit} noValidate>

          {/* ── Title ── */}
          <div className={styles.field}>
            <label className={styles.label}>Task Title <span className={styles.req}>*</span></label>
            <input
              className={classNames(styles.input, errors.title && styles.inputError)}
              value={title}
              onChange={(e) => { setTitle(e.target.value); setErrors((p) => ({ ...p, title: "" })); }}
              placeholder="e.g. Swap tokens on SyncSwap"
              autoFocus
            />
            {errors.title && <span className={styles.errorMsg}><AlertCircle size={12}/> {errors.title}</span>}
          </div>

          {/* ── Type pills ── */}
          <div className={styles.field}>
            <label className={styles.label}>Task Type</label>
            <div className={styles.typePills}>
              {TYPE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  className={classNames(styles.typePill, type === opt.value && styles.typePillActive)}
                  style={type === opt.value ? { background: opt.bg, color: opt.color, borderColor: opt.color + "66" } : {}}
                  onClick={() => setType(opt.value)}
                >
                  {opt.icon} {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* ── Priority + Status + Project row ── */}
          <div className={styles.row3}>
            <div className={styles.field}>
              <label className={styles.label}>Priority</label>
              <div className={styles.priorityPills}>
                {PRIORITY_OPTIONS.map((opt) => (
                  <button key={opt.value} type="button"
                    className={classNames(styles.priorityPill, priority === opt.value && styles.priorityPillActive)}
                    style={priority === opt.value ? { borderColor: opt.color, color: opt.color, background: opt.color + "15" } : {}}
                    onClick={() => setPriority(opt.value)}
                  >
                    <span className={styles.priorityDot} style={{ background: opt.color }} />
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Status</label>
              <select className={styles.select} value={status} onChange={(e) => setStatus(e.target.value as TaskStatus)}>
                {STATUS_OPTIONS.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
            </div>
          </div>

          {/* ── Project + Deadline row ── */}
          <div className={styles.fieldRow}>
            <div className={styles.field}>
              <label className={styles.label}>Linked Project</label>
              <select className={styles.select} value={projectId} onChange={(e) => setProjectId(e.target.value)}>
                <option value="">— None —</option>
                {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Deadline</label>
              <input type="date" className={styles.input} value={deadline} onChange={(e) => setDeadline(e.target.value)} />
            </div>
          </div>

          {/* ══ PROFILE ASSIGNMENT ═══════════════════════════════ */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionIcon} style={{ background: "#ede9fe", color: "#7c3aed" }}><Users size={14}/></span>
              <span className={styles.sectionTitle}>Assign Profiles</span>
              <span className={styles.sectionCount}>{selectedIdentityIds.length} selected</span>
              {allIdentities.length > 0 && (
                <button type="button" className={styles.selectAllBtn}
                  onClick={() => setSelectedIdentityIds(
                    selectedIdentityIds.length === allIdentities.length ? [] : allIdentities.map((i) => i.id)
                  )}>
                  {selectedIdentityIds.length === allIdentities.length ? "Deselect all" : "Select all"}
                </button>
              )}
            </div>
            <div className={styles.profileGrid}>
              {allIdentities.map((identity) => {
                const isSelected = selectedIdentityIds.includes(identity.id);
                const avatarColor = getAvatarColor(identity.alias);
                const platforms = [
                  identity.twitter && "𝕏",
                  identity.discord && "DC",
                  identity.telegram && "TG",
                ].filter(Boolean);
                return (
                  <button
                    key={identity.id}
                    type="button"
                    className={classNames(styles.profileCard, isSelected && styles.profileCardSelected)}
                    onClick={() => toggleIdentity(identity.id)}
                  >
                    {isSelected && <span className={styles.profileCheck}><Check size={10}/></span>}
                    <span className={styles.profileAvatar} style={{ background: avatarColor }}>
                      {identity.alias.slice(0, 2).toUpperCase()}
                    </span>
                    <span className={styles.profileAlias}>{identity.alias}</span>
                    <span className={styles.profilePlatforms}>{platforms.join(" · ") || "—"}</span>
                    <span
                      className={styles.profileStatus}
                      style={{
                        color: identity.status === "active" ? "#16a34a" : identity.status === "paused" ? "#7c3aed" : "#dc2626",
                        background: identity.status === "active" ? "#dcfce7" : identity.status === "paused" ? "#ede9fe" : "#fee2e2",
                      }}
                    >
                      {identity.status}
                    </span>
                  </button>
                );
              })}
            </div>
            {selectedIdentityIds.length > 0 && (
              <div className={styles.profileActions}>
                <Bot size={12}/>
                <span>Profiles will be available for Agent Dispatch after saving</span>
              </div>
            )}
          </div>

          {/* ══ WALLET ASSIGNMENT ════════════════════════════════ */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionIcon} style={{ background: "#dbeafe", color: "#2563eb" }}><Wallet size={14}/></span>
              <span className={styles.sectionTitle}>Assign Wallets</span>
              <span className={styles.sectionCount}>{selectedWalletIds.length} selected</span>
              {displayWallets.length > 0 && (
                <button type="button" className={styles.selectAllBtn}
                  onClick={() => setSelectedWalletIds(
                    selectedWalletIds.length === displayWallets.length ? [] : displayWallets.map((w) => w.id)
                  )}>
                  {selectedWalletIds.length === displayWallets.length ? "Deselect all" : "Select all"}
                </button>
              )}
            </div>
            {projectId && relevantWallets.length > 0 && (
              <div className={styles.walletHint}>
                Showing {relevantWallets.length} wallets linked to {selectedProject?.name}
              </div>
            )}
            <div className={styles.walletList}>
              {displayWallets.map((sw) => {
                const isSelected = selectedWalletIds.includes(sw.id);
                return (
                  <label key={sw.id} className={classNames(styles.walletRow, isSelected && styles.walletRowSelected)}>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleWallet(sw.id)}
                      className={styles.walletCheckbox}
                    />
                    <div className={styles.walletInfo}>
                      <span className={styles.walletName}>{sw.name}</span>
                      <span className={styles.walletAddr}>{sw.address.slice(0, 8)}…{sw.address.slice(-6)}</span>
                    </div>
                    <span className={styles.walletMain}>{sw.mainName}</span>
                    <div className={styles.walletChains}>
                      {sw.chains.slice(0, 3).map((c) => (
                        <span key={c} className={styles.walletChainTag}>{c}</span>
                      ))}
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* ── Description ── */}
          <div className={styles.field}>
            <label className={styles.label}>Description</label>
            <textarea className={styles.textarea} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What needs to be done and why..." rows={3} />
          </div>

          {/* ── Guide ── */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionIcon} style={{ background: "#fef3c7", color: "#c9a028" }}><BookOpen size={14}/></span>
              <span className={styles.sectionTitle}>Step-by-Step Guide</span>
              <span className={styles.sectionHint}>Agent will follow this</span>
            </div>
            <input className={styles.input} value={guideUrl} onChange={(e) => setGuideUrl(e.target.value)} placeholder="Guide URL (optional)" style={{ marginBottom: 8 }} />
            <textarea
              className={classNames(styles.textarea, styles.guideTextarea)}
              value={guide}
              onChange={(e) => setGuide(e.target.value)}
              placeholder={"## Bridge ETH to zkSync\n\n1. Go to bridge.zksync.io\n2. Connect wallet\n3. Enter amount\n4. Confirm transaction\n\n> Tip: Do this during low gas hours"}
              rows={7}
            />
            <p className={styles.guideHint}>Supports Markdown. AI agents will read this to execute the task.</p>
          </div>

          {/* ── Recurring ── */}
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
            {type === "onchain" && (
              <div className={styles.field}>
                <label className={styles.label}>Est. Gas Fee</label>
                <div className={styles.gasRow}>
                  <input className={styles.input} value={estimatedGasFee} onChange={(e) => setEstimatedGasFee(e.target.value)} placeholder="0.005" type="number" step="0.0001" style={{ flex: 1 }} />
                  <select className={styles.selectSmall} value={gasCurrency} onChange={(e) => setGasCurrency(e.target.value)}>
                    {["ETH","SUI","SOL","BNB","MATIC","AVAX","ARB"].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
            )}
          </div>
          {recurring === "daily" && (
            <label className={styles.checkboxRow}>
              <input type="checkbox" checked={isDailyReset} onChange={(e) => setIsDailyReset(e.target.checked)} />
              Auto-reset wallets to pending at 00:00 UTC daily
            </label>
          )}

          {/* ── Subtasks ── */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionTitle}>Subtasks / Steps</span>
              <span className={styles.sectionCount}>{subtasks.length}</span>
            </div>
            {subtasks.map((s) => (
              <div key={s.id} className={styles.subtaskItem}>
                <span className={styles.subtaskDot} />
                <span className={styles.subtaskText}>{s.title}</span>
                <button type="button" className={styles.subtaskRemove} onClick={() => setSubtasks((p) => p.filter((x) => x.id !== s.id))}><X size={12}/></button>
              </div>
            ))}
            <div className={styles.subtaskAddRow}>
              <input
                className={styles.input}
                value={newSubtask}
                onChange={(e) => setNewSubtask(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSubtask(); } }}
                placeholder="Add a step… press Enter"
              />
              <button type="button" className={styles.addStepBtn} onClick={addSubtask}><Plus size={13}/></button>
            </div>
          </div>

          {/* ── Tags ── */}
          <div className={styles.field}>
            <label className={styles.label}>Tags</label>
            <div className={styles.tagBox}>
              {tags.map((t) => (
                <span key={t} className={styles.tag}>
                  {t}
                  <button type="button" className={styles.tagRemove} onClick={() => setTags((p) => p.filter((x) => x !== t))}>×</button>
                </span>
              ))}
              <input
                className={styles.tagInput}
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={addTag}
                placeholder="bridge, defi… Enter"
              />
            </div>
          </div>

          {/* ── Footer ── */}
          <div className={styles.footer}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>Cancel</button>
            <button type="submit" className={styles.submitBtn}>
              {isEdit ? "Save Changes" : "Create Task"}
              <ChevronRight size={14}/>
            </button>
          </div>
        </form>
      </aside>
    </>
  );
}
