# Realtor Backend Web

Production-minded TypeScript + Express backend for realtor workflows: authentication, listing management, lead capture, analytics, OTP verification, public pages, featured links, property visibility controls, and messaging.

> **Status**: Active development. This README is intentionally exhaustive to make onboarding, operation, and maintenance reliable across engineering, QA, DevOps, and product teams.

## Table of Contents
- 1. Project Overview
- 2. Architecture at a Glance
- 3. Repository Layout
- 4. Tech Stack
- 5. Domain Model
- 6. API Surface
- 7. Request Lifecycle
- 8. Security Model
- 9. Configuration and Environment Variables
- 10. Local Development
- 11. Build and Run
- 12. Testing Strategy
- 13. Observability and Logging
- 14. Data and Prisma
- 15. Deployment Guide
- 16. Operations Runbook
- 17. Troubleshooting Guide
- 18. Contribution Guide
- 19. Coding Standards
- 20. Performance and Scaling
- 21. Reliability Checklist
- 22. Release Process
- 23. Incident Response
- 24. FAQ
- 25. Appendix

---

## Developer Navigation Guide

For day-to-day engineering onboarding and code navigation, read `DEVELOPER_README.md`.

## 1. Project Overview

This service powers realtor-focused features and public discovery flows. Primary actors:
- Realtor users who manage properties and visibility.
- Public visitors discovering realtor pages and properties.
- Lead submitters creating inbound contact opportunities.
- Authenticated staff/clients interacting via messaging and OTP flows.

### Core capabilities
- User signup/login with JWT.
- Property/listing creation and ownership-scoped reads.
- Lead capture + analytics event tracking.
- OTP request/verification.
- Featured links for curated property sets.
- Public realtor/profile and property access.
- Property visibility and phone-scoped access controls.
- Conversation/message persistence.

### Non-goals
- No frontend assets in this repository.
- No payment processor integration in current code.
- No multi-tenant org model beyond realtor ownership boundaries.

## 2. Architecture at a Glance

The service follows a layered module style:
- Routes: HTTP route definitions and middleware composition.
- Controllers: Transport layer adaptation (Request -> service input, response mapping).
- Services: Domain operations and persistence orchestration.
- Config: Runtime config, database client, operational constants.
- Middlewares: AuthN/AuthZ, plan limits, ownership checks, upload adapters.
- Types: Request augmentation and domain-specific typing.

### High-level flow
1. Incoming HTTP request.
2. Global middleware (CORS headers, JSON parser).
3. Module route match.
4. Route middleware (auth, role, plan, ownership).
5. Controller validation + normalization.
6. Service execution.
7. Prisma database calls.
8. Response mapping + status code.

## 3. Repository Layout

- `src/app.ts`: Express app composition and route mounting.
- `src/server.ts`: HTTP server entrypoint.
- `src/config/db.ts`: Prisma client bootstrap.
- `src/config/prisma.ts`: Default prisma export shim.
- `src/middlewares/`: AuthN/AuthZ and guard middlewares.
- `src/modules/auth/`: Auth module routes/controllers/services/validators.
- `src/modules/listings/`: Listings module.
- `src/modules/leads/`: Leads module.
- `src/modules/analytics/`: Analytics module.
- `src/modules/otp/`: OTP module.
- `src/modules/message/`: Messaging module.
- `src/modules/property/`: Property visibility module.
- `src/modules/featured/`: Featured links module.
- `src/modules/public/`: Public read-only routes.
- `src/types/express.d.ts`: Express request augmentation for req.user.
- `prisma/schema.prisma`: Data schema.

## 4. Tech Stack

- Node.js runtime.
- TypeScript strict mode.
- Express web framework.
- Prisma ORM.
- PostgreSQL database.
- JWT for stateless auth.
- Zod for request validation.
- Bcrypt for password hashing.

## 5. Domain Model

- **User**: see `prisma/schema.prisma` for shape and relations.
- **Property**: see `prisma/schema.prisma` for shape and relations.
- **Lead**: see `prisma/schema.prisma` for shape and relations.
- **AnalyticsEvent**: see `prisma/schema.prisma` for shape and relations.
- **PropertyVisibility**: see `prisma/schema.prisma` for shape and relations.
- **Conversation**: see `prisma/schema.prisma` for shape and relations.
- **Message**: see `prisma/schema.prisma` for shape and relations.
- **FeaturedLink**: see `prisma/schema.prisma` for shape and relations.
- **PhoneVerification**: see `prisma/schema.prisma` for shape and relations.
- **Listing**: see `prisma/schema.prisma` for shape and relations.

### Business invariants (expected)
- A property belongs to exactly one realtor.
- Only owner realtor can mutate visibility/access state.
- Public property reads must honor visibility flags.
- Client-originated messages require verified phone in current service logic.
- Analytics events should be append-only and immutable.

## 6. API Surface

Mounted route groups from `src/app.ts`:
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

### Endpoint catalog
- `POST /auth/signup` — Create realtor account.
- `POST /auth/login` — Authenticate and return JWT.
- `GET /auth/me` — Get current user context.
- `POST /auth/realtor-only` — Role-protected probe endpoint.
- `POST /listings` — Create listing/property.
- `GET /listings/me` — List current realtor listings.
- `POST /leads` — Submit lead.
- `GET /leads/me` — Get realtor leads.
- `GET /analytics/me` — Get realtor analytics.
- `POST /otp/request` — Request OTP for phone.
- `POST /otp/verify` — Verify OTP and persist phone verification.
- `POST /message/conversation` — Get or create conversation.
- `POST /message/send` — Create a message.
- `GET /message/:conversationId` — Fetch conversation messages.
- `PATCH /property/:id/visibility` — Set property public/private visibility.
- `POST /property/:id/allow` — Allow phone-specific access.
- `DELETE /property/:id/allow` — Revoke phone-specific access.
- `POST /featured` — Create featured link.
- `GET /featured/:token` — Resolve featured link.
- `GET /public/r/:slug` — Public realtor page with filters.
- `GET /public/r/:slug/property/:id` — Public property detail.

