import { supabase } from "../supabase.server";
import type {
  ProviderIntegration,
  ApiKey,
  AiFeatureMapping,
  TaxonomyItem,
  IngestionSettings,
  ApiLog,
} from "~/data/settings";

// ─────────────────────────────────────────
// PROVIDERS + API KEYS
// ─────────────────────────────────────────
function rowToApiKey(row: Record<string, unknown>): ApiKey {
  return {
    id: row.id as string,
    label: row.label as string,
    valueMasked: (row.value_masked as string) ?? undefined,
    status: row.status as ApiKey["status"],
    usagePercent: (row.usage_percent as number) ?? undefined,
    usageLabel: (row.usage_label as string) ?? undefined,
    quotaLimit: (row.quota_limit as string) ?? undefined,
    lastChecked: (row.last_checked as string) ?? undefined,
    isPrimary: row.is_primary as boolean,
  };
}

export async function getProviders(): Promise<ProviderIntegration[]> {
  const [{ data: providerRows, error: pErr }, { data: keyRows, error: kErr }] = await Promise.all([
    supabase.from("settings_providers").select("*"),
    supabase.from("settings_api_keys").select("*"),
  ]);

  if (pErr) throw new Error(`getProviders: ${pErr.message}`);
  if (kErr) throw new Error(`getApiKeys: ${kErr.message}`);

  type AnyRow = Record<string, unknown>;
  return (providerRows ?? []).map((pRow: AnyRow) => ({
    id: pRow.id as string,
    name: pRow.name as string,
    provider: pRow.provider as string,
    category: pRow.category as ProviderIntegration["category"],
    description: pRow.description as string,
    iconColor: pRow.icon_color as string,
    docsUrl: (pRow.docs_url as string) ?? undefined,
    keys: (keyRows ?? [])
      .filter((k: AnyRow) => k.provider_id === pRow.id)
      .map((k: AnyRow) => rowToApiKey(k)),
  }));
}

export async function updateApiKey(keyId: string, updates: Partial<ApiKey>): Promise<void> {
  const { error } = await supabase
    .from("settings_api_keys")
    .update({
      label: updates.label,
      value_masked: updates.valueMasked ?? null,
      status: updates.status,
      usage_percent: updates.usagePercent ?? null,
      usage_label: updates.usageLabel ?? null,
      quota_limit: updates.quotaLimit ?? null,
      last_checked: updates.lastChecked ?? null,
      is_primary: updates.isPrimary,
    })
    .eq("id", keyId);

  if (error) throw new Error(`updateApiKey: ${error.message}`);
}

export async function addApiKey(providerId: string, key: ApiKey): Promise<void> {
  const { error } = await supabase.from("settings_api_keys").insert({
    id: key.id,
    provider_id: providerId,
    label: key.label,
    value_masked: key.valueMasked ?? null,
    status: key.status,
    usage_percent: key.usagePercent ?? null,
    usage_label: key.usageLabel ?? null,
    quota_limit: key.quotaLimit ?? null,
    last_checked: key.lastChecked ?? null,
    is_primary: key.isPrimary,
  });
  if (error) throw new Error(`addApiKey: ${error.message}`);
}

export async function deleteApiKey(keyId: string): Promise<void> {
  const { error } = await supabase.from("settings_api_keys").delete().eq("id", keyId);
  if (error) throw new Error(`deleteApiKey: ${error.message}`);
}

// ─────────────────────────────────────────
// AI CONFIG
// ─────────────────────────────────────────
export async function getAiMappings(): Promise<AiFeatureMapping[]> {
  const { data, error } = await supabase.from("settings_ai_config").select("*");
  if (error) throw new Error(`getAiMappings: ${error.message}`);
  return (data ?? []).map((row: Record<string, unknown>) => ({
    feature: row.feature as AiFeatureMapping["feature"],
    featureLabel: row.feature_label as string,
    featureDescription: row.feature_description as string,
    primaryModel: row.primary_model as string,
    fallbackModel: row.fallback_model as string,
    temperature: row.temperature as number,
    maxTokens: row.max_tokens as number,
  }));
}

