import { createServerSupabase } from "./supabase/server";
import type { PlatformRole } from "./role-helpers";

export type SessionUser = { id: string; email: string | undefined; role: PlatformRole };

/** Get current user + platform role. Returns null when signed out. */
export async function getSessionUser(): Promise<SessionUser | null> {
  const supabase = await createServerSupabase();
  const { data } = await supabase.auth.getUser();
  const user = data.user;
  if (!user) return null;
  const { data: profile } = await supabase.from("profiles").select("platform_role").eq("id", user.id).single();
  const role = ((profile?.platform_role as PlatformRole | undefined) ?? "user");
  return { id: user.id, email: user.email ?? undefined, role };
}
