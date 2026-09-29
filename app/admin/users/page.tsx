import Link from "next/link";
import { createServerSupabase } from "@/lib/supabase/server";
import { RoleBadge } from "@/components/role-badge";

export default async function AdminUsers(): Promise<React.JSX.Element> {
  const supabase = await createServerSupabase();
  const { data } = await supabase.from("profiles").select("id,username,display_name,platform_role").order("created_at", { ascending: false }).limit(100);
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
      <h1 className="text-3xl font-semibold tracking-tight">Users</h1>
      <ul className="mt-6 divide-y divide-border rounded-md border border-border">
        {(data ?? []).map((u: { id: string; username: string; display_name: string; platform_role: string }) => (
          <li key={u.id as string} className="flex items-center justify-between gap-3 px-4 py-3 transition-colors hover:bg-bg-subtle">
            <span className="min-w-0 truncate">{u.display_name as string} <span className="font-mono text-xs text-text-subtle">@{u.username as string}</span> <RoleBadge role={u.platform_role as never} /></span>
            <Link className="shrink-0 text-sm text-text-muted hover:text-text" href={`/admin/users/${u.id as string}`}>Manage</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
