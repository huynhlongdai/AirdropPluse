import React from "react";
import {
  CheckCircle2, XCircle, Clock, AlertCircle, Hash, Zap,
  ChevronDown, ChevronUp, Edit3, Check, X, Users, TrendingUp,
} from "lucide-react";
import classNames from "classnames";
import type { Task, TaskExecution, WalletTaskStatus } from "~/data/tasks";
import { WALLET_TASK_STATUS_LABELS } from "~/data/tasks";
import styles from "./execution-matrix-tab.module.css";

interface ExecutionMatrixTabProps {
  task: Task;
  onTaskUpdate: (updated: Task) => void;
}

const STATUS_ICON: Record<WalletTaskStatus, React.ReactNode> = {
  "not-started": <Clock size={14} />,
  "in-progress": <TrendingUp size={14} />,
  "completed": <CheckCircle2 size={14} />,
  "failed": <XCircle size={14} />,
};

const STATUS_CYCLE: WalletTaskStatus[] = ["not-started", "in-progress", "completed", "failed"];

function nextStatus(current: WalletTaskStatus): WalletTaskStatus {
  const idx = STATUS_CYCLE.indexOf(current);
  return STATUS_CYCLE[(idx + 1) % STATUS_CYCLE.length];
}

export default function ExecutionMatrixTab({ task, onTaskUpdate }: ExecutionMatrixTabProps) {
  const [selectedWallets, setSelectedWallets] = React.useState<Set<string>>(new Set());
  const [editingWalletId, setEditingWalletId] = React.useState<string | null>(null);
  const [editDraft, setEditDraft] = React.useState<Partial<TaskExecution>>({});
  const [filterStatus, setFilterStatus] = React.useState<WalletTaskStatus | "all">("all");

  const executions = task.executions;
  const completed = executions.filter((e) => e.status === "completed").length;
  const failed = executions.filter((e) => e.status === "failed").length;
  const inProgress = executions.filter((e) => e.status === "in-progress").length;
  const notStarted = executions.filter((e) => e.status === "not-started").length;
  const total = executions.length;
  const execPct = total > 0 ? Math.round((completed / total) * 100) : 0;

  const filtered = filterStatus === "all"
    ? executions
    : executions.filter((e) => e.status === filterStatus);

  function updateExecution(walletId: string, changes: Partial<TaskExecution>) {
    const updated: Task = {
      ...task,
      executions: task.executions.map((e) =>
        e.walletId === walletId
          ? {
              ...e,
              ...changes,
              completedAt: changes.status === "completed" && !e.completedAt
                ? new Date().toISOString().split("T")[0]
                : changes.status !== "completed"
                ? undefined
                : e.completedAt,
            }
          : e
      ),
    };
    onTaskUpdate(updated);
  }

  function handleQuickToggle(walletId: string, current: WalletTaskStatus) {
    updateExecution(walletId, { status: nextStatus(current) });
  }

  function startEdit(exec: TaskExecution) {
    setEditingWalletId(exec.walletId);
    setEditDraft({ txHash: exec.txHash ?? "", actualGasFee: exec.actualGasFee ?? "", note: exec.note ?? "" });
  }

  function saveEdit(walletId: string) {
    updateExecution(walletId, editDraft);
    setEditingWalletId(null);
    setEditDraft({});
  }

  function cancelEdit() {
    setEditingWalletId(null);
    setEditDraft({});
  }

  function toggleSelectWallet(walletId: string) {
    setSelectedWallets((prev) => {
      const next = new Set(prev);
      if (next.has(walletId)) next.delete(walletId);
      else next.add(walletId);
      return next;
    });
  }

  function selectAll() {
    if (selectedWallets.size === filtered.length) {
      setSelectedWallets(new Set());
    } else {
      setSelectedWallets(new Set(filtered.map((e) => e.walletId)));
    }
  }

  function bulkSetStatus(status: WalletTaskStatus) {
    const updated: Task = {
      ...task,
      executions: task.executions.map((e) =>
        selectedWallets.has(e.walletId)
          ? {
              ...e,
              status,
              completedAt: status === "completed" ? (e.completedAt ?? new Date().toISOString().split("T")[0]) : undefined,
            }
          : e
      ),
    };
    onTaskUpdate(updated);
    setSelectedWallets(new Set());
  }

  return (
    <div className={styles.root}>
      {/* Summary bar */}
      <div className={styles.summaryBar}>
        <div className={styles.summaryCard} data-status="completed">
          <CheckCircle2 size={16} />
          <span className={styles.summaryCount}>{completed}</span>
          <span className={styles.summaryLabel}>Completed</span>
        </div>
        <div className={styles.summaryCard} data-status="in-progress">
          <TrendingUp size={16} />
          <span className={styles.summaryCount}>{inProgress}</span>
          <span className={styles.summaryLabel}>In Progress</span>
        </div>
        <div className={styles.summaryCard} data-status="not-started">
          <Clock size={16} />
          <span className={styles.summaryCount}>{notStarted}</span>
          <span className={styles.summaryLabel}>Not Started</span>
        </div>
        <div className={styles.summaryCard} data-status="failed">
          <AlertCircle size={16} />
          <span className={styles.summaryCount}>{failed}</span>
          <span className={styles.summaryLabel}>Failed</span>
        </div>
        <div className={styles.summaryProgress}>
          <div className={styles.progressLabel}>{execPct}% complete</div>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${execPct}%` }} />
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className={styles.toolbar}>
        {/* Filter tabs */}
        <div className={styles.filterTabs}>
          {(["all", "not-started", "in-progress", "completed", "failed"] as const).map((s) => (
            <button
              key={s}
              className={classNames(styles.filterTab, { [styles.filterTabActive]: filterStatus === s })}
              onClick={() => setFilterStatus(s)}
              type="button"
            >
              {s === "all" ? `All (${total})` : `${WALLET_TASK_STATUS_LABELS[s]} (${executions.filter((e) => e.status === s).length})`}
            </button>
          ))}
        </div>

        {/* Bulk actions */}
        {selectedWallets.size > 0 && (
          <div className={styles.bulkActions}>
            <span className={styles.bulkCount}>{selectedWallets.size} selected</span>
            <button className={classNames(styles.bulkBtn, styles.bulkBtnComplete)} onClick={() => bulkSetStatus("completed")} type="button">
              <CheckCircle2 size={13} /> Mark Completed
            </button>
            <button className={classNames(styles.bulkBtn, styles.bulkBtnProgress)} onClick={() => bulkSetStatus("in-progress")} type="button">
              <TrendingUp size={13} /> In Progress
            </button>
            <button className={classNames(styles.bulkBtn, styles.bulkBtnFail)} onClick={() => bulkSetStatus("failed")} type="button">
              <XCircle size={13} /> Mark Failed
            </button>
            <button className={classNames(styles.bulkBtn, styles.bulkBtnReset)} onClick={() => bulkSetStatus("not-started")} type="button">
              <Clock size={13} /> Reset
            </button>
          </div>
        )}
      </div>

      {/* Wallet list */}
      {filtered.length === 0 ? (
        <div className={styles.empty}>
          <Users size={32} />
          <p>No wallets assigned to this task.</p>
        </div>
      ) : (
        <div className={styles.walletTable}>
          {/* Table header */}
          <div className={styles.tableHead}>
            <div className={styles.thCheck}>
              <input
                type="checkbox"
                className={styles.checkbox}
                checked={selectedWallets.size === filtered.length && filtered.length > 0}
                onChange={selectAll}
              />
            </div>
            <div className={styles.thWallet}>Wallet</div>
            <div className={styles.thStatus}>Status</div>
            <div className={styles.thTx}>Tx Hash</div>
            <div className={styles.thGas}>Gas Used</div>
            <div className={styles.thActions}>Actions</div>
          </div>

          {filtered.map((exec) => (
            <WalletRow
              key={exec.walletId}
              exec={exec}
              task={task}
              isSelected={selectedWallets.has(exec.walletId)}
              isEditing={editingWalletId === exec.walletId}
              editDraft={editingWalletId === exec.walletId ? editDraft : {}}
              onSelect={() => toggleSelectWallet(exec.walletId)}
              onQuickToggle={() => handleQuickToggle(exec.walletId, exec.status)}
              onStartEdit={() => startEdit(exec)}
              onSaveEdit={() => saveEdit(exec.walletId)}
              onCancelEdit={cancelEdit}
              onEditDraftChange={setEditDraft}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface WalletRowProps {
  exec: TaskExecution;
  task: Task;
  isSelected: boolean;
  isEditing: boolean;
  editDraft: Partial<TaskExecution>;
  onSelect: () => void;
  onQuickToggle: () => void;
  onStartEdit: () => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onEditDraftChange: (d: Partial<TaskExecution>) => void;
}

function WalletRow({
  exec, task, isSelected, isEditing, editDraft,
  onSelect, onQuickToggle, onStartEdit, onSaveEdit, onCancelEdit, onEditDraftChange,
}: WalletRowProps) {
  const [expanded, setExpanded] = React.useState(false);

  return (
    <div
      className={classNames(styles.walletRow, styles[`row_${exec.status.replace("-", "_")}`], {
        [styles.walletRowSelected]: isSelected,
        [styles.walletRowEditing]: isEditing,
      })}
    >
      {/* Main row */}
      <div className={styles.rowMain}>
        <div className={styles.tdCheck}>
          <input type="checkbox" className={styles.checkbox} checked={isSelected} onChange={onSelect} />
        </div>

        <div className={styles.tdWallet}>
          <div className={styles.walletName}>{exec.walletName}</div>
          <div className={styles.walletAddress}>{exec.address}</div>
          {exec.completedAt && (
            <div className={styles.walletDate}>
              ✓ {new Date(exec.completedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            </div>
          )}
        </div>

        <div className={styles.tdStatus}>
          <button
            className={classNames(styles.statusPill, styles[`pill_${exec.status.replace("-", "_")}`])}
            onClick={onQuickToggle}
            title="Click to cycle status"
            type="button"
          >
            {STATUS_ICON[exec.status]}
            {WALLET_TASK_STATUS_LABELS[exec.status]}
          </button>
        </div>

        <div className={styles.tdTx}>
          {isEditing ? (
            <input
              className={styles.inlineInput}
              placeholder="0x..."
              value={editDraft.txHash ?? ""}
              onChange={(e) => onEditDraftChange({ ...editDraft, txHash: e.target.value })}
            />
          ) : exec.txHash ? (
            <span className={styles.txHash}>
              <Hash size={11} />
              {exec.txHash.length > 14 ? exec.txHash.slice(0, 14) + "…" : exec.txHash}
            </span>
          ) : (
            <span className={styles.emptyCell}>—</span>
          )}
        </div>

        <div className={styles.tdGas}>
          {isEditing ? (
            <input
              className={styles.inlineInput}
              style={{ width: "80px" }}
              placeholder="0.000"
              value={editDraft.actualGasFee ?? ""}
              onChange={(e) => onEditDraftChange({ ...editDraft, actualGasFee: e.target.value })}
            />
          ) : exec.actualGasFee ? (
            <span className={styles.gasValue}>
              <Zap size={11} />
              {exec.actualGasFee} {task.gasCurrency}
            </span>
          ) : (
            <span className={styles.emptyCell}>—</span>
          )}
        </div>

        <div className={styles.tdActions}>
          {isEditing ? (
            <>
              <button className={classNames(styles.actionBtn, styles.actionBtnSave)} onClick={onSaveEdit} type="button" title="Save">
                <Check size={13} />
              </button>
              <button className={classNames(styles.actionBtn, styles.actionBtnCancel)} onClick={onCancelEdit} type="button" title="Cancel">
                <X size={13} />
              </button>
            </>
          ) : (
            <>
              <button className={styles.actionBtn} onClick={onStartEdit} type="button" title="Edit tx/gas/note">
                <Edit3 size={13} />
              </button>
              <button className={styles.actionBtn} onClick={() => setExpanded((v) => !v)} type="button" title="Expand note">
                {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Expanded note row */}
      {(expanded || isEditing) && (
        <div className={styles.rowExpanded}>
          <span className={styles.noteLabel}>Note:</span>
          {isEditing ? (
            <input
              className={styles.noteInput}
              placeholder="Add a note (e.g. wallet stuck on captcha, needs more gas...)"
              value={editDraft.note ?? ""}
              onChange={(e) => onEditDraftChange({ ...editDraft, note: e.target.value })}
            />
          ) : (
            <span className={styles.noteText}>{exec.note ?? "No note."}</span>
          )}
        </div>
      )}
    </div>
  );
}
