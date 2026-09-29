// challenge-status Edge Function: auto upcoming→active→completed by date (SPEC §26.2).
import { serve } from "https://deno.land/std@0.208.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (): Promise<Response> => {
  const supabase = createClient(Deno.env.get("SUPABASE_URL") ?? "", Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "");
  const today = new Date().toISOString().slice(0, 10);
  const { data: toActive } = await supabase.from("challenges").update({ status: "active" }).eq("status", "upcoming").lte("start_date", today).select("id");
  const { data: toCompleted } = await supabase.from("challenges").update({ status: "completed" }).eq("status", "active").lt("end_date", today).select("id");
  return new Response(JSON.stringify({ ok: true, activated: toActive?.length ?? 0, completed: toCompleted?.length ?? 0 }), { headers: { "Content-Type": "application/json" } });
});
