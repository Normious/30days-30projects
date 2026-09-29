import Link from "next/link";
import { APP_CONFIG } from "@/lib/constants";
import { getSessionUser } from "@/lib/auth";
import { SignOutButton } from "./sign-out-button";

export async function Nav(): Promise<React.JSX.Element> {
  const user = await getSessionUser().catch(() => null);
  return (
    <header className="border-b border-border">
      <nav aria-label="Primary" className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="font-semibold tracking-tight">{APP_CONFIG.displayName}</Link>
        <div className="flex items-center gap-4 text-sm text-text-muted">
          <Link className="hover:text-text" href="/discover">Discover</Link>
          <Link className="hover:text-text" href="/challenges">Challenges</Link>
          <Link className="hover:text-text" href="/about">About</Link>
          {user ? (
            <>
              <Link className="hover:text-text" href="/dashboard">Dashboard</Link>
              {(user.role === "organiser" || user.role === "admin") && (
                <Link className="hover:text-text" href="/organiser">Organise</Link>
              )}
              {user.role === "admin" && (
                <Link className="hover:text-text" href="/admin">Admin</Link>
              )}
              <SignOutButton />
            </>
          ) : (
            <Link className="rounded-md bg-brand-600 px-3 py-1.5 text-white hover:bg-brand-700" href="/login">Sign in</Link>
          )}
        </div>
      </nav>
    </header>
  );
}
