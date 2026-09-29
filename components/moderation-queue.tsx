"use client";

import { approveProject, rejectProject } from "@/actions/moderation";
import { toast } from "sonner";
import { EmptyState } from "./ui";

export type PendingProject = { id: string; title: string; description: string; slug: string };

export function ModerationQueue({ projects, challengeSlug }: { projects: PendingProject[]; challengeSlug: string }): React.JSX.Element {
  void challengeSlug;
  if (projects.length === 0) {
    return <EmptyState title="Queue is empty" hint="New submissions will appear here for review." />;
  }
  return (
    <ul className="divide-y divide-border rounded-md border border-border">
      {projects.map((p) => (
        <li key={p.id} className="flex flex-col gap-3 px-4 py-3 transition-colors hover:bg-bg-subtle sm:flex-row sm:items-center sm:justify-between">
          <span className="min-w-0"><span className="font-medium">{p.title}</span> <span className="block truncate text-sm text-text-muted sm:inline">{p.description.slice(0, 80)}</span></span>
          <span className="flex shrink-0 gap-2">
            <button className="rounded-md bg-brand-600 px-3 py-1.5 text-sm text-white transition-all hover:bg-brand-700 active:translate-y-[1px]" onClick={async () => { const r = await approveProject(p.id); if (!r.ok) toast.error(r.error); else toast.success("Approved"); }}>Approve</button>
            <button className="rounded-md border border-border px-3 py-1.5 text-sm transition-colors hover:border-border-strong active:translate-y-[1px]" onClick={async () => { const reason = window.prompt("Rejection reason (5–500 chars)"); if (!reason) return; const r = await rejectProject(p.id, reason); if (!r.ok) toast.error(r.error); else toast.success("Rejected"); }}>Reject</button>
          </span>
        </li>
      ))}
    </ul>
  );
}
