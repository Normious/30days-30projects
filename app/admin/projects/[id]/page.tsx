import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";
import { featureProject, approveProject, rejectProject } from "@/actions/moderation";

export default async function AdminProjectDetail({ params }: { params: Promise<{ id: string }> }): Promise<React.JSX.Element> {
  const supabase = await createServerSupabase();
  const { data } = await supabase.from("projects").select("id,slug,title,description,status,featured").eq("id", (await params).id).single();
  if (!data) redirect("/admin/projects");
  const p = data as { id: string; title: string; status: string; featured: boolean };
  void featureProject; void approveProject; void rejectProject;
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-semibold">{p.title}</h1>
      <p className="font-mono text-xs uppercase text-text-subtle">{p.status}{p.featured ? " · featured" : ""}</p>
    </div>
  );
}
