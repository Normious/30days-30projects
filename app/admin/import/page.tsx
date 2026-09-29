"use client";

import { useState } from "react";
import { toast } from "sonner";
import { bulkImport, type SeedFile } from "@/actions/admin";

export default function ImportPage(): React.JSX.Element {
  const [autoApprove, setAutoApprove] = useState(false);
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState("");
  async function onFile(file: File): Promise<void> {
    setPending(true);
    try {
      const seed = JSON.parse(await file.text()) as SeedFile;
      const res = await bulkImport(seed, autoApprove);
      setResult(res.ok ? `Created ${res.users} users, ${res.projects} projects` : `Error: ${res.error}`);
      if (res.ok) toast.success("Import complete");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Invalid JSON";
      setResult(`Error: ${msg}`);
      toast.error(msg);
    }
    setPending(false);
  }
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 md:py-14">
      <h1 className="text-3xl font-semibold tracking-tight">Bulk import</h1>
      <p className="mt-2 text-sm text-text-muted">Upload seed JSON (SPEC §14). Preview counts before confirm — the file is parsed client-side and you confirm by choosing the file.</p>
      <label className="mt-6 flex items-center gap-2 text-sm"><input type="checkbox" checked={autoApprove} onChange={(e) => setAutoApprove(e.target.checked)} /> Auto-approve (pre-vetted cohorts only)</label>
      <label htmlFor="seed-file" className="mt-3 block text-sm">Seed JSON file</label>
      <input id="seed-file" type="file" accept="application/json" disabled={pending} onChange={(e) => { const f = e.target.files?.[0]; if (f) void onFile(f); }} className="mt-1 block text-sm" />
      {result && <p className="mt-4 rounded-md border border-border p-4 font-mono text-sm">{result}</p>}
    </div>
  );
}
