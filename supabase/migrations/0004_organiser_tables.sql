-- 0004 organiser tables. Refs: SPEC §10.3 (organiser_applications, histories, invites, audit_log, likes)

CREATE TABLE IF NOT EXISTS organiser_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    applicant_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    motivation TEXT NOT NULL CHECK (length(motivation) BETWEEN 100 AND 2000),
    planned_challenge_title TEXT NOT NULL CHECK (length(planned_challenge_title) BETWEEN 5 AND 120),
    planned_challenge_description TEXT NOT NULL CHECK (length(planned_challenge_description) BETWEEN 50 AND 2000),
    planned_start_date DATE NOT NULL,
    planned_end_date DATE NOT NULL,
    expected_participants INTEGER CHECK (expected_participants IS NULL OR (expected_participants > 0 AND expected_participants <= 10000)),
    previous_experience TEXT CHECK (length(previous_experience) <= 1000),
    portfolio_url TEXT,
    linkedin_url TEXT,
    community_references TEXT CHECK (length(community_references) <= 500),
    status organiser_application_status NOT NULL DEFAULT 'pending',
    reviewed_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    reviewed_at TIMESTAMPTZ,
    rejection_reason TEXT CHECK (length(rejection_reason) <= 500),
    reviewer_notes TEXT,
    is_admin_initiated BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CHECK (planned_end_date >= planned_start_date)
);
CREATE INDEX IF NOT EXISTS idx_org_apps_applicant ON organiser_applications(applicant_id);
CREATE INDEX IF NOT EXISTS idx_org_apps_status ON organiser_applications(status);
CREATE INDEX IF NOT EXISTS idx_org_apps_created ON organiser_applications(created_at DESC);
CREATE UNIQUE INDEX IF NOT EXISTS idx_org_apps_one_pending ON organiser_applications(applicant_id) WHERE status = 'pending';

CREATE TABLE IF NOT EXISTS user_role_history (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    old_role platform_role,
    new_role platform_role NOT NULL,
    changed_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_role_history_user ON user_role_history(user_id);
CREATE INDEX IF NOT EXISTS idx_role_history_created ON user_role_history(created_at DESC);

CREATE TABLE IF NOT EXISTS challenge_organiser_history (
    id BIGSERIAL PRIMARY KEY,
    challenge_id UUID NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    action TEXT NOT NULL CHECK (action IN ('added', 'removed', 'promoted_to_primary', 'stepped_down')),
    performed_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_org_history_challenge ON challenge_organiser_history(challenge_id);
CREATE INDEX IF NOT EXISTS idx_org_history_user ON challenge_organiser_history(user_id);
CREATE INDEX IF NOT EXISTS idx_org_history_created ON challenge_organiser_history(created_at DESC);

CREATE TABLE IF NOT EXISTS challenge_invites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    challenge_id UUID NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    token_hash TEXT NOT NULL UNIQUE,
    invited_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    used_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_ci_challenge ON challenge_invites(challenge_id);
CREATE INDEX IF NOT EXISTS idx_ci_email ON challenge_invites(lower(email));

CREATE TABLE IF NOT EXISTS audit_log (
    id BIGSERIAL PRIMARY KEY,
    actor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    target_type TEXT NOT NULL,
    target_id UUID,
    metadata JSONB DEFAULT '{}',
    ip_address INET,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_audit_actor ON audit_log(actor_id);
CREATE INDEX IF NOT EXISTS idx_audit_action ON audit_log(action);
CREATE INDEX IF NOT EXISTS idx_audit_created ON audit_log(created_at DESC);

CREATE TABLE IF NOT EXISTS project_likes (
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, project_id)
);
CREATE INDEX IF NOT EXISTS idx_likes_project ON project_likes(project_id);
