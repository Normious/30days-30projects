import Link from "next/link";
import { createServerSupabase } from "@/lib/supabase/server";
import { getSessionUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function OrganiserHome(): Promise<React.JSX.Element> {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  const supabase = await createServerSupabase();
  const { data } = await supabase.from("challenge_participants").select("challenges(slug,title,status)").eq("user_id", user.id).eq("role", "organiser");
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
      <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Organiser</h1>
      <p className="mt-2 text-text-muted">Challenges you run, moderation queuing below.</p>
      <div className="mt-4 flex gap-3">
        <Link href="/organiser/challenges" className="rounded-md border border-border px-4 py-2">My challenges</Link>
        <Link href="/organiser/challenges/new" className="rounded-md bg-brand-600 px-4 py-2 text-white">Create</Link>
      </div>
      <ul className="mt-6 divide-y divide-border rounded-md border border-border">
        {(((data ?? []) as { challenges: { slug: string; title: string; status: string } }[]).map((r, i) => {
          const c = r.challenges;
          return <li key={i} className="px-4 py-3 transition-colors hover:bg-bg-subtle"><Link className="underline underline-offset-4" href={`/organiser/challenges/${c.slug}/moderation`}>{c.title}</Link> <span className="font-mono text-xs uppercase tracking-widest text-brand-500">{c.status}</span></li>;
        }))}
      </ul>
    </div>
  );
}
