# Contributing & Clean Code Rules

## Branch and PR hygiene

- Keep PRs small and single-purpose.
- Rebase on latest main before requesting review.
- Do not mix refactor + feature + infra in one PR.

## Required checks before PR

```bash
npm run build
npx prisma validate
```

## Code quality rules

- Prefer explicit types over `any`.
- Keep controllers thin and services focused.
- Validate inputs at module boundaries.
- Fail fast on missing critical config.
- Never put try/catch blocks around imports.

## Security rules

- Never add secret fallbacks for production secrets.
- Protect sensitive routes with auth and proper ownership checks.
- Avoid logging sensitive values (tokens, OTP codes in production).

## Repo cleanliness

- Do not commit generated build output.
- Do not commit local env files.
- Keep docs updated when APIs or behavior change.

## Review checklist

- Does this change break auth/permissions?
- Are failure modes clear and safe?
- Are API responses consistent?
- Are docs/tests updated?
