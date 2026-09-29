"use client";

import { useRouter, useSearchParams } from "next/navigation";

export function Filters({ tech, category }: { tech: string; category: string }): React.JSX.Element {
  const router = useRouter();
  const params = useSearchParams();
  function set(key: string, value: string): void {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value); else next.delete(key);
    router.push(`/discover?${next.toString()}`);
  }
  return (
    <div className="flex gap-2">
      <label className="sr-only" htmlFor="f-tech">Filter by tech</label>
      <select id="f-tech" value={tech} onChange={(e) => set("tech", e.target.value)} className="rounded-md border border-border bg-bg-subtle px-3 py-2 text-sm">
        <option value="">All tech</option>
        {["React", "TypeScript", "Python", "Go", "Rust"].map((t) => <option key={t} value={t}>{t}</option>)}
      </select>
      <label className="sr-only" htmlFor="f-cat">Filter by category</label>
      <select id="f-cat" value={category} onChange={(e) => set("category", e.target.value)} className="rounded-md border border-border bg-bg-subtle px-3 py-2 text-sm">
        <option value="">All categories</option>
        {["web", "cli", "api", "mobile", "data"].map((c) => <option key={c} value={c}>{c}</option>)}
      </select>
    </div>
  );
}
