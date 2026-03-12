import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

let _client: ReturnType<typeof createClient<Database>> | null = null;

/**
 * Browser-side Supabase client.
 * Credentials are loaded from a /api/config endpoint to avoid exposing them in JS bundles.
 */
export function getSupabaseClient(supabaseUrl: string, supabaseAnonKey: string) {
  if (_client) return _client;
  _client = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    realtime: { params: { eventsPerSecond: 10 } },
  });
  return _client;
}
