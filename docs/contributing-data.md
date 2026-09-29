# Contributing data (seed a new challenge)

Template: `seed/september-2026.json`. Shape: `{ challenge: {...}, participants: [{ email, display_name, username, bio, links, projects: [{ day_number, title, description, screenshot_url, demo_url, repo_url, tech_stack, category }] }] }`.

```bash
pnpm seed --file=seed/my-challenge.json            # pending review
pnpm seed --file=seed/my-challenge.json --auto-approve  # admin, pre-vetted only
```

Rules: slugs auto-generated (`title-2` on collision); `challenge_id=NULL` = standalone; team co-authors must already be registered (no email invites in v1).
