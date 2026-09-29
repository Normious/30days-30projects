// cleanup-orphans Edge Function: nightly screenshot orphan + expired invite cleanup (SPEC §26.13).
import { serve } from "https://deno.land/std@0.208.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (_req: Request): Promise<Response> => {
  const supabase = createClient(Deno.env.get("SUPABASE_URL") ?? "", Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "");
  // Expired unused invites
  const { data: expired } = await supabase.from("challenge_invites").select("id").lt("expires_at", new Date().toISOString()).is("used_at", null);
  for (const row of expired ?? []) await supabase.from("challenge_invites").delete().eq("id", (row as { id: string }).id);
  // Orphan screenshots: storage objects not referenced by any project (best-effort, batched)
  const { data: objects } = await supabase.storage.from("screenshots").list("", { limit: 1000 });
  const { data: projects } = await supabase.from("projects").select("screenshot_url");
  const referenced = new Set((projects ?? []).map((p) => (p as { screenshot_url: string }).screenshot_url));
  let removed = 0;
  for (const obj of objects ?? []) {
    const { data } = supabase.storage.from("screenshots").getPublicUrl((obj as { name: string }).name);
    if (!referenced.has(data.publicUrl)) {
      await supabase.storage.from("screenshots").remove([(obj as { name: string }).name]);
      removed++;
    }
  }
  return new Response(JSON.stringify({ ok: true, invitesCleaned: expired?.length ?? 0, orphansRemoved: removed }), { headers: { "Content-Type": "application/json" } });
});
