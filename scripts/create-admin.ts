/** Bootstrap admin: pnpm create-admin --email=<email>. Reads ADMIN_EMAIL env. Refs: SPEC §26.1 */
import { createClient } from "@supabase/supabase-js";

const email = process.argv.find((a) => a.startsWith("--email="))?.split("=")[1] ?? process.env.ADMIN_EMAIL;
if (!email) {
  console.error("Usage: pnpm create-admin --email=<email> (or set ADMIN_EMAIL)");
  process.exit(1);
}

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL ?? "", process.env.SUPABASE_SERVICE_ROLE_KEY ?? "", { auth: { persistSession: false } });

const { data: users } = await supabase.auth.admin.listUsers();
const user = users?.users.find((u) => u.email === email);
if (!user) {
  console.error(`No auth user with email ${email}. Register via /register first.`);
  process.exit(1);
}

const { error } = await supabase.from("profiles").update({ platform_role: "admin" }).eq("id", user.id);
if (error) {
  console.error(error.message);
  process.exit(1);
}
await supabase.from("audit_log").insert({ action: "admin.bootstrap", target_type: "profile", target_id: user.id, metadata: { email } });
console.log(`Promoted ${email} to admin.`);
