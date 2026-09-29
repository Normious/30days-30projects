"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

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
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="text-3xl font-semibold">Sign in</h1>
      {sent ? <p className="mt-4 rounded-md border border-border bg-bg-subtle p-4">Check your email for a magic link.</p> : (
        <form onSubmit={submit} className="mt-6 space-y-3">
          <label htmlFor="email" className="block text-sm">Email</label>
          <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-md border border-border bg-bg-subtle px-3 py-2" />
          {error && <p role="alert" className="text-sm text-accent-rose">{error}</p>}
          <button type="submit" className="w-full rounded-md bg-brand-600 px-4 py-2 text-white">Send magic link</button>
        </form>
      )}
      <div className="mt-4 flex gap-2">
        <button onClick={() => oauth("google")} className="flex-1 rounded-md border border-border px-4 py-2">Google</button>
        <button onClick={() => oauth("github")} className="flex-1 rounded-md border border-border px-4 py-2">GitHub</button>
      </div>
    </div>
  );
}
