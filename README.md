# 30 Days, 30 Projects

An open-source multi-challenge portfolio and submission platform. Participants join challenges, submit projects, and get a permanent portfolio page at `/u/:username`. Organisers run challenges; admins moderate.

## Deploy in 5 min (you push to cloud)

```bash
pnpm install
cp .env.example .env.local  # paste Supabase keys + ADMIN_EMAIL + RESEND_API_KEY
supabase start && supabase db reset
pnpm dev  # http://localhost:3000
```

Cloud push (your step):
1. Create a Supabase project → copy URL/anon/service keys → `supabase db push` (or link + push).
2. Create `screenshots` + `avatars` public buckets; enable Email magic link + Google + GitHub auth; set redirect to `https://your-domain/auth/callback`.
3. Register via `/register`, then `pnpm create-admin --email=<you>`.
4. `pnpm seed --file=seed/september-2026.json --auto-approve` (or Admin → Import).
5. `vercel --prod`.

## Scripts

| Script | Purpose |
|--------|---------|
| `pnpm dev` / `build` / `start` | Next.js |
| `pnpm typecheck` / `lint` | `tsc --noEmit` / `next lint` |
| `pnpm test:unit` / `test:integration` / `test:e2e` | Vitest / Vitest / Playwright |
| `pnpm create-admin` | Promote user via `ADMIN_EMAIL` |
| `pnpm seed` | Bulk import seed JSON |

Spec: `SPEC.md` (v1, frozen). Plan: `docs/IMPLEMENTATION_PLAN.md`. Decisions: `docs/DECISIONS.md`.
