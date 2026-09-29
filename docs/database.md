# Database

Migrations in `supabase/migrations/` (0001 extensions → 0007 storage). Enums: `platform_role`, `challenge_role`, `challenge_status`, `registration_mode`, `project_status`, `participant_status`, `author_role`, `organiser_application_status`.

Core: `profiles` (1:1 with `auth.users`), `challenges`, `challenge_participants` (participants + organisers, one primary per challenge), `projects` (+ `search_vector` full-text), `project_authors` (author/co-author, co-authors must be registered).

Governance: `organiser_applications` (one pending per user), `user_role_history`, `challenge_organiser_history`, `challenge_invites` (hashed tokens, 7-day expiry), `audit_log`, `project_likes` (Phase 2).

Triggers: `touch_updated_at` ×4, `handle_new_user` (auto-profile), `auto_promote_to_participant`, `track_project_creation`, `log_role_change`, `sync_challenge_primary_organiser`, `handle_project_approval` (sets `published_at`).

RLS helpers: `is_admin`, `is_organiser`, `is_participant`, `is_challenge_organiser`, `is_challenge_primary_organiser`, `can_moderate_challenge`, `can_govern_challenge`, `owns_challenge`. See migration `0006_rls.sql` for policy-by-policy intent.

Storage: `screenshots` (5MB, image/*), `avatars` (2MB, image/*), public read + authenticated write; orphans cleaned nightly by `cleanup-orphans`.
