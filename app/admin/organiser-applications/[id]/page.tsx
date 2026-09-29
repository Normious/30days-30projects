import { createServerSupabase } from "@/lib/supabase/server";
import { ApplicationReview } from "@/components/application-review";
import { redirect } from "next/navigation";

export default async function ApplicationDetail({ params }: { params: Promise<{ id: string }> }): Promise<React.JSX.Element> {
  const supabase = await createServerSupabase();
  const { data } = await supabase.from("organiser_applications").select("*").eq("id", (await params).id).single();
  if (!data) redirect("/admin/organiser-applications");
  const a = data as { id: string; motivation: string; planned_challenge_title: string; planned_challenge_description: string; status: string };
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 md:py-14">
      <h1 className="max-w-xl text-balance text-3xl font-semibold tracking-tight">{a.planned_challenge_title}</h1>
      <p className="mt-2 font-mono text-xs uppercase tracking-widest text-accent-amber">{a.status}</p>
      <p className="mt-4 max-w-[65ch] leading-relaxed">{a.motivation}</p>
      <p className="mt-3 max-w-[65ch] leading-relaxed text-text-muted">{a.planned_challenge_description}</p>
      <ApplicationReview id={a.id} />
    </div>
  );
}
