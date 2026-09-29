import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";

export default async function Settings(): Promise<React.JSX.Element> {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 md:py-14">
      <h1 className="text-3xl font-semibold tracking-tight">Settings</h1>
      <div className="mt-6 divide-y divide-border rounded-md border border-border">
        {(
          [
            ["/settings/profile", "Profile editor", "Name, bio, links, location"],
            ["/settings/become-organiser", "Become an organiser", "Apply to run your own challenge"],
            ["/settings/become-organiser/status", "Application status", "Track your organiser application"],
          ] satisfies [string, string, string][]
        ).map(([href, title, hint]) => (
          <Link key={href} className="block px-4 py-4 transition-colors hover:bg-bg-subtle" href={href}>
            <span className="font-medium">{title}</span>
            <span className="mt-0.5 block text-sm text-text-muted">{hint}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
