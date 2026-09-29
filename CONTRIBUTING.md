# Contributing

## Workflow
```bash
git checkout -b feat/my-change
pnpm install && pnpm dev
pnpm typecheck && pnpm lint && pnpm test:unit
git commit -m "feat(ui): my change"
```

Conventional Commits: `feat:`, `fix:`, `docs:`, `style:`, `refactor:`, `perf:`, `test:`, `chore:`.

## PR checklist
- [ ] Linked issue (`Closes #123`)
- [ ] Tests added/updated
- [ ] Docs updated
- [ ] `pnpm typecheck` + `pnpm lint` pass
- [ ] Screenshot for UI changes

## Won't merge
Real secrets in `.env.example` · RLS removal without discussion · unjustified deps · breaking changes without migration path.
