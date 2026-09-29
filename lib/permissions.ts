import { createServerSupabase } from "./supabase/server";

/** Server-side permission checks mirroring SQL helpers (SPEC §6.3). Never trust client. */
export async function isChallengeOrganiser(challengeId: string, userId: string): Promise<boolean> {
  const supabase = createServerSupabase();
  const { data } = await supabase.from("challenge_participants")
    .select("id").eq("challenge_id", challengeId).eq("user_id", userId).eq("role", "organiser").limit(1);
  return (data?.length ?? 0) > 0;
}

export async function isChallengePrimaryOrganiser(challengeId: string, userId: string): Promise<boolean> {
  const supabase = createServerSupabase();
  const { data } = await supabase.from("challenge_participants")
    .select("id").eq("challenge_id", challengeId).eq("user_id", userId)
    .eq("role", "organiser").eq("is_primary", true).limit(1);
  return (data?.length ?? 0) > 0;
}
