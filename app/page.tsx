import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { createServerSupabase } from "@/lib/supabase/server";
import { ProjectCard } from "@/components/project-card";
import { ChallengeCard } from "@/components/challenge-card";
import { Button, Badge } from "@/components/ui";
import { Reveal } from "@/components/reveal";
import { APP_CONFIG } from "@/lib/constants";

const TECH = ["React", "TypeScript", "Python", "Go", "Rust", "Tailwind", "Postgres", "Next.js"];

const STEPS = [
  { n: "01", title: "Join a challenge", body: "Pick a public challenge and join with one click." },
  { n: "02", title: "Ship daily", body: "Submit a project a day — screenshot, demo, and repo." },
  { n: "03", title: "Get discovered", body: "Approved work lands on your permanent /u/username portfolio." },
];

export default async function Home(): Promise<React.JSX.Element> {
  const supabase = await createServerSupabase();
  const [{ data: featured }, { count: projects }, { count: makers }, { data: challenges }] = await Promise.all([
    supabase.from("projects").select("slug,title,description,screenshot_url,tech_stack,view_count").eq("status", "approved").eq("featured", true).limit(3),
    supabase.from("projects").select("id", { count: "exact", head: true }).eq("status", "approved"),
    supabase.from("profiles").select("id", { count: "exact", head: true }),
    supabase.from("challenges").select("slug,title,tagline,status,start_date,end_date").neq("status", "draft").order("start_date", { ascending: false }).limit(2),
  ]);
  return (
    <div>
      {/* Hero — left-aligned split, glow behind (SPEC §8.6) */}
      <section className="relative overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute -top-40 left-1/2 h-96 w-[60rem] -translate-x-1/2 rounded-full bg-brand-600/15 blur-3xl" />
        <div className="relative mx-auto grid max-w-6xl gap-10 px-4 pb-16 pt-20 md:grid-cols-5 md:pt-24">
          <div className="md:col-span-3">
            <Badge>{APP_CONFIG.tagline}</Badge>
            <h1 className="mt-4 max-w-xl text-balance text-4xl font-semibold leading-none tracking-tighter md:text-6xl">
              Ship. Showcase. Get discovered.
            </h1>
            <p className="mt-4 max-w-[52ch] text-lg leading-relaxed text-text-muted">
              One project a day. A living portfolio at <span className="font-mono text-base text-text">/u/username</span>.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/discover">Browse projects <ArrowRight size={16} className="ml-1" /></Button>
              <Button href="/register" variant="outline">Join a challenge</Button>
            </div>
            <dl className="mt-10 flex gap-8">
              {[[String(projects ?? 0), "projects"], [String(makers ?? 0), "makers"]].map(([v, l]) => (
                <div key={l}>
                  <dt className="order-2 mt-1 text-sm text-text-subtle">{l}</dt>
                  <dd className="font-mono text-2xl tabular-nums">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="hidden md:col-span-2 md:block">
            <div className="rounded-lg border border-border bg-bg-subtle p-5 font-mono text-xs leading-relaxed text-text-muted">
              <p><span className="text-accent-emerald">$</span> ship day-12</p>
              <p>✓ screenshot uploaded</p>
              <p>✓ submitted for review</p>
              <p>✓ <span className="text-text">approved → live on /u/you</span></p>
            </div>
          </div>
        </div>
      </section>

      {/* Tech strip — single marquee, motion-safe */}
      <div className="overflow-hidden border-y border-border py-3" aria-hidden>
        <div className="flex w-max gap-8 font-mono text-xs uppercase tracking-widest text-text-subtle motion-safe:animate-[marquee_30s_linear_infinite]">
          {[...TECH, ...TECH].map((t, i) => <span key={i}>{t}</span>)}
        </div>
      </div>

      {/* Featured */}
      <section className="mx-auto max-w-6xl px-4 py-16 md:py-24">
        <Reveal>
          <div className="flex items-end justify-between">
            <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">Featured work</h2>
            <Link href="/discover" className="text-sm text-text-muted hover:text-text">View all</Link>
          </div>
        </Reveal>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(((featured ?? []) as { slug: string }[]).map((p, i) => <Reveal key={p.slug as string} delay={i * 0.06}><ProjectCard project={p as never} /></Reveal>))}
        </div>
        {(featured ?? []).length === 0 && (
          <p className="mt-6 rounded-md border border-dashed border-border-strong px-6 py-12 text-center text-sm text-text-subtle">
            No featured projects yet — curate up to 5 from <Link className="underline" href="/admin/projects">moderation</Link>.
          </p>
        )}
      </section>

      {/* How it works — divided list, no card boxes */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-24">
          <Reveal><h2 className="text-2xl font-semibold tracking-tight md:text-3xl">How it works</h2></Reveal>
          <ol className="mt-8 divide-y divide-border border-y border-border">
            {STEPS.map((s) => (
              <li key={s.n} className="grid gap-1 py-5 sm:grid-cols-[4rem_1fr_2fr] sm:items-baseline">
                <span className="font-mono text-sm text-brand-500">{s.n}</span>
                <span className="font-medium">{s.title}</span>
                <span className="text-sm text-text-muted">{s.body}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Challenges teaser */}
      {(challenges ?? []).length > 0 && (
        <section className="mx-auto max-w-6xl px-4 pb-16 md:pb-24">
          <Reveal>
            <div className="flex items-end justify-between">
              <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">Running now</h2>
              <Link href="/challenges" className="text-sm text-text-muted hover:text-text">All challenges</Link>
            </div>
          </Reveal>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {(((challenges ?? []) as { slug: string }[]).map((c) => <ChallengeCard key={c.slug as string} challenge={c as never} />))}
          </div>
        </section>
      )}

      {/* CTA band */}
      <section className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-5 px-4 py-16 md:flex-row md:items-center md:justify-between md:py-20">
          <div>
            <h2 className="max-w-md text-balance text-2xl font-semibold tracking-tight md:text-3xl">Your work deserves more than a repo link.</h2>
            <p className="mt-2 text-text-muted">Claim your portfolio URL in under a minute.</p>
          </div>
          <Button href="/register">Get started <ArrowRight size={16} className="ml-1" /></Button>
        </div>
      </section>
    </div>
  );
}
