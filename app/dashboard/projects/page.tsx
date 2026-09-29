import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";
import { getSessionUser } from "@/lib/auth";
import { Button, Badge, EmptyState } from "@/components/ui";

const STATUS_TONE: Record<string, string> = {
  approved: "text-accent-emerald",
  pending: "text-accent-amber",
  rejected: "text-accent-rose",
};

export default async function MyProjects(): Promise<React.JSX.Element> {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  const supabase = await createServerSupabase();
  const { data } = await supabase.from("project_authors").select("projects(id,slug,title,status)").eq("user_id", user.id);
  const rows = (((data ?? []) as { projects: { id: string; slug: string; title: string; status: string } }[]).map((row) => row.projects));
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">My projects</h1>
          <p className="mt-1 font-mono text-sm tabular-nums text-text-subtle">{rows.length} submitted</p>
        </div>
        <Button href="/dashboard/projects/new">New project</Button>
      </div>
      {rows.length > 0 ? (
        <ul className="mt-6 divide-y divide-border rounded-md border border-border">
          {rows.map((p) => (
            <li key={p.id} className="flex items-center justify-between gap-3 px-4 py-3 transition-colors hover:bg-bg-subtle">
              <span className="min-w-0 truncate">{p.title} <Badge><span className={STATUS_TONE[p.status] ?? ""}>{p.status}</span></Badge></span>
              <span className="flex shrink-0 gap-3 text-sm">
                {p.status === "approved" && <a className="text-text-muted hover:text-text" href={`/p/${p.slug}`}>View</a>}
                <a className="underline underline-offset-4" href={`/dashboard/projects/${p.id}/edit`}>Edit</a>
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-6">
          <EmptyState
            title="No projects yet"
            hint="Submit your first project — it goes live here and on your portfolio once approved."
            action={<Button href="/dashboard/projects/new">Submit a project</Button>}
          />
        </div>
      )}
    </div>
  );
}
