"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabase } from "@/lib/supabase/server";
import { getSessionUser } from "@/lib/auth";
import { profileSchema } from "@/lib/validation";
import type { ActionResult } from "./projects";

/** Update own profile (role fields guarded by RLS). */
export async function updateProfile(input: unknown): Promise<ActionResult> {
  const user = await getSessionUser();
  if (!user) return { ok: false, error: "Not authenticated" };
  const parsed = profileSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.errors[0]?.message ?? "Invalid input" };
  const supabase = createServerSupabase();
  const { error } = await supabase.from("profiles").update(parsed.data).eq("id", user.id);
  if (error) return { ok: false, error: error.message };
  revalidatePath(`/u/`);
  return { ok: true, data: { id: user.id } };
}
