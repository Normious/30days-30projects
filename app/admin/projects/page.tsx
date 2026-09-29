import { createServerSupabase } from "@/lib/supabase/server";
import { ModerationQueue } from "@/components/moderation-queue";

export default async function AdminProjects({ searchParams }: { searchParams: { status?: string } }): Promise<React.JSX.Element> {
  const supabase = createServerSupabase();
  const status = searchParams.status ?? "pending";
  const { data } = await supabase.from("projects").select("id,title,description,slug").eq("status", status).limit(100);
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-semibold">Moderation — {status}</h1>
      <div className="mt-6"><ModerationQueue projects={(data ?? []) as never} challengeSlug="" /></div>
    </div>
  );
}
