import React from "react";
import { Zap, Twitter, RefreshCw, Flame, CalendarClock, Pencil, Trash2 } from "lucide-react";
import classNames from "classnames";
import type { Task } from "~/data/tasks";
import styles from "./task-list-view.module.css";

interface TaskListViewProps {
  tasks: Task[];
  onTaskClick?: (task: Task) => void;
  onEditTask?: (task: Task) => void;
  onDeleteTask?: (task: Task) => void;
}

const TYPE_ICONS: Record<Task["type"], React.ReactNode> = {
  onchain: <Zap size={11} />,
  social: <Twitter size={11} />,
  "daily-checkin": <RefreshCw size={11} />,
  "one-time": <Flame size={11} />,
};

const TYPE_LABELS: Record<Task["type"], string> = {
  onchain: "On-chain",
  social: "Social",
  "daily-checkin": "Daily",
  "one-time": "One-time",
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

const STATUS_LABELS: Record<Task["status"], string> = {
  backlog: "Backlog",
  "in-progress": "In Progress",
  review: "Review",
  completed: "Done",
};

function formatDeadline(dateStr: string) {
  const date = new Date(dateStr);
  const diff = date.getTime() - Date.now();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  if (days < 0) return { label: "Overdue", urgent: true };
  if (days === 0) return { label: "Today", urgent: true };
  if (days <= 3) return { label: `${days}d left`, urgent: true };
  return { label: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }), urgent: false };
}

export default function TaskListView({ tasks, onTaskClick, onEditTask, onDeleteTask }: TaskListViewProps) {
  return (
    <div className={styles.list}>
      <div className={styles.header}>
        <span>Task</span>
        <span>Type</span>
        <span>Status</span>
        <span>Wallets</span>
        <span>Deadline</span>
        <span>Est. Gas</span>
        <span></span>
      </div>
      {tasks.map((task) => {
        const doneCount = task.executions.filter((e) => e.status === "completed").length;
        const totalCount = task.executions.length;
        const progress = totalCount > 0 ? (doneCount / totalCount) * 100 : 0;

        return (
          <div
            key={task.id}
            className={classNames(styles.row, { [styles.rowOverdue]: task.isOverdue })}
            onClick={onTaskClick ? () => onTaskClick(task) : undefined}
            style={onTaskClick ? { cursor: "pointer" } : undefined}
          >
            {/* Title */}
            <div className={styles.taskTitle}>
              <span
                className={classNames(styles.priorityDot, {
                  [styles.priorityHigh]: task.priority === "high",
                  [styles.priorityMedium]: task.priority === "medium",
                  [styles.priorityLow]: task.priority === "low",
                })}
              />
              <div style={{ minWidth: 0 }}>
                <div
                  className={classNames(styles.title, {
                    [styles.titleCompleted]: task.status === "completed",
                  })}
                >
                  {task.title}
                </div>
                {task.projectName && (
                  <div className={styles.projectName}>{task.projectName}</div>
                )}
              </div>
            </div>

            {/* Type */}
            <span className={classNames(styles.typeBadge, TYPE_STYLE[task.type])}>
              {TYPE_ICONS[task.type]}
              {TYPE_LABELS[task.type]}
            </span>

            {/* Status */}
            <span className={classNames(styles.statusBadge, STATUS_STYLE[task.status])}>
              {STATUS_LABELS[task.status]}
            </span>

            {/* Wallet progress */}
            <div className={styles.walletProgress}>
              <div className={styles.walletProgressBar}>
                <div
                  className={classNames(styles.walletProgressFill, {
                    [styles.walletProgressFillComplete]: progress === 100,
                  })}
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className={styles.walletProgressLabel}>
                {doneCount}/{totalCount} wallets
              </span>
            </div>

            {/* Deadline */}
            {task.deadline ? (
              (() => {
                const dl = formatDeadline(task.deadline);
                return (
                  <span className={classNames(styles.deadline, { [styles.deadlineUrgent]: dl.urgent })}>
                    <CalendarClock size={11} />
                    {dl.label}
                  </span>
                );
              })()
            ) : (
              <span className={classNames(styles.deadline, styles.noGas)}>—</span>
            )}

            {/* Gas fee */}
            {task.estimatedGasFee ? (
              <span className={styles.gasFee}>
                <Zap size={11} />
                ~{task.estimatedGasFee} {task.gasCurrency}
              </span>
            ) : (
              <span className={classNames(styles.gasFee, styles.noGas)}>Free</span>
            )}

            {/* Actions */}
            <div className={styles.rowActions} onClick={(e) => e.stopPropagation()}>
              {onEditTask && (
                <button className={styles.rowActionBtn} onClick={() => onEditTask(task)} title="Edit" type="button">
                  <Pencil size={13} />
                </button>
              )}
              {onDeleteTask && (
                <button className={classNames(styles.rowActionBtn, styles.rowActionDelete)} onClick={() => onDeleteTask(task)} title="Delete" type="button">
                  <Trash2 size={13} />
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
