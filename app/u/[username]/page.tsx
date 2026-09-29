import { notFound } from "next/navigation";
import Image from "next/image";
import { createServerSupabase } from "@/lib/supabase/server";
import { ProjectGrid } from "@/components/project-grid";
import { ProfileCard } from "@/components/profile-card";

export async function generateMetadata({ params }: { params: Promise<{ username: string }> }): Promise<{ title: string; description: string }> {
  const supabase = await createServerSupabase();
  const { data } = await supabase.from("profiles").select("display_name,bio").eq("username", (await params).username).single();
  if (!data) return { title: "Not found", description: "" };
  return { title: (data.display_name as string) ?? (await params).username, description: (data.bio as string) ?? "" };
}

export default async function Portfolio({ params }: { params: Promise<{ username: string }> }): Promise<React.JSX.Element> {
  const supabase = await createServerSupabase();
  const { data: profile } = await supabase.from("profiles").select("*").eq("username", (await params).username).single();
  if (!profile) notFound();
  const p = profile as { id: string; display_name: string; bio: string | null; avatar_url: string | null; linkedin_url: string | null; github_url: string | null; website_url: string | null; location: string | null };
  const { data: links } = await supabase.from("project_authors").select("projects(slug,title,description,screenshot_url,tech_stack,view_count,status)").eq("user_id", p.id);
  type LinkRow = { projects: { slug: string; title: string; description: string; screenshot_url: string; tech_stack: string[] | null; view_count: number | null; status: string } };
  const projects = (((links ?? []) as LinkRow[]).map((l) => l.projects).filter((x) => x.status === "approved"));
  const views = projects.reduce<number>((sum, x) => sum + (x.view_count ?? 0), 0);
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
        {p.avatar_url ? (
          <Image src={p.avatar_url} alt={`${p.display_name} avatar`} width={88} height={88} className="rounded-full border border-border-strong" />
        ) : (
          <div aria-hidden className="flex h-[88px] w-[88px] items-center justify-center rounded-full border border-border-strong bg-bg-subtle font-mono text-2xl text-brand-500">
            {p.display_name.slice(0, 1).toUpperCase()}
          </div>
        )}
        <div className="min-w-0">
          <p className="font-mono text-xs text-text-subtle">/u/{(await params).username}</p>
          <h1 className="mt-1 text-balance text-3xl font-semibold tracking-tight md:text-4xl">{p.display_name}</h1>
          {p.bio && <p className="mt-2 max-w-[65ch] leading-relaxed text-text-muted">{p.bio}</p>}
          <ProfileCard profile={p as never} />
        </div>
      </div>
      <dl className="mt-8 flex gap-8 border-y border-border py-4">
        {[[String(projects.length), "projects"], [String(views), "views"]].map(([v, l]) => (
          <div key={l}>
            <dd className="font-mono text-xl tabular-nums">{v}</dd>
            <dt className="mt-0.5 text-sm text-text-subtle">{l}</dt>
          </div>
        ))}
      </dl>
      <h2 className="mt-10 text-2xl font-semibold tracking-tight">Projects</h2>
      <div className="mt-4"><ProjectGrid projects={projects as never} /></div>
    </div>
  );
}
