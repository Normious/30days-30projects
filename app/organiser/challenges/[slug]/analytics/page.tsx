import { createServerSupabase } from "@/lib/supabase/server";

export default async function Analytics({ params }: { params: Promise<{ slug: string }> }): Promise<React.JSX.Element> {
  const supabase = await createServerSupabase();
  const { data: challenge } = await supabase.from("challenges").select("id,title").eq("slug", (await params).slug).single();
  const c = challenge as { id: string; title: string } | null;
  const [{ count: total }, { count: approved }, { count: pending }, { count: participants }] = c ? await Promise.all([
    supabase.from("projects").select("id", { count: "exact", head: true }).eq("challenge_id", c.id),
    supabase.from("projects").select("id", { count: "exact", head: true }).eq("challenge_id", c.id).eq("status", "approved"),
    supabase.from("projects").select("id", { count: "exact", head: true }).eq("challenge_id", c.id).eq("status", "pending"),
    supabase.from("challenge_participants").select("id", { count: "exact", head: true }).eq("challenge_id", c.id).eq("role", "participant"),
  ]) : [{ count: 0 }, { count: 0 }, { count: 0 }, { count: 0 }];
  const cards: [string, number | null][] = [["Total projects", total], ["Approved", approved], ["Pending", pending], ["Participants", participants]];
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
      <h1 className="max-w-3xl text-balance text-3xl font-semibold tracking-tight">Analytics — {c?.title ?? (await params).slug}</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-4">
        {cards.map(([label, v]) => <div key={label} className="rounded-md border border-border bg-bg-subtle p-5"><p className="font-mono text-2xl tabular-nums">{v ?? 0}</p><p className="mt-1 text-sm text-text-muted">{label}</p></div>)}
      </div>
    </div>
  );
}
