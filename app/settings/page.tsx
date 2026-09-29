import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";

export default async function Settings(): Promise<React.JSX.Element> {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-semibold">Settings</h1>
      <div className="mt-6 space-y-2">
        <Link className="block rounded-md border border-border px-4 py-3 hover:border-border-strong" href="/settings/profile">Profile editor</Link>
        <Link className="block rounded-md border border-border px-4 py-3 hover:border-border-strong" href="/settings/become-organiser">Become an organiser</Link>
        <Link className="block rounded-md border border-border px-4 py-3 hover:border-border-strong" href="/settings/become-organiser/status">Application status</Link>
      </div>
    </div>
  );
}
