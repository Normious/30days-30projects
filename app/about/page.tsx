import Link from "next/link";
import { Rocket, CalendarCheck, Telescope, ArrowRight } from "lucide-react";
import { createServerSupabase } from "@/lib/supabase/server";
import { APP_CONFIG } from "@/lib/constants";
import { Badge, Button } from "@/components/ui";
import { Reveal } from "@/components/reveal";

const PILLARS = [
  {
    icon: Rocket,
    title: "Participants",
    body: "Join a challenge, ship a project a day, and keep a permanent portfolio at /u/username.",
  },
  {
    icon: CalendarCheck,
    title: "Organisers",
    body: "Run your own challenge, invite makers, curate submissions, and feature the best work.",
  },
  {
    icon: Telescope,
    title: "Visitors",
    body: "Discover talent the honest way — through shipped work, not résumés.",
  },
];

const FORK_POINTS = [
  ["MIT licensed", "Maximum freedom to reuse and remix."],
  ["$0 to run", "Supabase + Vercel free tiers cover the whole stack."],
  ["Rebrand in minutes", "One config file: name, tagline, color."],
];

export default async function About(): Promise<React.JSX.Element> {
  const supabase = await createServerSupabase();
  const [{ count: projects }, { count: makers }, { count: challenges }] = await Promise.all([
    supabase.from("projects").select("id", { count: "exact", head: true }).eq("status", "approved"),
    supabase.from("profiles").select("id", { count: "exact", head: true }),
    supabase.from("challenges").select("id", { count: "exact", head: true }).neq("status", "draft"),
  ]);
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute -top-40 left-1/2 h-96 w-[60rem] -translate-x-1/2 rounded-full bg-brand-600/15 blur-3xl" />
        <div className="relative mx-auto max-w-6xl px-4 pb-14 pt-20 md:pt-24">
          <Badge>Open source · MIT</Badge>
          <h1 className="mt-4 max-w-2xl text-balance text-4xl font-semibold leading-none tracking-tighter md:text-6xl">
            Built in the open, for every community.
          </h1>
          <p className="mt-4 max-w-[52ch] text-lg leading-relaxed text-text-muted">
            A free, forkable home for developer challenges — yours included.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/discover">Browse projects <ArrowRight size={16} className="ml-1" /></Button>
            <Button href={APP_CONFIG.repoUrl} variant="outline">Star on GitHub</Button>
          </div>
          <dl className="mt-10 flex gap-8">
            {[[String(projects ?? 0), "projects shipped"], [String(makers ?? 0), "makers"], [String(challenges ?? 0), "challenges"]].map(([v, l]) => (
              <div key={l}>
                <dd className="font-mono text-2xl tabular-nums">{v}</dd>
                <dt className="mt-1 text-sm text-text-subtle">{l}</dt>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Pillars — who it's for */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-24">
          <Reveal><h2 className="text-2xl font-semibold tracking-tight md:text-3xl">Who it serves</h2></Reveal>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {PILLARS.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.06}>
                <div className="h-full rounded-md border border-border bg-bg-subtle p-6 transition-all duration-150 ease-out hover:-translate-y-0.5 hover:border-border-strong">
                  <p.icon size={20} className="text-brand-500" aria-hidden />
                  <h3 className="mt-3 text-xl font-medium tracking-tight">{p.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-text-muted">{p.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Fork strip — divided list */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-24">
          <Reveal><h2 className="text-2xl font-semibold tracking-tight md:text-3xl">Fork it in an afternoon</h2></Reveal>
          <ol className="mt-8 divide-y divide-border border-y border-border">
            {FORK_POINTS.map(([title, body]) => (
              <li key={title} className="grid gap-1 py-5 sm:grid-cols-[1fr_2fr] sm:items-baseline">
                <span className="font-medium">{title}</span>
                <span className="text-sm text-text-muted">{body}</span>
              </li>
            ))}
          </ol>
          <p className="mt-6 text-sm text-text-muted">
            Full guide in the repo — <Link className="underline underline-offset-4 hover:text-text" href={`${APP_CONFIG.repoUrl}#readme`}>deployment docs</Link>.
          </p>
        </div>
      </section>

      {/* CTA panel */}
      <section className="mx-auto max-w-6xl px-4 pb-16 md:pb-24">
        <Reveal>
          <div className="relative overflow-hidden rounded-lg border border-border bg-bg-subtle px-6 py-12 text-center md:py-16">
            <div aria-hidden className="pointer-events-none absolute -top-24 left-1/2 h-48 w-[36rem] -translate-x-1/2 rounded-full bg-brand-600/20 blur-3xl" />
            <h2 className="relative mx-auto max-w-md text-balance text-2xl font-semibold tracking-tight md:text-3xl">
              Stop linking repos. Start showing work.
            </h2>
            <div className="relative mt-6 flex flex-wrap justify-center gap-3">
              <Button href="/register">Claim your portfolio</Button>
              <Button href="/challenges" variant="outline">Find a challenge</Button>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
