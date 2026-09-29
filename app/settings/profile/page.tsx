"use client";

import { useState } from "react";
import { toast } from "sonner";
import { updateProfile } from "@/actions/profiles";

export default function ProfileEditor(): React.JSX.Element {
  const [pending, setPending] = useState(false);
  async function submit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setPending(true);
    const res = await updateProfile({ display_name: String(fd.get("display_name")), bio: String(fd.get("bio") ?? ""), location: String(fd.get("location") ?? ""), linkedin_url: String(fd.get("linkedin_url") ?? ""), github_url: String(fd.get("github_url") ?? ""), website_url: String(fd.get("website_url") ?? "") });
    setPending(false);
    if (!res.ok) toast.error(res.error); else toast.success("Profile saved");
  }
  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-3xl font-semibold">Profile</h1>
      <form onSubmit={submit} className="mt-6 space-y-4">
        <div><label htmlFor="display_name" className="block text-sm">Display name</label><input id="display_name" name="display_name" required className="mt-1 w-full rounded-md border border-border bg-bg-subtle px-3 py-2" /></div>
        <div><label htmlFor="bio" className="block text-sm">Bio (max 500)</label><textarea id="bio" name="bio" maxLength={500} className="mt-1 w-full rounded-md border border-border bg-bg-subtle px-3 py-2" /></div>
        <div><label htmlFor="location" className="block text-sm">Location</label><input id="location" name="location" className="mt-1 w-full rounded-md border border-border bg-bg-subtle px-3 py-2" /></div>
        <div><label htmlFor="linkedin_url" className="block text-sm">LinkedIn URL</label><input id="linkedin_url" name="linkedin_url" type="url" className="mt-1 w-full rounded-md border border-border bg-bg-subtle px-3 py-2" /></div>
        <div><label htmlFor="github_url" className="block text-sm">GitHub URL</label><input id="github_url" name="github_url" type="url" className="mt-1 w-full rounded-md border border-border bg-bg-subtle px-3 py-2" /></div>
        <div><label htmlFor="website_url" className="block text-sm">Website</label><input id="website_url" name="website_url" type="url" className="mt-1 w-full rounded-md border border-border bg-bg-subtle px-3 py-2" /></div>
        <button disabled={pending} className="w-full rounded-md bg-brand-600 px-4 py-2 text-white disabled:opacity-50">Save</button>
      </form>
    </div>
  );
}