export async function updateAiMapping(feature: string, updates: Partial<AiFeatureMapping>): Promise<void> {
  const { error } = await supabase
    .from("settings_ai_config")
    .update({
      primary_model: updates.primaryModel,
      fallback_model: updates.fallbackModel,
      temperature: updates.temperature,
      max_tokens: updates.maxTokens,
    })
    .eq("feature", feature);
  if (error) throw new Error(`updateAiMapping: ${error.message}`);
}

// ─────────────────────────────────────────
// TAXONOMY
// ─────────────────────────────────────────
export async function getTaxonomy(): Promise<TaxonomyItem[]> {
  const { data, error } = await supabase.from("settings_taxonomy").select("*");
  if (error) throw new Error(`getTaxonomy: ${error.message}`);
  return (data ?? []).map((row: Record<string, unknown>) => ({
    id: row.id as string,
    type: row.type as TaxonomyItem["type"],
    label: row.label as string,
    color: row.color as string,
    builtIn: row.built_in as boolean,
    usageCount: row.usage_count as number,
  }));
}

export async function createTaxonomyItem(item: TaxonomyItem): Promise<void> {
  const { error } = await supabase.from("settings_taxonomy").insert({
    id: item.id,
    type: item.type,
    label: item.label,
    color: item.color,
    built_in: item.builtIn,
    usage_count: item.usageCount,
  });
  if (error) throw new Error(`createTaxonomyItem: ${error.message}`);
}

export async function deleteTaxonomyItem(id: string): Promise<void> {
  const { error } = await supabase.from("settings_taxonomy").delete().eq("id", id);
  if (error) throw new Error(`deleteTaxonomyItem: ${error.message}`);
}

// ─────────────────────────────────────────
// INGESTION SETTINGS
// ─────────────────────────────────────────
export async function getIngestionSettings(): Promise<IngestionSettings> {
  const { data, error } = await supabase.from("settings_ingestion").select("*").eq("id", "singleton").single();
  if (error) throw new Error(`getIngestionSettings: ${error.message}`);
  return {
    crawlDepth: data.crawl_depth as number,
    skipImages: data.skip_images as boolean,
    textOnly: data.text_only as boolean,
    autoScrapeEnabled: data.auto_scrape_enabled as boolean,
    scrapeIntervalHours: data.scrape_interval_hours as number,
    priorityDomains: data.priority_domains as string[],
    maxItemsPerRun: data.max_items_per_run as number,
    deduplication: data.deduplication as boolean,
  };
}

export async function updateIngestionSettings(settings: IngestionSettings): Promise<void> {
  const { error } = await supabase.from("settings_ingestion").update({
    crawl_depth: settings.crawlDepth,
    skip_images: settings.skipImages,
    text_only: settings.textOnly,
    auto_scrape_enabled: settings.autoScrapeEnabled,
    scrape_interval_hours: settings.scrapeIntervalHours,
    priority_domains: settings.priorityDomains,
    max_items_per_run: settings.maxItemsPerRun,
    deduplication: settings.deduplication,
  }).eq("id", "singleton");
  if (error) throw new Error(`updateIngestionSettings: ${error.message}`);
}

// ─────────────────────────────────────────
// API LOGS
// ─────────────────────────────────────────
export async function getApiLogs(limit = 50): Promise<ApiLog[]> {
  const { data, error } = await supabase
    .from("api_logs")
    .select("*")
    .order("timestamp", { ascending: false })
    .limit(limit);

  if (error) throw new Error(`getApiLogs: ${error.message}`);
  return (data ?? []).map((row: Record<string, unknown>) => ({
    id: row.id as string,
    timestamp: row.timestamp as string,
    service: row.service as string,
    endpoint: row.endpoint as string,
    statusCode: row.status_code as number,
    latencyMs: row.latency_ms as number,
    tokensUsed: (row.tokens_used as number) ?? undefined,
    costUsd: (row.cost_usd as number) ?? undefined,
    success: row.success as boolean,
    errorMessage: (row.error_message as string) ?? undefined,
  }));
}
