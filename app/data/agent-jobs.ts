// ─────────────────────────────────────────────────────────────────
// Agent Jobs — domain types
// Each AgentJob represents one automated task execution dispatched
// to a browser-agent that controls a specific identity profile.
// ─────────────────────────────────────────────────────────────────

export type AgentJobStatus = "pending" | "queued" | "running" | "completed" | "failed" | "cancelled";

export interface AgentJob {
  id: string;
  taskId: string;
  identityId: string;
  walletId?: string;
  /** Human-readable label shown in the UI */
  name: string;
  /** Extra instructions passed to the agent on top of task.guide */
  instructions?: string;
  status: AgentJobStatus;
  resultSummary?: string;
  txHash?: string;
  proofImageUrl?: string;
  errorMessage?: string;
  createdAt: string;
  queuedAt?: string;
  startedAt?: string;
  completedAt?: string;
  /** Which runner instance picked up this job */
  runnerId?: string;
}

// ─── Status helpers ───────────────────────────────────────────────

export const AGENT_JOB_STATUS_LABELS: Record<AgentJobStatus, string> = {
  pending:   "Pending",
  queued:    "Queued",
  running:   "Running",
  completed: "Completed",
  failed:    "Failed",
  cancelled: "Cancelled",
};

export const AGENT_JOB_STATUS_COLORS: Record<AgentJobStatus, string> = {
  pending:   "var(--color-neutral-500)",
  queued:    "var(--color-blue-500)",
  running:   "var(--color-amber-500)",
  completed: "var(--color-green-500)",
  failed:    "var(--color-red-500)",
  cancelled: "var(--color-neutral-400)",
};

/** Terminal statuses — job cannot transition out of these */
export const TERMINAL_STATUSES: AgentJobStatus[] = ["completed", "failed", "cancelled"];

/** Returns true if the job is still active (agent may be working) */
export function isActiveJob(job: AgentJob): boolean {
  return job.status === "queued" || job.status === "running";
}
