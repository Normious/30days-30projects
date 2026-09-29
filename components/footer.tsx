import Link from "next/link";
import { APP_CONFIG } from "@/lib/constants";

export function Footer(): React.JSX.Element {
  return (
    <footer className="border-t border-border py-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-text-subtle">
          <p>{APP_CONFIG.displayName} — {APP_CONFIG.tagline}</p>
          <p className="mt-1 font-mono text-xs">MIT · <a className="underline hover:text-text" href={APP_CONFIG.repoUrl}>GitHub</a></p>
        </div>
        <nav aria-label="Footer" className="flex gap-4 text-sm text-text-muted">
          <Link className="hover:text-text" href="/discover">Discover</Link>
          <Link className="hover:text-text" href="/challenges">Challenges</Link>
          <Link className="hover:text-text" href="/about">About</Link>
        </nav>
      </div>
    </footer>
  );
}
