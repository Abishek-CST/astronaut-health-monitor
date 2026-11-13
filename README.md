# Astronaut Health Monitor

An offline-first prototype for monitoring astronaut health indicators during space missions, with a possible Earth-based use case for remote research stations and field teams.

> **Prototype and safety notice:** This project is for education and demonstration. It is not a medical device, does not diagnose conditions, and must not be used to make real medical decisions. Demo measurements should be clearly labelled as simulated unless collected from an authorized, validated source.

## Problem

During long-duration missions, crews may need to review health observations when connectivity is limited. A useful monitoring interface should preserve records locally, show trends, identify data that may deserve review, and explain its alerts.

## Proposed solution

A responsive web application that:
- Displays astronaut profiles and health observations.
- Visualizes measurements over time.
- Flags unusual values or changes using transparent, configurable rules and an experimental anomaly-detection component.
- Supports limited offline operation and synchronization when connectivity returns.
- Applies access controls and records important actions.
- Demonstrates possible Earth applications in remote or isolated environments.

## Technology stack

- **Frontend:** React, TypeScript, Tailwind CSS
- **Backend API:** Python, FastAPI
- **Database:** PostgreSQL
- **Offline storage:** Service Worker and IndexedDB
- **Data analysis:** Python, pandas, scikit-learn (optional)
- **Testing:** pytest and frontend tests
- **Version control:** Git and GitHub
- **Packaging:** Docker (optional for the first prototype)

Choose stable, mutually compatible versions when implementing; document exact versions in the project manifests.

## Architecture overview

1. React renders the dashboard and captures user actions.
2. The PWA caches application assets and stores selected pending records locally.
3. FastAPI validates requests, enforces authorization, and runs application logic.
4. PostgreSQL stores authorized records and audit events.
5. A Python analysis module can generate explainable review flags from suitable data.

See [ARCHITECTURE.md](ARCHITECTURE.md) and [OFFLINE_SYNC.md](OFFLINE_SYNC.md).

## Repository layout

```text
astronaut-health-monitor/
├── README.md
├── PROJECT_PLAN.md
├── REQUIREMENTS.md
├── ARCHITECTURE.md
├── DATABASE.md
├── AI_ML_PLAN.md
├── OFFLINE_SYNC.md
├── SECURITY.md
├── TESTING.md
├── SUBMISSION.md
├── .gitignore
├── .env.example
├── frontend/
├── backend/
├── ml/
├── database/
├── tests/
└── docs/images/
```

## Getting started

The full-stack application is generated, tested, and ready to run.

### Quick Start (Single Command Hosting)
To host both the FastAPI REST API and the compiled React PWA frontend on port 8000:
```bash
python -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000
```
Then navigate to: **`http://127.0.0.1:8000`** in your browser.

### Development Mode
To run Vite with hot-module replacement (HMR) and live proxying to the FastAPI backend:
1. Start the backend:
   ```bash
   python -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000
   ```
2. In a separate terminal, start the frontend:
   ```bash
   cd frontend
   npm run dev
   ```
   Open `http://localhost:5173`.

### Running Automated Tests
```bash
python -c "import tests.test_api_and_rules as t; t.test_transparent_review_rules(); t.test_idempotency_and_duplicate_prevention(); t.test_flag_acknowledgment(); print('ALL TESTS PASSED SUCCESSFULLY!')"
```

## Demo data

Use synthetic data generated specifically for the demo. Label it **SIMULATED DATA** in the interface, charts, screenshots, and presentation. Do not imply that the sample data comes from NASA or actual astronauts unless that is true and authorized.

## Project status

- [x] Confirm the official challenge brief and map requirements to it.
- [x] Build the dashboard MVP.
- [x] Implement API and persistent storage.
- [x] Implement offline read/write queue and synchronization.
- [x] Add transparent review flags.
- [x] Add authentication and authorization.
- [x] Run tests and security checks.
- [x] Host live website locally on port 8000.
- [ ] Record demo and prepare final submission.

## License and attribution

Choose a license before public release. Attribute any datasets, libraries, icons, and other assets according to their licenses and the official challenge rules.
