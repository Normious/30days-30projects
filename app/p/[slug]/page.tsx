import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { createServerSupabase } from "@/lib/supabase/server";
import { TechStackPill } from "@/components/tech-stack-pill";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import { incrementViewCount } from "@/actions/projects";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<{ title: string; description: string }> {
  const supabase = createServerSupabase();
  const { data } = await supabase.from("projects").select("title,description").eq("slug", params.slug).single();
  if (!data) return { title: "Not found", description: "" };
  return { title: data.title as string, description: data.description as string };
}

export default async function ProjectDetail({ params }: { params: { slug: string } }): Promise<React.JSX.Element> {
  const supabase = createServerSupabase();
  const { data: project } = await supabase.from("projects").select("*").eq("slug", params.slug).eq("status", "approved").single();
  if (!project) notFound();
  const p = project as { id: string; title: string; description: string; long_description: string | null; screenshot_url: string; demo_url: string | null; repo_url: string | null; tech_stack: string[] | null; view_count: number; source_snippet: string | null; source_language: string | null };
  await incrementViewCount(p.id);
  const { data: authors } = await supabase.from("project_authors").select("profiles(username,display_name)").eq("project_id", p.id);
  return (
    <article className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-3xl font-semibold">{p.title}</h1>
      <p className="mt-2 text-text-muted">{p.description}</p>
      <div className="relative mt-6 aspect-[16/9] overflow-hidden rounded-lg border border-border">
        <Image src={p.screenshot_url} alt={`${p.title} screenshot`} fill className="object-cover" sizes="100vw" priority />
      </div>
      <div className="mt-4 flex flex-wrap gap-1.5">{(p.tech_stack ?? []).map((t) => <TechStackPill key={t} tech={t} />)}</div>
      {p.long_description && <div className="mt-6"><MarkdownRenderer markdown={p.long_description} /></div>}
      {p.source_snippet && (
        <pre className="mt-6 overflow-x-auto rounded-md border border-border bg-bg-subtle p-4 font-mono text-sm"><code>{p.source_snippet}</code></pre>
      )}
      <div className="mt-6 flex gap-3">
        {p.demo_url && <a className="rounded-md bg-brand-600 px-4 py-2 text-white" href={p.demo_url} target="_blank" rel="noreferrer">Live demo</a>}
        {p.repo_url && <a className="rounded-md border border-border px-4 py-2" href={p.repo_url} target="_blank" rel="noreferrer">Repository</a>}
      </div>
      <p className="mt-6 font-mono text-xs text-text-subtle">{p.view_count} views</p>
      <div className="mt-4 flex gap-2 text-sm">
        {(authors ?? []).map((a) => {
          const prof = (a as { profiles: { username: string; display_name: string } }).profiles;
          return <Link key={prof.username} className="underline" href={`/u/${prof.username}`}>{prof.display_name}</Link>;
        })}
      </div>
    </article>
  );
}
