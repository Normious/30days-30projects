import { notFound } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";
import { ProjectGrid } from "@/components/project-grid";
import { OrganiserList } from "@/components/organiser-list";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import { Badge, Button } from "@/components/ui";

export default async function ChallengePage({ params }: { params: Promise<{ slug: string }> }): Promise<React.JSX.Element> {
  const supabase = await createServerSupabase();
  const { data: challenge } = await supabase.from("challenges").select("*").eq("slug", (await params).slug).single();
  if (!challenge) notFound();
  const c = challenge as { id: string; title: string; tagline: string | null; description: string | null; status: string; start_date: string; end_date: string };
  if (c.status === "draft") notFound();
  const { data: projects } = await supabase.from("projects").select("slug,title,description,screenshot_url,tech_stack,view_count").eq("challenge_id", c.id).eq("status", "approved").order("day_number", { ascending: true }).limit(100);
  const { data: organisers } = await supabase.from("challenge_participants").select("user_id,is_primary,profiles(username,display_name)").eq("challenge_id", c.id).eq("role", "organiser");
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
      <div className="flex flex-wrap items-center gap-3">
        <Badge>{c.status}</Badge>
        <span className="font-mono text-xs tabular-nums text-text-subtle">{c.start_date} → {c.end_date}</span>
      </div>
      <h1 className="mt-3 max-w-3xl text-balance text-3xl font-semibold tracking-tight md:text-5xl">{c.title}</h1>
      {c.tagline && <p className="mt-3 max-w-[60ch] text-lg leading-relaxed text-text-muted">{c.tagline}</p>}
      {c.description && <div className="mt-5 max-w-[70ch]"><MarkdownRenderer markdown={c.description} /></div>}
      <OrganiserList organisers={(organisers ?? []) as never} />
      <div className="mt-6"><Button href="/dashboard/projects/new">Submit a project</Button></div>
      <h2 className="mt-12 text-2xl font-semibold tracking-tight">
        Submissions <span className="font-mono text-base font-normal tabular-nums text-text-subtle">{(projects ?? []).length}</span>
      </h2>
      <div className="mt-4"><ProjectGrid projects={(projects ?? []) as never} /></div>
    </div>
  );
}
