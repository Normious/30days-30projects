"use client";

import { useRouter, useSearchParams } from "next/navigation";

export function SearchBar({ defaultValue }: { defaultValue: string }): React.JSX.Element {
  const router = useRouter();
  const params = useSearchParams();
  return (
    <form
      role="search"
      className="flex-1"
      onSubmit={(e) => {
        e.preventDefault();
        const q = new FormData(e.currentTarget).get("q");
        const next = new URLSearchParams(params.toString());
        if (typeof q === "string" && q) next.set("q", q); else next.delete("q");
        router.push(`/discover?${next.toString()}`);
      }}
    >
      <label htmlFor="discover-search" className="sr-only">Search projects</label>
      <input id="discover-search" name="q" defaultValue={defaultValue} placeholder="Search projects…" className="w-full rounded-md border border-border bg-bg-subtle px-3 py-2 text-sm" />
    </form>
  );
}
