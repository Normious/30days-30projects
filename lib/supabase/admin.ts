import { createClient } from "@supabase/supabase-js";

/** Service-role client — server-only, never expose to browser. RLS bypass only for admin jobs. */
export function createAdminSupabase(): ReturnType<typeof createClient> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
  return createClient(url, key, { auth: { persistSession: false } });
}
