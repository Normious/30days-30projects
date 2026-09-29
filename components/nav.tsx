import Link from "next/link";
import { Suspense } from "react";
import { APP_CONFIG } from "@/lib/constants";
import { getSessionUser } from "@/lib/auth";
import { NavLinks } from "./nav-links";

export async function Nav(): Promise<React.JSX.Element> {
  const user = await getSessionUser().catch(() => null);
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg/90 backdrop-blur">
      <nav aria-label="Primary" className="relative mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="font-semibold tracking-tight">{APP_CONFIG.displayName}</Link>
        <Suspense>
          <NavLinks role={user?.role ?? null} />
        </Suspense>
      </nav>
    </header>
  );
}
