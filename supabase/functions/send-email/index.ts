// send-email Edge Function: 12 events (SPEC §26.10) via Resend.
import { serve } from "https://deno.land/std@0.208.0/http/server.ts";

const EVENTS = ["welcome_verify", "challenge_invite", "project_approved", "project_rejected", "organiser_app_submitted", "organiser_app_approved", "organiser_app_rejected", "added_as_co_organiser", "promoted_to_primary", "password_reset", "email_changed", "account_deleted"] as const;

serve(async (req: Request): Promise<Response> => {
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });
  const { event, to, data } = await req.json() as { event: string; to: string; data?: Record<string, string> };
  if (!(EVENTS as readonly string[]).includes(event)) return new Response("Unknown event", { status: 400 });
  if (!to || !to.includes("@")) return new Response("Invalid recipient", { status: 400 });
  const apiKey = Deno.env.get("RESEND_API_KEY");
  if (!apiKey) return new Response("Email not configured", { status: 503 });
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: "noreply@30days30projects.dev", to, subject: `[30days-30projects] ${event}`, html: `<p>${event}</p><pre>${JSON.stringify(data ?? {})}</pre>` }),
  });
  return new Response(JSON.stringify({ ok: res.ok }), { headers: { "Content-Type": "application/json" } });
});
