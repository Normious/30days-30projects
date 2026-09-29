"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabase } from "@/lib/supabase/server";
import { getSessionUser } from "@/lib/auth";
import { MAX_FEATURED_PROJECTS } from "@/lib/constants";
import type { ActionResult } from "./projects";

async function requireModerator(challengeId: string | null, userId: string, role: string): Promise<boolean> {
  if (role === "admin") return true;
  if (!challengeId) return false;
  const supabase = await createServerSupabase();
  const { data } = await supabase.from("challenge_participants").select("id")
    .eq("challenge_id", challengeId).eq("user_id", userId).eq("role", "organiser").limit(1);
  return (data?.length ?? 0) > 0;
}

/** Approve project. Refs: SPEC §16 moderation (status + featured only). */
export async function approveProject(id: string): Promise<ActionResult> {
  const user = await getSessionUser();
  if (!user) return { ok: false, error: "Not authenticated" };
  const supabase = await createServerSupabase();
  const { data: project } = await supabase.from("projects").select("challenge_id").eq("id", id).single();
  if (!project) return { ok: false, error: "Not found" };
  if (!(await requireModerator(project.challenge_id as string | null, user.id, user.role)))
    return { ok: false, error: "Not authorized" };
  const { error } = await supabase.from("projects").update({ status: "approved" }).eq("id", id);
  if (error) return { ok: false, error: error.message };
  await supabase.from("audit_log").insert({ actor_id: user.id, action: "project.approve", target_type: "project", target_id: id });
  revalidatePath("/discover");
  return { ok: true, data: { id } };
}

/** Reject project with reason. */
export async function rejectProject(id: string, reason: string): Promise<ActionResult> {
  const user = await getSessionUser();
  if (!user) return { ok: false, error: "Not authenticated" };
  if (reason.length < 5 || reason.length > 500) return { ok: false, error: "Reason must be 5–500 chars" };
  const supabase = await createServerSupabase();
  const { data: project } = await supabase.from("projects").select("challenge_id").eq("id", id).single();
  if (!project) return { ok: false, error: "Not found" };
  if (!(await requireModerator(project.challenge_id as string | null, user.id, user.role)))
    return { ok: false, error: "Not authorized" };
  const { error } = await supabase.from("projects").update({ status: "rejected", rejection_reason: reason }).eq("id", id);
  if (error) return { ok: false, error: error.message };
  await supabase.from("audit_log").insert({ actor_id: user.id, action: "project.reject", target_type: "project", target_id: id });
  revalidatePath("/admin/projects");
  return { ok: true, data: { id } };
}

/** Toggle featured (admin only, max 5). Refs: SPEC §26.8. */
export async function featureProject(id: string, featured: boolean): Promise<ActionResult> {
  const user = await getSessionUser();
  if (!user || user.role !== "admin") return { ok: false, error: "Admin only" };
  const supabase = await createServerSupabase();
  if (featured) {
    const { count } = await supabase.from("projects").select("id", { count: "exact", head: true }).eq("featured", true);
    if ((count ?? 0) >= MAX_FEATURED_PROJECTS) return { ok: false, error: `Max ${MAX_FEATURED_PROJECTS} featured projects` };
  }
  const { error } = await supabase.from("projects").update({ featured }).eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/");
  return { ok: true, data: { id } };
}

/** Bulk approve (admin only). */
export async function bulkApprove(ids: string[]): Promise<{ ok: boolean; approved: number; error?: string }> {
  const user = await getSessionUser();
  if (!user || user.role !== "admin") return { ok: false, approved: 0, error: "Admin only" };
  const supabase = await createServerSupabase();
  const { error, count } = await supabase.from("projects").update({ status: "approved" }).in("id", ids);
  if (error) return { ok: false, approved: 0, error: error.message };
  await supabase.from("audit_log").insert({ actor_id: user.id, action: "project.bulk_approve", target_type: "project", metadata: { count: ids.length } });
  revalidatePath("/admin/projects");
  return { ok: true, approved: count ?? ids.length };
}
