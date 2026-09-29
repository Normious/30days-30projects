"use client";

import { useState } from "react";
import { toast } from "sonner";
import { addCoOrganiser, removeCoOrganiser, promoteToPrimary, leaveAsOrganiser } from "@/actions/challenge-organisers";

export function OrganiserSettings({ challengeId, organisers, isPrimary }: { challengeId: string; organisers: { user_id: string; username: string; is_primary: boolean }[]; isPrimary: boolean }): React.JSX.Element {
  const [email, setEmail] = useState("");
  return (
    <div className="space-y-4">
      <ul className="divide-y divide-border rounded-md border border-border">
        {organisers.map((o) => (
          <li key={o.user_id} className="flex flex-col gap-2 px-4 py-3 transition-colors hover:bg-bg-subtle sm:flex-row sm:items-center sm:justify-between">
            <span>{o.username} {o.is_primary && <span className="font-mono text-xs text-brand-500">primary</span>}</span>
            {isPrimary && !o.is_primary && (
              <span className="flex gap-2 text-sm">
                <button className="underline" onClick={async () => { const r = await promoteToPrimary(challengeId, o.user_id); if (!r.ok) toast.error(r.error); else toast.success("Promoted"); }}>Make primary</button>
                <button className="underline" onClick={async () => { const r = await removeCoOrganiser(challengeId, o.user_id); if (!r.ok) toast.error(r.error); else toast.success("Removed"); }}>Remove</button>
              </span>
            )}
          </li>
        ))}
      </ul>
      {isPrimary ? (
        <form className="flex gap-2" onSubmit={async (e) => { e.preventDefault(); const r = await addCoOrganiser(challengeId, email); if (!r.ok) toast.error(r.error); else { toast.success("Added"); setEmail(""); } }}>
          <label htmlFor="co-email" className="sr-only">Co-organiser username</label>
          <input id="co-email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="username (must be registered)" className="flex-1 rounded-md border border-border bg-bg-subtle px-3 py-2 text-sm" />
          <button className="rounded-md bg-brand-600 px-4 py-2 text-sm text-white">Add</button>
        </form>
      ) : (
        <button className="rounded-md border border-border px-4 py-2 text-sm" onClick={async () => { const r = await leaveAsOrganiser(challengeId); if (!r.ok) toast.error(r.error); else toast.success("Left"); }}>Leave as organiser</button>
      )}
    </div>
  );
}
