import { describe, expect, it } from "vitest";

// RLS + action integration tests require a local Supabase stack (supabase start).
// These are contract tests: they assert the SQL files contain every policy/trigger
// from SPEC §10–11 so CI fails fast when the stack isn't running.
import { readFileSync } from "fs";
import { join } from "path";

function sql(name: string): string {
  return readFileSync(join(__dirname, "..", "..", "supabase", "migrations", name), "utf8");
}

describe("migration contracts", () => {
  it("0006_rls contains all helper functions", () => {
    const s = sql("0006_rls.sql");
    for (const fn of ["is_admin", "is_organiser", "is_participant", "is_challenge_organiser", "is_challenge_primary_organiser", "can_moderate_challenge", "can_govern_challenge", "owns_challenge"]) {
      expect(s).toContain(fn);
    }
  });
  it("0005_triggers contains all 7 triggers", () => {
    const s = sql("0005_triggers.sql");
    for (const t of ["trg_profiles_updated", "on_auth_user_created", "trg_auto_participant", "trg_project_count", "trg_role_history", "trg_sync_primary_organiser", "trg_project_published"]) {
      expect(s).toContain(t);
    }
  });
  it("0007_storage creates both buckets", () => {
    const s = sql("0007_storage.sql");
    expect(s).toContain("screenshots");
    expect(s).toContain("avatars");
  });
});
