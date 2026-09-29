import { APP_CONFIG } from "@/lib/constants";

export default function About(): React.JSX.Element {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-semibold">About {APP_CONFIG.displayName}</h1>
      <p className="mt-4 text-text-muted">An open-source, multi-challenge portfolio and submission platform. Participants join challenges, submit projects, and get a permanent portfolio page. Organisers run challenges and curate submissions. Visitors discover talent.</p>
      <p className="mt-4 text-text-muted">Fork it for your own community — MIT licensed, deployable to Vercel + Supabase free tiers.</p>
    </div>
  );
}
