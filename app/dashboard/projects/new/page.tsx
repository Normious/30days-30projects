"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createProject } from "@/actions/projects";
import { ImageUploader } from "@/components/image-uploader";
import { fieldCls } from "@/components/ui";

export default function NewProject(): React.JSX.Element {
  const router = useRouter();
  const [screenshot, setScreenshot] = useState("");
  const [pending, setPending] = useState(false);
  async function submit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setPending(true);
    const res = await createProject({
      title: String(fd.get("title")), description: String(fd.get("description")),
      screenshot_url: screenshot, demo_url: String(fd.get("demo_url") ?? ""),
      repo_url: String(fd.get("repo_url") ?? ""), tech_stack: String(fd.get("tech_stack") ?? "").split(",").map((s) => s.trim()).filter(Boolean),
    });
    setPending(false);
    if (!res.ok) toast.error(res.error); else { toast.success("Submitted for review"); router.push("/dashboard/projects"); }
  }
  return (
    <div className="mx-auto max-w-2xl px-4 py-10 md:py-14">
      <h1 className="text-3xl font-semibold tracking-tight">Submit project</h1>
      <p className="mt-2 text-sm text-text-muted">Pending review — it goes live once an organiser approves it.</p>
      <form onSubmit={submit} className="mt-6 space-y-4">
        <div><label htmlFor="title" className="mb-1.5 block text-sm">Title</label><input id="title" name="title" required maxLength={120} placeholder="Calculator App" className={fieldCls} /></div>
        <div><label htmlFor="description" className="mb-1.5 block text-sm">Description (max 280)</label><textarea id="description" name="description" required maxLength={280} rows={3} placeholder="What it does, in one or two sentences." className={fieldCls} /></div>
        <ImageUploader bucket="screenshots" label="Screenshot" onUploaded={setScreenshot} />
        <div><label htmlFor="demo_url" className="mb-1.5 block text-sm">Demo URL</label><input id="demo_url" name="demo_url" type="url" placeholder="https://" className={fieldCls} /></div>
        <div><label htmlFor="repo_url" className="mb-1.5 block text-sm">Repo URL</label><input id="repo_url" name="repo_url" type="url" placeholder="https://" className={fieldCls} /></div>
        <div><label htmlFor="tech_stack" className="mb-1.5 block text-sm">Tech stack (comma-separated)</label><input id="tech_stack" name="tech_stack" placeholder="React, TypeScript, Tailwind" autoComplete="off" className={fieldCls} /></div>
        <button disabled={pending || !screenshot} className="w-full rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white transition-all duration-150 ease-out hover:bg-brand-700 active:translate-y-[1px] disabled:opacity-50">{pending ? "Submitting…" : "Submit for review"}</button>
      </form>
    </div>
  );
}
