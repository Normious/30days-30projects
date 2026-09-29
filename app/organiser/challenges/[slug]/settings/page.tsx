import { createServerSupabase } from "@/lib/supabase/server";
import { getSessionUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { OrganiserSettings } from "@/components/organiser-settings";

export default async function ChallengeSettings({ params }: { params: { slug: string } }): Promise<React.JSX.Element> {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  const supabase = createServerSupabase();
  const { data: challenge } = await supabase.from("challenges").select("id,title,primary_organiser_id").eq("slug", params.slug).single();
  if (!challenge) redirect("/organiser/challenges");
  const c = challenge as { id: string; title: string; primary_organiser_id: string | null };
  const isPrimary = c.primary_organiser_id === user.id || user.role === "admin";
  const { data: rows } = await supabase.from("challenge_participants").select("user_id,is_primary,profiles(username)").eq("challenge_id", c.id).eq("role", "organiser");
  const organisers = (rows ?? []).map((r) => ({ user_id: (r as { user_id: string }).user_id, is_primary: (r as { is_primary: boolean }).is_primary, username: ((r as { profiles: { username: string } }).profiles)?.username ?? "" }));
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-semibold">Organisers — {c.title}</h1>
      {!isPrimary && <p className="mt-2 text-sm text-text-muted">Primary-only management. You can leave but not manage others.</p>}
      <div className="mt-6"><OrganiserSettings challengeId={c.id} organisers={organisers} isPrimary={isPrimary} /></div>
    </div>
  );
}
