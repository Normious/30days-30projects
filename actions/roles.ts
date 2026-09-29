"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabase } from "@/lib/supabase/server";
import { getSessionUser } from "@/lib/auth";
import type { PlatformRole } from "@/lib/role-helpers";
import type { ActionResult } from "./projects";

/** Admin promote user (direct promotion, Path A). */
export async function promoteUser(userId: string, role: PlatformRole, reason?: string): Promise<ActionResult> {
  const user = await getSessionUser();
  if (!user || user.role !== "admin") return { ok: false, error: "Admin only" };
  const supabase = createServerSupabase();
  const { error } = await supabase.from("profiles").update({ platform_role: role }).eq("id", userId);
  if (error) return { ok: false, error: error.message };
  await supabase.from("user_role_history").insert({ user_id: userId, new_role: role, changed_by: user.id, reason: reason ?? "admin_promotion" });
  await supabase.from("audit_log").insert({ actor_id: user.id, action: "user.promote", target_type: "profile", target_id: userId, metadata: { role } });
  revalidatePath("/admin/users");
  return { ok: true, data: { id: userId } };
}

/** Admin revoke organiser → participant + suspend. */
export async function revokeOrganiser(userId: string, reason: string): Promise<ActionResult> {
  const user = await getSessionUser();
  if (!user || user.role !== "admin") return { ok: false, error: "Admin only" };
  const supabase = createServerSupabase();
  const { error } = await supabase.from("profiles").update({ platform_role: "participant", organiser_status: "suspended", organiser_revoked_at: new Date().toISOString(), organiser_revoked_reason: reason }).eq("id", userId);
  if (error) return { ok: false, error: error.message };
  await supabase.from("audit_log").insert({ actor_id: user.id, action: "user.revoke_organiser", target_type: "profile", target_id: userId });
  revalidatePath("/admin/users");
  return { ok: true, data: { id: userId } };
}
