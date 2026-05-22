# Realtor Backend Web

A production-focused backend API for realtor workflows (auth, listings, leads, messaging, OTP, public profiles, analytics, and realtime stream events).

---

## What this project does

- Realtor authentication and authorization
- Listing/property management
- Lead capture and analytics tracking
- OTP verification workflow
- Public realtor/property pages via slug
- Realtime conversation events (SSE)

---

## Tech stack

- Node.js + TypeScript
- Express
- Prisma + PostgreSQL
- JWT auth
- Zod validation

---

## Project structure (high level)

- `src/server.ts` — app entrypoint
- `src/app.ts` — middleware + route mounting
- `src/config/*` — DB, sentry, plan config
- `src/middlewares/*` — auth/security/ownership/plan guards
- `src/modules/*` — feature modules (routes/controllers/services)
- `prisma/schema.prisma` — DB models
- `render.yaml` — Render deployment manifest

---

## Quick start

```bash
npm install
npm run build
npx prisma validate
npm run dev
```

Production run:

```bash
npm run build
npm run start
```

---

## Required environment variables

- `JWT_SECRET`
- `DATABASE_URL` (or temporarily set `ALLOW_START_WITHOUT_DB=true` to boot in degraded mode)

Optional:

- `CORS_ORIGIN`
- `SENTRY_DSN`
- `SENTRY_ENVIRONMENT`
- `SENTRY_RELEASE`

---

## Core API groups

- `/auth`
- `/listings`
- `/leads`
- `/analytics`
- `/otp`
- `/message`
- `/property`
- `/featured`
- `/public`
- `/realtime`

See `README_FRONTEND_INTEGRATION.md` for frontend usage patterns.

---

## Security posture (current)

- JWT-required protected routes
- Request rate limiting and security headers
- OTP request/verify rate windows
- Error reporting hooks (Sentry transport)

---

## Deployment (Render)

- Use `render.yaml` for baseline service config.
- Ensure runtime env vars are configured in Render dashboard.
- Build command should install dependencies and build TypeScript.

---

## Documentation map

- `README_FRONTEND_INTEGRATION.md` — API integration guide for frontend
- `README_NAVIGATION.md` — codebase navigation and architecture map
- `README_CONTRIBUTING.md` — contribution standards and clean code rules
- `README_NON_TECHNICAL.md` — plain-language project overview
