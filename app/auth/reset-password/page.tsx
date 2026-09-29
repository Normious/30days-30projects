"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function ResetPassword(): React.JSX.Element {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="text-3xl font-semibold">Reset password</h1>
      {sent ? <p className="mt-4 rounded-md border border-border bg-bg-subtle p-4">Check your email for reset instructions.</p> : (
        <form className="mt-6 space-y-3" onSubmit={async (e) => { e.preventDefault(); await createClient().auth.resetPasswordForEmail(email); setSent(true); }}>
          <label htmlFor="email" className="block text-sm">Email</label>
          <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-md border border-border bg-bg-subtle px-3 py-2" />
          <button type="submit" className="w-full rounded-md bg-brand-600 px-4 py-2 text-white">Send reset link</button>
        </form>
      )}
    </div>
  );
}
