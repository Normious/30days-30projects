import Link from "next/link";
import { createServerSupabase } from "@/lib/supabase/server";

export default async function AdminHome(): Promise<React.JSX.Element> {
  const supabase = createServerSupabase();
  const [{ count: pending }, { count: users }, { count: challenges }, { count: apps }] = await Promise.all([
    supabase.from("projects").select("id", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("profiles").select("id", { count: "exact", head: true }),
    supabase.from("challenges").select("id", { count: "exact", head: true }),
    supabase.from("organiser_applications").select("id", { count: "exact", head: true }).eq("status", "pending"),
  ]);
  const cards: [string, string, number | null][] = [["Moderation queue", "/admin/projects", pending], ["Challenges", "/admin/challenges", challenges], ["Users", "/admin/users", users], ["Organiser applications", "/admin/organiser-applications", apps]];
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-semibold">Admin</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {cards.map(([label, href, v]) => <Link key={href} href={href} className="rounded-md border border-border p-5 hover:border-border-strong"><p className="font-mono text-2xl">{v ?? 0}</p><p className="text-sm text-text-muted">{label}</p></Link>)}
      </div>
      <Link href="/admin/import" className="mt-6 inline-block rounded-md border border-border px-4 py-2">Bulk import</Link>
    </div>
  );
}
