"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { fieldCls } from "@/components/ui";
import { clsx } from "clsx";

function passwordChecks(pw: string): { label: string; ok: boolean }[] {
  return [
    { label: "8+ characters", ok: pw.length >= 8 },
    { label: "Upper & lower case", ok: /[a-z]/.test(pw) && /[A-Z]/.test(pw) },
    { label: "A number", ok: /\d/.test(pw) },
    { label: "A symbol", ok: /[^A-Za-z0-9]/.test(pw) },
  ];
}

function strengthLabel(passed: number): { text: string; cls: string } {
  if (passed >= 4) return { text: "Strong", cls: "text-accent-emerald" };
  if (passed === 3) return { text: "Good — one more to go", cls: "text-accent-amber" };
  if (passed === 2) return { text: "Fair", cls: "text-accent-amber" };
  return { text: "Weak", cls: "text-accent-rose" };
}

export default function Register(): React.JSX.Element {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const checks = passwordChecks(password);
  const passed = checks.filter((c) => c.ok).length;
  const strong = passed >= 4;
  const strength = strengthLabel(passed);

  async function submit(e: React.FormEvent): Promise<void> {
    e.preventDefault();
    setError("");
    setPending(true);
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });
    setPending(false);
    if (error) {
      setError(error.message);
      return;
    }
    if (data.session) {
      const { data: profile } = await supabase.from("profiles").select("bio").eq("id", data.session.user.id).single();
      router.push((profile as { bio: string | null } | null)?.bio ? "/dashboard" : "/settings/profile");
      router.refresh();
    } else {
      setSent(true);
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16 md:py-24">
      <h1 className="text-3xl font-semibold tracking-tight">Join the challenge</h1>
      <p className="mt-2 text-sm text-text-muted">One email, one portfolio. Email confirmation may be required.</p>
      {sent ? (
        <p className="mt-6 rounded-md border border-border bg-bg-subtle p-4 text-sm">Check your email to confirm your account, then sign in.</p>
      ) : (
        <form onSubmit={submit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm">Email</label>
            <input id="email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className={fieldCls} />
          </div>
          <div>
            <label htmlFor="password" className="mb-1.5 block text-sm">Password</label>
            <input id="password" type="password" required minLength={8} autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Choose a strong password" aria-describedby="pw-strength" className={fieldCls} />
            {password.length > 0 && (
              <div id="pw-strength" className="mt-2" aria-live="polite">
                <div className="flex gap-1" aria-hidden>
                  {[0, 1, 2, 3].map((i) => (
                    <span key={i} className={clsx("h-1 flex-1 rounded-full", i < passed ? (strong ? "bg-accent-emerald" : "bg-accent-amber") : "bg-bg-muted")} />
                  ))}
                </div>
                <p className={clsx("mt-1.5 font-mono text-xs", strength.cls)}>{strength.text}</p>
                <ul className="mt-1 space-y-0.5 text-xs text-text-muted">
                  {checks.map((c) => (
                    <li key={c.label} className={c.ok ? "text-text-muted" : ""}>
                      <span className={clsx("mr-1.5 font-mono", c.ok ? "text-accent-emerald" : "text-text-subtle")} aria-hidden>{c.ok ? "✓" : "○"}</span>
                      {c.label}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          {error && <p role="alert" className="text-sm text-accent-rose">{error}</p>}
          <button type="submit" disabled={pending || !strong} className="w-full rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white transition-all duration-150 ease-out hover:bg-brand-700 active:translate-y-[1px] disabled:opacity-50">
            {pending ? "Creating…" : strong ? "Create account" : "Make your password strong to continue"}
          </button>
        </form>
      )}
      <p className="mt-6 text-center text-sm text-text-muted">
        Already have an account? <Link href="/login" className="underline underline-offset-4 hover:text-text">Sign in</Link>
      </p>
    </div>
  );
}
