import { notFound } from "next/navigation";
import Link from "next/link";
import { createServerSupabase } from "@/lib/supabase/server";
import { ProjectGrid } from "@/components/project-grid";
import { OrganiserList } from "@/components/organiser-list";
import { MarkdownRenderer } from "@/components/markdown-renderer";

export default async function ChallengePage({ params }: { params: { slug: string } }): Promise<React.JSX.Element> {
  const supabase = createServerSupabase();
  const { data: challenge } = await supabase.from("challenges").select("*").eq("slug", params.slug).single();
  if (!challenge) notFound();
  const c = challenge as { id: string; title: string; tagline: string | null; description: string | null; status: string; start_date: string; end_date: string };
  if (c.status === "draft") notFound();
  const { data: projects } = await supabase.from("projects").select("slug,title,description,screenshot_url,tech_stack,view_count").eq("challenge_id", c.id).eq("status", "approved").order("day_number", { ascending: true }).limit(100);
  const { data: organisers } = await supabase.from("challenge_participants").select("user_id,is_primary,profiles(username,display_name)").eq("challenge_id", c.id).eq("role", "organiser");
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <p className="font-mono text-xs uppercase tracking-widest text-brand-500">{c.status} · {c.start_date} → {c.end_date}</p>
      <h1 className="mt-2 text-3xl font-semibold">{c.title}</h1>
      {c.tagline && <p className="mt-2 text-lg text-text-muted">{c.tagline}</p>}
      {c.description && <div className="mt-4"><MarkdownRenderer markdown={c.description} /></div>}
      <OrganiserList organisers={(organisers ?? []) as never} />
      <div className="mt-6"><Link href="/dashboard/projects/new" className="rounded-md bg-brand-600 px-4 py-2 text-white">Submit a project</Link></div>
      <h2 className="mt-10 text-2xl font-semibold">Submissions</h2>
      <div className="mt-4"><ProjectGrid projects={(projects ?? []) as never} /></div>
    </div>
  );
}
