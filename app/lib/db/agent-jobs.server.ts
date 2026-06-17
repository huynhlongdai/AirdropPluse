import { supabase } from "../supabase.server";
import type { AgentJob, AgentJobStatus } from "~/data/agent-jobs";

// ─── Row mappers ──────────────────────────────────────────────────

type AnyRow = Record<string, unknown>;

function rowToJob(row: AnyRow): AgentJob {
  return {
    id:             row.id as string,
    taskId:         row.task_id as string,
    identityId:     row.identity_id as string,
    walletId:       (row.wallet_id as string) ?? undefined,
    name:           (row.name as string) ?? "",
    instructions:   (row.instructions as string) ?? undefined,
    status:         row.status as AgentJobStatus,
    resultSummary:  (row.result_summary as string) ?? undefined,
    txHash:         (row.tx_hash as string) ?? undefined,
    proofImageUrl:  (row.proof_image_url as string) ?? undefined,
    errorMessage:   (row.error_message as string) ?? undefined,
    createdAt:      row.created_at as string,
    queuedAt:       (row.queued_at as string) ?? undefined,
    startedAt:      (row.started_at as string) ?? undefined,
    completedAt:    (row.completed_at as string) ?? undefined,
    runnerId:       (row.runner_id as string) ?? undefined,
  };
}

function jobToRow(j: Partial<AgentJob> & { id?: string }) {
  return {
    ...(j.id            !== undefined && { id:              j.id }),
    ...(j.taskId        !== undefined && { task_id:         j.taskId }),
    ...(j.identityId    !== undefined && { identity_id:     j.identityId }),
    ...(j.walletId      !== undefined && { wallet_id:       j.walletId ?? null }),
    ...(j.name          !== undefined && { name:            j.name }),
    ...(j.instructions  !== undefined && { instructions:    j.instructions ?? null }),
    ...(j.status        !== undefined && { status:          j.status }),
    ...(j.resultSummary !== undefined && { result_summary:  j.resultSummary ?? null }),
    ...(j.txHash        !== undefined && { tx_hash:         j.txHash ?? null }),
    ...(j.proofImageUrl !== undefined && { proof_image_url: j.proofImageUrl ?? null }),
    ...(j.errorMessage  !== undefined && { error_message:   j.errorMessage ?? null }),
    ...(j.queuedAt      !== undefined && { queued_at:       j.queuedAt ?? null }),
    ...(j.startedAt     !== undefined && { started_at:      j.startedAt ?? null }),
    ...(j.completedAt   !== undefined && { completed_at:    j.completedAt ?? null }),
    ...(j.runnerId      !== undefined && { runner_id:       j.runnerId ?? null }),
  };
}

// ─── Queries ──────────────────────────────────────────────────────

/** Fetch all agent jobs, newest first */
export async function getAgentJobs(): Promise<AgentJob[]> {
  const { data, error } = await supabase
    .from("agent_jobs")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(`getAgentJobs: ${error.message}`);
  return (data ?? []).map((r: AnyRow) => rowToJob(r));
}

/** Fetch jobs for a specific task */
export async function getJobsForTask(taskId: string): Promise<AgentJob[]> {
  const { data, error } = await supabase
    .from("agent_jobs")
    .select("*")
    .eq("task_id", taskId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(`getJobsForTask: ${error.message}`);
  return (data ?? []).map((r: AnyRow) => rowToJob(r));
}

/** Fetch a single job by id */
export async function getAgentJob(id: string): Promise<AgentJob | null> {
  const { data, error } = await supabase
    .from("agent_jobs")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return null;
  return rowToJob(data as AnyRow);
}

// ─── Mutations ────────────────────────────────────────────────────

/** Dispatch a new agent job */
export async function createAgentJob(job: Omit<AgentJob, "id" | "createdAt" | "status"> & { id?: string }): Promise<AgentJob> {
  const { data, error } = await supabase
    .from("agent_jobs")
    .insert({
      ...jobToRow({ ...job, status: "pending" }),
      created_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) throw new Error(`createAgentJob: ${error.message}`);
  return rowToJob(data as AnyRow);
}

/** Update job status and optional result fields — used by the agent runner via webhook */
export async function updateAgentJob(id: string, patch: Partial<AgentJob>): Promise<AgentJob> {
  const { data, error } = await supabase
    .from("agent_jobs")
    .update(jobToRow(patch))
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(`updateAgentJob: ${error.message}`);
  return rowToJob(data as AnyRow);
}

/** Cancel a pending or queued job */
export async function cancelAgentJob(id: string): Promise<AgentJob> {
  return updateAgentJob(id, { status: "cancelled" });
}

/** Delete a job record (only terminal jobs should be deleted) */
export async function deleteAgentJob(id: string): Promise<void> {
  const { error } = await supabase.from("agent_jobs").delete().eq("id", id);
  if (error) throw new Error(`deleteAgentJob: ${error.message}`);
}
