import { createServerSupabase } from "@/lib/supabase/server";
import { ProjectGrid } from "@/components/project-grid";
import { SearchBar } from "@/components/search-bar";
import { Filters } from "@/components/filters";

type Props = { searchParams: { q?: string; tech?: string; category?: string } };

export default async function Discover({ searchParams }: Props): Promise<React.JSX.Element> {
  const supabase = createServerSupabase();
  let query = supabase.from("projects").select("slug,title,description,screenshot_url,tech_stack,view_count").eq("status", "approved").order("created_at", { ascending: false }).limit(60);
  if (searchParams.q) query = query.textSearch("search_vector", searchParams.q);
  if (searchParams.category) query = query.eq("category", searchParams.category);
  if (searchParams.tech) query = query.contains("tech_stack", [searchParams.tech]);
  const { data } = await query;
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-semibold">Discover</h1>
      <div className="mt-6 flex flex-col gap-3 md:flex-row">
        <SearchBar defaultValue={searchParams.q ?? ""} />
        <Filters tech={searchParams.tech ?? ""} category={searchParams.category ?? ""} />
      </div>
      <div className="mt-8"><ProjectGrid projects={(data ?? []) as never} /></div>
    </div>
  );
}
