import Link from "next/link";
import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";
import { getSessionUser } from "@/lib/auth";

export default async function Dashboard(): Promise<React.JSX.Element> {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  const supabase = createServerSupabase();
  const { count: projects } = await supabase.from("project_authors").select("id", { count: "exact", head: true }).eq("user_id", user.id);
  const { count: challenges } = await supabase.from("challenge_participants").select("id", { count: "exact", head: true }).eq("user_id", user.id);
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-semibold">Dashboard</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-md border border-border p-5"><p className="font-mono text-2xl">{projects ?? 0}</p><p className="text-sm text-text-muted">Projects</p></div>
        <div className="rounded-md border border-border p-5"><p className="font-mono text-2xl">{challenges ?? 0}</p><p className="text-sm text-text-muted">Challenges</p></div>
        <div className="rounded-md border border-border p-5"><p className="font-mono text-2xl capitalize">{user.role}</p><p className="text-sm text-text-muted">Role</p></div>
      </div>
      <div className="mt-6 flex gap-3">
        <Link href="/dashboard/projects/new" className="rounded-md bg-brand-600 px-4 py-2 text-white">Submit project</Link>
        <Link href="/dashboard/projects" className="rounded-md border border-border px-4 py-2">My projects</Link>
        <Link href="/dashboard/challenges" className="rounded-md border border-border px-4 py-2">My challenges</Link>
      </div>
    </div>
  );
}
