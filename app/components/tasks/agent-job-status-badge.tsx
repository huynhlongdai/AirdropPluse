import React from "react";
import { Bot, Clock, Loader2, CheckCircle2, XCircle, Ban } from "lucide-react";
import type { AgentJobStatus } from "~/data/agent-jobs";
import { AGENT_JOB_STATUS_LABELS } from "~/data/agent-jobs";
import styles from "./agent-job-status-badge.module.css";

interface AgentJobStatusBadgeProps {
  status: AgentJobStatus;
  /** Show animated spinner for running status */
  animate?: boolean;
  size?: "sm" | "md";
}

const STATUS_ICONS: Record<AgentJobStatus, React.ReactNode> = {
  pending:   <Clock size={11} />,
  queued:    <Bot size={11} />,
  running:   <Loader2 size={11} className={styles.spinIcon} />,
  completed: <CheckCircle2 size={11} />,
  failed:    <XCircle size={11} />,
  cancelled: <Ban size={11} />,
};

export default function AgentJobStatusBadge({ status, size = "sm" }: AgentJobStatusBadgeProps) {
  return (
    <span className={`${styles.badge} ${styles[status]} ${styles[size]}`}>
      {STATUS_ICONS[status]}
      <span>{AGENT_JOB_STATUS_LABELS[status]}</span>
    </span>
  );
}
