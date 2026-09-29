import Link from "next/link";

export default function NotFound(): React.JSX.Element {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-24 text-center">
      <p className="font-mono text-sm text-brand-500">404</p>
      <h1 className="mt-2 text-balance text-3xl font-semibold tracking-tight">This page shipped to nowhere.</h1>
      <p className="mt-2 text-text-muted">The link is broken or the page was removed.</p>
      <div className="mt-6 flex gap-3">
        <Link href="/" className="rounded-md bg-brand-600 px-4 py-2 text-sm text-white hover:bg-brand-700">Go home</Link>
        <Link href="/discover" className="rounded-md border border-border px-4 py-2 text-sm hover:border-border-strong">Browse projects</Link>
      </div>
    </div>
  );
}
