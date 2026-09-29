import Link from "next/link";

export type ChallengeSummary = { slug: string; title: string; tagline: string | null; status: string; start_date: string; end_date: string };

export function ChallengeCard({ challenge }: { challenge: ChallengeSummary }): React.JSX.Element {
  return (
    <Link
      href={`/c/${challenge.slug}`}
      className="block rounded-md border border-border bg-bg-subtle p-5 transition-all duration-150 ease-out hover:-translate-y-0.5 hover:border-border-strong active:translate-y-0 active:scale-[0.99]"
    >
      <p className="font-mono text-xs uppercase tracking-widest text-brand-500">{challenge.status}</p>
      <h3 className="mt-1 text-balance text-xl font-medium tracking-tight">{challenge.title}</h3>
      {challenge.tagline && <p className="mt-1 text-sm text-text-muted">{challenge.tagline}</p>}
      <p className="mt-3 font-mono text-xs tabular-nums text-text-subtle">{challenge.start_date} → {challenge.end_date}</p>
    </Link>
  );
}
