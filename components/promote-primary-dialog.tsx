"use client";
import { promoteToPrimary } from "@/actions/challenge-organisers";
import { toast } from "sonner";
export function PromotePrimaryDialog({ challengeId, userId }: { challengeId: string; userId: string }): React.JSX.Element {
  return <button className="underline text-sm" onClick={async () => { const r = await promoteToPrimary(challengeId, userId); if (!r.ok) toast.error(r.error); else toast.success("Promoted"); }}>Make primary</button>;
}
