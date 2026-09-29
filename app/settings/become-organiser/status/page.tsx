import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";
import { getSessionUser } from "@/lib/auth";
import { ApplicationStatusCard } from "@/components/application-status-card";

export default async function ApplicationStatus(): Promise<React.JSX.Element> {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  const supabase = await createServerSupabase();
  const { data } = await supabase.from("organiser_applications").select("*").eq("applicant_id", user.id).order("created_at", { ascending: false }).limit(1).single();
  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-3xl font-semibold">Application status</h1>
      <div className="mt-6"><ApplicationStatusCard application={data as never} /></div>
    </div>
  );
}
