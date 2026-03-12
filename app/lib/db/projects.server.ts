import { supabase } from "../supabase.server";
import type { Project, ProjectTask } from "~/data/projects";

/** Map DB row → Project domain type */
function rowToProject(row: Record<string, unknown>): Project {
  return {
    id: row.id as string,
    name: row.name as string,
    description: row.description as string,
    category: row.category as Project["category"],
    projectType: row.project_type as Project["projectType"],
    chain: row.chain as Project["chain"],
    ecosystem: row.ecosystem as string[],
    status: row.status as Project["status"],
    costType: row.cost_type as Project["costType"],
    estimatedCost: (row.estimated_cost as string) ?? undefined,
    potentialValue: row.potential_value as Project["potentialValue"],
    hypeScore: row.hype_score as number,
    riskLevel: row.risk_level as Project["riskLevel"],
    riskFactors: row.risk_factors as string[],
    sentiment: row.sentiment as Project["sentiment"],
    fundingAmount: (row.funding_amount as string) ?? undefined,
    fundingRounds: (row.funding_rounds as Project["fundingRounds"]) ?? [],
    investors: (row.investors as string[]) ?? [],
    tgeDate: (row.tge_date as string) ?? undefined,
    totalSupply: (row.total_supply as string) ?? undefined,
    vestingInfo: (row.vesting_info as string) ?? undefined,
    milestones: (row.milestones as Project["milestones"]) ?? [],
    imageUrl: row.image_url as string,
    logoUrl: (row.logo_url as string) ?? undefined,
    tasks: [], // loaded separately via project_tasks join
    snapshotDate: (row.snapshot_date as string) ?? undefined,
    claimDate: (row.claim_date as string) ?? undefined,
    expiryDate: (row.expiry_date as string) ?? undefined,
    priority: row.priority as Project["priority"],
    isHot: (row.is_hot as boolean) ?? false,
    isNew: (row.is_new as boolean) ?? false,
    sourceUrl: (row.source_url as string) ?? undefined,
    twitterUrl: (row.twitter_url as string) ?? undefined,
    discordUrl: (row.discord_url as string) ?? undefined,
    telegramUrl: (row.telegram_url as string) ?? undefined,
    participatingWalletIds: (row.participating_wallet_ids as string[]) ?? [],
    linkedWallets: (row.linked_wallets as Project["linkedWallets"]) ?? [],
    linkedIdentities: (row.linked_identities as Project["linkedIdentities"]) ?? [],
    updates: (row.updates as Project["updates"]) ?? [],
    notes: (row.notes as string) ?? undefined,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

/** Map DB row → ProjectTask */
function rowToProjectTask(row: Record<string, unknown>): ProjectTask {
  return {
    id: row.id as string,
    description: row.description as string,
    completed: row.completed as boolean,
    walletId: (row.wallet_id as string) ?? undefined,
    completedAt: (row.completed_at as string) ?? undefined,
    dueDate: (row.due_date as string) ?? undefined,
    priority: (row.priority as ProjectTask["priority"]) ?? undefined,
  };
}

/** Map Project → DB insert shape */
function projectToRow(p: Project) {
  return {
    id: p.id,
    name: p.name,
    description: p.description,
    category: p.category,
    project_type: p.projectType,
    chain: p.chain,
    ecosystem: p.ecosystem,
    status: p.status,
    cost_type: p.costType,
    estimated_cost: p.estimatedCost ?? null,
    potential_value: p.potentialValue,
    hype_score: p.hypeScore,
    risk_level: p.riskLevel,
    risk_factors: p.riskFactors,
    sentiment: p.sentiment,
    funding_amount: p.fundingAmount ?? null,
    funding_rounds: p.fundingRounds ?? [],
    investors: p.investors ?? [],
    tge_date: p.tgeDate ?? null,
    total_supply: p.totalSupply ?? null,
    vesting_info: p.vestingInfo ?? null,
    milestones: p.milestones ?? [],
    image_url: p.imageUrl,
    logo_url: p.logoUrl ?? null,
    snapshot_date: p.snapshotDate ?? null,
    claim_date: p.claimDate ?? null,
    expiry_date: p.expiryDate ?? null,
    priority: p.priority,
    is_hot: p.isHot ?? false,
    is_new: p.isNew ?? false,
    source_url: p.sourceUrl ?? null,
    twitter_url: p.twitterUrl ?? null,
    discord_url: p.discordUrl ?? null,
    telegram_url: p.telegramUrl ?? null,
    participating_wallet_ids: p.participatingWalletIds ?? [],
    linked_wallets: p.linkedWallets ?? [],
    linked_identities: p.linkedIdentities ?? [],
    updates: p.updates ?? [],
    notes: p.notes ?? null,
    updated_at: new Date().toISOString(),
  };
}

export async function getProjects(): Promise<Project[]> {
  const { data: projectRows, error: pErr } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  if (pErr) throw new Error(`getProjects: ${pErr.message}`);

  const { data: taskRows, error: tErr } = await supabase
    .from("project_tasks")
    .select("*");

  if (tErr) throw new Error(`getProjectTasks: ${tErr.message}`);

  return (projectRows ?? []).map((row: Record<string, unknown>) => {
    const project = rowToProject(row);
    project.tasks = (taskRows ?? [])
      .filter((t: Record<string, unknown>) => t.project_id === project.id)
      .map((t: Record<string, unknown>) => rowToProjectTask(t));
    return project;
  });
}

export async function getProject(id: string): Promise<Project | null> {
  const { data: row, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return null;

  const { data: taskRows } = await supabase
    .from("project_tasks")
    .select("*")
    .eq("project_id", id);

  const project = rowToProject(row as Record<string, unknown>);
  project.tasks = (taskRows ?? []).map((t: Record<string, unknown>) => rowToProjectTask(t));
  return project;
}

export async function createProject(p: Project): Promise<Project> {
  const row = projectToRow(p);
  const { data, error } = await supabase
    .from("projects")
    .insert({ ...row, created_at: p.createdAt || new Date().toISOString() })
    .select()
    .single();

  if (error) throw new Error(`createProject: ${error.message}`);

  // Insert project tasks
  if (p.tasks && p.tasks.length > 0) {
    await supabase.from("project_tasks").insert(
      p.tasks.map((t: { id: string; description: string; completed: boolean; walletId?: string; completedAt?: string; dueDate?: string; priority?: string }) => ({
        id: t.id,
        project_id: p.id,
        description: t.description,
        completed: t.completed,
        wallet_id: t.walletId ?? null,
        completed_at: t.completedAt ?? null,
        due_date: t.dueDate ?? null,
        priority: t.priority ?? null,
      }))
    );
  }

  const project = rowToProject(data as Record<string, unknown>);
  project.tasks = p.tasks ?? [];
  return project;
}

export async function updateProject(p: Project): Promise<Project> {
  const row = projectToRow(p);
  const { data, error } = await supabase
    .from("projects")
    .update(row)
    .eq("id", p.id)
    .select()
    .single();

  if (error) throw new Error(`updateProject: ${error.message}`);
  const project = rowToProject(data as Record<string, unknown>);
  project.tasks = p.tasks ?? [];
  return project;
}

export async function deleteProject(id: string): Promise<void> {
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) throw new Error(`deleteProject: ${error.message}`);
}

export async function assignWalletsToProject(
  projectId: string,
  walletIds: string[]
): Promise<void> {
  const { error } = await supabase
    .from("projects")
    .update({
      participating_wallet_ids: walletIds,
      updated_at: new Date().toISOString(),
    })
    .eq("id", projectId);

  if (error) throw new Error(`assignWalletsToProject: ${error.message}`);
}
