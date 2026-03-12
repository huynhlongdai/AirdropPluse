import type { Route } from "./+types/api.config";

/** Returns public Supabase credentials for browser realtime subscriptions */
export async function loader(_: Route.LoaderArgs) {
  return Response.json({
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
  });
}
