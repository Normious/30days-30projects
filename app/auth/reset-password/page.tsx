"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { fieldCls } from "@/components/ui";

export default function ResetPassword(): React.JSX.Element {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  return (
    <div className="mx-auto max-w-md px-4 py-16 md:py-24">
      <h1 className="text-3xl font-semibold tracking-tight">Reset password</h1>
      {sent ? <p className="mt-6 rounded-md border border-border bg-bg-subtle p-4 text-sm">Check your email for reset instructions.</p> : (
        <form className="mt-6 space-y-4" onSubmit={async (e) => { e.preventDefault(); await createClient().auth.resetPasswordForEmail(email); setSent(true); }}>
          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm">Email</label>
            <input id="email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className={fieldCls} />
          </div>
          <button type="submit" className="w-full rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white transition-all duration-150 ease-out hover:bg-brand-700 active:translate-y-[1px]">Send reset link</button>
        </form>
      )}
    </div>
  );
}
