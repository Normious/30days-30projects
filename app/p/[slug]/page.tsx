import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { createServerSupabase } from "@/lib/supabase/server";
import { TechStackPill } from "@/components/tech-stack-pill";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import { incrementViewCount } from "@/actions/projects";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<{ title: string; description: string }> {
  const supabase = await createServerSupabase();
  const { data } = await supabase.from("projects").select("title,description").eq("slug", (await params).slug).single();
  if (!data) return { title: "Not found", description: "" };
  return { title: data.title as string, description: data.description as string };
}

export default async function ProjectDetail({ params }: { params: Promise<{ slug: string }> }): Promise<React.JSX.Element> {
  const supabase = await createServerSupabase();
  const { data: project } = await supabase.from("projects").select("*").eq("slug", (await params).slug).eq("status", "approved").single();
  if (!project) notFound();
  const p = project as { id: string; title: string; description: string; long_description: string | null; screenshot_url: string; demo_url: string | null; repo_url: string | null; tech_stack: string[] | null; view_count: number; source_snippet: string | null; source_language: string | null };
  await incrementViewCount(p.id);
  const { data: authors } = await supabase.from("project_authors").select("profiles(username,display_name)").eq("project_id", p.id);
  const names = (((authors ?? []) as { profiles: { username: string; display_name: string } }[]).map((a) => a.profiles));
  return (
    <article className="mx-auto max-w-4xl px-4 py-10 md:py-14">
      <h1 className="max-w-3xl text-balance text-3xl font-semibold tracking-tight md:text-4xl">{p.title}</h1>
      <p className="mt-3 max-w-[65ch] text-lg leading-relaxed text-text-muted">{p.description}</p>
      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-text-subtle">
        <span>
          by{" "}
          {names.map((prof, i) => (
            <span key={prof.username}>
              {i > 0 && ", "}
              <Link className="text-text underline decoration-border-strong underline-offset-4 hover:decoration-brand-500" href={`/u/${prof.username}`}>{prof.display_name}</Link>
            </span>
          ))}
        </span>
        <span aria-hidden>·</span>
        <span className="font-mono text-xs tabular-nums">{p.view_count} views</span>
      </div>
      <div className="relative mt-6 aspect-[16/9] overflow-hidden rounded-lg border border-border bg-bg-muted">
        <Image src={p.screenshot_url} alt={`${p.title} screenshot`} fill className="object-cover" sizes="100vw" priority />
      </div>
      <div className="mt-4 flex flex-wrap gap-1.5">{(p.tech_stack ?? []).map((t) => <TechStackPill key={t} tech={t} />)}</div>
      {p.long_description && <div className="mt-8 max-w-[70ch]"><MarkdownRenderer markdown={p.long_description} /></div>}
      {p.source_snippet && (
        <figure className="mt-8">
          <figcaption className="font-mono text-xs uppercase tracking-widest text-text-subtle">
            Source{p.source_language ? ` · ${p.source_language}` : ""}
          </figcaption>
          <pre className="mt-2 overflow-x-auto rounded-md border border-border bg-bg-subtle p-4 font-mono text-sm leading-relaxed"><code>{p.source_snippet}</code></pre>
        </figure>
      )}
      <div className="mt-8 flex flex-wrap gap-3">
        {p.demo_url && <a className="inline-flex items-center justify-center whitespace-nowrap rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white transition-all duration-150 ease-out hover:bg-brand-700 active:translate-y-[1px]" href={p.demo_url} target="_blank" rel="noreferrer">Live demo</a>}
        {p.repo_url && <a className="inline-flex items-center justify-center whitespace-nowrap rounded-md border border-border px-4 py-2 text-sm font-medium transition-all duration-150 ease-out hover:border-border-strong active:translate-y-[1px]" href={p.repo_url} target="_blank" rel="noreferrer">Repository</a>}
      </div>
    </article>
  );
}
