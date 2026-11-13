# Offline Operation and Synchronization

## Goal

Keep selected application functions available during temporary network loss and synchronize queued changes safely when connectivity returns.

Offline support does not mean every function works offline. The UI must identify which data is local, potentially stale, or awaiting synchronization.

## Components

- **Service Worker:** caches versioned static assets and the app shell.
- **IndexedDB:** stores a small set of permitted local records and queued operations.
- **Sync service:** sends queued operations to the API and processes acknowledgements.
- **Backend:** validates authorization and data, enforces idempotency, and returns per-operation results.

## Suggested local operation record

```json
{
  "operationId": "client-generated UUID",
  "operationType": "observation.create",
  "createdAt": "UTC timestamp",
  "payload": {
    "measurementType": "example_measurement",
    "value": 1,
    "unit": "example_unit",
    "isSimulated": true
  },
  "status": "pending",
  "attemptCount": 0
}
```

This is an illustrative schema. Do not store access tokens in IndexedDB records. Minimize sensitive local data and define what happens on sign-out and shared devices.

## Synchronization flow

1. The user creates an observation.
2. The client validates the basic form and generates a stable operation ID.
3. If online, the client submits the operation; if offline, it queues it locally.
4. The UI shows `Pending sync` for queued operations.
5. On reconnect or user request, the sync service submits pending operations.
6. The server authenticates the user, authorizes the operation, validates the payload, and checks the idempotency key.
7. The server returns a result for each operation.
8. The client marks accepted operations as synchronized and surfaces failures for review.

## Duplicate prevention

- Generate one stable operation ID when an operation is first created.
- Reuse that ID on every retry.
- Enforce uniqueness on the server.
- Return the original result for a repeated operation where appropriate.
- Do not assume that a timeout means the server failed to process the request.

## Conflict handling

For MVP observation records, prefer append-only records where feasible. For editable records:
- Detect updates based on a version or `updated_at` value.
- Do not silently overwrite newer server data.
- Present a conflict message and let an authorized user resolve it.
- Document the selected policy in the UI and tests.

## Cache policy

- Cache static assets with versioned names.
- Avoid caching authenticated API responses by default.
- Do not cache secrets or tokens.
- Clear user-specific local data on sign-out where appropriate.
- Provide a clear action to remove local demo data.
- Consider browser storage limits and possible eviction.

## Required tests

- [ ] App shell opens after first successful load while offline.
- [ ] Offline-created observation remains queued after a page reload.
- [ ] Reconnect synchronizes a pending observation.
- [ ] Retrying an operation does not create a duplicate.
- [ ] Failed sync shows a useful message and preserves retry capability.
- [ ] Expired authentication does not bypass server authorization.
- [ ] UI clearly distinguishes local, pending, synced, and failed states.
- [ ] Sign-out behavior for local data is tested and documented.

## Limitations

Browser storage can be cleared or evicted, and background sync support varies by browser. Do not promise guaranteed persistence. For a high-stakes operational system, browser-only offline storage would require much more rigorous engineering and validation.
