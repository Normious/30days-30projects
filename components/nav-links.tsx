"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { clsx } from "clsx";
import { Menu, X } from "lucide-react";
import { SignOutButton } from "./sign-out-button";
import type { PlatformRole } from "@/lib/role-helpers";

const LINKS = [
  { href: "/discover", label: "Discover" },
  { href: "/challenges", label: "Challenges" },
  { href: "/about", label: "About" },
];

function isActive(pathname: string, href: string): boolean {
  return pathname === href || (href !== "/" && pathname.startsWith(href));
}

export function NavLinks({ role }: { role: PlatformRole | null }): React.JSX.Element {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const authed = role !== null;
  const linkCls = (href: string): string =>
    clsx("hover:text-text", isActive(pathname, href) && "text-text underline underline-offset-4 decoration-brand-500");

  return (
    <>
      <div className="hidden items-center gap-4 text-sm text-text-muted md:flex">
        {LINKS.map((l) => <Link key={l.href} className={linkCls(l.href)} href={l.href}>{l.label}</Link>)}
        {authed ? (
          <>
            <Link className={linkCls("/dashboard")} href="/dashboard">Dashboard</Link>
            {(role === "organiser" || role === "admin") && <Link className={linkCls("/organiser")} href="/organiser">Organise</Link>}
            {role === "admin" && <Link className={linkCls("/admin")} href="/admin">Admin</Link>}
            <SignOutButton />
          </>
        ) : (
          <Link className="rounded-md bg-brand-600 px-3 py-1.5 text-white transition-all hover:bg-brand-700 active:translate-y-[1px]" href="/login">Sign in</Link>
        )}
      </div>
      <button className="rounded-md p-2 hover:text-text md:hidden" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => setOpen((v) => !v)}>
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>
      {open && (
        <div className="absolute inset-x-0 top-full border-b border-border bg-bg px-4 py-3 md:hidden">
          <div className="flex flex-col gap-3 text-sm">
            {LINKS.map((l) => <Link key={l.href} className={linkCls(l.href)} href={l.href} onClick={() => setOpen(false)}>{l.label}</Link>)}
            {authed ? (
              <>
                <Link href="/dashboard" onClick={() => setOpen(false)}>Dashboard</Link>
                {(role === "organiser" || role === "admin") && <Link href="/organiser" onClick={() => setOpen(false)}>Organise</Link>}
                {role === "admin" && <Link href="/admin" onClick={() => setOpen(false)}>Admin</Link>}
                <SignOutButton />
              </>
            ) : (
              <Link className="rounded-md bg-brand-600 px-3 py-2 text-center text-white" href="/login" onClick={() => setOpen(false)}>Sign in</Link>
            )}
          </div>
        </div>
      )}
    </>
  );
}
