# 📘 30days-30projects — Platform Specification

**Project:** 30 Days, 30 Projects — The Open-Source Challenge Platform  
**Codename:** `30days-30projects`  
**Author:** Emmanuel Phiri  
**Spec Version:** **v1** (frozen)  
**Application Version:** `1.0.0` (follows SemVer separately)  
**Date:** September 28, 2026  
**License:** MIT  
**Repository:** `https://github.com/Normious/30days-30projects`  
**Status:** ✅ **LOCKED**

---

## 📌 Document Versioning Convention

| Artifact | Versioning Rule |
|----------|-----------------|
| **This specification (`docs/SPEC.md`)** | **Always v1.** Never bump. Edits logged in the changelog below. |
| **Application code** | Follows SemVer — `1.0.0` → `1.0.1` (patch) → `1.1.0` (feature) → `2.0.0` (breaking) |
| **Database migrations** | Sequential — `0001_xxx.sql`, `0002_xxx.sql`, ... |
| **Documentation site** | Follows app version |

**Why:** The spec is a *contract*. Contracts don't drift. Code iterates.

### 📝 Spec Changelog (within v1)

```
[2026-09-28] Initial spec published
[2026-09-28] Added 4-role model + organiser application workflow
[2026-09-28] Added multi-organiser model (1 primary + N co-organisers)
[2026-09-28] Codename changed: Zotsatira → 30days-30projects
[2026-09-28] Design system locked: shadcn/ui + Tailwind + Radix
[2026-09-28] Removed §23.6 Service Integration Points
[2026-09-28] Integrated 18 implementation clarifications (§26)
[2026-09-28] SPEC FROZEN — v1 locked for build
```

---

## 1. Executive Summary

**30days-30projects** is an open-source, multi-challenge portfolio and submission platform for developer challenges. It serves three audiences:

| Audience | Job to Be Done |
|----------|---------------|
| **Participants** | Join a challenge, submit projects, get a permanent portfolio page |
| **Organisers** | Create and run challenges, invite participants, curate submissions |
| **Visitors / Recruiters** | Discover talent, browse projects, contact developers |

**Killer feature:** Every participant gets a **`/u/:username`** page that acts as a living portfolio — a URL they can put on their LinkedIn, resume, and email signature.

**Open-source mission:** Designed to be **forked and deployed by any community** running their own developer challenges. Contribution guidelines, seed data, and documentation are first-class citizens.

**Origin story:** Built as the Day 30 capstone of the September 2026 *30 Days, 30 Projects* challenge — a developer challenge that itself produced 30 microservices across 4 languages.

---

## 2. Goals & Non-Goals

### ✅ Goals (v1.0.0 release)

- Multi-challenge architecture (future-proof)
- Supabase Auth (email magic link + Google + GitHub OAuth)
- Public portfolio pages with SEO
- Screenshot + demo + repo + optional source snippet per project
- Team submissions (multiple authors per project — co-authors must already be registered)
- Standalone projects (no challenge required)
- Admin + Organiser approval workflow
- Multiple organisers per challenge (1 primary + N co-organisers)
- Organiser application workflow with admin review
- Bulk JSON seed import with `--auto-approve`
- Config-driven branding (forkable)
- Fully open-source, MIT licensed

### ❌ Non-Goals (deferred to post-v1.0.0)

- In-platform messaging between recruiters and participants
- Project comments
- Scoring / judging system
- Paid tiers / monetization
- Real-time notifications
- Mobile app
- Custom domains per participant
- PDF resume export
- Multi-language UI
- Email invites for co-authors (co-authors must already exist)

---

## 3. Open Source Strategy

### 🎁 What Makes This Fork-Friendly

| Feature | Why It Matters for Forks |
|---------|--------------------------|
| **Single-command setup** | `pnpm setup` runs migrations + seeds |
| **Seed JSON template** | Any org can fork and swap in their own data |
| **No paid services required** | Supabase free tier + Vercel free tier = $0 |
| **Config-driven branding** | Change app name, logo, colors in one file |
| **Full docs** | Deployment guide for non-technical organisers |
| **MIT License** | Maximum freedom for reuse |

### 📁 Repository Root Files

```
30days-30projects/
├── LICENSE                       # MIT
├── README.md
├── CONTRIBUTING.md
├── CODE_OF_CONDUCT.md
├── SECURITY.md
├── CHANGELOG.md
├── .github/
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.md
│   │   ├── feature_request.md
│   │   └── good_first_issue.md
│   ├── PULL_REQUEST_TEMPLATE.md
│   ├── FUNDING.yml
│   └── workflows/
│       ├── ci.yml
│       ├── codeql.yml
│       └── deploy-preview.yml
├── docs/
│   ├── SPEC.md                   # ← this document (v1 forever)
│   ├── deployment.md
│   ├── database.md
│   ├── contributing-data.md
│   └── architecture.md
└── (app code — see §15)
```

### 🏷️ Pre-Seeded "Good First Issues"

1. Add light theme toggle
2. Add "Copy portfolio URL" button on profile
3. Add `og:image` generation for project pages
4. Add filter by language (TypeScript, Python, Go, Rust)
5. Add "similar projects" section on project detail
6. Add RSS feed for new projects
7. Add keyboard shortcuts on `/discover`
8. Add "download seed template as JSON" admin button
9. Add participant "share on LinkedIn" button
10. Add project view count display

---

## 4. Roles & Permissions

### 4.1 Role Hierarchy (Linear)

```
        ┌──────────────┐
        │    ADMIN     │  Platform owner
        └──────┬───────┘
               │ inherits ↓
        ┌──────────────┐
        │  ORGANISER   │  Creates + runs challenges
        └──────┬───────┘
               │ inherits ↓
        ┌──────────────┐
        │ PARTICIPANT  │  Joins challenges, submits projects
        └──────┬───────┘
               │ inherits ↓
        ┌──────────────┐
        │    USER      │  Registered, standalone projects only
        └──────────────┘
```

### 4.2 Role Definitions

| Role | Who | How Assigned |
|------|-----|--------------|
| **User** | Anyone who registers | Automatic on signup |
| **Participant** | User who joined ≥1 challenge | Automatic on joining |
| **Organiser** | Approved by admin OR promoted directly | Admin action OR application approved |
| **Admin** | Platform owner | **Via `pnpm create-admin --email=<email>` script (reads from `ADMIN_EMAIL` env var)** |

### 4.3 Permissions Matrix

| Action | User | Participant | Organiser | Admin |
|--------|:----:|:-----------:|:---------:|:-----:|
| Browse catalogue | ✅ | ✅ | ✅ | ✅ |
| View public profiles | ✅ | ✅ | ✅ | ✅ |
| Edit own profile | ✅ | ✅ | ✅ | ✅ |
| Create standalone project | ✅ | ✅ | ✅ | ✅ |
| Join a public challenge | ❌ | ✅ | ✅ | ✅ |
| Submit project to a challenge | ❌ | ✅ | ✅ | ✅ |
| Create own challenge | ❌ | ❌ | ✅ | ✅ |
| Edit own challenge | ❌ | ❌ | ✅ | ✅ |
| Approve/reject projects in own challenge | ❌ | ❌ | ✅ | ✅ |
| Feature projects in own challenge | ❌ | ❌ | ✅ | ✅ |
| Apply to become organiser | ✅ | ✅ | — | — |
| Invite participants to own challenge | ❌ | ❌ | ✅ | ✅ |
| Manage co-organisers | ❌ | ❌ | ✅ (primary only) | ✅ |
| Approve/reject projects in any challenge | ❌ | ❌ | ❌ | ✅ |
| Create/edit/delete any challenge | ❌ | ❌ | ❌ | ✅ |
| Approve/reject organiser applications | ❌ | ❌ | ❌ | ✅ |
| Promote users | ❌ | ❌ | ❌ | ✅ |
| Ban/suspend users | ❌ | ❌ | ❌ | ✅ |
| View audit log | ❌ | ❌ | ❌ | ✅ |
| Delete any project | ❌ | ❌ | ❌ | ✅ |
| Bulk import seed data | ❌ | ❌ | ❌ | ✅ |

### 4.4 Role Transitions

