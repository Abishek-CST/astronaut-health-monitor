import urllib.request
import json

BASE = "http://127.0.0.1:8000/api/v1"

def get(path):
    r = urllib.request.urlopen(f"{BASE}{path}")
    return json.loads(r.read())

def post(path, body):
    data = json.dumps(body).encode("utf-8")
    req = urllib.request.Request(f"{BASE}{path}", data=data, headers={"Content-Type": "application/json"})
    r = urllib.request.urlopen(req)
    return json.loads(r.read())

def main():
    print("[1] Testing /subjects...")
    subs = get("/subjects")
    assert len(subs) == 4, f"Expected 4 crew, got {len(subs)}"
    labels = [s["display_label"] for s in subs]
    print(f" -> 4 crew members loaded: {labels}")

    print("[2] Testing /nasa-resources...")
    res = get("/nasa-resources")
    assert len(res) == 5, f"Expected 5 NASA resources, got {len(res)}"
    for r in res:
        print(f" -> {r['resource_name']} ({r.get('dataset_id')})")

    print("[3] Testing /observations...")
    obs = get("/observations?limit=10")
    assert len(obs) > 0, "No observations returned"
    print(f" -> Observations count: {len(obs)}, latest: {obs[0]['measurement_type']} = {obs[0]['value_numeric']} {obs[0]['unit']}")

    print("[4] Testing /review-flags...")
    flags = get("/review-flags")
    assert len(flags) >= 4, f"Expected >= 4 flags, got {len(flags)}"
    print(f" -> Flags count: {len(flags)}, top rule: {flags[0]['rule_code']}")
    print(f"    What changed: {flags[0].get('what_changed')}")
    print(f"    Baseline ref: {flags[0].get('baseline_reference')}")
    print(f"    Action review: {flags[0].get('action_to_review')}")

    print("[5] Testing /review-flags acknowledgment...")
    ack = post(f"/review-flags/{flags[0]['id']}/acknowledge", {
        "acknowledged_by": "Dr. Alex Chen (Flight Surgeon)",
        "notes": "Verified telemetry sensor adhesion. Hydration electrolyte pouch administered."
    })
    assert ack["acknowledged_by"] == "Dr. Alex Chen (Flight Surgeon)"
    print(" -> Flag acknowledgment verified!")

    print("[6] Testing idempotent /sync...")
    sync_payload = {
        "operations": [{
            "operation_id": "op-test-verify-1234",
            "operation_type": "observation.create",
            "created_at": "2026-11-14T00:00:00Z",
            "payload": {
                "subject_id": "c1-elena-rostova",
                "measurement_type": "heart_rate",
                "domain": "cardiovascular",
                "value_numeric": 68.5,
                "unit": "bpm",
                "observed_at": "2026-11-14T00:00:00Z",
                "source_type": "synthetic_demo",
                "source_name": "Bio-Harness Telemetry Simulator",
                "is_simulated": True,
                "note": "E2E automated validation test"
            }
        }]
    }
    sync_res1 = post("/sync", sync_payload)
    assert sync_res1["synced_count"] == 1, "First sync should succeed"
    print(" -> First sync: synced_count = 1")

    sync_res2 = post("/sync", sync_payload)
    assert sync_res2["duplicates_ignored"] == 1, "Repeated sync should be ignored idempotently"
    print(" -> Repeated sync: duplicates_ignored = 1 (Idempotency verified!)")

    print("[7] Testing /audit-events...")
    audits = get("/audit-events?limit=5")
    assert len(audits) >= 5, "Audit events should be recorded"
    print(f" -> Latest audit event: {audits[0]['event_type']} by {audits[0]['actor_user_id']}")

    print("\nALL ENDPOINTS & WORKFLOWS VALIDATED 100% SUCCESSFULLY!")

if __name__ == "__main__":
    main()
