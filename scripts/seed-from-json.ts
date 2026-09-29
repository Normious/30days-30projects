/** Seed from JSON: pnpm seed --file=seed/x.json [--auto-approve]. Uses service role locally. */
import { readFileSync } from "fs";
import { createClient } from "@supabase/supabase-js";
import type { SeedFile } from "../actions/admin";

const file = process.argv.find((a) => a.startsWith("--file="))?.split("=")[1];
const autoApprove = process.argv.includes("--auto-approve");
if (!file) {
  console.error("Usage: pnpm seed --file=seed/september-2026.json [--auto-approve]");
  process.exit(1);
}
const seed = JSON.parse(readFileSync(file, "utf8")) as SeedFile;
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL ?? "", process.env.SUPABASE_SERVICE_ROLE_KEY ?? "", { auth: { persistSession: false } });

// Challenge upsert
const { data: ch } = await supabase.from("challenges").upsert({
  slug: seed.challenge.slug, title: seed.challenge.title, tagline: seed.challenge.tagline ?? null,
  description: seed.challenge.description ?? null, rules: seed.challenge.rules ?? null,
  start_date: seed.challenge.start_date, end_date: seed.challenge.end_date,
  registration_mode: seed.challenge.registration_mode ?? "public", status: seed.challenge.status ?? "completed",
}, { onConflict: "slug" }).select("id").single();
if (!ch) {
  console.error("Challenge upsert failed");
  process.exit(1);
}
console.log(`Challenge: ${seed.challenge.slug} (autoApprove=${autoApprove})`);
console.log(`Participants in file: ${seed.participants.length}. Use the admin /admin/import UI or bulkImport action for full import.`);
