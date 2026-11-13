# Project Plan

## Working title

**Astronaut Health Monitor — Offline-First Mission Health Dashboard**

## Vision

Provide a clear, secure interface for reviewing health observations and trends in environments where connectivity may be intermittent.

## Problem statement

Space crews and remote teams may need to record and review health-related observations without continuous access to a network. Records must remain understandable, synchronized carefully, and protected against unauthorized access.

## Goals

1. Build a working, responsive prototype.
2. Show synthetic health observations and historical trends.
3. Make data entry and review possible during a simulated network outage.
4. Explain why a measurement or pattern was flagged for review.
5. Demonstrate basic privacy and security controls.
6. Communicate limitations clearly in the demo and submission.

## Non-goals for the hackathon MVP

- Diagnosing illnesses or recommending treatment.
- Replacing clinicians or mission medical protocols.
- Connecting to real medical devices without authorization and validation.
- Claiming flight readiness, clinical accuracy, or NASA endorsement.
- Building a complex predictive model before a reliable data pipeline exists.

## Target users

- Primary demo persona: an astronaut or mission health officer reviewing synthetic observations.
- Secondary illustrative use case: a remote research station or field team with intermittent connectivity.

## MVP features

- [ ] Dashboard with simulated profile and current observations.
- [ ] Historical chart for selected measurements.
- [ ] Add observation with timestamp, value, unit, and source.
- [ ] Visible label for simulated/demo data.
- [ ] Rule-based review flags with understandable reasons.
- [ ] Offline cached interface and local pending-record queue.
- [ ] Sync status and conflict/error feedback.
- [ ] Basic authenticated access and role checks.
- [ ] Audit log for significant actions.
- [ ] Demo walkthrough and screenshots.

## Suggested development phases

### Phase 1 — Define
- Read the official 2026 challenge brief.
- Select the exact challenge and identify judging criteria.
- Agree on the MVP and success criteria.

### Phase 2 — Prototype
- Sketch dashboard and observation-entry screens.
- Create synthetic sample records.
- Implement the UI with clear empty, loading, error, and offline states.

### Phase 3 — Backend and data
- Define schema and API contracts.
- Validate inputs and store records.
- Add authorization and audit events.

### Phase 4 — Offline behavior
- Cache static assets.
- Store permitted pending records in IndexedDB.
- Implement idempotent synchronization and conflict handling.

### Phase 5 — Analysis
- Add transparent rules first.
- Evaluate any optional anomaly model on synthetic or suitable authorized data.
- Show explanation and limitations for every flag.

### Phase 6 — Verify and submit
- Test online, offline, and reconnect scenarios.
- Check privacy/security and accessibility basics.
- Record a short demo.
- Verify all submission fields and links before submitting.

## Success criteria

- A reviewer can understand the purpose in under one minute.
- The main dashboard works on desktop and mobile widths.
- Synthetic observations can be entered, reviewed, and charted.
- A test observation can be saved locally while offline and synchronized after reconnecting.
- Duplicate synchronization does not create duplicate records.
- Review flags show a reason and are not presented as diagnoses.
- The demo clearly states that data is simulated and the prototype is not clinically validated.

## Risks and mitigations

| Risk | Mitigation |
|---|---|
| Scope becomes too large | Complete the MVP before optional AI or hardware integrations. |
| No valid real health dataset | Use labelled synthetic data; make no real-world performance claims. |
| Offline sync creates duplicates | Use client-generated IDs, idempotency keys, and server acknowledgements. |
| Misleading medical interpretation | Use neutral review language and explicit limitations. |
| Time lost to deployment | Keep a local demo path and record a backup demo video. |
| Challenge mismatch | Re-check the exact official challenge statement before finalizing. |

## Deadline plan

The project submission window stated in the event instructions opens **November 14, 2026 at 9:00 AM local time** and closes **November 15, 2026 at 11:59 PM local time**. Finish and test the prototype before the window, then submit through the team's Project Tab while submission is open. Confirm current official details on the event website.
