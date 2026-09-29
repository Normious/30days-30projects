import { createServerSupabase } from "@/lib/supabase/server";
import { APP_CONFIG } from "@/lib/constants";

export default async function sitemap(): Promise<{ url: string; lastModified: Date }[]> {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const supabase = await createServerSupabase();
  const [{ data: projects }, { data: profiles }, { data: challenges }] = await Promise.all([
    supabase.from("projects").select("slug").eq("status", "approved").limit(1000),
    supabase.from("profiles").select("username").limit(1000),
    supabase.from("challenges").select("slug").neq("status", "draft").limit(100),
  ]);
  void APP_CONFIG;
  return [
    { url: base, lastModified: new Date() },
    { url: `${base}/discover`, lastModified: new Date() },
    ...(((projects ?? []) as { slug: string }[]).map((p) => ({ url: `${base}/p/${p.slug}`, lastModified: new Date() }))),
    ...(((profiles ?? []) as { username: string }[]).map((p) => ({ url: `${base}/u/${p.username}`, lastModified: new Date() }))),    ...(((challenges ?? []) as { slug: string }[]).map((c) => ({ url: `${base}/c/${c.slug}`, lastModified: new Date() }))),
  ];
}
