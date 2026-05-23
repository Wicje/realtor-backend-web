# Developer README

This guide is for engineers who need to **quickly understand, navigate, and safely modify** this backend.

---

## 1) What this project is

`realtor-backend-web` is a TypeScript + Express API backend for realtor workflows:
- authentication,
- listing/property management,
- lead capture,
- analytics,
- OTP verification,
- messaging,
- public-facing property pages,
- featured links.

The codebase is organized by **feature modules** under `src/modules/*`.

---

## 2) Top-level project map

### Runtime + app wiring
- `src/server.ts`
  - Process entrypoint.
  - Starts HTTP server (`app.listen`).
  - Registers process-level fatal handlers (`unhandledRejection`, `uncaughtException`).
- `src/app.ts`
  - Express app composition.
  - Global middleware (CORS headers + JSON parser).
  - Mounts route modules.
  - Central error reporting middleware.

### Core config
- `src/config/db.ts`
  - Prisma client initialization.
  - Requires `DATABASE_URL`.
  - Uses `@prisma/adapter-pg`.
- `src/config/prisma.ts`
  - Re-export helper for Prisma client.
- `src/config/sentry.ts`
  - Sentry-compatible event delivery helper.
  - Used by global error and fatal handlers.
- `src/config/plans.ts`
  - Plan definitions used for property limit checks.

### Middleware layer
- `src/middlewares/auth.middleware.ts`
  - Bearer token auth.
  - Populates `req.user`.
- `src/middlewares/role.middleware.ts`
  - Role gate (e.g., REALTOR-only).
- `src/middlewares/plan.middleware.ts`
  - Plan entitlement checks.
- `src/middlewares/ownership.middleware.ts`
  - Property ownership guard.
- `src/middlewares/upload.middleware.ts`
  - Upload shim (currently no-op).

### Types
- `src/types/express.d.ts`
  - Extends Express `Request` with `user` payload.

### Data model
- `prisma/schema.prisma`
  - Single source of truth for DB models and relations.

---

## 3) Feature modules (how to read each)

Each module generally follows:
- `*.routes.ts` → endpoint wiring + middleware chain,
- `*.controller.ts` → request/response mapping,
- `*.service.ts` → domain/business + DB operations,
- `*.validator.ts` (where present) → Zod validation.

### Auth (`src/modules/auth`)
- Key routes:
  - `POST /auth/signup`
  - `POST /auth/login`
  - `GET /auth/me`
- Key files:
  - `auth.route.ts`, `auth.controller.ts`, `auth.service.ts`, `auth.validator.ts`.
- Important behavior:
  - Creates JWT token payload used by middlewares.
  - Requires `JWT_SECRET`.

### Listings (`src/modules/listings`)
- Key routes:
  - `POST /listings`
  - `GET /listings/me`
- Important behavior:
  - Uses `requireAuth` + role/plan middleware.
  - Creates and fetches properties for current realtor.

### Leads (`src/modules/leads`)
- Key routes:
  - `POST /leads`
  - `GET /leads/me`
- Important behavior:
  - Lead creation ties to property/realtor.
  - Tracks analytics events.

### Analytics (`src/modules/analytics`)
- Key route:
  - `GET /analytics/me`
- Important behavior:
  - Aggregation/grouping by event type.

### OTP (`src/modules/otp`)
- Key routes:
  - `POST /otp/request`
  - `POST /otp/verify`
- Important behavior:
  - Verify flow upserts `PhoneVerification`.

### Message (`src/modules/message`)
- Key routes:
  - `POST /message/conversation`
  - `POST /message/send`
  - `GET /message/:conversationId`
- Important behavior:
  - Conversation uniqueness via `propertyId + clientPhone`.
  - Client message path checks phone verification.

### Property visibility (`src/modules/property`)
- Key routes:
  - `PATCH /property/:id/visibility`
  - `POST /property/:id/allow`
  - `DELETE /property/:id/allow`
- Important behavior:
  - Visibility toggles + phone-level access control.

### Featured (`src/modules/featured`)
- Key routes:
  - `POST /featured`
  - `GET /featured/:token`
- Important behavior:
  - Generates share tokens for selected properties.

### Public (`src/modules/public`)
- Key routes:
  - `GET /public/r/:slug`
  - `GET /public/r/:slug/property/:id`
- Important behavior:
  - Read-only external pages with filters.
  - Tracks visit analytics.

---

## 4) End-to-end request flow (important for debugging)