| Transition | Trigger | Reversible? |
|------------|---------|:-----------:|
| Guest → User | Register | N/A |
| User → Participant | Joins any challenge | Yes |
| Participant → Organiser | Admin approves application OR direct promotion | Yes |
| Organiser → Admin | Manual promotion via `create-admin` script or admin panel | Yes |

### 4.5 UI Representation

```
Emmanuel Phiri                    [ADMIN] [ORGANISER] [PARTICIPANT]
Full-stack developer · Lilongwe, Malawi
```

---

## 5. Organiser Application Workflow

### 5.1 Two Paths to Becoming Organiser

**Path A — Admin-Initiated (Direct Promotion)**  
Admin promotes a user via `/admin/users`. No application needed.

**Path B — User-Initiated (Application)**  
User applies via `/settings/become-organiser`. Admin reviews. Approve → user becomes organiser. Reject → user sees reason, can re-apply after 30 days.

### 5.2 State Machine

```
                    ┌──────────┐
                    │   none   │
                    └────┬─────┘
                         │ apply
                         ▼
                    ┌──────────┐
       ┌────────────│  pending │◀─────────────┐
       │            └────┬─────┘              │
       │ reject          │ approve            │ re-apply
       ▼                 ▼                    │ (after 30 days)
  ┌──────────┐      ┌──────────┐              │
  │ rejected │──────┤ approved │              │
  └────┬─────┘      └────┬─────┘              │
       │ withdraw        │ revoke             │
       │                 ▼                    │
       │            ┌──────────────┐          │
       │            │  suspended   │          │
       │            └──────┬───────┘          │
       └───────────────────┴──────────────────┘
```

### 5.3 Application Form Fields

| Field | Type | Required | Validation |
|-------|------|:--------:|-----------|
| Motivation | Text (markdown) | ✅ | 100–2000 chars |
| Planned challenge title | Text | ✅ | 5–120 chars |
| Planned challenge description | Text (markdown) | ✅ | 50–2000 chars |
| Planned dates | Date range | ✅ | Future dates only |
| Expected participants | Number | ❌ | 1–10,000 |
| Previous experience | Text | ❌ | Max 1000 chars |
| Portfolio URL | URL | ❌ | HTTPS |
| LinkedIn URL | URL | ❌ | HTTPS |
| Community references | Text | ❌ | Max 500 chars |

### 5.4 Admin Review Interface

**Route:** `/admin/organiser-applications`

**Approval action:**
- `profiles.platform_role = 'organiser'`
- `profiles.organiser_status = 'approved'`
- `organiser_applications.status = 'approved'`
- Email to applicant

**Rejection action:**
- Requires rejection reason (20–500 chars)
- Email to applicant with reason
- User can re-apply after 30 days

---

## 6. Multi-Organiser Model

### 6.1 Design

Each challenge has:
- **1 primary organiser** — accountable party
- **0–N co-organisers** — full moderation permissions

### 6.2 Permission Split

| Action | Primary | Co-Organiser | Admin |
|--------|:-------:|:------------:|:-----:|
| Edit challenge metadata | ✅ | ✅ | ✅ |
| Publish/archive challenge | ✅ | ✅ | ✅ |
| Add/remove co-organisers | ✅ | ❌ | ✅ |
| Approve/reject projects | ✅ | ✅ | ✅ |
| Feature projects | ✅ | ✅ | ✅ |
| Invite participants | ✅ | ✅ | ✅ |
| Delete challenge | ✅ | ❌ | ✅ |
| Transfer primary role | ✅ | ❌ | ✅ |
| Step down as organiser | ⚠️ (must assign new primary) | ✅ | — |

### 6.3 Helper Functions

| Function | Returns |
|----------|---------|
| `is_challenge_organiser(challenge_id)` | TRUE if user is primary OR co-organiser |
| `is_challenge_primary_organiser(challenge_id)` | TRUE if user is primary only |
| `can_moderate_challenge(challenge_id)` | TRUE if organiser OR admin |
| `can_govern_challenge(challenge_id)` | TRUE if primary OR admin |

### 6.4 Key Flows

**Add Co-Organiser:** Primary enters email → search user (must be registered) → confirm → insert `challenge_participants` row with `role='organiser', is_primary=false` → email sent.

**Promote to Primary:** Primary clicks "Make primary" on co-organiser → confirmation → swap `is_primary` flags → trigger syncs `challenges.primary_organiser_id`.

**Leave as Organiser:** Co-organiser clicks "Leave" → confirmation → row deleted → email to primary.

**Admin Transfer:** Admin manages organisers from `/admin/challenges/:slug`.

### 6.5 Edge Cases

| Scenario | Behaviour |
|----------|-----------|
| Last organiser tries to leave | Blocked — must promote new primary first |
| Two co-organisers moderate same project | Both idempotent; one change commits |
| Primary account deleted | Blocked until ownership transferred |
| Add non-existent user | Rejected — must be registered user |
| Add participant as co-organiser | Allowed; role changes to 'organiser' |

---

## 7. Technology Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| **Framework** | Next.js 14 (App Router) | SSR for SEO, RSC for performance |
| **Language** | TypeScript (strict) | Type safety |
| **Styling** | Tailwind CSS | Utility-first |
| **Components** | shadcn/ui | Accessible, owned by us |
| **Auth** | Supabase Auth | Email + OAuth, RLS integration |
| **Database** | Supabase Postgres | Managed, RLS |
| **Storage** | Supabase Storage | Screenshot + avatar uploads |
| **Search** | Postgres full-text (v1) | Simple, no external deps |
| **Email** | Supabase Edge Functions + Resend | Verification, invites |
| **Deployment** | Vercel (app) + Supabase (backend) | Free tiers |
| **Package Manager** | pnpm | Fast, monorepo-ready |
| **Testing** | Vitest + Playwright | Unit + e2e |

### Environment Variables (`.env.example`)

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...
DATABASE_URL=postgresql://postgres:xxx@db.xxxxx.supabase.co:5432/postgres

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=30 Days, 30 Projects
NEXT_PUBLIC_TAGLINE=Ship. Showcase. Get discovered.
NEXT_PUBLIC_PRIMARY_COLOR=#4F46E5

# Admin bootstrap
ADMIN_EMAIL=emmanuel@example.com

# Email
RESEND_API_KEY=re_xxx...

# Optional
NEXT_PUBLIC_POSTHOG_KEY=phc_xxx...
```

---

## 8. Design System

### 8.1 The Stack

| Layer | Choice |
|-------|--------|
| **Primitives** | Radix UI |
| **Component library** | shadcn/ui |
| **Styling** | Tailwind CSS |
| **Icons** | Lucide |
| **Typography** | Inter + JetBrains Mono |
| **Theme** | `next-themes` (dark default) |
| **Charts** | Recharts |
| **Toasts** | Sonner |
| **Animation** | Framer Motion (restrained) |
| **Forms** | react-hook-form + zod |

### 8.2 Aesthetic References

| Site | What to Steal |
|------|---------------|
| **Linear** | Minimalism, tight typography, subtle gradients |
| **Vercel** | Crisp borders, monospace accents, dark-first |
| **Resend** | Beautiful cards, restrained animation |
| **Cal.com** | shadcn/ui reference implementation |
| **Raycast** | Keyboard-first, polished dark UI |

### 8.3 Color Tokens

```typescript
// tailwind.config.ts
colors: {
  bg: {
    DEFAULT: '#0A0A0A',
    subtle:  '#121212',
    muted:   '#1A1A1A',
    elevated:'#222222',
  },
  border: {
    DEFAULT: '#27272A',
    strong:  '#3F3F46',
  },
  text: {
    DEFAULT: '#FAFAFA',
    muted:   '#A1A1AA',
    subtle:  '#71717A',
  },
  brand: {
    50:  '#EEF2FF',
    100: '#E0E7FF',
    500: '#6366F1',
    600: '#4F46E5',
    700: '#4338CA',
  },
  accent: {
    amber:   '#F59E0B',
    emerald: '#10B981',
    rose:    '#EF4444',
    sky:     '#0EA5E9',
  },
},
```

### 8.4 Typography Scale

```
xs   12/16   meta labels
sm   14/20   body small, form labels
base 15/24   body default
lg   17/28   intro paragraphs
xl   20/28   card titles
2xl  24/32   section headers
3xl  30/36   page titles
4xl  38/44   hero (mobile)
5xl  48/52   hero (desktop)

