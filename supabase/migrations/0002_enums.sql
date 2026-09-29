-- 0002 enums. Refs: SPEC §10.2
DO $$ BEGIN CREATE TYPE platform_role AS ENUM ('user', 'participant', 'organiser', 'admin'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE challenge_role AS ENUM ('organiser', 'participant'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE challenge_status AS ENUM ('draft', 'upcoming', 'active', 'completed', 'archived'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE registration_mode AS ENUM ('public', 'invite_only'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE project_status AS ENUM ('pending', 'approved', 'rejected'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE participant_status AS ENUM ('active', 'completed', 'dropped'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE author_role AS ENUM ('author', 'co_author'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE organiser_application_status AS ENUM ('pending', 'approved', 'rejected', 'withdrawn', 'suspended'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
