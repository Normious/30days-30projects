# Deployment (Vercel + Supabase, free tiers)

1. Fork the repo.
2. `pnpm install`; `cp .env.example .env.local`; fill Supabase keys, `ADMIN_EMAIL`, `RESEND_API_KEY`.
3. Supabase dashboard → new project → Auth → enable Email magic link, Google, GitHub; redirect URL `https://<your-domain>/auth/callback`.
4. `supabase link` then `supabase db push`; create public buckets `screenshots`, `avatars`.
5. Register at `/register`, then `pnpm create-admin --email=<you>`.
6. Seed: `pnpm seed --file=seed/september-2026.json --auto-approve` or Admin → Import.
7. `vercel --prod`; add custom domain in Vercel dashboard.
8. Supabase → Edge Functions: deploy `send-email`, `cleanup-orphans` (nightly cron), `challenge-status` (daily cron).
