"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function ImageUploader({ bucket, label, onUploaded }: { bucket: string; label: string; onUploaded: (url: string) => void }): React.JSX.Element {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  async function pick(e: React.ChangeEvent<HTMLInputElement>): Promise<void> {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    if (!file.type.startsWith("image/")) { setError("Only images allowed"); return; }
    if (file.size > 5 * 1024 * 1024) { setError("Max 5MB"); return; }
    setUploading(true);
    const supabase = createClient();
    const path = `${crypto.randomUUID()}-${file.name}`;
    const { error } = await supabase.storage.from(bucket).upload(path, file, { contentType: file.type });
    setUploading(false);
    if (error) { setError(error.message); return; }
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    onUploaded(data.publicUrl);
  }
  return (
    <div>
      <label className="block text-sm">{label} (immediate upload; orphans cleaned nightly)</label>
      <input type="file" accept="image/*" onChange={pick} aria-label={label} className="mt-1 block text-sm" />
      {uploading && <div className="mt-2 h-8 animate-pulse rounded-md bg-bg-muted" aria-label="Uploading" />}
      {error && <p role="alert" className="text-sm text-accent-rose">{error}</p>}
    </div>
  );
}
