import { supabase } from "../supabase.server";
import type { InboxItem } from "~/data/inbox";

function rowToInboxItem(row: Record<string, unknown>): InboxItem {
  return {
    id: row.id as string,
    rawContent: row.raw_content as string,
    sourceType: row.source_type as InboxItem["sourceType"],
    sourceUrl: (row.source_url as string) ?? undefined,
    itemType: row.item_type as InboxItem["itemType"],
    status: row.status as InboxItem["status"],
    extractedData: Object.keys(row.extracted_data as object).length
      ? (row.extracted_data as InboxItem["extractedData"])
      : undefined,
    createdAt: row.created_at as string,
    processedAt: (row.processed_at as string) ?? undefined,
  };
}

function inboxItemToRow(item: InboxItem) {
  return {
    id: item.id,
    raw_content: item.rawContent,
    source_type: item.sourceType,
    source_url: item.sourceUrl ?? null,
    item_type: item.itemType,
    status: item.status,
    extracted_data: item.extractedData ?? {},
    processed_at: item.processedAt ?? null,
  };
}

export async function getInboxItems(): Promise<InboxItem[]> {
  const { data, error } = await supabase
    .from("inbox_items")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(`getInboxItems: ${error.message}`);
  return (data ?? []).map((row: Record<string, unknown>) => rowToInboxItem(row));
}

export async function createInboxItem(item: InboxItem): Promise<InboxItem> {
  const { data, error } = await supabase
    .from("inbox_items")
    .insert({ ...inboxItemToRow(item), created_at: item.createdAt || new Date().toISOString() })
    .select()
    .single();

  if (error) throw new Error(`createInboxItem: ${error.message}`);
  return rowToInboxItem(data as Record<string, unknown>);
}

export async function updateInboxItem(item: InboxItem): Promise<InboxItem> {
  const { data, error } = await supabase
    .from("inbox_items")
    .update(inboxItemToRow(item))
    .eq("id", item.id)
    .select()
    .single();

  if (error) throw new Error(`updateInboxItem: ${error.message}`);
  return rowToInboxItem(data as Record<string, unknown>);
}

export async function deleteInboxItem(id: string): Promise<void> {
  const { error } = await supabase.from("inbox_items").delete().eq("id", id);
  if (error) throw new Error(`deleteInboxItem: ${error.message}`);
}
