import { createServerSupabase } from "@/lib/supabase/server";
import { ModerationQueue } from "@/components/moderation-queue";

export default async function Moderation({ params }: { params: Promise<{ slug: string }> }): Promise<React.JSX.Element> {
  const supabase = await createServerSupabase();
  const { data: challenge } = await supabase.from("challenges").select("id,title").eq("slug", (await params).slug).single();
  const c = challenge as { id: string; title: string } | null;
  const { data: projects } = c ? await supabase.from("projects").select("id,title,description,slug").eq("challenge_id", c.id).eq("status", "pending") : { data: [] };
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
      <h1 className="max-w-3xl text-balance text-3xl font-semibold tracking-tight">Moderation — {c?.title ?? (await params).slug}</h1>
      <p className="mt-2 text-sm text-text-muted">Moderators can only change status + featured — never content (SPEC §26.16).</p>
      <div className="mt-6"><ModerationQueue projects={(projects ?? []) as never} challengeSlug={(await params).slug} /></div>
    </div>
  );
}
