import Link from "next/link";
import { createServerSupabase } from "@/lib/supabase/server";
import { ChallengeCard } from "@/components/challenge-card";

export default async function Challenges(): Promise<React.JSX.Element> {
  const supabase = await createServerSupabase();
  const { data } = await supabase.from("challenges").select("slug,title,tagline,status,start_date,end_date").neq("status", "draft").order("start_date", { ascending: false });
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
      <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Challenges</h1>
      <p className="mt-2 text-text-muted">One challenge, one month, one portfolio.</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {(data ?? []).map((c: { slug: string }) => <ChallengeCard key={c.slug as string} challenge={c as never} />)}
        {(data ?? []).length === 0 && <p className="rounded-md border border-dashed border-border-strong px-6 py-12 text-center text-sm text-text-subtle">No challenges yet. <Link className="underline" href="/organiser/challenges/new">Create one</Link>.</p>}
      </div>
    </div>
  );
}
