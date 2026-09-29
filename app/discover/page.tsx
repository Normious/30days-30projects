import { createServerSupabase } from "@/lib/supabase/server";
import { ProjectGrid } from "@/components/project-grid";
import { SearchBar } from "@/components/search-bar";
import { Filters } from "@/components/filters";
import { EmptyState, Button } from "@/components/ui";

type Props = { searchParams: Promise<{ q?: string; tech?: string; category?: string }> };

export default async function Discover({ searchParams }: Props): Promise<React.JSX.Element> {
  const sp = await searchParams;
  const supabase = await createServerSupabase();
  let query = supabase.from("projects").select("slug,title,description,screenshot_url,tech_stack,view_count", { count: "exact" }).eq("status", "approved").order("created_at", { ascending: false }).limit(60);
  if (sp.q) query = query.textSearch("search_vector", sp.q);
  if (sp.category) query = query.eq("category", sp.category);
  if (sp.tech) query = query.contains("tech_stack", [sp.tech]);
  const { data, count } = await query;
  const projects = (data ?? []) as never[];
  const filtering = Boolean(sp.q ?? sp.tech ?? sp.category);
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
      <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Discover</h1>
      <p className="mt-2 text-text-muted">
        <span className="font-mono tabular-nums text-text">{count ?? 0}</span> {count === 1 ? "project" : "projects"}
        {sp.q ? <> matching <span className="text-text">“{sp.q}”</span></> : " shipped by the community"}
      </p>
      <div className="mt-6 flex flex-col gap-3 md:flex-row">
        <SearchBar defaultValue={sp.q ?? ""} />
        <Filters tech={sp.tech ?? ""} category={sp.category ?? ""} />
      </div>
      <div className="mt-8">
        {projects.length > 0 ? (
          <ProjectGrid projects={projects as never} />
        ) : (
          <EmptyState
            title={filtering ? "Nothing matches those filters" : "No projects yet"}
            hint={filtering ? "Try a different keyword or clear the tech and category filters." : "Be the first to ship — submit a project and it will appear here once approved."}
            action={filtering ? <Button href="/discover" variant="outline">Clear filters</Button> : <Button href="/dashboard/projects/new">Submit a project</Button>}
          />
        )}
      </div>
    </div>
  );
}
