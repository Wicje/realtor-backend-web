# Frontend Integration Guide

This guide explains how frontend apps should integrate with this backend safely and predictably.

## 1) Auth flow

1. `POST /auth/signup` or `POST /auth/login`
2. Store returned JWT securely (prefer httpOnly cookie if you control BFF; otherwise in-memory/local strategy with XSS safeguards).
3. Send `Authorization: Bearer <token>` on protected routes.

## 2) Important endpoints for UI

- Profile/auth:
  - `POST /auth/login`
  - `GET /auth/me`
- Listings:
  - `POST /listings`
  - `GET /listings/me`
- Leads:
  - `POST /leads`
  - `GET /leads/me`
- Public:
  - `GET /public/r/:slug`
  - `GET /public/r/:slug/property/:id`
- Messaging:
  - `POST /message/conversation`
  - `POST /message/send`
  - `GET /message/:conversationId`
- Realtime:
  - `GET /realtime/stream/:conversationId` (SSE)
  - `POST /realtime/publish`

## 3) Error handling contract

- 400: validation/domain issue
- 401: missing/invalid auth
- 403: permission denied
- 404: not found
- 429: rate limit
- 500: server error

Always handle 401 by forcing re-auth.

## 4) Realtime (SSE)

Use EventSource (or fetch stream polyfill where needed):

- connect to `/realtime/stream/:conversationId`
- listen for custom events
- reconnect on disconnect with exponential backoff

## 5) OTP UX notes

- OTP requests are throttled
- Verify attempts are throttled
- Show user-friendly cooldown/retry messaging

## 6) Frontend production checklist

- Handle 429 with retry strategy
- Handle 401 token expiration flow
- Validate user input client-side and server-side
- Avoid exposing secrets in frontend builds
