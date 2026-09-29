"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabase } from "@/lib/supabase/server";
import { getSessionUser } from "@/lib/auth";
import { challengeSchema } from "@/lib/validation";
import { uniqueSlug } from "@/lib/slug";
import type { ActionResult } from "./projects";

/** Create challenge as draft + self as primary. Refs: SPEC §16. */
export async function createChallenge(input: unknown): Promise<ActionResult> {
  const user = await getSessionUser();
  if (!user || (user.role !== "organiser" && user.role !== "admin")) return { ok: false, error: "Organiser only" };
  const parsed = challengeSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.errors[0]?.message ?? "Invalid input" };
  if (new Date(parsed.data.end_date) < new Date(parsed.data.start_date)) return { ok: false, error: "end_date >= start_date" };
  const supabase = await createServerSupabase();
  const { data: existing } = await supabase.from("challenges").select("slug");
  const slug = uniqueSlug(parsed.data.title, new Set<string>(((existing ?? []) as { slug: string }[]).map((c) => c.slug)));
  const { data, error } = await supabase.from("challenges").insert({
    slug, title: parsed.data.title, tagline: parsed.data.tagline ?? null,
    description: parsed.data.description ?? null, rules: parsed.data.rules ?? null,
    hero_image_url: parsed.data.hero_image_url || null, start_date: parsed.data.start_date,
    end_date: parsed.data.end_date, registration_mode: parsed.data.registration_mode,
    status: "draft", primary_organiser_id: null,
  }).select("id").single();
  if (error || !data) return { ok: false, error: error?.message ?? "Insert failed" };
  await supabase.from("challenge_participants").insert({ challenge_id: data.id, user_id: user.id, role: "organiser", is_primary: true });
  await supabase.from("audit_log").insert({ actor_id: user.id, action: "challenge.create", target_type: "challenge", target_id: data.id });
  revalidatePath("/organiser/challenges");
  return { ok: true, data: { id: data.id as string } };
}

/** Update metadata (primary or admin). */
export async function updateChallenge(id: string, input: unknown): Promise<ActionResult> {
  const user = await getSessionUser();
  if (!user) return { ok: false, error: "Not authenticated" };
  const supabase = await createServerSupabase();
  const { data: ch } = await supabase.from("challenges").select("primary_organiser_id").eq("id", id).single();
  if (!ch || (ch.primary_organiser_id !== user.id && user.role !== "admin")) return { ok: false, error: "Not authorized" };
  const parsed = challengeSchema.partial().safeParse(input);
  if (!parsed.success) return { ok: false, error: "Invalid input" };
  const { error } = await supabase.from("challenges").update(parsed.data).eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath(`/c/${id}`);
  return { ok: true, data: { id } };
}

/** Publish draft → upcoming. */
export async function publishChallenge(id: string): Promise<ActionResult> {
  const user = await getSessionUser();
  if (!user) return { ok: false, error: "Not authenticated" };
  const supabase = await createServerSupabase();
  const { data: ch } = await supabase.from("challenges").select("primary_organiser_id,status").eq("id", id).single();
  if (!ch || (ch.primary_organiser_id !== user.id && user.role !== "admin")) return { ok: false, error: "Not authorized" };
  if (ch.status !== "draft") return { ok: false, error: "Only drafts can be published" };
  const { error } = await supabase.from("challenges").update({ status: "upcoming" }).eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/challenges");
  return { ok: true, data: { id } };
}

/** Archive challenge. */
export async function archiveChallenge(id: string): Promise<ActionResult> {
  const user = await getSessionUser();
  if (!user) return { ok: false, error: "Not authenticated" };
  const supabase = await createServerSupabase();
  const { data: ch } = await supabase.from("challenges").select("primary_organiser_id").eq("id", id).single();
  if (!ch || (ch.primary_organiser_id !== user.id && user.role !== "admin")) return { ok: false, error: "Not authorized" };
  const { error } = await supabase.from("challenges").update({ status: "archived" }).eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/challenges");
  return { ok: true, data: { id } };
}

/** Soft delete: archive + detach projects (remain approved). Refs: SPEC §26.15. */
export async function deleteChallenge(id: string): Promise<ActionResult> {
  const user = await getSessionUser();
  if (!user) return { ok: false, error: "Not authenticated" };
  const supabase = await createServerSupabase();
  const { data: ch } = await supabase.from("challenges").select("primary_organiser_id").eq("id", id).single();
  if (!ch || (ch.primary_organiser_id !== user.id && user.role !== "admin")) return { ok: false, error: "Not authorized" };
  await supabase.from("projects").update({ challenge_id: null }).eq("challenge_id", id);
  const { error } = await supabase.from("challenges").update({ status: "archived" }).eq("id", id);
  if (error) return { ok: false, error: error.message };
  await supabase.from("audit_log").insert({ actor_id: user.id, action: "challenge.delete", target_type: "challenge", target_id: id });
  revalidatePath("/challenges");
  return { ok: true, data: { id } };
}
