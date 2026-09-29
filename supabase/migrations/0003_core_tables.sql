-- 0003 core tables. Refs: SPEC §10.3 (profiles, challenges, challenge_participants, projects, project_authors)

CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE NOT NULL
        CHECK (username ~ '^[a-z0-9][a-z0-9-]{1,28}[a-z0-9]$'
               AND username NOT IN (
                   'admin','api','login','logout','register','dashboard',
                   'discover','u','p','c','me','settings','about','help',
                   'organiser','challenges'
               )),
    display_name TEXT NOT NULL,
    bio TEXT CHECK (length(bio) <= 500),
    avatar_url TEXT,
    linkedin_url TEXT,
    github_url TEXT,
    twitter_url TEXT,
    website_url TEXT,
    location TEXT,
    email_public BOOLEAN DEFAULT FALSE,
    platform_role platform_role DEFAULT 'user',
    organiser_status organiser_application_status,
    organiser_approved_at TIMESTAMPTZ,
    organiser_approved_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    organiser_revoked_at TIMESTAMPTZ,
    organiser_revoked_reason TEXT,
    challenge_count INTEGER DEFAULT 0,
    project_count INTEGER DEFAULT 0,
    last_participated_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);
CREATE INDEX IF NOT EXISTS idx_profiles_platform_role ON profiles(platform_role);
CREATE INDEX IF NOT EXISTS idx_profiles_organiser_status ON profiles(organiser_status) WHERE organiser_status IS NOT NULL;

CREATE TABLE IF NOT EXISTS challenges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL CHECK (slug ~ '^[a-z0-9][a-z0-9-]{1,60}[a-z0-9]$'),
    title TEXT NOT NULL,
    tagline TEXT CHECK (length(tagline) <= 200),
    description TEXT,
    rules TEXT,
    hero_image_url TEXT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    registration_mode registration_mode DEFAULT 'public',
    status challenge_status DEFAULT 'draft',
    primary_organiser_id UUID REFERENCES profiles(id) ON DELETE RESTRICT,
    max_participants INTEGER DEFAULT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CHECK (end_date >= start_date),
    CHECK ((status = 'draft' AND primary_organiser_id IS NULL) OR (status != 'draft' AND primary_organiser_id IS NOT NULL))
);
CREATE INDEX IF NOT EXISTS idx_challenges_slug ON challenges(slug);
CREATE INDEX IF NOT EXISTS idx_challenges_status ON challenges(status);
CREATE INDEX IF NOT EXISTS idx_challenges_dates ON challenges(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_challenges_primary_organiser ON challenges(primary_organiser_id);

CREATE TABLE IF NOT EXISTS challenge_participants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    challenge_id UUID NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    role challenge_role NOT NULL DEFAULT 'participant',
    is_primary BOOLEAN DEFAULT FALSE,
    status participant_status DEFAULT 'active',
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    UNIQUE(challenge_id, user_id),
    CHECK (is_primary = FALSE OR role = 'organiser')
);
CREATE INDEX IF NOT EXISTS idx_cp_challenge ON challenge_participants(challenge_id);
CREATE INDEX IF NOT EXISTS idx_cp_user ON challenge_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_cp_organisers ON challenge_participants(challenge_id) WHERE role = 'organiser';
CREATE UNIQUE INDEX IF NOT EXISTS idx_one_primary_organiser_per_challenge ON challenge_participants(challenge_id) WHERE role = 'organiser' AND is_primary = TRUE;

CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL CHECK (slug ~ '^[a-z0-9][a-z0-9-]{1,80}[a-z0-9]$'),
    title TEXT NOT NULL CHECK (length(title) <= 120),
    description TEXT NOT NULL CHECK (length(description) <= 280),
    long_description TEXT,
    screenshot_url TEXT NOT NULL,
    demo_url TEXT,
    repo_url TEXT,
    source_snippet TEXT,
    source_language TEXT,
    tech_stack TEXT[] DEFAULT '{}',
    category TEXT,
    challenge_id UUID REFERENCES challenges(id) ON DELETE SET NULL,
    day_number INTEGER CHECK (day_number IS NULL OR (day_number >= 1 AND day_number <= 365)),
    status project_status DEFAULT 'pending',
    rejection_reason TEXT,
    featured BOOLEAN DEFAULT FALSE,
    view_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    published_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects(slug);
CREATE INDEX IF NOT EXISTS idx_projects_challenge ON projects(challenge_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(featured) WHERE featured = TRUE;
CREATE INDEX IF NOT EXISTS idx_projects_created ON projects(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_projects_tech_stack ON projects USING GIN(tech_stack);
-- search_vector maintained by trg_projects_search_vector (0005_triggers): array_to_string is
-- STABLE on PG16 so it cannot appear in a GENERATED expression. Same column, same GIN index.
ALTER TABLE projects ADD COLUMN IF NOT EXISTS search_vector tsvector;
CREATE INDEX IF NOT EXISTS idx_projects_search ON projects USING GIN(search_vector);

CREATE TABLE IF NOT EXISTS project_authors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    role author_role NOT NULL DEFAULT 'author',
    display_order INTEGER DEFAULT 0,
    UNIQUE(project_id, user_id)
);
CREATE INDEX IF NOT EXISTS idx_pa_project ON project_authors(project_id);
CREATE INDEX IF NOT EXISTS idx_pa_user ON project_authors(user_id);
