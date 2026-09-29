import Link from "next/link";
import { createServerSupabase } from "@/lib/supabase/server";
import { getSessionUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function OrganiserHome(): Promise<React.JSX.Element> {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  const supabase = createServerSupabase();
  const { data } = await supabase.from("challenge_participants").select("challenges(slug,title,status)").eq("user_id", user.id).eq("role", "organiser");
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-semibold">Organiser</h1>
      <div className="mt-4 flex gap-3">
        <Link href="/organiser/challenges" className="rounded-md border border-border px-4 py-2">My challenges</Link>
        <Link href="/organiser/challenges/new" className="rounded-md bg-brand-600 px-4 py-2 text-white">Create</Link>
      </div>
      <ul className="mt-6 space-y-2">
        {(data ?? []).map((r, i) => {
          const c = (r as { challenges: { slug: string; title: string; status: string } }).challenges;
          return <li key={i} className="rounded-md border border-border px-4 py-3"><Link className="underline" href={`/organiser/challenges/${c.slug}/moderation`}>{c.title}</Link> <span className="font-mono text-xs text-text-subtle">{c.status}</span></li>;
        })}
      </ul>
    </div>
  );
}
