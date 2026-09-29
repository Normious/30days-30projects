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
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex items-center justify-between"><h1 className="text-3xl font-semibold">My challenges</h1><Link href="/organiser/challenges/new" className="rounded-md bg-brand-600 px-4 py-2 text-white">New</Link></div>
      <ul className="mt-6 space-y-2">
        {(((data ?? []) as { challenges: { slug: string; title: string; status: string } }[]).map((r, i) => {
          const c = r.challenges;
          return (
            <li key={i} className="flex items-center justify-between rounded-md border border-border px-4 py-3">
              <span>{c.title} <span className="font-mono text-xs text-text-subtle">{c.status}</span></span>
              <span className="flex gap-2 text-sm">
                <Link className="underline" href={`/organiser/challenges/${c.slug}/moderation`}>Moderate</Link>
                <Link className="underline" href={`/organiser/challenges/${c.slug}/analytics`}>Analytics</Link>
                <Link className="underline" href={`/organiser/challenges/${c.slug}/settings`}>Settings</Link>
              </span>
            </li>
          );
        }))}
      </ul>
    </div>
  );
}
