import { supabase } from "../supabase.server";
import type { IdentityProfile } from "~/data/identities";

function rowToIdentity(row: Record<string, unknown>): IdentityProfile {
  return {
    id: row.id as string,
    alias: row.alias as string,
    status: row.status as IdentityProfile["status"],
    email: Object.keys(row.email_data as object).length ? (row.email_data as IdentityProfile["email"]) : undefined,
    twitter: Object.keys(row.twitter_data as object).length ? (row.twitter_data as IdentityProfile["twitter"]) : undefined,
    discord: Object.keys(row.discord_data as object).length ? (row.discord_data as IdentityProfile["discord"]) : undefined,
    telegram: Object.keys(row.telegram_data as object).length ? (row.telegram_data as IdentityProfile["telegram"]) : undefined,
    tiktok: Object.keys(row.tiktok_data as object).length ? (row.tiktok_data as IdentityProfile["tiktok"]) : undefined,
    others: (row.others as IdentityProfile["others"]) ?? [],
    linkedWallets: (row.linked_wallets as string[]) ?? [],
    notes: (row.notes as string) ?? undefined,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

function identityToRow(identity: IdentityProfile) {
  return {
    id: identity.id,
    alias: identity.alias,
    status: identity.status,
    email_data: identity.email ?? {},
    twitter_data: identity.twitter ?? {},
    discord_data: identity.discord ?? {},
    telegram_data: identity.telegram ?? {},
    tiktok_data: identity.tiktok ?? {},
    others: identity.others ?? [],
    linked_wallets: identity.linkedWallets ?? [],
    notes: identity.notes ?? null,
    updated_at: new Date().toISOString(),
  };
}

export async function getIdentities(): Promise<IdentityProfile[]> {
  const { data, error } = await supabase
    .from("identities")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(`getIdentities: ${error.message}`);
  return (data ?? []).map((row: Record<string, unknown>) => rowToIdentity(row));
}

export async function getIdentity(id: string): Promise<IdentityProfile | null> {
  const { data, error } = await supabase.from("identities").select("*").eq("id", id).single();
  if (error) return null;
  return rowToIdentity(data as Record<string, unknown>);
}

export async function createIdentity(identity: IdentityProfile): Promise<IdentityProfile> {
  const { data, error } = await supabase
    .from("identities")
    .insert({ ...identityToRow(identity), created_at: identity.createdAt || new Date().toISOString() })
    .select()
    .single();

  if (error) throw new Error(`createIdentity: ${error.message}`);
  return rowToIdentity(data as Record<string, unknown>);
}

export async function updateIdentity(identity: IdentityProfile): Promise<IdentityProfile> {
  const { data, error } = await supabase
    .from("identities")
    .update(identityToRow(identity))
    .eq("id", identity.id)
    .select()
    .single();

  if (error) throw new Error(`updateIdentity: ${error.message}`);
  return rowToIdentity(data as Record<string, unknown>);
}

export async function deleteIdentity(id: string): Promise<void> {
  const { error } = await supabase.from("identities").delete().eq("id", id);
  if (error) throw new Error(`deleteIdentity: ${error.message}`);
}
