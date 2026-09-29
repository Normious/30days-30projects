"use client";
import { leaveAsOrganiser } from "@/actions/challenge-organisers";
import { toast } from "sonner";
export function LeaveOrganiserDialog({ challengeId }: { challengeId: string }): React.JSX.Element {
  return <button className="rounded-md border border-border px-4 py-2 text-sm" onClick={async () => { if (!window.confirm("Leave as organiser?")) return; const r = await leaveAsOrganiser(challengeId); if (!r.ok) toast.error(r.error); else toast.success("Left"); }}>Leave</button>;
}
