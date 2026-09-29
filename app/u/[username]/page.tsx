import { notFound } from "next/navigation";
import Image from "next/image";
import { createServerSupabase } from "@/lib/supabase/server";
import { ProjectGrid } from "@/components/project-grid";
import { ProfileCard } from "@/components/profile-card";

export async function generateMetadata({ params }: { params: { username: string } }): Promise<{ title: string; description: string }> {
  const supabase = createServerSupabase();
  const { data } = await supabase.from("profiles").select("display_name,bio").eq("username", params.username).single();
  if (!data) return { title: "Not found", description: "" };
  return { title: (data.display_name as string) ?? params.username, description: (data.bio as string) ?? "" };
}

export default async function Portfolio({ params }: { params: { username: string } }): Promise<React.JSX.Element> {
  const supabase = createServerSupabase();
  const { data: profile } = await supabase.from("profiles").select("*").eq("username", params.username).single();
  if (!profile) notFound();
  const p = profile as { id: string; display_name: string; bio: string | null; avatar_url: string | null; linkedin_url: string | null; github_url: string | null; website_url: string | null; location: string | null };
  const { data: links } = await supabase.from("project_authors").select("projects(slug,title,description,screenshot_url,tech_stack,view_count,status)").eq("user_id", p.id);
  const projects = (links ?? []).map((l) => (l as { projects: unknown }).projects).filter((x) => (x as { status: string }).status === "approved");
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex items-start gap-4">
        {p.avatar_url && <Image src={p.avatar_url} alt={`${p.display_name} avatar`} width={80} height={80} className="rounded-full" />}
        <div>
          <h1 className="text-3xl font-semibold">{p.display_name}</h1>
          {p.bio && <p className="mt-1 text-text-muted">{p.bio}</p>}
          <ProfileCard profile={p as never} />
        </div>
      </div>
      <h2 className="mt-10 text-2xl font-semibold">Projects</h2>
      <div className="mt-4"><ProjectGrid projects={projects as never} /></div>
    </div>
  );
}
