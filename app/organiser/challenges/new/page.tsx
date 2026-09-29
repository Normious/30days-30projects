"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createChallenge } from "@/actions/challenges";

export default function NewChallenge(): React.JSX.Element {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  async function submit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setPending(true);
    const res = await createChallenge({ title: String(fd.get("title")), tagline: String(fd.get("tagline") ?? ""), description: String(fd.get("description") ?? ""), start_date: String(fd.get("start_date")), end_date: String(fd.get("end_date")), registration_mode: String(fd.get("registration_mode") ?? "public") });
    setPending(false);
    if (!res.ok) toast.error(res.error); else { toast.success("Draft created"); router.push("/organiser/challenges"); }
  }
  const input = "mt-1 w-full rounded-md border border-border bg-bg-subtle px-3 py-2";
  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-3xl font-semibold">Create challenge</h1>
      <form onSubmit={submit} className="mt-6 space-y-4">
        <div><label htmlFor="title" className="block text-sm">Title</label><input id="title" name="title" required className={input} /></div>
        <div><label htmlFor="tagline" className="block text-sm">Tagline</label><input id="tagline" name="tagline" maxLength={200} className={input} /></div>
        <div><label htmlFor="description" className="block text-sm">Description</label><textarea id="description" name="description" className={input} /></div>
        <div className="grid grid-cols-2 gap-3">
          <div><label htmlFor="start_date" className="block text-sm">Start</label><input id="start_date" name="start_date" type="date" required className={input} /></div>
          <div><label htmlFor="end_date" className="block text-sm">End</label><input id="end_date" name="end_date" type="date" required className={input} /></div>
        </div>
        <div><label htmlFor="registration_mode" className="block text-sm">Registration</label><select id="registration_mode" name="registration_mode" className={input}><option value="public">Public</option><option value="invite_only">Invite only</option></select></div>
        <button disabled={pending} className="w-full rounded-md bg-brand-600 px-4 py-2 text-white disabled:opacity-50">Save as draft</button>
      </form>
    </div>
  );
}
