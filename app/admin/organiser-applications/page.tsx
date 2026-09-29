import Link from "next/link";
import { createServerSupabase } from "@/lib/supabase/server";

export default async function OrganiserApplications(): Promise<React.JSX.Element> {
  const supabase = createServerSupabase();
  const { data } = await supabase.from("organiser_applications").select("id,planned_challenge_title,status,created_at,profiles!organiser_applications_applicant_id_fkey(display_name)").eq("status", "pending").order("created_at", { ascending: true });
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-semibold">Organiser applications</h1>
      <ul className="mt-6 space-y-2">
        {(data ?? []).map((a) => (
          <li key={a.id as string} className="flex items-center justify-between rounded-md border border-border px-4 py-3">
            <span>{a.planned_challenge_title as string} <span className="font-mono text-xs text-text-subtle">{a.status as string}</span></span>
            <Link className="text-sm underline" href={`/admin/organiser-applications/${a.id as string}`}>Review</Link>
          </li>
        ))}
        {(data ?? []).length === 0 && <p className="text-text-subtle">No pending applications.</p>}
      </ul>
    </div>
  );
}
