import type { PlatformRole } from "@/lib/role-helpers";

export function RoleBadge({ role }: { role: PlatformRole }): React.JSX.Element {
  return <span className="ml-2 rounded-full border border-border px-2 py-0.5 font-mono text-[11px] uppercase tracking-wide text-text-muted">[{role}]</span>;
}
