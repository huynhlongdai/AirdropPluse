import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

/**
 * Server-side Supabase client with service role — never expose to browser.
 * Untyped to avoid TypeScript inference issues with generated schema types;
 * all row→domain mapping is done explicitly in the service layer.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false },
}) as any; // eslint-disable-line @typescript-eslint/no-explicit-any
