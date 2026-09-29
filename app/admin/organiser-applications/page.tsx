import Link from "next/link";
import { createServerSupabase } from "@/lib/supabase/server";

export default async function OrganiserApplications(): Promise<React.JSX.Element> {
  const supabase = await createServerSupabase();
  const { data } = await supabase.from("organiser_applications").select("id,planned_challenge_title,status,created_at,profiles!organiser_applications_applicant_id_fkey(display_name)").eq("status", "pending").order("created_at", { ascending: true });
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
      <h1 className="text-3xl font-semibold tracking-tight">Organiser applications</h1>
      <p className="mt-2 text-text-muted">Oldest first — every application deserves a timely review.</p>
      <ul className="mt-6 divide-y divide-border rounded-md border border-border">
        {(data ?? []).map((a: { id: string; planned_challenge_title: string; status: string }) => (
          <li key={a.id as string} className="flex items-center justify-between gap-3 px-4 py-3 transition-colors hover:bg-bg-subtle">
            <span className="min-w-0 truncate">{a.planned_challenge_title as string} <span className="font-mono text-xs uppercase tracking-widest text-accent-amber">{a.status as string}</span></span>
            <Link className="shrink-0 text-sm text-text-muted hover:text-text" href={`/admin/organiser-applications/${a.id as string}`}>Review</Link>
          </li>
        ))}
        {(data ?? []).length === 0 && <li className="px-4 py-8 text-center text-sm text-text-subtle">No pending applications.</li>}
      </ul>
    </div>
  );
}
