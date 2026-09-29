import Link from "next/link";

export type ChallengeSummary = { slug: string; title: string; tagline: string | null; status: string; start_date: string; end_date: string };

export function ChallengeCard({ challenge }: { challenge: ChallengeSummary }): React.JSX.Element {
  return (
    <Link href={`/c/${challenge.slug}`} className="rounded-md border border-border bg-bg-subtle p-5 hover:border-border-strong">
      <p className="font-mono text-xs uppercase tracking-widest text-brand-500">{challenge.status}</p>
      <h3 className="mt-1 text-xl font-medium">{challenge.title}</h3>
      {challenge.tagline && <p className="mt-1 text-sm text-text-muted">{challenge.tagline}</p>}
      <p className="mt-2 font-mono text-xs text-text-subtle">{challenge.start_date} → {challenge.end_date}</p>
    </Link>
  );
}
