# Codebase Navigation Guide

## Recommended reading order

1. `src/server.ts`
2. `src/app.ts`
3. `src/types/express.d.ts`
4. `src/middlewares/auth.middleware.ts`
5. `src/config/db.ts`
6. `prisma/schema.prisma`
7. `src/modules/*`

## Module pattern

Each feature usually has:

- `*.route.ts` — endpoint + middleware chain
- `*.controller.ts` — HTTP mapping
- `*.service.ts` — business logic + DB calls
- `*.validator.ts` — zod schemas (where applicable)

## Key operational files

- `render.yaml` — Render deployment settings
- `tsconfig.json` — TS build behavior
- `package.json` — scripts/deps

## Fast debugging strategy

- Routing issue: `app.ts` -> module `*.route.ts`
- Auth issue: `auth.middleware.ts` + token helpers
- Data issue: module `*.service.ts` + `prisma/schema.prisma`
- Runtime boot issue: `server.ts`, `config/db.ts`, env vars
