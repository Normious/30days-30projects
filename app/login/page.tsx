"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { fieldCls } from "@/components/ui";

export default function Login(): React.JSX.Element {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  async function submit(e: React.FormEvent): Promise<void> {
    e.preventDefault();
    setError("");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: `${window.location.origin}/auth/callback` } });
    if (error) setError(error.message); else setSent(true);
  }
  async function oauth(provider: "google" | "github"): Promise<void> {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({ provider, options: { redirectTo: `${window.location.origin}/auth/callback` } });
  }
  return (
    <div className="mx-auto max-w-md px-4 py-16 md:py-24">
      <h1 className="text-3xl font-semibold tracking-tight">Sign in</h1>
      <p className="mt-2 text-sm text-text-muted">Magic link, Google, or GitHub — no password needed.</p>
      {sent ? <p className="mt-6 rounded-md border border-border bg-bg-subtle p-4 text-sm">Check your email for a magic link.</p> : (
        <form onSubmit={submit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm">Email</label>
            <input id="email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className={fieldCls} />
          </div>
          {error && <p role="alert" className="text-sm text-accent-rose">{error}</p>}
          <button type="submit" className="w-full rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white transition-all duration-150 ease-out hover:bg-brand-700 active:translate-y-[1px]">Send magic link</button>
        </form>
      )}
      <div className="mt-4 flex gap-2">
        <button onClick={() => oauth("google")} className="flex-1 rounded-md border border-border px-4 py-2 text-sm transition-colors hover:border-border-strong active:translate-y-[1px]">Google</button>
        <button onClick={() => oauth("github")} className="flex-1 rounded-md border border-border px-4 py-2 text-sm transition-colors hover:border-border-strong active:translate-y-[1px]">GitHub</button>
      </div>
    </div>
  );
}
