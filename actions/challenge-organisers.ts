"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabase } from "@/lib/supabase/server";
import { getSessionUser } from "@/lib/auth";
import type { ActionResult } from "./projects";

async function requireGovern(challengeId: string, userId: string, role: string): Promise<boolean> {
  if (role === "admin") return true;
  const supabase = createServerSupabase();
  const { data } = await supabase.from("challenge_participants").select("id")
    .eq("challenge_id", challengeId).eq("user_id", userId).eq("role", "organiser").eq("is_primary", true).limit(1);
  return (data?.length ?? 0) > 0;
}

/** Add co-organiser (must be registered). Refs: SPEC §6.4. */
export async function addCoOrganiser(challengeId: string, emailOrUsername: string): Promise<ActionResult> {
  const user = await getSessionUser();
  if (!user) return { ok: false, error: "Not authenticated" };
  if (!(await requireGovern(challengeId, user.id, user.role))) return { ok: false, error: "Primary only" };
  const supabase = createServerSupabase();
  const q = emailOrUsername.includes("@") ? supabase.from("profiles").select("id").eq("id", emailOrUsername) : supabase.from("profiles").select("id").eq("username", emailOrUsername);
  // Search by username; email lookup goes through auth admin in prod — here match profile by username or id.
  let target: { id: string } | null = null;
  const { data: byUsername } = await supabase.from("profiles").select("id").eq("username", emailOrUsername).single();
  if (byUsername) target = byUsername as { id: string };
  void q;
  if (!target) return { ok: false, error: "User must be registered" };
  const { error } = await supabase.from("challenge_participants").upsert({ challenge_id: challengeId, user_id: target.id, role: "organiser", is_primary: false }, { onConflict: "challenge_id,user_id" });
  if (error) return { ok: false, error: error.message };
  await supabase.from("challenge_organiser_history").insert({ challenge_id: challengeId, user_id: target.id, action: "added", performed_by: user.id });
  revalidatePath(`/organiser/challenges/${challengeId}/settings`);
  return { ok: true, data: { id: target.id } };
}

/** Remove co-organiser. */
export async function removeCoOrganiser(challengeId: string, targetUserId: string): Promise<ActionResult> {
  const user = await getSessionUser();
  if (!user) return { ok: false, error: "Not authenticated" };
  if (!(await requireGovern(challengeId, user.id, user.role))) return { ok: false, error: "Primary only" };
  const supabase = createServerSupabase();
  const { error } = await supabase.from("challenge_participants").delete().eq("challenge_id", challengeId).eq("user_id", targetUserId).eq("is_primary", false);
  if (error) return { ok: false, error: error.message };
  await supabase.from("challenge_organiser_history").insert({ challenge_id: challengeId, user_id: targetUserId, action: "removed", performed_by: user.id });
  revalidatePath(`/organiser/challenges/${challengeId}/settings`);
  return { ok: true, data: { id: targetUserId } };
}

/** Promote co-organiser to primary (swap flags; trigger syncs challenges.primary_organiser_id). */
export async function promoteToPrimary(challengeId: string, targetUserId: string): Promise<ActionResult> {
  const user = await getSessionUser();
  if (!user) return { ok: false, error: "Not authenticated" };
  if (!(await requireGovern(challengeId, user.id, user.role))) return { ok: false, error: "Primary only" };
  const supabase = createServerSupabase();
  await supabase.from("challenge_participants").update({ is_primary: false }).eq("challenge_id", challengeId).eq("user_id", user.id);
  const { error } = await supabase.from("challenge_participants").update({ is_primary: true }).eq("challenge_id", challengeId).eq("user_id", targetUserId);
  if (error) return { ok: false, error: error.message };
  await supabase.from("challenge_organiser_history").insert({ challenge_id: challengeId, user_id: targetUserId, action: "promoted_to_primary", performed_by: user.id });
  revalidatePath(`/organiser/challenges/${challengeId}/settings`);
  return { ok: true, data: { id: targetUserId } };
}

/** Co-organiser leaves own row. */
export async function leaveAsOrganiser(challengeId: string): Promise<ActionResult> {
  const user = await getSessionUser();
  if (!user) return { ok: false, error: "Not authenticated" };
  const supabase = createServerSupabase();
  const { data: me } = await supabase.from("challenge_participants").select("is_primary").eq("challenge_id", challengeId).eq("user_id", user.id).single();
  if (!me) return { ok: false, error: "Not an organiser" };
  if ((me as { is_primary: boolean }).is_primary) return { ok: false, error: "Primary must assign a new primary first" };
  const { error } = await supabase.from("challenge_participants").delete().eq("challenge_id", challengeId).eq("user_id", user.id);
  if (error) return { ok: false, error: error.message };
  return { ok: true, data: { id: user.id } };
}

/** Primary steps down (promote target + demote self). */
export async function stepDownAsPrimary(challengeId: string, newPrimaryUserId: string): Promise<ActionResult> {
  return promoteToPrimary(challengeId, newPrimaryUserId);
}
