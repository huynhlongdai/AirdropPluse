/**
 * Server-side Supabase client.
 *
 * - If SUPABASE_URL is set  → use the real Supabase JS client (cloud / Coolify)
 * - Otherwise               → use the local pg adapter (local dev / testing)
 *
 * All db/*.server.ts files import from here and work unchanged in both modes.
 */

let supabaseExport: unknown;

const supabaseUrl = process.env.SUPABASE_URL;

if (supabaseUrl) {
  // ── Cloud / Coolify mode ────────────────────────────────────────
  const { createClient } = await import("@supabase/supabase-js");
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabaseExport = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } }) as any;
} else {
  // ── Local pg mode ───────────────────────────────────────────────
  const { supabase: localSb } = await import("./supabase.local");
  supabaseExport = localSb;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const supabase = supabaseExport as any;