Weights: 400, 500, 600 (max 3 per page)
```

### 8.5 Border Radius

```
sm    6px     buttons, small badges
md    10px    cards, inputs
lg    14px    large cards, modals
full  9999px  pills, avatars
```

### 8.6 Visual Rules

1. **Dark first** — design in dark, add light later
2. **Generous whitespace** — sections use `py-16` or `py-24`
3. **Monospace accents** — JetBrains Mono for stats, code, metadata
4. **Subtle gradients** — radial glow behind heroes only
5. **Understated borders** — 1px `#27272A`
6. **No drop shadows on flat elements** — hover/active only
7. **Skeleton loaders** — never spinners
8. **Animate on enter, not exit** — fade in 150ms, fade out instant

### 8.7 Motion

| Interaction | Duration | Easing |
|-------------|----------|--------|
| Hover | 150ms | ease-out |
| Fade in | 200ms | ease-out |
| Modal open | 250ms | cubic-bezier(0.16, 1, 0.3, 1) |
| Page transition | 300ms | ease-in-out |
| Skeleton shimmer | 1.5s | linear, infinite |

Respect `prefers-reduced-motion`.

### 8.8 Accessibility

- WCAG 2.1 AA target (4.5:1 text, 3:1 UI)
- Focus rings on every interactive element
- Keyboard-accessible everything
- Semantic HTML + ARIA labels on icon-only buttons
- Skip-to-content link on every page

### 8.9 Install Commands

```bash
pnpm add tailwindcss postcss autoprefixer
pnpm add lucide-react next-themes sonner framer-motion
pnpm add @radix-ui/react-dialog @radix-ui/react-dropdown-menu
pnpm add react-hook-form zod @hookform/resolvers

pnpm dlx shadcn@latest init
pnpm dlx shadcn@latest add button card input textarea label select \
    badge avatar dropdown-menu dialog alert-dialog toast tabs skeleton \
    separator sheet tooltip form
```

---

## 9. Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENTS                                  │
│  Participants │ Organisers │ Visitors/Recruiters │ Bots         │
└───────────────────────────────┬─────────────────────────────────┘
                                │ HTTPS
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Vercel (Next.js 14)                          │
│  App Router (RSC + Server Actions + Edge Middleware)            │
└───────────────────────────────┬─────────────────────────────────┘
                                │ @supabase/ssr
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                       Supabase                                  │
│  Auth (GoTrue) │ Postgres + RLS │ Storage (S3-like)             │
│  Edge Functions: send-email, cleanup-orphans, challenge-status  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 10. Database Schema

### 10.1 Extensions

```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "unaccent";
```

### 10.2 Enums

```sql
CREATE TYPE platform_role AS ENUM ('user', 'participant', 'organiser', 'admin');
CREATE TYPE challenge_role AS ENUM ('organiser', 'participant');
CREATE TYPE challenge_status AS ENUM ('draft', 'upcoming', 'active', 'completed', 'archived');
CREATE TYPE registration_mode AS ENUM ('public', 'invite_only');
CREATE TYPE project_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE participant_status AS ENUM ('active', 'completed', 'dropped');
CREATE TYPE author_role AS ENUM ('author', 'co_author');
CREATE TYPE organiser_application_status AS ENUM (
    'pending', 'approved', 'rejected', 'withdrawn', 'suspended'
);
```

### 10.3 Core Tables

```sql
-- ─────────────────────────────────────────────
-- Profiles
-- ─────────────────────────────────────────────
CREATE TABLE profiles (
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

CREATE INDEX idx_profiles_username ON profiles(username);
CREATE INDEX idx_profiles_platform_role ON profiles(platform_role);
CREATE INDEX idx_profiles_organiser_status ON profiles(organiser_status)
    WHERE organiser_status IS NOT NULL;

-- ─────────────────────────────────────────────
-- Challenges
-- ─────────────────────────────────────────────
CREATE TABLE challenges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL
        CHECK (slug ~ '^[a-z0-9][a-z0-9-]{1,60}[a-z0-9]$'),
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
    CHECK (
        (status = 'draft' AND primary_organiser_id IS NULL)
        OR (status != 'draft' AND primary_organiser_id IS NOT NULL)
    )
);

CREATE INDEX idx_challenges_slug ON challenges(slug);
CREATE INDEX idx_challenges_status ON challenges(status);
CREATE INDEX idx_challenges_dates ON challenges(start_date, end_date);
CREATE INDEX idx_challenges_primary_organiser ON challenges(primary_organiser_id);

-- ─────────────────────────────────────────────
-- Challenge Participants (includes organisers)
-- ─────────────────────────────────────────────
CREATE TABLE challenge_participants (
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

CREATE INDEX idx_cp_challenge ON challenge_participants(challenge_id);
CREATE INDEX idx_cp_user ON challenge_participants(user_id);
CREATE INDEX idx_cp_organisers ON challenge_participants(challenge_id)
    WHERE role = 'organiser';

CREATE UNIQUE INDEX idx_one_primary_organiser_per_challenge
    ON challenge_participants(challenge_id)
    WHERE role = 'organiser' AND is_primary = TRUE;

-- ─────────────────────────────────────────────
-- Projects
-- ─────────────────────────────────────────────
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL
        CHECK (slug ~ '^[a-z0-9][a-z0-9-]{1,80}[a-z0-9]$'),
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

CREATE INDEX idx_projects_slug ON projects(slug);
CREATE INDEX idx_projects_challenge ON projects(challenge_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_featured ON projects(featured) WHERE featured = TRUE;
CREATE INDEX idx_projects_created ON projects(created_at DESC);
CREATE INDEX idx_projects_tech_stack ON projects USING GIN(tech_stack);

ALTER TABLE projects ADD COLUMN search_vector tsvector
    GENERATED ALWAYS AS (
        setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
        setweight(to_tsvector('english', coalesce(description, '')), 'B') ||
        setweight(to_tsvector('english', coalesce(array_to_string(tech_stack, ' '), '')), 'B')
    ) STORED;

CREATE INDEX idx_projects_search ON projects USING GIN(search_vector);

-- ─────────────────────────────────────────────
-- Project Authors
-- ─────────────────────────────────────────────
CREATE TABLE project_authors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    role author_role NOT NULL DEFAULT 'author',
    display_order INTEGER DEFAULT 0,
    UNIQUE(project_id, user_id)
);

CREATE INDEX idx_pa_project ON project_authors(project_id);
CREATE INDEX idx_pa_user ON project_authors(user_id);

-- ─────────────────────────────────────────────
-- Organiser Applications
-- ─────────────────────────────────────────────
CREATE TABLE organiser_applications (
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
    CHECK (planned_end_date >= planned_start_date),
    CHECK (planned_start_date >= CURRENT_DATE)
);

CREATE INDEX idx_org_apps_applicant ON organiser_applications(applicant_id);
CREATE INDEX idx_org_apps_status ON organiser_applications(status);
CREATE INDEX idx_org_apps_created ON organiser_applications(created_at DESC);

CREATE UNIQUE INDEX idx_org_apps_one_pending
    ON organiser_applications(applicant_id)
    WHERE status = 'pending';

-- ─────────────────────────────────────────────
-- User Role History
-- ─────────────────────────────────────────────
CREATE TABLE user_role_history (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    old_role platform_role,
    new_role platform_role NOT NULL,
    changed_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_role_history_user ON user_role_history(user_id);
CREATE INDEX idx_role_history_created ON user_role_history(created_at DESC);

-- ─────────────────────────────────────────────
-- Challenge Organiser History
-- ─────────────────────────────────────────────
CREATE TABLE challenge_organiser_history (
    id BIGSERIAL PRIMARY KEY,
    challenge_id UUID NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    action TEXT NOT NULL CHECK (action IN ('added', 'removed', 'promoted_to_primary', 'stepped_down')),
    performed_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_org_history_challenge ON challenge_organiser_history(challenge_id);
CREATE INDEX idx_org_history_user ON challenge_organiser_history(user_id);
CREATE INDEX idx_org_history_created ON challenge_organiser_history(created_at DESC);

-- ─────────────────────────────────────────────
-- Challenge Invites
-- ─────────────────────────────────────────────
CREATE TABLE challenge_invites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    challenge_id UUID NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    token_hash TEXT NOT NULL UNIQUE,
    invited_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    used_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_ci_challenge ON challenge_invites(challenge_id);
CREATE INDEX idx_ci_email ON challenge_invites(lower(email));

-- ─────────────────────────────────────────────
-- Audit Log
-- ─────────────────────────────────────────────
CREATE TABLE audit_log (
    id BIGSERIAL PRIMARY KEY,
    actor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    target_type TEXT NOT NULL,
    target_id UUID,
    metadata JSONB DEFAULT '{}',
    ip_address INET,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_audit_actor ON audit_log(actor_id);
CREATE INDEX idx_audit_action ON audit_log(action);
CREATE INDEX idx_audit_created ON audit_log(created_at DESC);

-- ─────────────────────────────────────────────
-- Project Likes (post-v1)
-- ─────────────────────────────────────────────
CREATE TABLE project_likes (
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, project_id)
);

CREATE INDEX idx_likes_project ON project_likes(project_id);
```

