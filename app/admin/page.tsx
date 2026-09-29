import Link from "next/link";
import { createServerSupabase } from "@/lib/supabase/server";

export default async function AdminHome(): Promise<React.JSX.Element> {
  const supabase = await createServerSupabase();
  const [{ count: pending }, { count: users }, { count: challenges }, { count: apps }] = await Promise.all([
    supabase.from("projects").select("id", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("profiles").select("id", { count: "exact", head: true }),
    supabase.from("challenges").select("id", { count: "exact", head: true }),
    supabase.from("organiser_applications").select("id", { count: "exact", head: true }).eq("status", "pending"),
  ]);
  const cards: [string, string, number | null][] = [["Moderation queue", "/admin/projects", pending], ["Challenges", "/admin/challenges", challenges], ["Users", "/admin/users", users], ["Organiser applications", "/admin/organiser-applications", apps]];
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
      <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Admin</h1>
      <p className="mt-2 text-text-muted">Moderate, manage, and keep the platform healthy.</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {cards.map(([label, href, v]) => <Link key={href} href={href} className="rounded-md border border-border bg-bg-subtle p-5 transition-all duration-150 ease-out hover:-translate-y-0.5 hover:border-border-strong active:translate-y-0"><p className="font-mono text-2xl tabular-nums">{v ?? 0}</p><p className="mt-1 text-sm text-text-muted">{label}</p></Link>)}
      </div>
      <Link href="/admin/import" className="mt-6 inline-block rounded-md border border-border px-4 py-2 text-sm transition-colors hover:border-border-strong active:translate-y-[1px]">Bulk import</Link>
    </div>
  );
}
