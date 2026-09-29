"use client";

import { useState } from "react";
import { approveApplication, rejectApplication } from "@/actions/organiser-applications";
import { toast } from "sonner";
import { fieldCls } from "./ui";

export function ApplicationReview({ id }: { id: string }): React.JSX.Element {
  const [reason, setReason] = useState("");
  return (
    <div className="mt-4 space-y-3">
      <button className="rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white transition-all duration-150 ease-out hover:bg-brand-700 active:translate-y-[1px]" onClick={async () => { const r = await approveApplication(id); if (!r.ok) toast.error(r.error); else toast.success("Approved — user is now organiser"); }}>Approve</button>
      <div className="flex gap-2">
        <label htmlFor="rej" className="sr-only">Rejection reason</label>
        <input id="rej" value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Rejection reason (20–500 chars)" className={`${fieldCls} flex-1`} />
        <button className="shrink-0 rounded-md border border-border px-4 py-2 text-sm transition-colors hover:border-border-strong active:translate-y-[1px]" onClick={async () => { const r = await rejectApplication(id, reason); if (!r.ok) toast.error(r.error); else toast.success("Rejected"); }}>Reject</button>
      </div>
    </div>
  );
}
