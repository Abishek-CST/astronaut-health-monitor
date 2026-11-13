# Requirements

## Scope and assumptions

This document describes a hackathon prototype, not a clinically validated health system. Use synthetic demo data unless a dataset is authorized and its provenance is documented.

## Functional requirements

### FR-01 — Dashboard
The system shall show a summary of available observations, their timestamps and units, and the current synchronization state.

### FR-02 — Observation history
An authorized user shall be able to view observations filtered by person, measurement type, and date range.

### FR-03 — Record an observation
An authorized user shall be able to enter a measurement with a value, unit, timestamp, source, and optional note. The system shall validate required fields and reasonable data formats.

### FR-04 — Visualize trends
The interface shall plot available observations over time and label axes, units, missing data, and demo data appropriately.

### FR-05 — Review flags
The system shall display a review flag when a configured rule is triggered. Each flag shall explain the rule or change that caused it. A flag shall not be described as a diagnosis.

### FR-06 — Offline mode
The application shall provide a clear offline state and allow the specifically supported actions to be queued locally without a network connection.

### FR-07 — Synchronization
When connectivity returns, the client shall synchronize queued records, display success/failure states, and avoid duplicate creation on retries.

### FR-08 — Access control
The system shall require authentication for protected operations and enforce server-side authorization for each protected resource.

### FR-09 — Audit events
The system shall record important actions such as sign-in events, record creation/updates, review-flag acknowledgement, and synchronization outcomes, while avoiding unnecessary sensitive data in logs.

### FR-10 — Data provenance
The interface and stored record shall distinguish simulated data from authorized external data and retain source/provenance metadata where appropriate.

### FR-11 — Error handling
The system shall display understandable errors without exposing secrets, stack traces, or sensitive information.

### FR-12 — Export/demo
If export is implemented, it shall be restricted to authorized users and identify the exported dataset as simulated when applicable.

## Non-functional requirements

- **Usability:** Main tasks should be understandable without specialist training.
- **Responsive design:** Core screens should work on phone, tablet, and desktop widths.
- **Offline resilience:** Cached assets and queued records should survive an ordinary page reload where supported.
- **Security:** Validate input, use HTTPS in deployment, protect credentials, and apply least privilege.
- **Privacy:** Collect the minimum data necessary; do not put real health data into public demos or source control.
- **Reliability:** Handle network loss, retries, duplicate requests, and stale data explicitly.
- **Accessibility:** Use semantic HTML, keyboard navigation, visible focus, readable contrast, and text alternatives for charts.
- **Maintainability:** Separate UI, API, data access, and analysis logic.
- **Performance:** Keep the MVP lightweight and avoid unnecessary large dependencies.
- **Transparency:** State the limitations of simulated data and experimental analytics.

## User stories

- As a reviewer, I want to see recent observations so I can understand the current recorded data.
- As a user, I want to add an observation so the record can be updated.
- As a user without connectivity, I want supported entries queued locally so I can continue working.
- As a user, I want to know whether my entries have synchronized.
- As a reviewer, I want to know why an item was flagged so I can inspect the underlying data.
- As an administrator, I want access restrictions and audit events so use of the prototype can be reviewed.

## Acceptance criteria

- [ ] All sample values are labelled simulated.
- [ ] Required fields and units are validated.
- [ ] Charts display timestamps and units.
- [ ] Every review flag includes a reason and source rule.
- [ ] Offline state is visible.
- [ ] A queued record synchronizes after reconnecting in the tested scenario.
- [ ] Repeating the same sync request does not create a duplicate.
- [ ] Unauthorized API requests are rejected by the server.
- [ ] Secrets are not committed to the repository.
- [ ] The README provides setup and demo instructions.
