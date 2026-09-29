import Link from "next/link";
import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";
import { getSessionUser } from "@/lib/auth";

export default async function MyChallenges(): Promise<React.JSX.Element> {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  const supabase = await createServerSupabase();
  const { data } = await supabase.from("challenge_participants").select("challenges(slug,title,status)").eq("user_id", user.id);
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
      <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">My challenges</h1>
      <p className="mt-1 font-mono text-sm tabular-nums text-text-subtle">{(data ?? []).length} joined</p>
      <ul className="mt-6 divide-y divide-border rounded-md border border-border">
        {(data ?? []).map((row: { challenges: { slug: string; title: string; status: string } }, i: number) => {
          const c = (row as { challenges: { slug: string; title: string; status: string } }).challenges;
          return <li key={i} className="px-4 py-3 transition-colors hover:bg-bg-subtle"><Link className="underline underline-offset-4" href={`/c/${c.slug}`}>{c.title}</Link> <span className="font-mono text-xs uppercase tracking-widest text-brand-500">{c.status}</span></li>;
        })}
      </ul>
    </div>
  );
}
