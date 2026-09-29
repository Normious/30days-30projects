"use client";

import { withdrawApplication } from "@/actions/organiser-applications";
import { toast } from "sonner";

export type Application = { id: string; status: string; rejection_reason: string | null; created_at: string } | null;

export function ApplicationStatusCard({ application }: { application: Application }): React.JSX.Element {
  if (!application) return <p className="rounded-md border border-border p-4 text-text-muted">No application yet.</p>;
  return (
    <div className="rounded-md border border-border p-4">
      <p className="font-mono text-sm uppercase">{application.status}</p>
      {application.rejection_reason && <p className="mt-2 text-sm">Reason: {application.rejection_reason}</p>}
      {application.status === "pending" && (
        <button
          className="mt-3 rounded-md border border-border px-3 py-1.5 text-sm"
          onClick={async () => { const r = await withdrawApplication(application.id); if (!r.ok) toast.error(r.error); else toast.success("Withdrawn"); }}
        >Withdraw</button>
      )}
    </div>
  );
}
