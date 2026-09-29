"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { fieldCls } from "./ui";

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
      <div className="relative">
        <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-subtle" aria-hidden />
        <input id="discover-search" name="q" defaultValue={defaultValue} placeholder="Search projects…" autoComplete="off" className={`${fieldCls} pl-9`} />
      </div>
    </form>
  );
}
