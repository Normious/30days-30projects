import Link from "next/link";
import { createServerSupabase } from "@/lib/supabase/server";

export default async function AdminChallenges(): Promise<React.JSX.Element> {
  const supabase = await createServerSupabase();
  const { data } = await supabase.from("challenges").select("slug,title,status").order("created_at", { ascending: false });
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
      <h1 className="text-3xl font-semibold tracking-tight">All challenges</h1>
      <ul className="mt-6 divide-y divide-border rounded-md border border-border">
        {(data ?? []).map((c: { slug: string; title: string; status: string }) => <li key={c.slug as string} className="px-4 py-3 transition-colors hover:bg-bg-subtle"><Link className="underline underline-offset-4" href={`/c/${c.slug as string}`}>{c.title as string}</Link> <span className="font-mono text-xs uppercase tracking-widest text-brand-500">{c.status as string}</span></li>)}
      </ul>
    </div>
  );
}
