"use client";

import { approveProject, rejectProject } from "@/actions/moderation";
import { toast } from "sonner";

export type PendingProject = { id: string; title: string; description: string; slug: string };

export function ModerationQueue({ projects, challengeSlug }: { projects: PendingProject[]; challengeSlug: string }): React.JSX.Element {
  void challengeSlug;
  if (projects.length === 0) return <p className="text-text-subtle">Queue is empty.</p>;
  return (
    <ul className="space-y-2">
      {projects.map((p) => (
        <li key={p.id} className="flex items-center justify-between rounded-md border border-border px-4 py-3">
          <span>{p.title} <span className="text-sm text-text-muted">{p.description.slice(0, 60)}</span></span>
          <span className="flex gap-2">
            <button className="rounded-md bg-brand-600 px-3 py-1 text-sm text-white" onClick={async () => { const r = await approveProject(p.id); if (!r.ok) toast.error(r.error); else toast.success("Approved"); }}>Approve</button>
            <button className="rounded-md border border-border px-3 py-1 text-sm" onClick={async () => { const reason = window.prompt("Rejection reason (5–500 chars)"); if (!reason) return; const r = await rejectProject(p.id, reason); if (!r.ok) toast.error(r.error); else toast.success("Rejected"); }}>Reject</button>
          </span>
        </li>
      ))}
    </ul>
  );
}
