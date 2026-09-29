# Decisions

| # | Decision | Rationale |
|---|----------|-----------|
| 1 | Keep `uuid_generate_v4()` in migrations (not `gen_random_uuid()`) | Match SPEC §10.3 verbatim; both extensions installed so either works. |
| 2 | `planned_start_date >= CURRENT_DATE` enforced in Zod/action, not as DB CHECK | DB check with `CURRENT_DATE` is non-deterministic for seeds/tests; app-layer validation preserves intent (§5.3). |
| 3 | Profile `UPDATE` policy simplified to `auth.uid() = id` (no column-guard subselects) | Spec's `WITH CHECK` subselects against same table cause recursion/ambiguity under RLS; role/status changes restricted to admin policy + server actions. Same security posture, enforceable. |
| 4 | Dual project-insert policies (standalone + challenge) kept as spec'd | Two `FOR INSERT` policies = OR semantics; preserves spec intent. |
| 5 | Rate limiting is in-memory (`lib/rate-limit.ts`) | SPEC §26.18 centralizes limits; Redis/Upstash upgrade path documented when multi-instance. |
| 6 | `incrementViewCount` falls back to read-modify-write when RPC missing | Works before/after `increment_project_views` RPC exists; replace with pure RPC once deployed. |
| 7 | Markdown via remark + rehype-sanitize (not raw HTML) | SPEC §20 XSS mitigation. |
| 8 | No new npm packages beyond spec stack | Remark parse/gfm/rehype packages justified here for §20 sanitization requirement. |
| 9 | `projects.search_vector` via trigger, not GENERATED column | Spec §10.3 expression uses `array_to_string`, which is STABLE (not IMMUTABLE) on PG16 — Postgres rejects it in GENERATED columns. Trigger computes the identical value; same column name, same GIN index. |
| 10 | Upgraded framework: Next.js 14 → 16 + React 18 → 19 (SPEC §7 amended by owner) | Owner directive 2026-09-29. Changes applied: async `cookies()`/`params`/`searchParams` throughout, `middleware.ts` → `proxy.ts` (Node runtime), `next lint` → ESLint 9 flat config (`eslint.config.mjs` + `@next/eslint-plugin-next`), React 19 peer bumps, `@supabase/ssr` 0.4 → 0.7. SPEC §10–11 (database) untouched. `docs/SPEC.md` stays v1-frozen; this row is the amendment record. |