### 10.4 Triggers

```sql
-- Auto-update updated_at
CREATE OR REPLACE FUNCTION touch_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_profiles_updated BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION touch_updated_at();
CREATE TRIGGER trg_challenges_updated BEFORE UPDATE ON challenges
    FOR EACH ROW EXECUTE FUNCTION touch_updated_at();
CREATE TRIGGER trg_projects_updated BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION touch_updated_at();
CREATE TRIGGER trg_org_apps_updated BEFORE UPDATE ON organiser_applications
    FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    base_username TEXT;
    final_username TEXT;
    counter INTEGER := 1;
BEGIN
    base_username := regexp_replace(
        split_part(NEW.email, '@', 1), '[^a-z0-9-]', '-', 'g'
    );
    base_username := trim(both '-' from lower(base_username));
    IF length(base_username) < 3 THEN
        base_username := 'user-' || substr(md5(random()::text), 1, 8);
    END IF;
    final_username := base_username;
    WHILE EXISTS (SELECT 1 FROM profiles WHERE username = final_username) LOOP
        counter := counter + 1;
        final_username := base_username || '-' || counter;
    END LOOP;
    INSERT INTO profiles (id, username, display_name)
    VALUES (NEW.id, final_username,
        COALESCE(NEW.raw_user_meta_data->>'full_name', final_username));
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Auto-promote User → Participant on joining challenge
CREATE OR REPLACE FUNCTION auto_promote_to_participant()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE profiles
    SET platform_role = 'participant',
        challenge_count = challenge_count + 1,
        last_participated_at = NOW()
    WHERE id = NEW.user_id AND platform_role = 'user';

    UPDATE profiles
    SET challenge_count = challenge_count + 1,
        last_participated_at = NOW()
    WHERE id = NEW.user_id AND platform_role != 'user';
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_auto_participant AFTER INSERT ON challenge_participants
    FOR EACH ROW EXECUTE FUNCTION auto_promote_to_participant();

-- Track project count
CREATE OR REPLACE FUNCTION track_project_creation()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE profiles
    SET project_count = project_count + 1
    WHERE id = (
        SELECT user_id FROM project_authors
        WHERE project_id = NEW.id AND role = 'author' LIMIT 1
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_project_count AFTER INSERT ON projects
    FOR EACH ROW EXECUTE FUNCTION track_project_creation();

-- Log role changes
CREATE OR REPLACE FUNCTION log_role_change()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.platform_role IS DISTINCT FROM NEW.platform_role THEN
        INSERT INTO user_role_history (user_id, old_role, new_role, reason)
        VALUES (NEW.id, OLD.platform_role, NEW.platform_role, 'role_update');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_role_history AFTER UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION log_role_change();

-- Sync challenge primary organiser
CREATE OR REPLACE FUNCTION sync_challenge_primary_organiser()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.role = 'organiser' AND NEW.is_primary = TRUE THEN
        UPDATE challenges SET primary_organiser_id = NEW.user_id
        WHERE id = NEW.challenge_id;
    END IF;

    IF NEW.role = 'organiser' AND OLD.is_primary = TRUE AND NEW.is_primary = FALSE THEN
        IF NOT EXISTS (
            SELECT 1 FROM challenge_participants
            WHERE challenge_id = NEW.challenge_id
              AND role = 'organiser'
              AND is_primary = TRUE
              AND user_id != NEW.user_id
        ) THEN
            RAISE EXCEPTION 'Cannot remove primary flag — challenge must have a primary organiser';
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_sync_primary_organiser AFTER INSERT OR UPDATE ON challenge_participants
    FOR EACH ROW EXECUTE FUNCTION sync_challenge_primary_organiser();

-- Auto-publish project when approved
CREATE OR REPLACE FUNCTION handle_project_approval()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'approved' AND OLD.status != 'approved' THEN
        NEW.published_at := NOW();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_project_published BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION handle_project_approval();
```

---

## 11. Row-Level Security

### 11.1 Helper Functions

```sql
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
    SELECT EXISTS (
        SELECT 1 FROM profiles WHERE id = auth.uid() AND platform_role = 'admin'
    );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION is_organiser()
RETURNS BOOLEAN AS $$
    SELECT EXISTS (
        SELECT 1 FROM profiles
        WHERE id = auth.uid() AND platform_role IN ('organiser', 'admin')
    );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION is_participant()
RETURNS BOOLEAN AS $$
    SELECT EXISTS (
        SELECT 1 FROM profiles
        WHERE id = auth.uid()
          AND platform_role IN ('participant', 'organiser', 'admin')
    );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION is_challenge_organiser(challenge_uuid UUID)
RETURNS BOOLEAN AS $$
    SELECT EXISTS (
        SELECT 1 FROM challenge_participants
        WHERE challenge_id = challenge_uuid
          AND user_id = auth.uid()
          AND role = 'organiser'
    );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION is_challenge_primary_organiser(challenge_uuid UUID)
RETURNS BOOLEAN AS $$
    SELECT EXISTS (
        SELECT 1 FROM challenge_participants
        WHERE challenge_id = challenge_uuid
          AND user_id = auth.uid()
          AND role = 'organiser'
          AND is_primary = TRUE
    );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION can_moderate_challenge(challenge_uuid UUID)
RETURNS BOOLEAN AS $$
    SELECT is_admin() OR is_challenge_organiser(challenge_uuid);
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION can_govern_challenge(challenge_uuid UUID)
RETURNS BOOLEAN AS $$
    SELECT is_admin() OR is_challenge_primary_organiser(challenge_uuid);
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION owns_challenge(challenge_uuid UUID)
RETURNS BOOLEAN AS $$
    SELECT can_govern_challenge(challenge_uuid);
$$ LANGUAGE sql SECURITY DEFINER STABLE;
```

### 11.2 Policies

