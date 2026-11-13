# Architecture

## Overview

The application uses a web frontend, a Python API, a relational database, and a client-side offline queue. An optional analysis module computes transparent review flags.

```text
User
  |
  v
React + TypeScript PWA
  |-- UI, charts, forms
  |-- Service Worker: cache application assets
  |-- IndexedDB: permitted local/pending records
  |
  | HTTPS API requests / sync
  v
FastAPI
  |-- Authentication and authorization
  |-- Request validation
  |-- Observation service
  |-- Review-flag service
  |-- Audit events
  |
  +--------------------+
  |                    |
  v                    v
PostgreSQL          Python analysis module
(records, users,    (rules first; optional
audit events)        evaluated anomaly model)
```

## Components

### Frontend
- React and TypeScript provide the user interface.
- Tailwind CSS supports consistent responsive styling.
- A charting library can display trends with units and timestamps.
- UI states should include loading, empty, error, offline, syncing, and synchronized.

### Progressive Web App
- A Service Worker may cache versioned static assets.
- IndexedDB stores only the minimum permitted local data and pending operations.
- The UI should explain when information is local, stale, or not yet synchronized.
- Avoid caching sensitive API responses by default. Define explicit cache rules and clear local data on sign-out where appropriate.

### Backend API
- FastAPI exposes documented endpoints.
- Pydantic schemas validate incoming and outgoing data.
- Service functions implement business rules.
- Database access is isolated from route handlers.
- Authorization is enforced server-side; hiding a UI control is not a security boundary.

### Database
- PostgreSQL stores users, observations, review flags, and audit events.
- Use migrations to version schema changes.
- Store timestamps consistently in UTC and render local display times with an explicit timezone.

### Analysis
- Start with deterministic, documented rules.
- Keep the analysis function separate from API routing.
- If using machine learning, version the model, record its input assumptions, evaluate it, and expose uncertainty and limitations.

## Suggested repository structure

```text
frontend/
  src/
    components/
    pages/
    services/
    hooks/
    types/
backend/
  app/
    main.py
    api/
    schemas/
    services/
    repositories/
    models/
ml/
  rules.py
  anomaly_detection.py
database/
  migrations/
tests/
  backend/
  frontend/
docs/
  images/
```

## Suggested API contract

| Method | Path | Purpose |
|---|---|---|
| GET | `/health` | Liveness check; no sensitive details |
| GET | `/api/v1/observations` | List authorized observations with filters |
| POST | `/api/v1/observations` | Create an observation |
| GET | `/api/v1/observations/{id}` | Read one authorized observation |
| PATCH | `/api/v1/observations/{id}` | Update an allowed observation |
| GET | `/api/v1/review-flags` | List review flags |
| POST | `/api/v1/review-flags/{id}/acknowledge` | Acknowledge a flag |
| POST | `/api/v1/sync` | Submit queued client operations idempotently |

These are proposed routes, not implemented endpoints. Document authentication, request/response schemas, validation errors, pagination, and idempotency behavior before implementation.

## Key design decisions

1. **Rules before ML:** deterministic review rules are easier to explain and test for a short hackathon.
2. **Client-generated IDs:** queued records need stable identifiers to survive retries.
3. **Idempotent sync:** the server should safely recognize repeated submissions.
4. **UTC timestamps:** use timezone-aware timestamps and clear display conversion.
5. **Least privilege:** roles and resource ownership must be checked on the backend.
6. **No diagnosis claims:** the system presents observations and review prompts, not medical conclusions.

## Deployment

For a demo, use local development services or a trusted deployment platform. Keep secrets in environment variables or a secret manager, use HTTPS for deployed traffic, restrict database access, and avoid deploying real personal health information.
