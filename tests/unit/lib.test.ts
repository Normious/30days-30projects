import { describe, expect, it } from "vitest";
import { uniqueSlug, isValidProjectSlug, isValidChallengeSlug } from "@/lib/slug";
import { isValidUsername, baseUsernameFromEmail } from "@/lib/username";
import { checkRateLimit, resetRateLimits } from "@/lib/rate-limit";
import { hasRole } from "@/lib/role-helpers";
import { projectSchema, organiserApplicationSchema } from "@/lib/validation";

describe("slug", () => {
  it("generates unique slugs with -2 suffix", () => {
    expect(uniqueSlug("Calculator App", new Set())).toBe("calculator-app");
    expect(uniqueSlug("Calculator App", new Set(["calculator-app"]))).toBe("calculator-app-2");
  });
  it("validates shapes", () => {
    expect(isValidProjectSlug("calculator-app")).toBe(true);
    expect(isValidProjectSlug("Bad Slug!")).toBe(false);
    expect(isValidChallengeSlug("september-2026")).toBe(true);
  });
});

describe("username", () => {
  it("rejects reserved words", () => {
    expect(isValidUsername("admin")).toBe(false);
    expect(isValidUsername("alice-banda")).toBe(true);
  });
  it("derives base from email", () => {
    expect(baseUsernameFromEmail("Alice@Example.com")).toBe("alice");
  });
});

describe("rate-limit", () => {
  it("enforces project cap 5/hr", () => {
    resetRateLimits();
    for (let i = 0; i < 5; i++) expect(checkRateLimit("projectSubmission", "u1").ok).toBe(true);
    expect(checkRateLimit("projectSubmission", "u1").ok).toBe(false);
  });
});

describe("roles", () => {
  it("linear hierarchy admin > organiser > participant > user", () => {
    expect(hasRole("admin", "organiser")).toBe(true);
    expect(hasRole("user", "participant")).toBe(false);
    expect(hasRole(undefined, "user")).toBe(false);
  });
});

describe("validation", () => {
  it("rejects long project titles", () => {
    const r = projectSchema.safeParse({ title: "x".repeat(121), description: "d", screenshot_url: "https://x.dev/a.png" });
    expect(r.success).toBe(false);
  });
  it("rejects short organiser motivation", () => {
    const r = organiserApplicationSchema.safeParse({ motivation: "short", planned_challenge_title: "Valid title", planned_challenge_description: "x".repeat(60), planned_start_date: "2026-10-01", planned_end_date: "2026-10-31" });
    expect(r.success).toBe(false);
  });
});