```sql
-- ─────────────────────────────────────────────
-- Profiles
-- ─────────────────────────────────────────────
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone"
    ON profiles FOR SELECT USING (true);

CREATE POLICY "Users can update own profile fields"
    ON profiles FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (
        auth.uid() = id
        AND platform_role = (SELECT platform_role FROM profiles WHERE id = auth.uid())
        AND organiser_status IS NOT DISTINCT FROM
            (SELECT organiser_status FROM profiles WHERE id = auth.uid())
    );

CREATE POLICY "Admins can update any profile"
    ON profiles FOR UPDATE USING (is_admin());

-- ─────────────────────────────────────────────
-- Challenges
-- ─────────────────────────────────────────────
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published challenges viewable by everyone"
    ON challenges FOR SELECT
    USING (status IN ('upcoming', 'active', 'completed', 'archived'));

CREATE POLICY "Draft challenges viewable by organiser and admin"
    ON challenges FOR SELECT
    USING (primary_organiser_id = auth.uid() OR is_admin());

CREATE POLICY "Organisers and admins can create challenges"
    ON challenges FOR INSERT
    WITH CHECK (
        is_organiser()
        AND (primary_organiser_id IS NULL OR primary_organiser_id = auth.uid())
    );

CREATE POLICY "Primary organiser and admins can update challenges"
    ON challenges FOR UPDATE
    USING (primary_organiser_id = auth.uid() OR is_admin());

CREATE POLICY "Primary organiser and admins can delete challenges"
    ON challenges FOR DELETE
    USING (primary_organiser_id = auth.uid() OR is_admin());

-- ─────────────────────────────────────────────
-- Projects
-- ─────────────────────────────────────────────
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Approved projects are public"
    ON projects FOR SELECT
    USING (
        status = 'approved'
        OR EXISTS (
            SELECT 1 FROM project_authors
            WHERE project_id = projects.id AND user_id = auth.uid()
        )
        OR is_admin()
    );

CREATE POLICY "Users can create standalone projects"
    ON projects FOR INSERT
    WITH CHECK (auth.uid() IS NOT NULL AND challenge_id IS NULL);

CREATE POLICY "Participants can submit to challenges"
    ON projects FOR INSERT
    WITH CHECK (
        auth.uid() IS NOT NULL
        AND (challenge_id IS NULL OR is_participant())
    );

CREATE POLICY "Authors can update own pending projects"
    ON projects FOR UPDATE
    USING (
        status = 'pending'
        AND EXISTS (
            SELECT 1 FROM project_authors
            WHERE project_id = projects.id
              AND user_id = auth.uid()
              AND role = 'author'
        )
    );

CREATE POLICY "Challenge organisers and admins can moderate projects"
    ON projects FOR UPDATE
    USING (
        is_admin()
        OR EXISTS (
            SELECT 1 FROM challenge_participants cp
            WHERE cp.challenge_id = projects.challenge_id
              AND cp.user_id = auth.uid()
              AND cp.role = 'organiser'
        )
    );

-- ─────────────────────────────────────────────
-- Project Authors
-- ─────────────────────────────────────────────
ALTER TABLE project_authors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Project authors are public"
    ON project_authors FOR SELECT USING (true);

CREATE POLICY "Authors can manage co-authors on own pending projects"
    ON project_authors FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM projects p
            JOIN project_authors pa ON pa.project_id = p.id
            WHERE p.id = project_authors.project_id
              AND pa.user_id = auth.uid()
              AND pa.role = 'author'
              AND p.status = 'pending'
        )
    );

-- ─────────────────────────────────────────────
-- Challenge Participants
-- ─────────────────────────────────────────────
ALTER TABLE challenge_participants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Participants are viewable by everyone"
    ON challenge_participants FOR SELECT USING (true);

CREATE POLICY "Users can join public challenges"
    ON challenge_participants FOR INSERT
    WITH CHECK (
        user_id = auth.uid()
        AND role = 'participant'
        AND EXISTS (
            SELECT 1 FROM challenges
            WHERE id = challenge_id
              AND status IN ('upcoming', 'active')
              AND registration_mode = 'public'
        )
    );

CREATE POLICY "Primary organiser and admins can add participants"
    ON challenge_participants FOR INSERT
    WITH CHECK (can_govern_challenge(challenge_id));

CREATE POLICY "Primary organiser and admins can remove participants"
    ON challenge_participants FOR DELETE
    USING (can_govern_challenge(challenge_id) OR user_id = auth.uid());

CREATE POLICY "Primary organiser and admins can update participants"
    ON challenge_participants FOR UPDATE
    USING (can_govern_challenge(challenge_id))
    WITH CHECK (can_govern_challenge(challenge_id));

-- ─────────────────────────────────────────────
-- Organiser Applications
-- ─────────────────────────────────────────────
ALTER TABLE organiser_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Applicants can view own applications"
    ON organiser_applications FOR SELECT USING (applicant_id = auth.uid());

CREATE POLICY "Admins can view all applications"
    ON organiser_applications FOR SELECT USING (is_admin());

CREATE POLICY "Users can apply to become organiser"
    ON organiser_applications FOR INSERT
    WITH CHECK (
        applicant_id = auth.uid()
        AND NOT EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND platform_role IN ('organiser', 'admin')
        )
        AND NOT EXISTS (
            SELECT 1 FROM organiser_applications
            WHERE applicant_id = auth.uid() AND status = 'pending'
        )
        AND (SELECT created_at FROM profiles WHERE id = auth.uid()) < NOW() - INTERVAL '7 days'
    );

CREATE POLICY "Applicants can withdraw own application"
    ON organiser_applications FOR UPDATE
    USING (applicant_id = auth.uid() AND status = 'pending')
    WITH CHECK (status = 'withdrawn');

CREATE POLICY "Admins can review applications"
    ON organiser_applications FOR UPDATE
    USING (is_admin())
    WITH CHECK (is_admin());

-- ─────────────────────────────────────────────
-- User Role History
-- ─────────────────────────────────────────────
ALTER TABLE user_role_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admins can view role history"
    ON user_role_history FOR SELECT USING (is_admin());

-- ─────────────────────────────────────────────
-- Challenge Organiser History
-- ─────────────────────────────────────────────
ALTER TABLE challenge_organiser_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Challenge organisers can view organiser history"
    ON challenge_organiser_history FOR SELECT
    USING (is_challenge_organiser(challenge_id) OR is_admin());

CREATE POLICY "Primary organiser and admins can write organiser history"
    ON challenge_organiser_history FOR INSERT
    WITH CHECK (can_govern_challenge(challenge_id));

-- ─────────────────────────────────────────────
-- Audit Log
-- ─────────────────────────────────────────────
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admins can view audit log"
    ON audit_log FOR SELECT USING (is_admin());
```

### 11.3 Storage Buckets

```
Bucket: 'screenshots'  → public read, authenticated write (5MB max, image/*)
Bucket: 'avatars'      → public read, authenticated write (2MB max, image/*)
```

---

## 12. URL Structure & Pages

### Public Pages

| URL | Page |
|-----|------|
| `/` | Landing |
| `/discover` | Catalogue |
| `/p/:slug` | Project detail |
| `/u/:username` | Portfolio |
| `/c/:slug` | Challenge |
| `/challenges` | Challenges list |
| `/about` | About |

### Auth Pages

| URL | Page |
|-----|------|
| `/login` | Sign in |
| `/register` | Sign up |
| `/auth/callback` | OAuth / magic link callback |
| `/auth/reset-password` | Password reset request |

### Authenticated Pages

| URL | Page |
|-----|------|
| `/dashboard` | Personal dashboard |
| `/dashboard/projects` | My projects |
| `/dashboard/projects/new` | Submit new project |
| `/dashboard/projects/:id/edit` | Edit project |
| `/dashboard/challenges` | My challenges |
| `/settings` | Account settings |
| `/settings/profile` | Profile editor |
| `/settings/become-organiser` | Application form |
| `/settings/become-organiser/status` | Application status |

### Organiser Pages

| URL | Page | Access |
|-----|------|--------|
| `/organiser` | Dashboard | Any organiser + admin |
| `/organiser/challenges` | My challenges | Any organiser + admin |
| `/organiser/challenges/new` | Create | Any organiser + admin |
| `/organiser/challenges/:slug/moderation` | Moderation | Any organiser + admin |
| `/organiser/challenges/:slug/analytics` | Analytics | Any organiser + admin |
| `/organiser/challenges/:slug/settings` | Organiser management | **Primary only** + admin |

### Admin Pages

| URL | Page |
|-----|------|
| `/admin` | Overview |
| `/admin/projects` | Moderation queue |
| `/admin/challenges` | All challenges |
| `/admin/users` | User management |
| `/admin/users/:id` | User detail + roles |
| `/admin/organiser-applications` | Application review |
| `/admin/organiser-applications/:id` | Application detail |
| `/admin/import` | Bulk import |

### SEO-Friendly URL Examples

```
✅ https://30days30projects.dev/u/emmanuel-phiri
✅ https://30days30projects.dev/p/wireless-headphones-scraper
✅ https://30days30projects.dev/c/september-2026
✅ https://30days30projects.dev/discover?tech=rust
```

---

## 13. User Flows

### Flow A — New Participant Registers + Submits First Project

