# Merge Conflict Playbook

This repo had repeated conflicts caused by broad commits and generated artifacts.
Use this workflow to minimize future conflicts.

## 1) Keep PRs small and scoped
- Split infra/config changes from feature logic.
- Avoid mixing docs-only, schema-only, and runtime behavior in one PR.

## 2) Never commit generated runtime artifacts
- Do not commit `dist/` output.
- Do not commit generated JS/typings/maps under `src/`.
- Regenerate locally with `npm run build` and `prisma generate`.

## 3) Rebase before opening/updating PR
```bash
git fetch origin
git rebase origin/main
```

## 4) Resolve high-conflict files predictably
- `package-lock.json`: accept mainline then run `npm install` and recommit lockfile.
- `README.md` / long docs: prefer append-only sections; avoid mass rewrites.
- `prisma/schema.prisma`: run `npx prisma format` after conflict resolution.

## 5) Run conflict sanity checks after rebasing
```bash
npm run build
npx prisma validate
```

## 6) Recommended merge strategy for this repo
- Use **Rebase and merge** for clean history.
- Avoid merge commits from stale branches.
- Enable git rerere locally:
```bash
git config rerere.enabled true
git config rerere.autoupdate true
```

## 7) Render deployment conflict safety
If deployment PR and feature PR touch shared config (`package.json`, `render.yaml`, `prisma/schema.prisma`):
1. Merge deployment PR first.
2. Rebase feature PR on updated main.
3. Re-run build + prisma validate before merge.
