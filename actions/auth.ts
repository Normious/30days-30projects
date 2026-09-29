"use server";

import { createServerSupabase } from "@/lib/supabase/server";
import { isStrongPassword, signUpInputSchema, weakPasswordMessage } from "@/lib/password";

export type SignUpResult = { ok: true; hasSession: boolean; userId: string | null } | { ok: false; error: string };

/**
 * Server-side signup. Enforces the password policy before Supabase creates
 * the account, so the client-side meter can't be bypassed via our UI.
 * NOTE: direct anon-key calls to Supabase Auth bypass app code entirely —
 * also set minimum length 8 + leaked-password protection in the Supabase
 * dashboard (Auth → Password protection) as the true enforcement boundary.
 */
export async function signUpWithPassword(input: unknown): Promise<SignUpResult> {
  const parsed = signUpInputSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.errors[0]?.message ?? "Enter a valid email and password." };
  const { email, password } = parsed.data;
  if (!isStrongPassword(password)) return { ok: false, error: weakPasswordMessage(password) };
  const supabase = await createServerSupabase();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: appUrl ? { emailRedirectTo: `${appUrl}/auth/callback` } : undefined,
  });
  if (error) return { ok: false, error: error.message };
  return { ok: true, hasSession: data.session !== null, userId: data.user?.id ?? null };
}
