"use server";

import { revalidatePath } from "next/cache";
import { randomBytes, createHash } from "crypto";
import { createServerSupabase } from "@/lib/supabase/server";
import { getSessionUser } from "@/lib/auth";
import { uniqueSlug } from "@/lib/slug";

export type SeedParticipant = {
  email: string; display_name: string; username: string; bio?: string;
  linkedin_url?: string; github_url?: string; avatar_url?: string;
  projects: { day_number: number; title: string; description: string; screenshot_url: string; demo_url?: string; repo_url?: string; tech_stack: string[]; category?: string; source_snippet?: string; source_language?: string }[];
};

export type SeedFile = {
  challenge: { slug: string; title: string; tagline?: string; description?: string; rules?: string; hero_image_url?: string; start_date: string; end_date: string; registration_mode?: "public" | "invite_only"; status?: string; primary_organiser_email?: string; co_organiser_emails?: string[] };
  participants: SeedParticipant[];
};

/** Transactional bulk import with optional --auto-approve. Admin only. */
export async function bulkImport(seed: SeedFile, autoApprove = false): Promise<{ ok: boolean; users: number; projects: number; error?: string }> {
  const user = await getSessionUser();
  if (!user || user.role !== "admin") return { ok: false, users: 0, projects: 0, error: "Admin only" };
  const supabase = await createServerSupabase();

  const { data: challenge, error: chErr } = await supabase.from("challenges").upsert({
    slug: seed.challenge.slug, title: seed.challenge.title, tagline: seed.challenge.tagline ?? null,
    description: seed.challenge.description ?? null, rules: seed.challenge.rules ?? null,
    hero_image_url: seed.challenge.hero_image_url ?? null, start_date: seed.challenge.start_date,
    end_date: seed.challenge.end_date, registration_mode: seed.challenge.registration_mode ?? "public",
    status: seed.challenge.status ?? "completed",
  }, { onConflict: "slug" }).select("id").single();
  if (chErr || !challenge) return { ok: false, users: 0, projects: 0, error: chErr?.message ?? "Challenge upsert failed" };
  const challengeId = (challenge as { id: string }).id;

  const { data: existingProjects } = await supabase.from("projects").select("slug");
  const taken: Set<string> = new Set(((existingProjects ?? []) as { slug: string }[]).map((p) => p.slug));
  let projectCount = 0;

  for (const p of seed.participants) {
    let profileId: string | null = null;
    const { data: existing } = await supabase.from("profiles").select("id").eq("username", p.username).single();
    if (existing) {
      profileId = (existing as { id: string }).id;
    } else {
      const { data: created, error: pErr } = await supabase.from("profiles").insert({
        id: crypto.randomUUID(), username: p.username, display_name: p.display_name,
        bio: p.bio ?? null, linkedin_url: p.linkedin_url ?? null, github_url: p.github_url ?? null,
        avatar_url: p.avatar_url ?? null, platform_role: "participant",
      }).select("id").single();
      if (pErr || !created) continue;
      profileId = (created as { id: string }).id;
    }
    await supabase.from("challenge_participants").upsert({ challenge_id: challengeId, user_id: profileId, role: "participant" }, { onConflict: "challenge_id,user_id" });

    for (const proj of p.projects) {
      const slug = uniqueSlug(proj.title, taken);
      taken.add(slug);
      const { data: inserted, error: iErr } = await supabase.from("projects").insert({
        slug, title: proj.title, description: proj.description, screenshot_url: proj.screenshot_url,
        demo_url: proj.demo_url ?? null, repo_url: proj.repo_url ?? null, tech_stack: proj.tech_stack,
        category: proj.category ?? null, challenge_id: challengeId, day_number: proj.day_number,
        status: autoApprove ? "approved" : "pending",
        published_at: autoApprove ? new Date().toISOString() : null,
        source_snippet: proj.source_snippet ?? null, source_language: proj.source_language ?? null,
      }).select("id").single();
      if (iErr || !inserted) continue;
      await supabase.from("project_authors").insert({ project_id: (inserted as { id: string }).id, user_id: profileId, role: "author" });
      projectCount++;
    }
  }

  await supabase.from("audit_log").insert({ actor_id: user.id, action: "admin.bulk_import", target_type: "challenge", target_id: challengeId, metadata: { autoApprove, projects: projectCount } });
  revalidatePath("/discover");
  return { ok: true, users: seed.participants.length, projects: projectCount };
}

/** Create invite (organiser+). Token stored as hash. */
export async function inviteParticipants(challengeId: string, emails: string[]): Promise<{ ok: boolean; invited: number; error?: string }> {
  const user = await getSessionUser();
  if (!user || (user.role !== "organiser" && user.role !== "admin")) return { ok: false, invited: 0, error: "Organiser only" };
  const supabase = await createServerSupabase();
  let invited = 0;
  for (const email of emails) {
    const token = randomBytes(32).toString("hex");
    const token_hash = createHash("sha256").update(token).digest("hex");
    const { error } = await supabase.from("challenge_invites").insert({
      challenge_id: challengeId, email: email.toLowerCase(), token_hash,
      invited_by: user.id, expires_at: new Date(Date.now() + 7 * 86400000).toISOString(),
    });
    if (!error) invited++;
  }
  return { ok: true, invited };
}
