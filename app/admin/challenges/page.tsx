import Link from "next/link";
import { createServerSupabase } from "@/lib/supabase/server";

export default async function AdminChallenges(): Promise<React.JSX.Element> {
  const supabase = createServerSupabase();
  const { data } = await supabase.from("challenges").select("slug,title,status").order("created_at", { ascending: false });
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-semibold">All challenges</h1>
      <ul className="mt-6 space-y-2">
        {(data ?? []).map((c) => <li key={c.slug as string} className="rounded-md border border-border px-4 py-3"><Link className="underline" href={`/c/${c.slug as string}`}>{c.title as string}</Link> <span className="font-mono text-xs text-text-subtle">{c.status as string}</span></li>)}
      </ul>
    </div>
  );
}
