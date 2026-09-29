import Link from "next/link";
import { redirect } from "next/navigation";
import { FolderKanban, Trophy, ShieldCheck } from "lucide-react";
import { createServerSupabase } from "@/lib/supabase/server";
import { getSessionUser } from "@/lib/auth";
import { Button } from "@/components/ui";

export default async function Dashboard(): Promise<React.JSX.Element> {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  const supabase = await createServerSupabase();
  const { count: projects } = await supabase.from("project_authors").select("id", { count: "exact", head: true }).eq("user_id", user.id);
  const { count: challenges } = await supabase.from("challenge_participants").select("id", { count: "exact", head: true }).eq("user_id", user.id);
  const stats = [
    { icon: FolderKanban, value: String(projects ?? 0), label: "Projects", href: "/dashboard/projects" },
    { icon: Trophy, value: String(challenges ?? 0), label: "Challenges", href: "/dashboard/challenges" },
    { icon: ShieldCheck, value: user.role, label: "Role", href: "/settings", capitalize: true },
  ];
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
      <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Dashboard</h1>
      <p className="mt-2 text-text-muted">Your work, challenges, and progress at a glance.</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="rounded-md border border-border bg-bg-subtle p-5 transition-all duration-150 ease-out hover:-translate-y-0.5 hover:border-border-strong active:translate-y-0"
          >
            <s.icon size={18} className="text-brand-500" aria-hidden />
            <p className={`mt-3 font-mono text-2xl tabular-nums ${s.capitalize ? "capitalize" : ""}`}>{s.value}</p>
            <p className="mt-1 text-sm text-text-muted">{s.label}</p>
          </Link>
        ))}
      </div>
      <div className="mt-6 flex flex-wrap gap-3">
        <Button href="/dashboard/projects/new">Submit project</Button>
        <Button href="/dashboard/projects" variant="outline">My projects</Button>
        <Button href="/dashboard/challenges" variant="outline">My challenges</Button>
      </div>
    </div>
  );
}