## 7. Request Lifecycle

1. Transport received by Express.
2. Headers normalized and CORS headers attached.
3. JSON body parsed.
4. Route-level middleware chain executes.
5. Controller validates payload (Zod where configured).
6. Controller calls service.
7. Service talks to database via Prisma.
8. Controller maps output into HTTP response.

## 8. Security Model

- JWT Bearer auth for protected routes.
- Role checks for role-scoped endpoints.
- Ownership checks for property mutations.
- Plan-based throttling via property count limits.
- No hardcoded JWT fallback secret; env required.
- Input validation via Zod in major write paths.

### Security hardening checklist
- [ ] SH-001: Verify route auth/authorization behavior with automated integration tests.

## 9. Configuration and Environment Variables

| Variable | Default | Purpose |
|---|---|---|
| `PORT` | `5000` | HTTP listen port |
| `DATABASE_URL` | `(required)` | PostgreSQL connection URL |
| `JWT_SECRET` | `(required)` | JWT sign/verify secret |
| `CORS_ORIGIN` | `*` | Allowed web origin for API calls |
| `CLOUDINARY_CLOUD_NAME` | `optional` | Cloudinary integration (currently stubbed) |
| `CLOUDINARY_API_KEY` | `optional` | Cloudinary integration key |
| `CLOUDINARY_API_SECRET` | `optional` | Cloudinary integration secret |

## 10. Local Development

1. Install dependencies: `npm install`.
2. Copy env template to `.env` and set required values.
3. Run database and migrations (if configured).
4. Generate Prisma client as needed.
5. Start dev server: `npm run dev`.

## 11. Build and Run

- `npm run build` compiles TS to `dist/`.
- `npm run dev` runs ts-node-dev entrypoint.
- `npm run start` should execute built output in production.

## 12. Testing Strategy

- Unit tests for services and validators.
- Integration tests for route + middleware wiring.
- Contract tests for auth and error response shapes.
- Migration checks for Prisma schema changes.
- Smoke tests for startup and health endpoints.


## 13. Observability and Logging

- Use structured logs in JSON in production.
- Attach request id/correlation id.
- Never log secrets or raw tokens.
- Track DB latency and error rates.
- Emit counters for auth failures and OTP verification attempts.

## 14. Data and Prisma

- Schema located at `prisma/schema.prisma`.
- Use migrations for every schema change.
- Keep generated client in sync with schema updates.
- Treat enums and relations as API contracts.
- Validate data constraints before deploy.

## 15. Deployment Guide

1. Build artifact with `npm run build`.
2. Run migrations against target DB.
3. Set env vars in runtime platform.
4. Start process manager against compiled output.
5. Run post-deploy smoke tests.



## 18. Contribution Guide

- Create focused PRs with one primary objective.
- Add/update tests for behavior changes.
- Document env/config updates.
- Avoid unrelated refactors in bugfix PRs.
- Use conventional commit messages where practical.

## 19. Coding Standards

- Prefer pure service functions with explicit inputs/outputs.
- Use early returns for authorization/validation failures.
- Avoid `any`; use narrow types and guards.
- Keep controllers thin and services domain-focused.
- Return consistent error shapes from controllers.


## 20. Performance and Scaling

- Add DB indexes for common query patterns.
- Paginate list endpoints.
- Cache public read-heavy routes.
- Use connection pooling at runtime.
- Track p95/p99 latency by endpoint.


## 22. Release Process

1. Branch cut.
2. CI green.
3. Migration review.
4. Deploy staging.
5. QA sign-off.
6. Deploy production.
7. Post-release monitoring.


## 24. FAQ

**Q: Why strict TypeScript?**  
A: To fail early and reduce runtime defects.

**Q: Why Prisma?**  
A: Strongly-typed data access and migration workflow.

**Q: Where to add a new endpoint?**  
A: Create route/controller/service entries under the corresponding module.

**Q: How to secure a new route?**  
A: Apply `requireAuth` and role/ownership middleware as needed.

-

## 25. Appendix

### A. Module-to-file map
- **Auth**: `auth.route.ts`, `auth.controller.ts`, `auth.service.ts`, `auth.validator.ts`
- **Listings**: `listings.route.ts`, `listings.controller.ts`, `listings.service.ts`, `listings.validator.ts`
- **Leads**: `leads.routes.ts`, `leads.controller.ts`, `leads.service.ts`, `leads.validator.ts`
- **Analytics**: `analytics.routes.ts`, `analytics.controller.ts`, `analytics.service.ts`
- **OTP**: `otp.routes.ts`, `otp.controller.ts`, `otp.service.ts`
- **Message**: `message.route.ts`, `message.controller.ts`, `message.service.ts`
- **Property**: `property.routes.ts`, `property.controller.ts`, `property.visibility.service.ts`
- **Featured**: `featured.routes.ts`, `featured.controller.ts`, `featured.service.ts`
- **Public**: `public.routes.ts`, `public.controller.ts`, `public.service.ts`

### B. HTTP status conventions
- 200 OK for successful reads/updates.
- 201 Created for successful creates.
- 400 Bad Request for validation/domain errors.
- 401 Unauthorized for missing/invalid auth.
- 403 Forbidden for role/ownership denial.
- 404 Not Found for missing resource.
- 500 Internal Server Error for unhandled server faults.


