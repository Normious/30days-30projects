"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { applyForOrganiser } from "@/actions/organiser-applications";

export default function BecomeOrganiser(): React.JSX.Element {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  async function submit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setPending(true);
    const res = await applyForOrganiser({
      motivation: String(fd.get("motivation")), planned_challenge_title: String(fd.get("planned_challenge_title")),
      planned_challenge_description: String(fd.get("planned_challenge_description")),
      planned_start_date: String(fd.get("planned_start_date")), planned_end_date: String(fd.get("planned_end_date")),
      previous_experience: String(fd.get("previous_experience") ?? ""), portfolio_url: String(fd.get("portfolio_url") ?? ""),
      linkedin_url: String(fd.get("linkedin_url") ?? ""), community_references: String(fd.get("community_references") ?? ""),
    });
    setPending(false);
    if (!res.ok) toast.error(res.error); else { toast.success("Application submitted"); router.push("/settings/become-organiser/status"); }
  }
  const input = "w-full rounded-md border border-border bg-bg-subtle px-3 py-2 text-sm text-text placeholder:text-text-subtle transition-colors hover:border-border-strong focus:border-brand-500 focus:outline-none";
  return (
    <div className="mx-auto max-w-2xl px-4 py-10 md:py-14">
      <h1 className="text-3xl font-semibold tracking-tight">Become an organiser</h1>
      <p className="mt-2 text-sm text-text-muted">Accounts must be 7+ days old. One pending application at a time.</p>
      <form onSubmit={submit} className="mt-6 space-y-4">
        <div><label htmlFor="motivation" className="block text-sm">Motivation (100–2000 chars)</label><textarea id="motivation" name="motivation" required minLength={100} maxLength={2000} className={input} /></div>
        <div><label htmlFor="planned_challenge_title" className="block text-sm">Planned challenge title (5–120)</label><input id="planned_challenge_title" name="planned_challenge_title" required minLength={5} maxLength={120} className={input} /></div>
        <div><label htmlFor="planned_challenge_description" className="block text-sm">Planned challenge description (50–2000)</label><textarea id="planned_challenge_description" name="planned_challenge_description" required minLength={50} maxLength={2000} className={input} /></div>
        <div className="grid grid-cols-2 gap-3">
          <div><label htmlFor="planned_start_date" className="block text-sm">Start date</label><input id="planned_start_date" name="planned_start_date" type="date" required className={input} /></div>
          <div><label htmlFor="planned_end_date" className="block text-sm">End date</label><input id="planned_end_date" name="planned_end_date" type="date" required className={input} /></div>
        </div>
        <div><label htmlFor="previous_experience" className="block text-sm">Previous experience</label><textarea id="previous_experience" name="previous_experience" maxLength={1000} className={input} /></div>
        <div><label htmlFor="portfolio_url" className="block text-sm">Portfolio URL</label><input id="portfolio_url" name="portfolio_url" type="url" className={input} /></div>
        <div><label htmlFor="linkedin_url" className="block text-sm">LinkedIn URL</label><input id="linkedin_url" name="linkedin_url" type="url" className={input} /></div>
        <div><label htmlFor="community_references" className="block text-sm">Community references</label><textarea id="community_references" name="community_references" maxLength={500} className={input} /></div>
        <button disabled={pending} className="w-full rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white transition-all duration-150 ease-out hover:bg-brand-700 active:translate-y-[1px] disabled:opacity-50">Submit application</button>
      </form>
    </div>
  );
}
