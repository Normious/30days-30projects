import Link from "next/link";
import { createServerSupabase } from "@/lib/supabase/server";
import { getSessionUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function OrganiserChallenges(): Promise<React.JSX.Element> {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  const supabase = await createServerSupabase();
  const { data } = await supabase.from("challenge_participants").select("challenges(slug,title,status)").eq("user_id", user.id).eq("role", "organiser");
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
      <div className="flex flex-wrap items-center justify-between gap-3"><div><h1 className="text-3xl font-semibold tracking-tight md:text-4xl">My challenges</h1><p className="mt-1 font-mono text-sm tabular-nums text-text-subtle">{(((data ?? []) as { challenges: { slug: string } }[]).length)} total</p></div><Link href="/organiser/challenges/new" className="rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white transition-all duration-150 ease-out hover:bg-brand-700 active:translate-y-[1px]">New</Link></div>
      <ul className="mt-6 divide-y divide-border rounded-md border border-border">
        {(((data ?? []) as { challenges: { slug: string; title: string; status: string } }[]).map((r, i) => {
          const c = r.challenges;
          return (
            <li key={i} className="flex flex-col gap-2 px-4 py-3 transition-colors hover:bg-bg-subtle sm:flex-row sm:items-center sm:justify-between">
              <span className="font-medium">{c.title} <span className="font-mono text-xs uppercase tracking-widest text-brand-500">{c.status}</span></span>
              <span className="flex shrink-0 gap-3 text-sm">
                <Link className="text-text-muted hover:text-text" href={`/organiser/challenges/${c.slug}/moderation`}>Moderate</Link>
                <Link className="text-text-muted hover:text-text" href={`/organiser/challenges/${c.slug}/analytics`}>Analytics</Link>
                <Link className="underline underline-offset-4" href={`/organiser/challenges/${c.slug}/settings`}>Settings</Link>
              </span>
            </li>
          );
        }))}
      </ul>
    </div>
  );
}
