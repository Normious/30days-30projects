import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";
import { getSessionUser } from "@/lib/auth";

export default async function EditProject({ params }: { params: Promise<{ id: string }> }): Promise<React.JSX.Element> {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  const supabase = await createServerSupabase();
  const { data } = await supabase.from("projects").select("id,title,description,status").eq("id", (await params).id).single();
  if (!data) redirect("/dashboard/projects");
  if ((data.status as string) !== "pending") redirect("/dashboard/projects");
  return (
    <div className="mx-auto max-w-2xl px-4 py-10 md:py-14">
      <h1 className="text-3xl font-semibold tracking-tight">Edit project</h1>
      <p className="mt-2 text-sm text-text-muted">Only pending projects can be edited.</p>
      <p className="mt-4 rounded-md border border-border bg-bg-subtle p-4">{(data.title as string)} — {(data.description as string)}</p>
    </div>
  );
}
