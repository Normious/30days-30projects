"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabase } from "@/lib/supabase/server";
import { getSessionUser } from "@/lib/auth";
import { organiserApplicationSchema } from "@/lib/validation";
import { checkRateLimit } from "@/lib/rate-limit";
import type { ActionResult } from "./projects";

/** Apply to become organiser (7-day account age enforced by RLS + here). */
export async function applyForOrganiser(input: unknown): Promise<ActionResult> {
  const user = await getSessionUser();
  if (!user) return { ok: false, error: "Not authenticated" };
  if (user.role === "organiser" || user.role === "admin") return { ok: false, error: "Already an organiser" };
  const rate = checkRateLimit("organiserApplication", user.id);
  if (!rate.ok) return { ok: false, error: "One application per 30 days" };
  const parsed = organiserApplicationSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.errors[0]?.message ?? "Invalid input" };
  if (new Date(parsed.data.planned_start_date) < new Date(new Date().toDateString())) return { ok: false, error: "Planned dates must be in the future" };
  const supabase = createServerSupabase();
  const { data, error } = await supabase.from("organiser_applications").insert({ applicant_id: user.id, ...parsed.data }).select("id").single();
  if (error) return { ok: false, error: error.message };
  revalidatePath("/settings/become-organiser/status");
  return { ok: true, data: { id: (data as { id: string }).id } };
}

/** Withdraw own pending application. */
export async function withdrawApplication(id: string): Promise<ActionResult> {
  const user = await getSessionUser();
  if (!user) return { ok: false, error: "Not authenticated" };
  const supabase = createServerSupabase();
  const { error } = await supabase.from("organiser_applications").update({ status: "withdrawn" }).eq("id", id).eq("applicant_id", user.id).eq("status", "pending");
  if (error) return { ok: false, error: error.message };
  revalidatePath("/settings/become-organiser/status");
  return { ok: true, data: { id } };
}

/** Admin approve → promote to organiser. */
export async function approveApplication(id: string): Promise<ActionResult> {
  const user = await getSessionUser();
  if (!user || user.role !== "admin") return { ok: false, error: "Admin only" };
  const supabase = createServerSupabase();
  const { data: app } = await supabase.from("organiser_applications").select("applicant_id").eq("id", id).single();
  if (!app) return { ok: false, error: "Not found" };
  await supabase.from("organiser_applications").update({ status: "approved", reviewed_by: user.id, reviewed_at: new Date().toISOString() }).eq("id", id);
  await supabase.from("profiles").update({ platform_role: "organiser", organiser_status: "approved", organiser_approved_at: new Date().toISOString(), organiser_approved_by: user.id }).eq("id", (app as { applicant_id: string }).applicant_id);
  await supabase.from("audit_log").insert({ actor_id: user.id, action: "organiser_application.approve", target_type: "organiser_application", target_id: id });
  revalidatePath("/admin/organiser-applications");
  return { ok: true, data: { id } };
}

/** Admin reject with reason (20–500 chars). */
export async function rejectApplication(id: string, reason: string): Promise<ActionResult> {
  const user = await getSessionUser();
  if (!user || user.role !== "admin") return { ok: false, error: "Admin only" };
  if (reason.length < 20 || reason.length > 500) return { ok: false, error: "Reason must be 20–500 chars" };
  const supabase = createServerSupabase();
  const { error } = await supabase.from("organiser_applications").update({ status: "rejected", rejection_reason: reason, reviewed_by: user.id, reviewed_at: new Date().toISOString() }).eq("id", id);
  if (error) return { ok: false, error: error.message };
  await supabase.from("audit_log").insert({ actor_id: user.id, action: "organiser_application.reject", target_type: "organiser_application", target_id: id });
  revalidatePath("/admin/organiser-applications");
  return { ok: true, data: { id } };
}
