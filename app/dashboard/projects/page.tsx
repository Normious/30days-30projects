import Link from "next/link";
import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";
import { getSessionUser } from "@/lib/auth";

export default async function MyProjects(): Promise<React.JSX.Element> {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  const supabase = createServerSupabase();
  const { data } = await supabase.from("project_authors").select("projects(id,slug,title,status)").eq("user_id", user.id);
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold">My projects</h1>
        <Link href="/dashboard/projects/new" className="rounded-md bg-brand-600 px-4 py-2 text-white">New</Link>
      </div>
      <ul className="mt-6 space-y-2">
        {(data ?? []).map((row) => {
          const p = (row as { projects: { id: string; slug: string; title: string; status: string } }).projects;
          return (
            <li key={p.id} className="flex items-center justify-between rounded-md border border-border px-4 py-3">
              <span>{p.title} <span className="ml-2 font-mono text-xs text-text-subtle">{p.status}</span></span>
              <Link className="text-sm underline" href={`/dashboard/projects/${p.id}/edit`}>Edit</Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
