import { supabase } from "../supabase.server";
import type { Task, TaskExecution, Subtask, TaskNote, ActivityLog } from "~/data/tasks";

/** Map joined DB rows → Task domain type */
function rowToTask(
  row: Record<string, unknown>,
  executions: TaskExecution[],
  subtasks: Subtask[],
  notes: TaskNote[],
  activityLog: ActivityLog[]
): Task {
  return {
    id: row.id as string,
    title: row.title as string,
    description: (row.description as string) ?? undefined,
    guide: (row.guide as string) ?? undefined,
    guideSource: (row.guide_source as Task["guideSource"]) ?? undefined,
    guideSourceLabel: (row.guide_source_label as string) ?? undefined,
    type: row.type as Task["type"],
    priority: row.priority as Task["priority"],
    status: row.status as Task["status"],
    recurring: (row.recurring as Task["recurring"]) ?? null,
    projectId: (row.project_id as string) ?? undefined,
    projectName: (row.project_name as string) ?? undefined,
    chainId: (row.chain_id as string) ?? undefined,
    estimatedGasFee: (row.estimated_gas_fee as string) ?? undefined,
    gasCurrency: (row.gas_currency as string) ?? undefined,
    deadline: (row.deadline as string) ?? undefined,
    createdAt: row.created_at as string,
    executions,
    linkedIdentityIds: (row.linked_identity_ids as string[]) ?? [],
    tags: (row.tags as string[]) ?? [],
    isOverdue: (row.is_overdue as boolean) ?? false,
    isDailyReset: (row.is_daily_reset as boolean) ?? false,
    subtasks,
    notes,
    activityLog,
    guideUrl: (row.guide_url as string) ?? undefined,
    proofImages: (row.proof_images as string[]) ?? [],
  };
}

function rowToExecution(row: Record<string, unknown>): TaskExecution {
  return {
    walletId: row.wallet_id as string,
    walletName: row.wallet_name as string,
    address: row.address as string,
    status: row.status as TaskExecution["status"],
    completedAt: (row.completed_at as string) ?? undefined,
    txHash: (row.tx_hash as string) ?? undefined,
    actualGasFee: (row.actual_gas_fee as string) ?? undefined,
    note: (row.note as string) ?? undefined,
  };
}

function rowToSubtask(row: Record<string, unknown>): Subtask {
  return {
    id: row.id as string,
    title: row.title as string,
    completed: row.completed as boolean,
    completedAt: (row.completed_at as string) ?? undefined,
  };
}

function rowToNote(row: Record<string, unknown>): TaskNote {
  return {
    id: row.id as string,
    content: row.content as string,
    createdAt: row.created_at as string,
  };
}

function rowToActivityLog(row: Record<string, unknown>): ActivityLog {
  return {
    id: row.id as string,
    type: row.type as ActivityLog["type"],
    message: row.message as string,
    timestamp: row.timestamp as string,
  };
}

function taskToRow(t: Task) {
  return {
    id: t.id,
    title: t.title,
    description: t.description ?? null,
    guide: t.guide ?? null,
    guide_source: t.guideSource ?? null,
    guide_source_label: t.guideSourceLabel ?? null,
    type: t.type,
    priority: t.priority,
    status: t.status,
    recurring: t.recurring ?? null,
    project_id: t.projectId ?? null,
    project_name: t.projectName ?? null,
    chain_id: t.chainId ?? null,
    estimated_gas_fee: t.estimatedGasFee ?? null,
    gas_currency: t.gasCurrency ?? null,
    deadline: t.deadline ?? null,
    linked_identity_ids: t.linkedIdentityIds ?? [],
    tags: t.tags ?? [],
    is_overdue: t.isOverdue ?? false,
    is_daily_reset: t.isDailyReset ?? false,
    guide_url: t.guideUrl ?? null,
    proof_images: t.proofImages ?? [],
  };
}

export async function getTasks(): Promise<Task[]> {
  const [{ data: taskRows, error: tErr }, { data: execRows }, { data: stRows }, { data: noteRows }, { data: logRows }] =
    await Promise.all([
      supabase.from("tasks").select("*").order("created_at", { ascending: false }),
      supabase.from("task_executions").select("*"),
      supabase.from("task_subtasks").select("*").order("sort_order", { ascending: true }),
      supabase.from("task_notes").select("*").order("created_at", { ascending: true }),
      supabase.from("task_activity_log").select("*").order("timestamp", { ascending: true }),
    ]);

  if (tErr) throw new Error(`getTasks: ${tErr.message}`);

  type AnyRow = Record<string, unknown>;
  return (taskRows ?? []).map((row: AnyRow) => {
    const id = row.id as string;
    return rowToTask(
      row,
      (execRows ?? []).filter((e: AnyRow) => e.task_id === id).map((e: AnyRow) => rowToExecution(e)),
      (stRows ?? []).filter((s: AnyRow) => s.task_id === id).map((s: AnyRow) => rowToSubtask(s)),
      (noteRows ?? []).filter((n: AnyRow) => n.task_id === id).map((n: AnyRow) => rowToNote(n)),
      (logRows ?? []).filter((l: AnyRow) => l.task_id === id).map((l: AnyRow) => rowToActivityLog(l))
    );
  });
}