```
1. Land on / → hero + countdown
2. Click "Join Challenge" → /register
3. Register (magic link or OAuth)
4. Profile auto-created (username generated)
5. New users → /settings/profile ("Complete your profile" prompt)
6. Existing users → /dashboard
7. Click "Submit Project"
8. Upload screenshot (immediate to Storage; orphan cleanup runs nightly)
9. Fill form → submit → status = 'pending'
10. Admin approves → status = 'approved', published_at = NOW()
11. Project appears in /discover and /u/username
```

### Flow B — Admin Moderates Submissions

```
1. Admin → /admin
2. See pending count badge
3. /admin/projects?status=pending
4. Review + Approve / Reject / Feature (max 5 featured)
5. Bulk actions available
6. Moderators can only change status and featured — not edit content
```

### Flow C — Visitor Discovers a Developer

```
1. Land on / (from Google)
2. Click featured project → /p/calculator-app
3. See author → click → /u/alice-banda
4. See portfolio → click LinkedIn → external
```

### Flow D — Organiser Creates a New Challenge

```
1. Organiser → /organiser/challenges
2. "Create Challenge" → fill form
3. Save as draft (status = 'draft', primary_organiser_id = self)
4. Add co-organisers via /organiser/challenges/:slug/settings
5. Preview → "Publish" → status = 'upcoming'
6. Background cron flips to 'active' on start_date and 'completed' on end_date
7. Share /c/:slug link
```

### Flow E — User Applies to Become Organiser

```
1. User → /settings/become-organiser
2. Eligibility check (account age > 7 days, no pending, not already organiser)
3. Fill form → submit → status = 'pending'
4. Email to all admins
5. Admin reviews → approve → platform_role = 'organiser'
6. Applicant receives email
```

### Flow F — Primary Organiser Adds Co-Organiser

```
1. Primary → /organiser/challenges/:slug/settings
2. "+ Add organiser"
3. Search by email or username (must be registered)
4. Confirm
5. Insert challenge_participants row (role='organiser', is_primary=false)
6. Email sent
```

### Flow G — Primary Organiser Promotes Co-Organiser

```
1. Primary → /organiser/challenges/:slug/settings
2. [...] → "Make primary"
3. Confirm
4. Swap is_primary flags → trigger syncs challenges.primary_organiser_id
5. Emails sent
```

### Flow H — Bulk Seed Import

```
1. Admin prepares seed.json
2. /admin/import → upload
3. Preview: "Will create 30 users, 1 challenge, 900 projects"
4. Confirm → transaction
5. With --auto-approve: projects go live immediately
6. Without: projects stay pending for review
```

---

## 14. Seed Data Format

**File:** `seed/september-2026.json`

```json
{
  "challenge": {
    "slug": "september-2026",
    "title": "30 Days, 30 Projects — September 2026",
    "tagline": "The September Developer Challenge",
    "description": "Build and ship one project every day for 30 days.",
    "rules": "1. One project per day\n2. ...",
    "hero_image_url": "https://.../hero.jpg",
    "start_date": "2026-09-01",
    "end_date": "2026-09-30",
    "registration_mode": "invite_only",
    "status": "completed",
    "primary_organiser_email": "emmanuel@example.com",
    "co_organiser_emails": ["blessings@example.com"]
  },
  "participants": [
    {
      "email": "alice@example.com",
      "display_name": "Alice Banda",
      "username": "alice-banda",
      "bio": "Full-stack developer. Loves Rust and React.",
      "linkedin_url": "https://linkedin.com/in/alice-banda",
      "github_url": "https://github.com/alice-banda",
      "avatar_url": "https://.../alice.jpg",
      "projects": [
        {
          "day_number": 1,
          "title": "Calculator App",
          "description": "A sleek calculator with keyboard support.",
          "screenshot_url": "https://.../calc.png",
          "demo_url": "https://calc.alice.dev",
          "repo_url": "https://github.com/alice-banda/calc",
          "tech_stack": ["React", "TypeScript", "Tailwind"],
          "category": "web",
          "source_snippet": "function evaluate(expr: string) { ... }",
          "source_language": "typescript"
        }
      ]
    }
  ]
}
```

**Import commands:**
```bash
# Pending review (default)
pnpm seed --file=seed/september-2026.json

# Auto-approve (admin-only, for pre-vetted cohorts)
pnpm seed --file=seed/september-2026.json --auto-approve
```

**Collision handling:** Same title in different challenge → new slug (`calculator-app-2`).

---

## 15. Project File Structure

```
30days-30projects/
├── app/
│   ├── (public)/
│   │   ├── page.tsx
│   │   ├── discover/page.tsx
│   │   ├── p/[slug]/page.tsx
│   │   ├── u/[username]/page.tsx
│   │   ├── c/[slug]/page.tsx
│   │   ├── challenges/page.tsx
│   │   └── about/page.tsx
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   └── auth/callback/route.ts
│   ├── (app)/
│   │   ├── layout.tsx
│   │   ├── dashboard/
│   │   │   ├── page.tsx
│   │   │   ├── projects/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── new/page.tsx
│   │   │   │   └── [id]/edit/page.tsx
│   │   │   └── challenges/page.tsx
│   │   └── settings/
│   │       ├── page.tsx
│   │       ├── profile/page.tsx
│   │       ├── account/page.tsx
│   │       └── become-organiser/
│   │           ├── page.tsx
│   │           └── status/page.tsx
│   ├── (organiser)/
│   │   └── organiser/
│   │       ├── layout.tsx
│   │       ├── page.tsx
│   │       └── challenges/
│   │           ├── page.tsx
│   │           ├── new/page.tsx
│   │           └── [slug]/
│   │               ├── moderation/page.tsx
│   │               ├── analytics/page.tsx
│   │               └── settings/page.tsx
│   ├── (admin)/
│   │   └── admin/
│   │       ├── layout.tsx
│   │       ├── page.tsx
│   │       ├── projects/
│   │       │   ├── page.tsx
│   │       │   └── [id]/page.tsx
│   │       ├── challenges/
│   │       │   ├── page.tsx
│   │       │   ├── new/page.tsx
│   │       │   └── [slug]/edit/page.tsx
│   │       ├── users/
│   │       │   ├── page.tsx
│   │       │   └── [id]/page.tsx
│   │       ├── organiser-applications/
│   │       │   ├── page.tsx
│   │       │   └── [id]/page.tsx
│   │       └── import/page.tsx
│   ├── api/
│   │   ├── og/route.tsx
│   │   └── revalidate/route.ts
│   ├── layout.tsx
│   ├── globals.css
│   ├── sitemap.ts
│   └── robots.ts
├── components/
│   ├── ui/                       # shadcn/ui
│   ├── project-card.tsx
│   ├── project-grid.tsx
│   ├── profile-card.tsx
│   ├── challenge-card.tsx
│   ├── filters.tsx
│   ├── search-bar.tsx
│   ├── tech-stack-pill.tsx
│   ├── nav.tsx
│   ├── footer.tsx
│   ├── markdown-renderer.tsx
│   ├── image-uploader.tsx
│   ├── role-badge.tsx
│   ├── organiser-list.tsx
│   ├── add-organiser-dialog.tsx
│   ├── promote-primary-dialog.tsx
│   ├── leave-organiser-dialog.tsx
│   ├── application-status-card.tsx
│   ├── application-form.tsx
│   └── role-change-dialog.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   ├── server.ts
│   │   ├── admin.ts
│   │   └── middleware.ts
│   ├── auth.ts
│   ├── permissions.ts
│   ├── role-helpers.ts
│   ├── rate-limit.ts               # ← NEW (§26.18)
│   ├── slug.ts
│   ├── username.ts
│   ├── validation.ts
│   ├── formatters.ts
│   └── constants.ts
├── actions/
│   ├── projects.ts
│   ├── challenges.ts
│   ├── challenge-organisers.ts
│   ├── profiles.ts
│   ├── moderation.ts
│   ├── participants.ts
│   ├── organiser-applications.ts
│   ├── roles.ts
│   └── admin.ts
├── supabase/
│   ├── migrations/
│   │   ├── 0001_extensions.sql
│   │   ├── 0002_enums.sql
│   │   ├── 0003_core_tables.sql
│   │   ├── 0004_organiser_tables.sql
│   │   ├── 0005_triggers.sql
│   │   ├── 0006_rls.sql
│   │   ├── 0007_storage.sql
│   │   └── 0008_seed_september_2026.sql
│   ├── seed.sql
│   └── functions/
│       ├── send-email/index.ts
│       ├── cleanup-orphans/index.ts       # ← NEW (screenshots + old invites)
│       └── challenge-status/index.ts       # ← NEW (auto-transitions)
├── scripts/
│   ├── create-admin.ts                     # ← NEW (bootstrap)
│   ├── seed-from-json.ts
│   └── generate-username.ts
├── tests/
│   ├── unit/
│   └── e2e/
├── public/
│   ├── logo.svg
│   └── og-default.png
├── docs/
│   ├── SPEC.md                   # ← this document (v1 forever)
│   ├── deployment.md
│   ├── database.md
│   ├── contributing-data.md
│   └── architecture.md
├── .env.example
├── .gitignore
├── .nvmrc
├── LICENSE
├── README.md
├── CONTRIBUTING.md
├── CODE_OF_CONDUCT.md
├── SECURITY.md
├── CHANGELOG.md
├── package.json
├── pnpm-lock.yaml
├── next.config.mjs
├── tailwind.config.ts
├── tsconfig.json
├── postcss.config.mjs
└── vitest.config.ts
```

