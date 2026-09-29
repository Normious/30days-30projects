"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createProject } from "@/actions/projects";
import { ImageUploader } from "@/components/image-uploader";

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
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-3xl font-semibold">Submit project</h1>
      <form onSubmit={submit} className="mt-6 space-y-4">
        <div><label htmlFor="title" className="block text-sm">Title</label><input id="title" name="title" required maxLength={120} className="mt-1 w-full rounded-md border border-border bg-bg-subtle px-3 py-2" /></div>
        <div><label htmlFor="description" className="block text-sm">Description (max 280)</label><textarea id="description" name="description" required maxLength={280} className="mt-1 w-full rounded-md border border-border bg-bg-subtle px-3 py-2" /></div>
        <ImageUploader bucket="screenshots" label="Screenshot" onUploaded={setScreenshot} />
        <div><label htmlFor="demo_url" className="block text-sm">Demo URL</label><input id="demo_url" name="demo_url" type="url" className="mt-1 w-full rounded-md border border-border bg-bg-subtle px-3 py-2" /></div>
        <div><label htmlFor="repo_url" className="block text-sm">Repo URL</label><input id="repo_url" name="repo_url" type="url" className="mt-1 w-full rounded-md border border-border bg-bg-subtle px-3 py-2" /></div>
        <div><label htmlFor="tech_stack" className="block text-sm">Tech stack (comma-separated)</label><input id="tech_stack" name="tech_stack" placeholder="React, TypeScript, Tailwind" className="mt-1 w-full rounded-md border border-border bg-bg-subtle px-3 py-2" /></div>
        <button disabled={pending || !screenshot} className="w-full rounded-md bg-brand-600 px-4 py-2 text-white disabled:opacity-50">{pending ? "Submitting…" : "Submit for review"}</button>
      </form>
    </div>
  );
}
