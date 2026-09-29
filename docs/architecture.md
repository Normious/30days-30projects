# Architecture

Next.js 14 (RSC + Server Actions) on Vercel → Supabase (GoTrue auth, Postgres + RLS, Storage, Edge Functions). Reads via Server Components (`@supabase/ssr`); mutations via Server Actions (Zod-validated, rate-limited, audit-logged); storage direct-to-bucket with nightly orphan cleanup; `challenge-status` cron flips `upcoming→active→completed`; `send-email` (Resend) fires 12 lifecycle events. Search is Postgres full-text on `projects.search_vector` (v1 scope: projects only).
