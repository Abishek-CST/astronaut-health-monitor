# Testing Plan

## Test strategy

Test the MVP at unit, API integration, UI, offline-sync, and manual-demo levels. Use synthetic data and avoid real personal health information in test fixtures.

## Unit tests

- [ ] Validate observation values, timestamps, and required units.
- [ ] Reject malformed payloads.
- [ ] Verify each review rule with positive and negative examples.
- [ ] Verify timestamps are timezone-aware and handled consistently.
- [ ] Verify idempotency-key validation.
- [ ] Verify role and ownership policies in service logic.

## API integration tests

- [ ] Authorized user can create and read permitted observations.
- [ ] Unauthenticated requests to protected endpoints are rejected.
- [ ] User cannot access another user's restricted records.
- [ ] Invalid payloads return safe validation errors.
- [ ] Duplicate sync operation returns an idempotent result.
- [ ] Database errors do not expose stack traces or credentials.
- [ ] Audit events are created for the defined important actions.

## Frontend tests

- [ ] Dashboard renders loading, empty, success, and error states.
- [ ] Charts show labels, units, and timestamps.
- [ ] Simulated-data label is visible.
- [ ] Forms display validation feedback.
- [ ] Keyboard focus is visible and controls have accessible names.
- [ ] Layout remains usable at mobile and desktop widths.
- [ ] Offline and pending-sync states are understandable.

## Offline and sync tests

1. Load the app online once.
2. Disable network connectivity.
3. Create a permitted synthetic observation.
4. Reload the page and confirm it remains queued.
5. Restore connectivity and synchronize.
6. Confirm the server has one record for the operation.
7. Retry the same operation and confirm no duplicate.
8. Simulate a rejected operation and confirm the UI retains a useful failure state.

## Security tests

- [ ] Authorization is enforced by the backend.
- [ ] Inputs cannot alter database queries.
- [ ] Secrets are absent from frontend bundles and Git history.
- [ ] CORS permits only intended origins in deployment.
- [ ] Cookie settings and CSRF protection match the selected authentication design.
- [ ] Local data is handled correctly on sign-out.
- [ ] Error responses do not reveal internal details.
- [ ] Rate limiting and request size controls are tested if implemented.

## ML evaluation (only if implemented)

- [ ] Document data provenance and limitations.
- [ ] Split evaluation data to avoid leakage.
- [ ] Report suitable metrics for labelled data.
- [ ] Include false-positive and false-negative examples.
- [ ] Compare against a simple baseline.
- [ ] Avoid clinical claims based on synthetic or unvalidated data.

## Manual acceptance checklist

- [ ] A new reviewer can understand the purpose within one minute.
- [ ] The demo can be run reliably from a clean setup.
- [ ] The main workflow works without relying on a live external service.
- [ ] Offline mode and synchronization are demonstrated.
- [ ] At least one review flag is explained from its underlying data.
- [ ] All demo data is identified as simulated.
- [ ] Limitations and future work are stated honestly.

## Test report template

| Field | Value |
|---|---|
| Build/commit | Fill in |
| Test date | Fill in |
| Environment | Fill in |
| Tests passed / total | Fill in |
| Known failures | Fill in |
| Security issues | Fill in |
| Release decision | Pass / needs work |