---

## 16. Server Actions Reference

### `actions/projects.ts`

| Action | Auth | Effect |
|--------|------|--------|
| `createProject` | Member | Insert + authors, status = 'pending' |
| `updateProject` | Author (pending) | Update |
| `deleteProject` | Author or Admin | Soft delete |
| `incrementViewCount` | Public | Atomic increment |

### `actions/moderation.ts`

| Action | Auth | Effect |
|--------|------|--------|
| `approveProject` | Organiser or Admin | status = 'approved' |
| `rejectProject` | Organiser or Admin | status = 'rejected' |
| `featureProject` | Admin | Toggle (max 5 featured) |
| `bulkApprove` | Admin | Approve many |

**Moderation scope:** Status + featured only. Moderators cannot edit title, description, or screenshot.

### `actions/challenges.ts`

| Action | Auth | Effect |
|--------|------|--------|
| `createChallenge` | Organiser | Insert as draft + add as primary |
| `updateChallenge` | Primary or Admin | Update metadata |
| `publishChallenge` | Primary or Admin | status = 'upcoming' |
| `archiveChallenge` | Primary or Admin | status = 'archived' |
| `deleteChallenge` | Primary or Admin | Soft delete (projects become standalone) |

**Status transitions:** Manual (`draft → upcoming`), auto after that (cron flips to active/completed).

### `actions/challenge-organisers.ts`

| Action | Auth | Effect |
|--------|------|--------|
| `addCoOrganiser` | Primary or Admin | Insert row (user must exist) |
| `removeCoOrganiser` | Primary or Admin | Delete row |
| `promoteToPrimary` | Primary or Admin | Swap flags |
| `stepDownAsPrimary` | Primary | Promote + demote self |
| `leaveAsOrganiser` | Co-Organiser | Delete own row |

### `actions/participants.ts`

| Action | Auth | Effect |
|--------|------|--------|
| `joinChallenge` | Member | Insert participant row (public + open only) |
| `leaveChallenge` | Self | Mark dropped |

### `actions/organiser-applications.ts`

| Action | Auth | Effect |
|--------|------|--------|
| `applyForOrganiser` | User/Participant | Insert (7-day minimum account age) |
| `withdrawApplication` | Applicant | status = 'withdrawn' |
| `approveApplication` | Admin | status + promote user |
| `rejectApplication` | Admin | status + reason |

### `actions/roles.ts`

| Action | Auth | Effect |
|--------|------|--------|
| `promoteUser` | Admin | Change role + history |
| `revokeOrganiser` | Admin | Demote + suspend |

### `actions/admin.ts`

| Action | Auth | Effect |
|--------|------|--------|
| `bulkImport` | Admin | Transactional seed (auto-approve optional) |
| `inviteParticipants` | Organiser | Create invites |

---

## 17. Phased Rollout

### 🟢 Phase 1 — MVP (Weeks 1–2)

- [ ] Supabase project setup
- [ ] Database schema with 4-role enum
- [ ] Supabase Auth (email + Google + GitHub)
- [ ] Auto-profile + auto-participant triggers
- [ ] `pnpm create-admin` script
- [ ] Public pages (`/`, `/discover`, `/p/:slug`, `/u/:username`, `/c/:slug`)
- [ ] Project submission form
- [ ] Screenshot upload + orphan cleanup cron
- [ ] Admin moderation queue
- [ ] Organiser application form + admin review
- [ ] Admin user management
- [ ] Multi-organiser support
- [ ] Admin challenge creation
- [ ] Challenge status transition cron
- [ ] Bulk JSON import
- [ ] Email notifications (12 events)
- [ ] Rate limiting (`lib/rate-limit.ts`)
- [ ] Seed September 2026 cohort
- [ ] Deploy to Vercel
- [ ] README + CONTRIBUTING + LICENSE

**Exit criteria:** Live URL where anyone can browse all 900 projects.

### 🟡 Phase 2 — Engagement

- [ ] Likes on projects
- [ ] Featured projects on homepage (max 5)
- [ ] OG image generation
- [ ] Search improvements (profiles, challenges)
- [ ] Profile editor with avatar upload
- [ ] "Copy portfolio URL" button
- [ ] RSS feed
- [ ] CSV export
- [ ] Organiser dashboard analytics
- [ ] Activity feed from `audit_log`

### 🔵 Phase 3 — Growth

- [ ] Custom domains per participant
- [ ] PDF resume export
- [ ] Comments
- [ ] Follow participants
- [ ] API keys
- [ ] Multi-language UI
- [ ] Judge role
- [ ] Sponsor role
- [ ] Teams as first-class entities
- [ ] Co-author email invites

---

## 18. Deployment Guide

### Prerequisites
- Node.js 20+ and pnpm
- GitHub, Supabase, Vercel accounts (all free)

### Steps

```bash
# 1. Fork
gh repo fork Normious/30days-30projects --clone
cd 30days-30projects

# 2. Install
pnpm install

# 3. Create Supabase project (dashboard)

# 4. Configure env
cp .env.example .env.local
# Paste keys + set ADMIN_EMAIL

# 5. Run migrations
pnpm supabase db push

# 6. Create storage buckets
pnpm supabase storage create screenshots --public
pnpm supabase storage create avatars --public

# 7. Configure auth providers (dashboard)
# Email magic link, Google, GitHub
# Redirect URLs: https://your-domain.com/auth/callback

# 8. Register your admin account (via /register)
# Then run:
pnpm create-admin

# 9. Seed
pnpm seed --file=seed/my-challenge.json --auto-approve

# 10. Deploy
vercel --prod

# 11. Add custom domain (Vercel dashboard)
```

---

## 19. Contribution Guidelines

### Workflow

```bash
git checkout -b feat/add-dark-mode-toggle
pnpm install && pnpm dev
pnpm typecheck && pnpm lint && pnpm test
git commit -m "feat(ui): add dark mode toggle to nav"
git push origin feat/add-dark-mode-toggle
```

### Commit Convention (Conventional Commits)

- `feat:` — new feature
- `fix:` — bug fix
- `docs:` — documentation
- `style:` — formatting
- `refactor:` — restructure
- `perf:` — performance
- `test:` — tests
- `chore:` — tooling

### PR Checklist

- [ ] Linked to issue (`Closes #123`)
- [ ] Tests added/updated
- [ ] Docs updated
- [ ] `pnpm typecheck` passes
- [ ] `pnpm lint` passes
- [ ] Screenshot for UI changes

### Won't Merge

- Real secrets in `.env.example`
- RLS policy removal without discussion
- Unjustified dependencies
- Breaking changes without migration path

---

## 20. Security Considerations

