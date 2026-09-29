import { createServerSupabase } from "@/lib/supabase/server";
import { ApplicationReview } from "@/components/application-review";
import { redirect } from "next/navigation";

export default async function ApplicationDetail({ params }: { params: { id: string } }): Promise<React.JSX.Element> {
  const supabase = createServerSupabase();
  const { data } = await supabase.from("organiser_applications").select("*").eq("id", params.id).single();
  if (!data) redirect("/admin/organiser-applications");
  const a = data as { id: string; motivation: string; planned_challenge_title: string; planned_challenge_description: string; status: string };
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-semibold">{a.planned_challenge_title}</h1>
      <p className="mt-2 font-mono text-xs uppercase text-text-subtle">{a.status}</p>
      <p className="mt-4">{a.motivation}</p>
      <p className="mt-2 text-text-muted">{a.planned_challenge_description}</p>
      <ApplicationReview id={a.id} />
    </div>
  );
}
