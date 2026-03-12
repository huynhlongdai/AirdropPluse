import { supabase } from "../supabase.server";
import type { MainWallet, SubWallet, GasBalance } from "~/data/wallets";

function rowToSubWallet(row: Record<string, unknown>): SubWallet {
  return {
    id: row.id as string,
    name: row.name as string,
    address: row.address as string,
    type: row.type as SubWallet["type"],
    chains: row.chains as SubWallet["chains"],
    status: row.status as SubWallet["status"],
    purpose: (row.purpose as string) ?? undefined,
    linkedIdentityIds: (row.linked_identity_ids as string[]) ?? [],
    gasBalances: (row.gas_balances as GasBalance[]) ?? [],
    activeProjectIds: (row.active_project_ids as string[]) ?? [],
    createdAt: row.created_at as string,
  };
}

function rowToMainWallet(row: Record<string, unknown>, subWallets: SubWallet[]): MainWallet {
  return {
    id: row.id as string,
    name: row.name as string,
    address: row.address as string,
    type: row.type as MainWallet["type"],
    chains: row.chains as MainWallet["chains"],
    notes: (row.notes as string) ?? undefined,
    subWallets,
    createdAt: row.created_at as string,
  };
}

export async function getMainWallets(): Promise<MainWallet[]> {
  const [{ data: mainRows, error: mErr }, { data: subRows, error: sErr }] = await Promise.all([
    supabase.from("wallets").select("*").order("created_at", { ascending: false }),
    supabase.from("sub_wallets").select("*").order("created_at", { ascending: true }),
  ]);

  if (mErr) throw new Error(`getMainWallets: ${mErr.message}`);
  if (sErr) throw new Error(`getSubWallets: ${sErr.message}`);

  type AnyRow = Record<string, unknown>;
  return (mainRows ?? []).map((mainRow: AnyRow) => {
    const subs = (subRows ?? [])
      .filter((s: AnyRow) => s.main_wallet_id === mainRow.id)
      .map((s: AnyRow) => rowToSubWallet(s));
    return rowToMainWallet(mainRow, subs);
  });
}

export async function createMainWallet(w: MainWallet): Promise<MainWallet> {
  const { error } = await supabase.from("wallets").insert({
    id: w.id,
    name: w.name,
    address: w.address,
    type: w.type,
    chains: w.chains,
    notes: w.notes ?? null,
    created_at: w.createdAt,
  });
  if (error) throw new Error(`createMainWallet: ${error.message}`);
  return w;
}

export async function updateMainWallet(w: MainWallet): Promise<MainWallet> {
  const { error } = await supabase
    .from("wallets")
    .update({ name: w.name, address: w.address, type: w.type, chains: w.chains, notes: w.notes ?? null })
    .eq("id", w.id);
  if (error) throw new Error(`updateMainWallet: ${error.message}`);
  return w;
}

export async function deleteMainWallet(id: string): Promise<void> {
  const { error } = await supabase.from("wallets").delete().eq("id", id);
  if (error) throw new Error(`deleteMainWallet: ${error.message}`);
}

export async function createSubWallet(mainWalletId: string, sub: SubWallet): Promise<SubWallet> {
  const { error } = await supabase.from("sub_wallets").insert({
    id: sub.id,
    main_wallet_id: mainWalletId,
    name: sub.name,
    address: sub.address,
    type: sub.type,
    chains: sub.chains,
    status: sub.status,
    purpose: sub.purpose ?? null,
    linked_identity_ids: sub.linkedIdentityIds,
    gas_balances: sub.gasBalances,
    active_project_ids: sub.activeProjectIds,
    created_at: sub.createdAt,
  });
  if (error) throw new Error(`createSubWallet: ${error.message}`);
  return sub;
}

export async function updateSubWallet(sub: SubWallet): Promise<SubWallet> {
  const { error } = await supabase
    .from("sub_wallets")
    .update({
      name: sub.name,
      address: sub.address,
      type: sub.type,
      chains: sub.chains,
      status: sub.status,
      purpose: sub.purpose ?? null,
      linked_identity_ids: sub.linkedIdentityIds,
      gas_balances: sub.gasBalances,
      active_project_ids: sub.activeProjectIds,
    })
    .eq("id", sub.id);
  if (error) throw new Error(`updateSubWallet: ${error.message}`);
  return sub;
}

export async function deleteSubWallet(id: string): Promise<void> {
  const { error } = await supabase.from("sub_wallets").delete().eq("id", id);
  if (error) throw new Error(`deleteSubWallet: ${error.message}`);
}
