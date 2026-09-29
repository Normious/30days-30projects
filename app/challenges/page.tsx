import Link from "next/link";
import { createServerSupabase } from "@/lib/supabase/server";
import { ChallengeCard } from "@/components/challenge-card";

export default async function Challenges(): Promise<React.JSX.Element> {
  const supabase = createServerSupabase();
  const { data } = await supabase.from("challenges").select("slug,title,tagline,status,start_date,end_date").neq("status", "draft").order("start_date", { ascending: false });
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-semibold">Challenges</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {(data ?? []).map((c) => <ChallengeCard key={c.slug as string} challenge={c as never} />)}
        {(data ?? []).length === 0 && <p className="text-text-subtle">No challenges yet. <Link className="underline" href="/organiser/challenges/new">Create one</Link>.</p>}
      </div>
    </div>
  );
}
