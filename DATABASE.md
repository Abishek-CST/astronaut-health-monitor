# Database Design

## Principles

- Store the minimum information required for the prototype.
- Use synthetic data for public demos.
- Keep timestamps timezone-aware and store them consistently in UTC.
- Record units and source/provenance with each measurement.
- Use migrations to track schema changes.
- Define retention and deletion rules before handling any real data.

## Proposed entities

### `users`
| Column | Type | Notes |
|---|---|---|
| `id` | UUID | Primary key |
| `display_name` | TEXT | Demo name or approved display name |
| `email` | TEXT | Unique identifier if email login is used |
| `password_hash` | TEXT | Only a strong password hash; never plaintext |
| `role` | TEXT | Constrained role such as `admin`, `reviewer`, `contributor` |
| `created_at` | TIMESTAMPTZ | Creation timestamp |
| `is_active` | BOOLEAN | Account status |

### `subjects`
Represents the person/profile associated with observations. For a demo, use synthetic identifiers and avoid real personal details.

| Column | Type | Notes |
|---|---|---|
| `id` | UUID | Primary key |
| `display_label` | TEXT | Synthetic label, e.g. `Demo Crew Member A` |
| `is_simulated` | BOOLEAN | Must be true for demo subjects |
| `created_at` | TIMESTAMPTZ | Creation timestamp |

### `observations`
| Column | Type | Notes |
|---|---|---|
| `id` | UUID | Primary key; may be generated client-side for sync |
| `subject_id` | UUID | Foreign key to `subjects` |
| `measurement_type` | TEXT | E.g. heart rate or sleep duration |
| `value_numeric` | NUMERIC | Numeric value when applicable |
| `value_text` | TEXT | Optional nonnumeric value |
| `unit` | TEXT | Explicit unit |
| `observed_at` | TIMESTAMPTZ | When observation was taken |
| `recorded_at` | TIMESTAMPTZ | When system recorded it |
| `source` | TEXT | Manual, synthetic generator, or approved source |
| `is_simulated` | BOOLEAN | Provenance label |
| `created_by` | UUID | Nullable FK to user |
| `client_operation_id` | UUID | Idempotency key for queued writes |
| `note` | TEXT | Optional; avoid unnecessary sensitive content |

Add a uniqueness constraint on the idempotency identifier within the appropriate scope so retries do not duplicate records.

### `review_flags`
| Column | Type | Notes |
|---|---|---|
| `id` | UUID | Primary key |
| `observation_id` | UUID | Related observation, if applicable |
| `subject_id` | UUID | Related subject |
| `rule_code` | TEXT | Stable identifier for the rule/model |
| `severity` | TEXT | Product-defined review priority, not medical severity |
| `reason` | TEXT | Human-readable explanation |
| `created_at` | TIMESTAMPTZ | Timestamp |
| `acknowledged_by` | UUID | Nullable user reference |
| `acknowledged_at` | TIMESTAMPTZ | Nullable timestamp |

### `audit_events`
| Column | Type | Notes |
|---|---|---|
| `id` | UUID | Primary key |
| `actor_user_id` | UUID | Nullable for system events |
| `event_type` | TEXT | E.g. `observation.created` |
| `resource_type` | TEXT | Resource category |
| `resource_id` | UUID | Related resource |
| `occurred_at` | TIMESTAMPTZ | UTC event time |
| `request_id` | TEXT | Optional correlation ID |
| `metadata` | JSONB | Minimal non-sensitive context |

Do not store passwords, access tokens, or unnecessary measurement details in audit metadata.

## Relationships

- A subject can have many observations.
- An observation can have zero or many review flags.
- A user can create many observations and acknowledge flags.
- Audit events may refer to users and resources.

## Index suggestions

- `observations(subject_id, observed_at DESC)`
- `observations(measurement_type, observed_at DESC)`
- `review_flags(subject_id, created_at DESC)`
- Unique index for the scoped client operation/idempotency key.

Choose indexes based on actual query patterns and verify with query plans if the dataset grows.

## Example synthetic record

```json
{
  "id": "a generated UUID",
  "measurement_type": "heart_rate",
  "value_numeric": 72,
  "unit": "beats/min",
  "observed_at": "2026-11-14T10:00:00Z",
  "source": "synthetic_demo_generator",
  "is_simulated": true
}
```

The number above is an illustrative synthetic example, not a medical recommendation or expected normal value.

## Data lifecycle

1. Validate incoming data.
2. Store provenance and timestamps.
3. Limit access to authorized roles.
4. Define retention/deletion behavior.
5. Keep demo exports synthetic and labelled.
6. Never commit production credentials or real health records to source control.
