# Codebase Risk Analysis (2026-04-28)

## High-severity blockers

1. **TypeScript build fails with syntax errors** in `src/modules/listings/listings.service.ts` and `src/modules/message/message.service.ts`, so the backend cannot be reliably built or deployed.
2. **`src/server.ts` cannot run as written** because it references `app` without importing it.
3. **Prisma schema is inconsistent and likely invalid for generation/migrations** (e.g., undefined `Realtor` model relation).

## Functional and security risks

- `src/app.ts` uses `cors()` and `morgan()` without imports; route mount paths for `featured` and `public` are missing leading `/`, making those routes unreachable under intended prefixes.
- JWT code falls back to hardcoded `dev_secret` in production paths if env is missing.
- Socket server allows all origins (`origin: "*"`), increasing exposure for abuse.
- Message controller endpoints use `req.user` but route file does not enforce auth middleware on conversation/message routes.

## Structural/maintenance risks

- Source tree mixes TS source with generated JS and declaration artifacts under `src/`, which can cause stale runtime behavior and confusion.
- `package.json` has `start: node dist/server.ts`; Node normally runs JS output (`.js`), not TS, after `tsc`.

## Recommendation order

1. Fix parse/syntax errors and broken imports first (`server.ts`, listings/message services, app imports).
2. Repair Prisma schema relations and run `prisma validate` + `prisma generate`.
3. Enforce auth on sensitive message endpoints and remove insecure default JWT secret.
4. Tighten CORS configuration and align runtime scripts (`start` target, build artifacts).
5. Separate source and build outputs cleanly (avoid committed JS in `src/`).
