import { APP_CONFIG } from "@/lib/constants";

export function Footer(): React.JSX.Element {
  return (
    <footer className="border-t border-border py-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 text-sm text-text-subtle">
        <p>{APP_CONFIG.displayName} — {APP_CONFIG.tagline}</p>
        <p className="font-mono text-xs">MIT · <a className="underline" href={APP_CONFIG.repoUrl}>GitHub</a></p>
      </div>
    </footer>
  );
}
