import React from "react";
import { Link, Zap, Twitter, CalendarClock, RefreshCw, AlertCircle, Flame, Pencil, Trash2 } from "lucide-react";
import classNames from "classnames";
import type { Task } from "~/data/tasks";
import { TASK_TYPE_LABELS } from "~/data/tasks";
import styles from "./task-card.module.css";

interface TaskCardProps {
  task: Task;
  className?: string;
  onClick?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

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

function formatDeadline(dateStr: string) {
  const date = new Date(dateStr);
  const diff = date.getTime() - Date.now();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  if (days < 0) return { label: "Overdue", urgent: true };
  if (days === 0) return { label: "Due today", urgent: true };
  if (days === 1) return { label: "Due tomorrow", urgent: true };
  if (days <= 7) return { label: `${days}d left`, urgent: true };
  return { label: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }), urgent: false };
}

export default function TaskCard({ task, className, onClick, onEdit, onDelete }: TaskCardProps) {
  const doneCount = task.executions.filter((e) => e.status === "completed").length;
  const totalCount = task.executions.length;
  const progress = totalCount > 0 ? (doneCount / totalCount) * 100 : 0;
  const isComplete = task.status === "completed";

  return (
    <div
      className={classNames(styles.card, className, {
        [styles.cardOverdue]: task.isOverdue,
      })}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => { if (e.key === "Enter" || e.key === " ") onClick(); } : undefined}
    >
      <div className={styles.cardHeader}>
        <span className={classNames(styles.title, { [styles.titleCompleted]: isComplete })}>
          {task.title}
        </span>
        <span
          className={classNames(styles.priorityDot, {
            [styles.priorityHigh]: task.priority === "high",
            [styles.priorityMedium]: task.priority === "medium",
            [styles.priorityLow]: task.priority === "low",
          })}
        />
      </div>

      <div className={styles.badges}>
        <span className={classNames(styles.badge, TYPE_STYLE[task.type])}>
          {TYPE_ICONS[task.type]}
          {TASK_TYPE_LABELS[task.type]}
        </span>
        {task.recurring && (
          <span className={classNames(styles.badge, styles.badgeRecurring)}>
            <RefreshCw size={10} />
            {task.recurring}
          </span>
        )}
        {task.isOverdue && (
          <span className={classNames(styles.badge, styles.badgeOverdue)}>
            <AlertCircle size={10} />
            Overdue
          </span>
        )}
      </div>

      {task.projectName && (
        <div className={styles.projectLabel}>
          <Link size={11} />
          {task.projectName}
          {task.chainId && <> · {task.chainId}</>}
        </div>
      )}

      <div className={styles.footer}>
        <div className={styles.walletPills}>
          {task.executions.slice(0, 3).map((exec) => (
            <span
              key={exec.walletId}
              className={classNames(styles.walletPill, {
                [styles.walletPillDone]: exec.status === "completed",
                [styles.walletPillFailed]: exec.status === "failed",
              })}
            >
              {exec.walletName.split(" ")[0]}
            </span>
          ))}
          {task.executions.length > 3 && (
            <span className={styles.walletPill}>+{task.executions.length - 3}</span>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
          {task.estimatedGasFee && (
            <span className={styles.gasFee}>
              <Zap size={11} />
              ~{task.estimatedGasFee} {task.gasCurrency}
            </span>
          )}
          {task.deadline && (() => {
            const dl = formatDeadline(task.deadline);
            return (
              <span className={classNames(styles.deadline, { [styles.deadlineUrgent]: dl.urgent })}>
                <CalendarClock size={11} />
                {dl.label}
              </span>
            );
          })()}
        </div>
      </div>

      {totalCount > 0 && (
        <div className={styles.progressBar}>
          <div
            className={classNames(styles.progressFill, { [styles.progressFillComplete]: progress === 100 })}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {(onEdit || onDelete) && (
        <div className={styles.cardQuickActions} onClick={(e) => e.stopPropagation()}>
          {onEdit && (
            <button className={styles.cardQuickBtn} onClick={onEdit} title="Edit" type="button">
              <Pencil size={12} />
            </button>
          )}
          {onDelete && (
            <button className={classNames(styles.cardQuickBtn, styles.cardQuickDelete)} onClick={onDelete} title="Delete" type="button">
              <Trash2 size={12} />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