1. Request hits `src/server.ts` app listener.
2. `src/app.ts` applies global headers + JSON parser.
3. Route group matches (`/auth`, `/listings`, etc.).
4. Route-level middlewares run (auth/role/plan/ownership).
5. Controller validates/parses input.
6. Service executes DB/domain logic.
7. Controller returns output.
8. Any unhandled error flows into app error middleware + Sentry helper.

When debugging, inspect files in this exact order.

---

## 5) Key APIs and important behavior notes

### Health
- `GET /health`
- Used for deploy checks.

### Auth-sensitive APIs
- Most realtor-facing APIs require `Authorization: Bearer <token>`.
- `req.user` is expected by many controllers; missing auth usually fails early.

### Data consistency APIs
- Message creation and OTP flows rely on `PhoneVerification` state.
- Visibility and allow/revoke endpoints rely on ownership checks.

### Public APIs
- Public module routes should never require auth.
- Public property responses should be constrained by visibility/business rules.

---

## 6) Most important files to understand first (recommended reading order)

1. `src/server.ts`
2. `src/app.ts`
3. `src/types/express.d.ts`
4. `src/middlewares/auth.middleware.ts`
5. `src/config/db.ts`
6. `prisma/schema.prisma`
7. `src/modules/auth/*`
8. `src/modules/listings/*`
9. `src/modules/property/*`
10. `src/modules/message/*`
11. `src/modules/public/*`
12. `src/config/sentry.ts`

If you only have 30 minutes, read items 1–6 first.

---

## 7) Local setup for contributors

### Prerequisites
- Node.js 20+
- PostgreSQL connection string

### Environment variables
- `DATABASE_URL` (required)
- `JWT_SECRET` (required)
- `CORS_ORIGIN` (optional)
- `SENTRY_DSN` (optional)
- `SENTRY_ENVIRONMENT` (optional)
- `SENTRY_RELEASE` (optional)

### Commands
```bash
npm install
npm run build
npx prisma validate
npm run dev
```

Production-like run:
```bash
npm run build
npm run start
```

---

## 8) Safe change workflow

1. Pick one module.
2. Update validator (if input changes).
3. Update service logic.
4. Update controller mapping and status codes.
5. Update routes/middlewares if auth/permissions changed.
6. Run checks:
   - `npm run build`
   - `npx prisma validate`
7. Smoke test touched endpoints.

Avoid mixing unrelated refactors in the same PR.

---

## 9) Common pitfalls in this codebase

- Forgetting to enforce `requireAuth` on new sensitive routes.
- Changing token payload shape without updating `express.d.ts` and auth middleware expectations.
- Editing Prisma relations without running `prisma validate`.
- Returning non-normalized params (`string | string[]`) directly without checks in controllers.
- Adding generated artifacts to commits (`dist/`, generated JS/maps).

---

## 10) Quick troubleshooting matrix

### Build fails
- Run `npm run build` and fix first TypeScript error before continuing.

### Prisma initialization errors
- Verify `DATABASE_URL` and adapter dependencies.
- Run `npx prisma validate` and `npx prisma generate`.

### Auth failures (401/403)
- Check `JWT_SECRET` and token format.
- Confirm route middleware chain.

### Public routes not returning expected data
- Validate query/filter parsing in public controller.
- Confirm visibility and slug constraints in service logic.

---

## 11) Deployment notes (Render)

- Deployment config: `render.yaml`.
- Ensure env vars are present in Render dashboard.
- Build must run `npm install` + `npm run build`.
- Start command must run compiled output (`node dist/server.js`).

---

## 12) What to update when adding a new module

Create:
- `src/modules/<feature>/<feature>.routes.ts`
- `src/modules/<feature>/<feature>.controller.ts`
- `src/modules/<feature>/<feature>.service.ts`
- `src/modules/<feature>/<feature>.validator.ts` (if request body/query)

Then:
- mount route in `src/app.ts`,
- add auth/role middleware as needed,
- add Prisma model changes (if needed) + validate,
- document API route in project docs.

---

## 13) Ownership and review checklist for PRs

Before opening a PR, confirm:
- [ ] `npm run build` passes
- [ ] `npx prisma validate` passes
- [ ] Touched endpoints are smoke-tested
- [ ] Auth/role/ownership behavior verified
- [ ] No generated artifacts committed
- [ ] If schema changed: migration/validation notes included

---

## 14) Final orientation summary

If you’re onboarding:
- Start with `server.ts` + `app.ts` to understand runtime wiring.
- Learn auth middleware + `req.user` contract.
- Read Prisma schema to understand true data contracts.
- Then move module-by-module through routes → controllers → services.

That path gives you the fastest safe productivity ramp in this repository.
