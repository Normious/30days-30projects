"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createServerSupabase } from "@/lib/supabase/server";
import { getSessionUser } from "@/lib/auth";
import { projectSchema } from "@/lib/validation";
import { checkRateLimit } from "@/lib/rate-limit";
import { uniqueSlug } from "@/lib/slug";

export type ActionResult<T = { id: string }> = { ok: true; data: T } | { ok: false; error: string };

async function logAudit(actorId: string, action: string, targetType: string, targetId?: string): Promise<void> {
  const supabase = await createServerSupabase();
  await supabase.from("audit_log").insert({ actor_id: actorId, action, target_type: targetType, target_id: targetId ?? null });
}

/** Create project (status=pending). Refs: SPEC §16. */
export async function createProject(input: z.infer<typeof projectSchema>, coAuthorUsernames: string[] = []): Promise<ActionResult> {
  const user = await getSessionUser();
  if (!user) return { ok: false, error: "Not authenticated" };
  const rate = checkRateLimit("projectSubmission", user.id);
  if (!rate.ok) return { ok: false, error: "Rate limit: 5 projects per hour" };
  const parsed = projectSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.errors[0]?.message ?? "Invalid input" };

  const supabase = await createServerSupabase();
  const { data: existing } = await supabase.from("projects").select("slug");
  const taken: Set<string> = new Set(((existing ?? []) as { slug: string }[]).map((p) => p.slug));
  const slug = uniqueSlug(parsed.data.title, taken);

  const { data: project, error } = await supabase.from("projects").insert({
    slug, title: parsed.data.title, description: parsed.data.description,
    long_description: parsed.data.long_description ?? null, screenshot_url: parsed.data.screenshot_url,
    demo_url: parsed.data.demo_url || null, repo_url: parsed.data.repo_url || null,
    source_snippet: parsed.data.source_snippet ?? null, source_language: parsed.data.source_language ?? null,
    tech_stack: parsed.data.tech_stack, category: parsed.data.category ?? null,
    challenge_id: parsed.data.challenge_id ?? null, day_number: parsed.data.day_number ?? null, status: "pending",
  }).select("id").single();
  if (error || !project) return { ok: false, error: error?.message ?? "Insert failed" };

  await supabase.from("project_authors").insert({ project_id: project.id, user_id: user.id, role: "author" });
  for (const username of coAuthorUsernames) {
    const { data: co } = await supabase.from("profiles").select("id").eq("username", username).single();
    if (co) await supabase.from("project_authors").insert({ project_id: project.id, user_id: co.id, role: "co_author" });
  }
  await logAudit(user.id, "project.create", "project", project.id);
  revalidatePath("/discover");
  revalidatePath("/dashboard/projects");
  return { ok: true, data: { id: project.id as string } };
}

/** Update own pending project. Moderators cannot edit content (SPEC §26.16). */
export async function updateProject(id: string, input: Partial<z.infer<typeof projectSchema>>): Promise<ActionResult> {
  const user = await getSessionUser();
  if (!user) return { ok: false, error: "Not authenticated" };
  const supabase = await createServerSupabase();
  const { data: own } = await supabase.from("project_authors").select("id").eq("project_id", id).eq("user_id", user.id).eq("role", "author").limit(1);
  if (!own?.length && user.role !== "admin") return { ok: false, error: "Not authorized" };
  const { error } = await supabase.from("projects").update({
    title: input.title, description: input.description,
    long_description: input.long_description ?? undefined, screenshot_url: input.screenshot_url ?? undefined,
    demo_url: input.demo_url ?? undefined, repo_url: input.repo_url ?? undefined,
    tech_stack: input.tech_stack ?? undefined, category: input.category ?? undefined,
  }).eq("id", id).eq("status", "pending");
  if (error) return { ok: false, error: error.message };
  revalidatePath(`/p/${id}`);
  return { ok: true, data: { id } };
}

/** Delete own project (author) or any (admin). */
export async function deleteProject(id: string): Promise<ActionResult> {
  const user = await getSessionUser();
  if (!user) return { ok: false, error: "Not authenticated" };
  const supabase = await createServerSupabase();
  if (user.role !== "admin") {
    const { data: own } = await supabase.from("project_authors").select("id").eq("project_id", id).eq("user_id", user.id).limit(1);
    if (!own?.length) return { ok: false, error: "Not authorized" };
  }
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  await logAudit(user.id, "project.delete", "project", id);
  revalidatePath("/discover");
  return { ok: true, data: { id } };
}

/** Public atomic view-count increment. */
export async function incrementViewCount(id: string): Promise<void> {
  const supabase = await createServerSupabase();
  await supabase.rpc("increment_project_views", { project_id: id }).then(
    undefined,
    async () => {
      const { data } = await supabase.from("projects").select("view_count").eq("id", id).single();
      const current = (data?.view_count as number | undefined) ?? 0;
      await supabase.from("projects").update({ view_count: current + 1 }).eq("id", id);
    },
  );
}
