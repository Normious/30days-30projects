import Link from "next/link";
import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";
import { getSessionUser } from "@/lib/auth";

export default async function MyChallenges(): Promise<React.JSX.Element> {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  const supabase = createServerSupabase();
  const { data } = await supabase.from("challenge_participants").select("challenges(slug,title,status)").eq("user_id", user.id);
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-semibold">My challenges</h1>
      <ul className="mt-6 space-y-2">
        {(data ?? []).map((row, i) => {
          const c = (row as { challenges: { slug: string; title: string; status: string } }).challenges;
          return <li key={i} className="rounded-md border border-border px-4 py-3"><Link className="underline" href={`/c/${c.slug}`}>{c.title}</Link> <span className="font-mono text-xs text-text-subtle">{c.status}</span></li>;
        })}
      </ul>
    </div>
  );
}
