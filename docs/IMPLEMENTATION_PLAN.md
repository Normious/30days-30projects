# Implementation Plan (from SPEC v1, frozen — framework amended to Next 16 per owner, see DECISIONS #10)

Source: `SPEC.md` (v1; database/auth contract unchanged). Order respects dependencies: migrations → backend → frontend → tests → docs → deploy.

## 0. Scaffold
- [x] package.json (Next 16 + React 19, Supabase, Zod, shadcn deps), tsconfig strict + noUncheckedIndexedAccess, tailwind tokens §8.3, globals.css, layout/Nav/Footer

## 1. Migrations (`supabase/migrations/`)
- [x] 0001 extensions (§10.1) · 0002 enums (§10.2) · 0003 core tables (profiles, challenges, challenge_participants, projects, project_authors) · 0004 organiser tables (organiser_applications, histories, invites, audit_log, likes) · 0005 triggers (7, §10.4) · 0006 RLS (8 helpers + all policies §11) · 0007 storage (screenshots, avatars §11.3)
- [x] Gate: all 7 migrations run clean on PG16 (`postgres:16-alpine` scratch + `auth`/`storage` stubs) + full-text smoke test green. `supabase db reset` on the full stack pending (CLI image pull is network-bound); re-run it once — no SQL changes expected.
- [x] Gates: `pnpm typecheck` 0 errors · `pnpm lint` clean · `pnpm test:unit` 8/8 · `pnpm test:integration` 3/3 · `pnpm build` 32/32 pages · prod `/about` → 200.

## 2. Backend (`lib/`, `actions/`, functions)
- [x] lib: supabase client/server/admin/middleware, auth, permissions, role-helpers, rate-limit (§20/§26.18), slug (§26.3), username, validation (Zod), constants (APP_CONFIG §23.5), formatters
- [x] actions: projects, moderation, challenges, challenge-organisers, participants, organiser-applications, roles, admin (bulkImport, inviteParticipants), profiles
- [x] Edge Functions: send-email (12 events §26.10), cleanup-orphans (§26.13), challenge-status (§26.2)
- [x] scripts: create-admin (§26.1), seed-from-json (§14)
- [ ] Gate: every action has auth check + Zod + audit_log write for sensitive ops

## 3. Frontend (all routes §12 + components §15)
- [x] Public: `/`, `/discover`, `/p/:slug`, `/u/:username`, `/c/:slug`, `/challenges`, `/about`
- [x] Auth: `/login`, `/register`, `/auth/callback`, `/auth/reset-password`
- [x] Authed: `/dashboard`, `/dashboard/projects`, `/new`, `/[id]/edit`, `/dashboard/challenges`, `/settings`, `/profile`, `/become-organiser`, `/status`
- [x] Organiser + Admin trees; components per §15; api/og, api/revalidate, sitemap, robots
- [ ] Gate: Lighthouse ≥ 95 (post-deploy), axe clean

## 4. Tests (§21)
- [x] Unit (Vitest): slug, username, validation, rate-limit, roles
- [x] Integration: migration contract tests (full RLS live tests need `supabase start`)
- [x] E2E (Playwright): public browse smoke
- [ ] Gate: `pnpm test:unit` green; coverage 80%+ for lib/

## 5. Docs + Open source
- [ ] README (deploy in 5 min), CONTRIBUTING, CODE_OF_CONDUCT, SECURITY, CHANGELOG, docs/{deployment,database,contributing-data,architecture}, DECISIONS, good-first-issues (§3: 10 items)

## 6. DevOps
- [ ] CI (typecheck+lint+test+build), CodeQL, preview deploys, Dependabot, issue/PR templates
- [ ] Tag v1.0.0; user pushes to Supabase/Vercel cloud (local-only verification here)
