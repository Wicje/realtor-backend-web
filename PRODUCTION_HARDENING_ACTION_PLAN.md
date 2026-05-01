# Production Hardening Action Plan (Render Go-Live)

Owner: Backend Team  
Target: First production release on Render  
Priority model: P0 (must do now), P1 (do this week), P2 (next sprint)

## Executive Summary

Current backend is close to deployable but has known gaps in:
1. Realtime feature completeness,
2. OTP abuse protection,
3. Public listing hardening,
4. Operational safeguards (rate limiting, alerting, regression tests).

This document gives a fast-track plan to ship safely.

---

## P0 — Must complete before public go-live

### 1) Environment and startup correctness
- [ ] Set Render env vars: `DATABASE_URL`, `JWT_SECRET`, `CORS_ORIGIN`, `SENTRY_DSN`.
- [ ] Verify app boots from `npm run start` in Render using compiled `dist/server.js`.
- [ ] Validate Prisma client generation during build (`postinstall`).

Validation:
- `npm run build`
- `npx prisma validate`
- Render health check on `/health`

### 2) Auth and identity correctness
- [ ] Ensure signup always generates unique slug for public profile routing.
- [ ] Confirm JWT payload consistency across middleware/controllers.
- [ ] Verify protected routes all enforce `requireAuth`.

Validation:
- Signup/login smoke tests
- 401/403 matrix tests per protected route

### 3) Public listing safety and correctness
- [ ] Verify public filters and edge-case inputs (`minPrice=0`, `maxPrice=0`, invalid enums).
- [ ] Ensure only `isPublic=true` properties are exposed.
- [ ] Confirm slug-based access cannot leak non-public resources.

Validation:
- API tests for `/public/r/:slug` and `/public/r/:slug/property/:id`

### 4) OTP abuse safeguards
- [ ] Add attempt throttling (per phone + IP).
- [ ] Add resend cooldown windows.
- [ ] Remove OTP value from logs in production.

Validation:
- Repeated OTP requests are throttled
- Brute-force verify attempts are blocked

### 5) Observability and fatal paths
- [ ] Confirm Sentry DSN configured in Render.
- [ ] Verify non-blocking Sentry transport behavior.
- [ ] Add release/environment tags in deployment pipeline.

Validation:
- Trigger test exception endpoint in staging
- Confirm event appears in Sentry with environment/release tags

---

## P1 — Complete within first week after launch

### 6) Realtime completion (currently disabled)
- [ ] Reintroduce socket layer behind feature flag.
- [ ] Add authenticated connection handshake.
- [ ] Add room-level authorization tied to conversation ownership.
- [ ] Add integration tests for connect/join/send flows.

### 7) Security hardening
- [ ] Add HTTP security headers middleware.
- [ ] Add API rate limiting for auth, OTP, and public endpoints.
- [ ] Add request body size limits and strict payload validation coverage.

### 8) Data and consistency checks
- [ ] Add DB constraints/index review for public and messaging queries.
- [ ] Add migration validation checklist for schema changes.
- [ ] Add cleanup strategy for stale verifications/conversations if needed.

---

## P2 — Next sprint reliability work

### 9) Test coverage baseline
- [ ] Add integration tests for each route group.
- [ ] Add negative-path tests (auth failures, invalid payloads, ownership violations).
- [ ] Add production-smoke suite for Render post-deploy.

### 10) Runbooks and on-call readiness
- [ ] Add incident runbook for auth outage, DB outage, and OTP abuse incidents.
- [ ] Add dashboard/alerts for:
  - 5xx rate,
  - auth failure spikes,
  - OTP request anomalies,
  - public endpoint latency.

---

## Minimum Test Gate Before Deploy (must pass)

1. Build & schema
- `npm run build`
- `npx prisma validate`

2. API smoke
- `/health`
- auth signup/login/me
- listings create/me
- leads submit/me
- otp request/verify
- public slug list/detail

3. Security smoke
- protected route without token => 401
- wrong role => 403
- ownership violation => 403/404

4. Observability smoke
- synthetic error appears in Sentry

---

## Immediate Implementation Notes Applied

- Signup now generates slug at account creation time.
- Public price filters now correctly handle zero values.
- Sentry transport failures no longer interrupt request flow.

These are tactical fixes; full hardening still requires the P0/P1 checklist above.
