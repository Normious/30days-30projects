import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { clsx } from "clsx";
import { createServerSupabase } from "@/lib/supabase/server";
import { ChallengeCard } from "@/components/challenge-card";
import { Button, EmptyState } from "@/components/ui";
import { Reveal } from "@/components/reveal";

const TABS = [
  { value: "", label: "All" },
  { value: "active", label: "Active" },
  { value: "upcoming", label: "Upcoming" },
  { value: "completed", label: "Completed" },
] as const;

type Props = { searchParams: Promise<{ status?: string }> };

export default async function Challenges({ searchParams }: Props): Promise<React.JSX.Element> {
  const sp = await searchParams;
  const tab = TABS.some((t) => t.value === sp.status) ? (sp.status ?? "") : "";
  const supabase = await createServerSupabase();
  let query = supabase
    .from("challenges")
    .select("id,slug,title,tagline,status,start_date,end_date", { count: "exact" })
    .neq("status", "draft")
    .order("start_date", { ascending: false });
  if (tab) query = query.eq("status", tab);
  const { data, count } = await query;
  const rows = ((data ?? []) as { id: string; slug: string; title: string; tagline: string | null; status: string; start_date: string; end_date: string }[]);

  const spotlight = tab === "" ? (rows.find((c) => c.status === "active") ?? rows[0]) : undefined;
  const rest = spotlight ? rows.filter((c) => c.slug !== spotlight.slug) : rows;
  const [{ count: submissions }, { count: makers }] = spotlight
    ? await Promise.all([
        supabase.from("projects").select("id", { count: "exact", head: true }).eq("challenge_id", spotlight.id).eq("status", "approved"),
        supabase.from("challenge_participants").select("id", { count: "exact", head: true }).eq("challenge_id", spotlight.id).eq("role", "participant"),
      ])
    : [{ count: 0 }, { count: 0 }];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
      <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Challenges</h1>
      <p className="mt-2 text-text-muted">
        <span className="font-mono tabular-nums text-text">{count ?? 0}</span> {count === 1 ? "challenge" : "challenges"} on the board
      </p>

      <div className="mt-6 flex gap-1 border-b border-border" role="tablist" aria-label="Filter by status">
        {TABS.map((t) => {
          const active = tab === t.value;
          const href = t.value ? `/challenges?status=${t.value}` : "/challenges";
          return (
            <Link
              key={t.value}
              role="tab"
              aria-selected={active}
              href={href}
              className={clsx(
                "-mb-px border-b-2 px-3 py-2 text-sm transition-colors",
                active ? "border-brand-500 text-text" : "border-transparent text-text-muted hover:text-text",
              )}
            >
              {t.label}
            </Link>
          );
        })}
      </div>

      {spotlight && (
        <Reveal>
          <div className="relative mt-6 overflow-hidden rounded-lg border border-border bg-bg-subtle p-6 md:p-10">
            <div aria-hidden className="pointer-events-none absolute -top-24 right-0 h-48 w-96 rounded-full bg-brand-600/15 blur-3xl" />
            <p className="font-mono text-xs uppercase tracking-widest text-brand-500">{spotlight.status} · {spotlight.start_date} → {spotlight.end_date}</p>
            <h2 className="mt-2 max-w-2xl text-balance text-2xl font-semibold tracking-tight md:text-4xl">{spotlight.title}</h2>
            {spotlight.tagline && <p className="mt-2 max-w-[60ch] text-text-muted">{spotlight.tagline}</p>}
            <dl className="mt-5 flex gap-8">
              {[[String(submissions ?? 0), "submissions"], [String(makers ?? 0), "makers"]].map(([v, l]) => (
                <div key={l}>
                  <dd className="font-mono text-xl tabular-nums">{v}</dd>
                  <dt className="mt-0.5 text-sm text-text-subtle">{l}</dt>
                </div>
              ))}
            </dl>
            <div className="mt-6">
              <Button href={`/c/${spotlight.slug}`}>View challenge <ArrowRight size={16} className="ml-1" /></Button>
            </div>
          </div>
        </Reveal>
      )}

      {rest.length > 0 ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {rest.map((c, i) => <Reveal key={c.slug} delay={Math.min(i, 3) * 0.06}><ChallengeCard challenge={c} /></Reveal>)}
        </div>
      ) : !spotlight ? (
        <div className="mt-6">
          <EmptyState
            title={tab ? `No ${tab} challenges` : "No challenges yet"}
            hint={tab ? "Try another status — or check back when the next one opens." : "Be the first to run one."}
            action={<Button href="/organiser/challenges/new" variant="outline">Create a challenge</Button>}
          />
        </div>
      ) : null}
    </div>
  );
}
