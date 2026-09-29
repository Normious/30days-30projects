"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabase } from "@/lib/supabase/server";
import { getSessionUser } from "@/lib/auth";
import type { ActionResult } from "./projects";

/** Join public + open challenge. */
export async function joinChallenge(challengeId: string): Promise<ActionResult> {
  const user = await getSessionUser();
  if (!user) return { ok: false, error: "Not authenticated" };
  const supabase = await createServerSupabase();
  const { error } = await supabase.from("challenge_participants").insert({ challenge_id: challengeId, user_id: user.id, role: "participant" });
  if (error) return { ok: false, error: error.message };
  revalidatePath(`/c/${challengeId}`);
  return { ok: true, data: { id: challengeId } };
}

/** Leave (mark dropped). */
export async function leaveChallenge(challengeId: string): Promise<ActionResult> {
  const user = await getSessionUser();
  if (!user) return { ok: false, error: "Not authenticated" };
  const supabase = await createServerSupabase();
  const { error } = await supabase.from("challenge_participants").update({ status: "dropped" }).eq("challenge_id", challengeId).eq("user_id", user.id);
  if (error) return { ok: false, error: error.message };
  revalidatePath(`/c/${challengeId}`);
  return { ok: true, data: { id: challengeId } };
}