export async function getTask(id: string): Promise<Task | null> {
  const [{ data: row, error }, { data: execRows }, { data: stRows }, { data: noteRows }, { data: logRows }] =
    await Promise.all([
      supabase.from("tasks").select("*").eq("id", id).single(),
      supabase.from("task_executions").select("*").eq("task_id", id),
      supabase.from("task_subtasks").select("*").eq("task_id", id).order("sort_order"),
      supabase.from("task_notes").select("*").eq("task_id", id).order("created_at"),
      supabase.from("task_activity_log").select("*").eq("task_id", id).order("timestamp"),
    ]);

  if (error) return null;

  type AnyRow2 = Record<string, unknown>;
  return rowToTask(
    row as AnyRow2,
    (execRows ?? []).map((e: AnyRow2) => rowToExecution(e)),
    (stRows ?? []).map((s: AnyRow2) => rowToSubtask(s)),
    (noteRows ?? []).map((n: AnyRow2) => rowToNote(n)),
    (logRows ?? []).map((l: AnyRow2) => rowToActivityLog(l))
  );
}

export async function createTask(t: Task): Promise<Task> {
  const { data, error } = await supabase
    .from("tasks")
    .insert({ ...taskToRow(t), created_at: t.createdAt || new Date().toISOString() })
    .select()
    .single();

  if (error) throw new Error(`createTask: ${error.message}`);

  // Insert executions, subtasks, notes, activity logs in parallel
  await Promise.all([
    t.executions?.length
      ? supabase.from("task_executions").insert(
          t.executions.map((e) => ({
            task_id: t.id,
            wallet_id: e.walletId,
            wallet_name: e.walletName,
            address: e.address,
            status: e.status,
            completed_at: e.completedAt ?? null,
            tx_hash: e.txHash ?? null,
            actual_gas_fee: e.actualGasFee ?? null,
            note: e.note ?? null,
          }))
        )
      : Promise.resolve(),
    t.subtasks?.length
      ? supabase.from("task_subtasks").insert(
          t.subtasks.map((s, i) => ({
            id: s.id,
            task_id: t.id,
            title: s.title,
            completed: s.completed,
            completed_at: s.completedAt ?? null,
            sort_order: i,
          }))
        )
      : Promise.resolve(),
  ]);

  return rowToTask(data as Record<string, unknown>, t.executions ?? [], t.subtasks ?? [], t.notes ?? [], t.activityLog ?? []);
}

export async function updateTask(t: Task): Promise<Task> {
  const { error } = await supabase.from("tasks").update(taskToRow(t)).eq("id", t.id);
  if (error) throw new Error(`updateTask: ${error.message}`);

  // Replace executions
  await supabase.from("task_executions").delete().eq("task_id", t.id);
  if (t.executions?.length) {
    await supabase.from("task_executions").insert(
      t.executions.map((e) => ({
        task_id: t.id,
        wallet_id: e.walletId,
        wallet_name: e.walletName,
        address: e.address,
        status: e.status,
        completed_at: e.completedAt ?? null,
        tx_hash: e.txHash ?? null,
        actual_gas_fee: e.actualGasFee ?? null,
        note: e.note ?? null,
      }))
    );
  }

  // Replace subtasks
  await supabase.from("task_subtasks").delete().eq("task_id", t.id);
  if (t.subtasks?.length) {
    await supabase.from("task_subtasks").insert(
      t.subtasks.map((s, i) => ({
        id: s.id,
        task_id: t.id,
        title: s.title,
        completed: s.completed,
        completed_at: s.completedAt ?? null,
        sort_order: i,
      }))
    );
  }

  // Append new notes (don't replace existing)
  if (t.notes?.length) {
    const { data: existingNotes } = await supabase.from("task_notes").select("id").eq("task_id", t.id);
    const existingIds = new Set((existingNotes ?? []).map((n: Record<string, unknown>) => n.id));
    const newNotes = t.notes.filter((n) => !existingIds.has(n.id));
    if (newNotes.length) {
      await supabase.from("task_notes").insert(
        newNotes.map((n) => ({ id: n.id, task_id: t.id, content: n.content, created_at: n.createdAt }))
      );
    }
  }

  // Append new activity log entries
  if (t.activityLog?.length) {
    const { data: existingLogs } = await supabase.from("task_activity_log").select("id").eq("task_id", t.id);
    const existingIds2 = new Set((existingLogs ?? []).map((l: Record<string, unknown>) => l.id));
    const newLogs = t.activityLog.filter((l) => !existingIds2.has(l.id));
    if (newLogs.length) {
      await supabase.from("task_activity_log").insert(
        newLogs.map((l) => ({ id: l.id, task_id: t.id, type: l.type, message: l.message, timestamp: l.timestamp }))
      );
    }
  }

  return t;
}

export async function deleteTask(id: string): Promise<void> {
  const { error } = await supabase.from("tasks").delete().eq("id", id);
  if (error) throw new Error(`deleteTask: ${error.message}`);
}
