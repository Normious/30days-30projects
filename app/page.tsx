import Link from "next/link";
import { createServerSupabase } from "@/lib/supabase/server";
import { ProjectCard } from "@/components/project-card";
import { APP_CONFIG } from "@/lib/constants";

export default async function Home(): Promise<React.JSX.Element> {
  const supabase = createServerSupabase();
  const { data: featured } = await supabase.from("projects").select("slug,title,description,screenshot_url,tech_stack,view_count").eq("status", "approved").eq("featured", true).limit(5);
  const { count } = await supabase.from("projects").select("id", { count: "exact", head: true }).eq("status", "approved");
  return (
    <div>
      <section className="mx-auto max-w-6xl px-4 py-16 md:py-24">
        <p className="font-mono text-xs uppercase tracking-widest text-brand-500">{APP_CONFIG.tagline}</p>
        <h1 className="mt-4 text-4xl font-semibold md:text-5xl">Ship. Showcase. Get discovered.</h1>
        <p className="mt-4 max-w-2xl text-lg text-text-muted">One project a day. A living portfolio at <span className="font-mono text-sm">/u/username</span>.</p>
        <div className="mt-8 flex gap-3">
          <Link href="/discover" className="rounded-md bg-brand-600 px-4 py-2 text-white hover:bg-brand-700">Browse {count ?? 0} projects</Link>
          <Link href="/register" className="rounded-md border border-border px-4 py-2 hover:border-border-strong">Join a challenge</Link>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-4 pb-24">
        <h2 className="text-2xl font-semibold">Featured</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(featured ?? []).map((p) => <ProjectCard key={p.slug as string} project={p as never} />)}
          {(featured ?? []).length === 0 && <p className="text-text-subtle">No featured projects yet.</p>}
        </div>
      </section>
    </div>
  );
}
