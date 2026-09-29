import Link from "next/link";
import { APP_CONFIG } from "@/lib/constants";
import { Button } from "@/components/ui";

export default function About(): React.JSX.Element {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 md:py-14">
      <h1 className="max-w-xl text-balance text-3xl font-semibold tracking-tight md:text-4xl">About {APP_CONFIG.displayName}</h1>
      <div className="mt-5 max-w-[65ch] space-y-4 leading-relaxed text-text-muted">
        <p>
          An open-source, multi-challenge portfolio and submission platform. Participants join challenges,
          submit projects, and get a permanent portfolio page. Organisers run challenges and curate
          submissions. Visitors discover talent.
        </p>
        <p>
          Fork it for your own community — MIT licensed, deployable to Vercel + Supabase free tiers.
        </p>
      </div>
      <div className="mt-8 flex flex-wrap gap-3">
        <Button href="/discover">Browse projects</Button>
        <Button href={APP_CONFIG.repoUrl} variant="outline">GitHub</Button>
        <Link href="/challenges" className="inline-flex items-center px-2 py-2 text-sm text-text-muted hover:text-text">Challenges</Link>
      </div>
    </div>
  );
}
