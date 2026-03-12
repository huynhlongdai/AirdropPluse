import React from "react";
import classNames from "classnames";
import type { Task, TaskStatus } from "~/data/tasks";
import { TASK_STATUS_LABELS } from "~/data/tasks";
import TaskCard from "./task-card";
import styles from "./task-board-view.module.css";

interface TaskBoardViewProps {
  tasks: Task[];
}

const COLUMNS: TaskStatus[] = ["backlog", "in-progress", "review", "completed"];

const INDICATOR_STYLES: Record<TaskStatus, string> = {
  backlog: styles.indicatorBacklog,
  "in-progress": styles.indicatorInProgress,
  review: styles.indicatorReview,
  completed: styles.indicatorCompleted,
};

export default function TaskBoardView({ tasks }: TaskBoardViewProps) {
  return (
    <div className={styles.board}>
      {COLUMNS.map((status) => {
        const colTasks = tasks.filter((t) => t.status === status);
        return (
          <div key={status} className={styles.column}>
            <div className={styles.columnHeader}>
              <span className={styles.columnTitle}>
                <span className={classNames(styles.columnIndicator, INDICATOR_STYLES[status])} />
                {TASK_STATUS_LABELS[status]}
              </span>
              <span className={styles.columnCount}>{colTasks.length}</span>
            </div>
            <div className={styles.columnCards}>
              {colTasks.length === 0 ? (
                <div className={styles.emptyState}>No tasks</div>
              ) : (
                colTasks.map((task) => <TaskCard key={task.id} task={task} />)
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
