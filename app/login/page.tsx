"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { fieldCls } from "@/components/ui";
import { OAUTH_ENABLED } from "@/lib/constants";

type Client = ReturnType<typeof createClient>;

/** New users finish onboarding; returning users land on their dashboard. */
async function landingFor(supabase: Client): Promise<string> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return "/dashboard";
  const { data: profile } = await supabase.from("profiles").select("bio").eq("id", user.id).single();
  return (profile as { bio: string | null } | null)?.bio ? "/dashboard" : "/settings/profile";
}

export default function Login(): React.JSX.Element {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [magicPending, setMagicPending] = useState(false);
  const [linkSent, setLinkSent] = useState(false);
  const [error, setError] = useState("");
  const signInLock = useRef(false);
  const magicLock = useRef(false);

  async function submitPassword(e: React.FormEvent): Promise<void> {
    e.preventDefault();
    if (signInLock.current) return;
    signInLock.current = true;
    setError("");
    setPending(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError(error.message);
        return;
      }
      router.push(await landingFor(supabase));
      router.refresh();
    } catch {
      setError("Couldn't sign you in. Check your connection and try again.");
    } finally {
      signInLock.current = false;
      setPending(false);
    }
  }

  async function sendMagicLink(): Promise<void> {
    if (magicLock.current) return;
    magicLock.current = true;
    setError("");
    setMagicPending(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: `${window.location.origin}/auth/callback` } });
      if (error) setError(error.message);
      else setLinkSent(true);
    } catch {
      setError("Couldn't send a magic link. Check your connection and try again.");
    } finally {
      magicLock.current = false;
      setMagicPending(false);
    }
  }

  async function oauth(provider: "google" | "github"): Promise<void> {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({ provider, options: { redirectTo: `${window.location.origin}/auth/callback` } });
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16 md:py-24">
      <h1 className="text-3xl font-semibold tracking-tight">Sign in</h1>
      <p className="mt-2 text-sm text-text-muted">Email and password, or a magic link — your choice.</p>

      <form onSubmit={submitPassword} className="mt-6 space-y-4">
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm">Email</label>
          <input id="email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className={fieldCls} />
        </div>
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label htmlFor="password" className="block text-sm">Password</label>
            <Link href="/auth/reset-password" className="text-sm text-text-muted hover:text-text">Forgot password?</Link>
          </div>
          <input id="password" type="password" required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className={fieldCls} />
        </div>
        {error && <p role="alert" className="text-sm text-accent-rose">{error}</p>}
        <button type="submit" disabled={pending} className="w-full rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white transition-all duration-150 ease-out hover:bg-brand-700 active:translate-y-[1px] disabled:opacity-50">
          {pending ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <div className="my-6 flex items-center gap-3 text-xs text-text-subtle" aria-hidden>
        <span className="h-px flex-1 bg-border" />
        <span>or</span>
        <span className="h-px flex-1 bg-border" />
      </div>

      {linkSent ? (
        <p className="rounded-md border border-border bg-bg-subtle p-4 text-sm">Check your email for a magic link.</p>
      ) : (
        <button onClick={sendMagicLink} disabled={!email || magicPending} className="w-full rounded-md border border-border px-4 py-2 text-sm transition-colors hover:border-border-strong active:translate-y-[1px] disabled:opacity-50">
          {magicPending ? "Sending…" : "Email me a magic link instead"}
        </button>
      )}

      {OAUTH_ENABLED && (
        <div className="mt-3 flex gap-2">
          <button onClick={() => oauth("google")} className="flex-1 rounded-md border border-border px-4 py-2 text-sm transition-colors hover:border-border-strong active:translate-y-[1px]">Google</button>
          <button onClick={() => oauth("github")} className="flex-1 rounded-md border border-border px-4 py-2 text-sm transition-colors hover:border-border-strong active:translate-y-[1px]">GitHub</button>
        </div>
      )}

      <p className="mt-6 text-center text-sm text-text-muted">
        New here? <Link href="/register" className="underline underline-offset-4 hover:text-text">Create an account</Link>
      </p>
    </div>
  );
}
