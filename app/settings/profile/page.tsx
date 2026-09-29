"use client";

import { useState } from "react";
import { toast } from "sonner";
import { updateProfile } from "@/actions/profiles";
import { fieldCls } from "@/components/ui";

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
    <div className="mx-auto max-w-2xl px-4 py-10 md:py-14">
      <h1 className="text-3xl font-semibold tracking-tight">Profile</h1>
      <p className="mt-2 text-sm text-text-muted">This is what recruiters see on your portfolio page.</p>
      <form onSubmit={submit} className="mt-6 space-y-4">
        <div><label htmlFor="display_name" className="mb-1.5 block text-sm">Display name</label><input id="display_name" name="display_name" required autoComplete="name" className={fieldCls} /></div>
        <div><label htmlFor="bio" className="mb-1.5 block text-sm">Bio (max 500)</label><textarea id="bio" name="bio" maxLength={500} rows={3} className={fieldCls} /></div>
        <div><label htmlFor="location" className="mb-1.5 block text-sm">Location</label><input id="location" name="location" autoComplete="address-level2" className={fieldCls} /></div>
        <div><label htmlFor="linkedin_url" className="mb-1.5 block text-sm">LinkedIn URL</label><input id="linkedin_url" name="linkedin_url" type="url" placeholder="https://" className={fieldCls} /></div>
        <div><label htmlFor="github_url" className="mb-1.5 block text-sm">GitHub URL</label><input id="github_url" name="github_url" type="url" placeholder="https://" className={fieldCls} /></div>
        <div><label htmlFor="website_url" className="mb-1.5 block text-sm">Website</label><input id="website_url" name="website_url" type="url" placeholder="https://" className={fieldCls} /></div>
        <button disabled={pending} className="w-full rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white transition-all duration-150 ease-out hover:bg-brand-700 active:translate-y-[1px] disabled:opacity-50">Save</button>
      </form>
    </div>
  );
}