| Concern | Mitigation |
|---------|-----------|
| XSS in markdown | `rehype-sanitize` + allowlist |
| SSRF on URL validation | Edge Function with allowlist |
| Screenshot spoofing | MIME + magic bytes + max size |
| Spam projects | Rate limit: 5 per hour per user |
| Username squatting | Reserved words + regex |
| RLS bypass | Test with `supabase test` |
| SQL injection | Parameterized queries |
| CSRF | Server Actions built-in |
| Session hijacking | Supabase httpOnly cookies |
| Dependency vulnerabilities | `pnpm audit` + Dependabot |
| Organiser abuse | Audit log + admin revocation |
| Fake organiser applications | 7-day account age requirement |

### Rate Limits (`lib/rate-limit.ts`)

| Action | Limit |
|--------|-------|
| Register | 3 per hour per IP |
| Password reset | 3 per hour per email |
| Project submission | 5 per hour per user |
| Organiser application | 1 per 30 days per user |
| Login attempt | 10 per 15 min per IP |

---

## 21. Testing Strategy

### Unit (Vitest)
Slug generation, username validation, Zod schemas, markdown sanitization, date formatting, role helpers, rate limit logic.

### Integration (Vitest + Supabase local)
RLS policies, server actions, auth flows, multi-organiser flows, organiser application lifecycle, status transition cron.

### E2E (Playwright)
Register → submit → approve → catalogue; visitor browse → filters → portfolio; organiser create → publish → add co-organiser; user applies → admin approves → becomes organiser.

### CI Matrix (`.github/workflows/ci.yml`)
```yaml
- pnpm typecheck
- pnpm lint
- pnpm test:unit
- pnpm test:integration
- pnpm build
```

---

## 22. Success Metrics

| Metric | Target |
|--------|--------|
| Signups | 100 in first 30 days |
| Projects submitted | 500 in first 30 days |
| Approval rate | > 85% |
| Profile views | 10,000 in first 90 days |
| External clicks | 1,000 in first 90 days |
| Forks | 5 in first 90 days |
| External PRs merged | 3 in first 90 days |
| New organisers approved | 2 in first 90 days |

---

## 23. Future-Proofing

### 23.1 Enum Extensibility

```sql
ALTER TYPE platform_role ADD VALUE 'judge';
ALTER TYPE challenge_role ADD VALUE 'judge';
ALTER TYPE platform_role ADD VALUE 'sponsor';
```

No downtime, no code changes needed until referenced.

### 23.2 Two-Axis Role Model

Platform role (user/participant/organiser/admin) **separate** from challenge role (organiser/participant/judge). Someone can be an organiser of their own challenge AND a participant in someone else's.

### 23.3 History Tables

- `user_role_history` — Platform role changes
- `challenge_organiser_history` — Organiser changes
- `audit_log` — All sensitive actions

Unlocks future dashboards without schema changes.

### 23.4 Soft Deletes

Everything cascades or soft-deletes. No hard data loss. GDPR flows supported.

### 23.5 Config-Driven Branding

```typescript
// lib/constants.ts
export const APP_CONFIG = {
  displayName: process.env.NEXT_PUBLIC_APP_NAME || '30 Days, 30 Projects',
  tagline: process.env.NEXT_PUBLIC_TAGLINE || 'Ship. Showcase. Get discovered.',
  primaryColor: process.env.NEXT_PUBLIC_PRIMARY_COLOR || '#4F46E5',
  repoUrl: 'https://github.com/Normious/30days-30projects',
};
```

Forks rebrand in 5 minutes.

---

## 24. Open Questions (Deferred)

1. Max co-organisers per challenge? (Recommend: 5, configurable)
2. Can organisers see each other's emails? (Recommend: yes)
3. Can a co-organiser be added to a draft challenge? (Recommend: yes)
4. Limit on challenges per organiser? (Recommend: 3, admin override)
5. Can a co-organiser invite participants? (Recommend: yes)
6. Organiser invitation expiry? (Recommend: 7 days)
7. Should suspended organisers re-apply? (Recommend: admin must reinstate)
8. Should rejected applicants see reviewer identity? (Recommend: no)
9. Multiple pending applications? (Recommend: one at a time)
10. Can organisers co-own a challenge? (Resolved: primary + co-organisers model)

---

## 25. Summary Table

| Aspect | Decision |
|--------|----------|
| **Codename** | `30days-30projects` |
| **Display name** | 30 Days, 30 Projects |
| **Spec version** | **v1 (frozen)** |
| **App version** | SemVer (starts at 1.0.0) |
| **License** | MIT |
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript (strict) |
| **Auth** | Supabase Auth |
| **Database** | Supabase Postgres + RLS |
| **Storage** | Supabase Storage |
| **Design system** | shadcn/ui + Tailwind + Radix |
| **Deployment** | Vercel + Supabase |
| **Cost** | $0 (free tiers) |
| **Platform roles** | user / participant / organiser / admin |
| **Challenge roles** | organiser (primary + co) / participant |
| **Organiser applications** | User-initiated (apply) + Admin-initiated (promote) |
| **Multi-organiser** | 1 primary + N co-organisers |
| **URL structure** | `/u/:username`, `/p/:slug`, `/c/:slug`, `/discover` |
| **Multi-challenge** | ✅ From day one |
| **Standalone projects** | ✅ Supported |
| **Team submissions** | ✅ Co-authors must exist on platform |
| **Bulk seed** | ✅ JSON import (`--auto-approve` admin-only) |
| **Open source ready** | ✅ CONTRIBUTING, LICENSE, CODE_OF_CONDUCT, templates |

---

## 26. Implementation Clarifications

The following decisions were locked during spec review and are binding:

| # | Area | Decision |
|---|------|----------|
| 1 | **Admin bootstrap** | `pnpm create-admin` script reads `ADMIN_EMAIL` env var, promotes user, logs to `audit_log` |
| 2 | **Challenge status** | Hybrid — manual publish (`draft → upcoming`), then auto-transition by cron based on dates |
| 3 | **Project slug** | Auto-generated from title; user can override; collisions append `-2`, `-3` |
| 4 | **Team submissions** | Co-authors must already be registered users (search by username/email); email invite deferred to Phase 3 |
| 5 | **Screenshot upload** | Immediate on drop, orphan cleanup runs nightly via Edge Function |
| 6 | **Magic link landing** | New users → `/settings/profile`; returning users → `/dashboard` |
| 7 | **Draft visibility** | Draft challenges visible only to primary organiser + admin; participants cannot join drafts |
| 8 | **Featured limit** | Max 5 featured projects; all featured show on homepage; admin manages from `/admin/projects?featured=true` |
| 9 | **Cross-challenge duplicates** | New project, new slug (`calculator-app-2`) — no re-submission of existing project |
| 10 | **Email notifications** | 12 events: welcome+verify, challenge invite, project approved, project rejected, organiser app submitted, organiser app approved, organiser app rejected, added as co-organiser, promoted to primary, password reset, email changed, account deleted |
| 11 | **Search scope (v1)** | Projects only; profiles + challenges deferred to Phase 2 |
| 12 | **Rejected project visibility** | Author dashboard only; not on public portfolio, not in `/discover` |
| 13 | **Storage cleanup** | Scheduled nightly cron (Edge Function); never delete synchronously in request path |
| 14 | **Timezone** | Store UTC always; display in user's local timezone |
| 15 | **Challenge deletion** | Soft delete (archived); projects become standalone (`challenge_id = NULL`), remain `status = 'approved'` |
| 16 | **Moderation scope** | Moderators can only change `status` and `featured` — cannot edit title, description, screenshot |
| 17 | **Auto-approve scope** | `--auto-approve` flag only on admin-run seed imports; regular submissions always `pending` |
| 18 | **Rate limits** | Centralized in `lib/rate-limit.ts` — Register 3/hr/IP, Password reset 3/hr/email, Projects 5/hr/user, Organiser apps 1/30d/user, Login 10/15min/IP |

---

## 🎯 Spec Frozen — v1 Locked

**This is the final, build-ready specification.**

- ✅ All 18 clarifications integrated
- ✅ Version stays at **v1** forever (this document)
- ✅ Application follows SemVer independently
- ✅ Open-source ready
- ✅ Zero blocking ambiguities

**Next:** Migrations → Scaffold → Build → Ship.

🚀 **Build. Ship. Repeat.**