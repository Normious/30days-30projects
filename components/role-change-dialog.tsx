"use client";

import { promoteUser, revokeOrganiser } from "@/actions/roles";
import { toast } from "sonner";
import type { PlatformRole } from "@/lib/role-helpers";

export function RoleChangeDialog({ userId, currentRole }: { userId: string; currentRole: PlatformRole }): React.JSX.Element {
  return (
    <div className="flex flex-wrap gap-2">
      {((["participant", "organiser", "admin"] as PlatformRole[]).filter((r) => r !== currentRole).map((r) => (
        <button key={r} className="rounded-md border border-border px-3 py-1.5 text-sm transition-colors hover:border-border-strong active:translate-y-[1px]" onClick={async () => { const res = await promoteUser(userId, r); if (!res.ok) toast.error(res.error); else toast.success(`Promoted to ${r}`); }}>Make {r}</button>
      )))}
      {currentRole === "organiser" && (
        <button className="rounded-md border border-accent-rose px-3 py-1.5 text-sm text-accent-rose transition-colors hover:bg-accent-rose/10 active:translate-y-[1px]" onClick={async () => { const reason = window.prompt("Revocation reason"); if (!reason) return; const res = await revokeOrganiser(userId, reason); if (!res.ok) toast.error(res.error); else toast.success("Revoked"); }}>Revoke</button>
      )}
    </div>
  );
}
