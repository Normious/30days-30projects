import Link from "next/link";
import { createServerSupabase } from "@/lib/supabase/server";
import { RoleBadge } from "@/components/role-badge";

export default async function AdminUsers(): Promise<React.JSX.Element> {
  const supabase = createServerSupabase();
  const { data } = await supabase.from("profiles").select("id,username,display_name,platform_role").order("created_at", { ascending: false }).limit(100);
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-semibold">Users</h1>
      <ul className="mt-6 space-y-2">
        {(data ?? []).map((u) => (
          <li key={u.id as string} className="flex items-center justify-between rounded-md border border-border px-4 py-3">
            <span>{u.display_name as string} <span className="font-mono text-xs text-text-subtle">@{u.username as string}</span> <RoleBadge role={u.platform_role as never} /></span>
            <Link className="text-sm underline" href={`/admin/users/${u.id as string}`}>Manage</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
