import { createServerSupabase } from "@/lib/supabase/server";
import { RoleChangeDialog } from "@/components/role-change-dialog";
import { redirect } from "next/navigation";

export default async function UserDetail({ params }: { params: Promise<{ id: string }> }): Promise<React.JSX.Element> {
  const supabase = await createServerSupabase();
  const { data: user } = await supabase.from("profiles").select("id,username,display_name,platform_role").eq("id", (await params).id).single();
  if (!user) redirect("/admin/users");
  const u = user as { id: string; username: string; display_name: string; platform_role: "user" | "participant" | "organiser" | "admin" };
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-semibold">{u.display_name}</h1>
      <p className="font-mono text-sm text-text-subtle">@{u.username} · {u.platform_role}</p>
      <div className="mt-6"><RoleChangeDialog userId={u.id} currentRole={u.platform_role} /></div>
    </div>
  );
}
