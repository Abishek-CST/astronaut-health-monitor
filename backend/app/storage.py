"""
In-Memory Storage & Synthetic Data Seed Layer
Adheres to DATABASE.md entities and provides thread-safe access.
"""

import uuid
from datetime import datetime, timezone, timedelta
from typing import List, Dict, Any, Optional
import random

class DataStore:
    def __init__(self):
        self.subjects: Dict[str, Dict[str, Any]] = {}
        self.observations: List[Dict[str, Any]] = []
        self.review_flags: List[Dict[str, Any]] = []
        self.audit_events: List[Dict[str, Any]] = []
        self.client_operation_ids: set = set()
        self._seed_initial_data()

    def _seed_initial_data(self):
        # 1. Seed Subjects
        crew_definitions = [
            {
                "id": "c1-elena-rostova",
                "display_label": "Commander Elena Rostova",
                "role": "Mission Commander",
                "mission_phase": "Ares-IV Transit (Sol 142)",
                "avatar_initials": "ER",
                "is_simulated": True,
                "created_at": (datetime.now(timezone.utc) - timedelta(days=150)).isoformat()
            },
            {
                "id": "c2-alex-chen",
                "display_label": "Dr. Alex Chen",
                "role": "Flight Surgeon / Medical Officer",
                "mission_phase": "Ares-IV Transit (Sol 142)",
                "avatar_initials": "AC",
                "is_simulated": True,
                "created_at": (datetime.now(timezone.utc) - timedelta(days=150)).isoformat()
            },
            {
                "id": "c3-marcus-vance",
                "display_label": "Marcus Vance",
                "role": "Chief Flight Engineer",
                "mission_phase": "Ares-IV Transit (Sol 142)",
                "avatar_initials": "MV",
                "is_simulated": True,
                "created_at": (datetime.now(timezone.utc) - timedelta(days=150)).isoformat()
            },
            {
                "id": "c4-sarah-jenkins",
                "display_label": "Sarah Jenkins",
                "role": "Payload & Astrobiology Specialist",
                "mission_phase": "Ares-IV Transit (Sol 142)",
                "avatar_initials": "SJ",
                "is_simulated": True,
                "created_at": (datetime.now(timezone.utc) - timedelta(days=150)).isoformat()
            }
        ]

        for crew in crew_definitions:
            self.subjects[crew["id"]] = crew

        # 2. Seed synthetic historical observations across last 7 days
        now = datetime.now(timezone.utc)

        for crew_id in self.subjects.keys():
            # Generate 24 hourly observations for the last 24h, plus 6-hourly points for previous 6 days
            time_points = []
            for h in range(24, 0, -1):
                time_points.append(now - timedelta(hours=h))
            for d in range(2, 7):
                for h_step in [0, 6, 12, 18]:
                    time_points.append(now - timedelta(days=d, hours=h_step))
            time_points.sort()

            # Baseline parameters
            base_hr = 68.0 if crew_id != "c3-marcus-vance" else 74.0
            base_spo2 = 98.2
            base_temp = 36.7
            base_rr = 14.0

            for t in time_points:
                t_iso = t.isoformat()
                
                # Heart Rate
                noise_hr = random.uniform(-4.0, 4.0)
                hr_val = round(base_hr + noise_hr, 1)
                # Introduce a controlled spike for Marcus Vance 3 hours ago (EVA exercise)
                if crew_id == "c3-marcus-vance" and (now - t).total_seconds() < 12000 and (now - t).total_seconds() > 7200:
                    hr_val = 114.0
                
                obs_hr = {
                    "id": str(uuid.uuid4()),
                    "subject_id": crew_id,
                    "measurement_type": "heart_rate",
                    "value_numeric": hr_val,
                    "value_text": None,
                    "unit": "bpm",
                    "observed_at": t_iso,
                    "recorded_at": t_iso,
                    "source": "bio_harness_telemetry",
                    "is_simulated": True,
                    "created_by": "telemetry_daemon",
                    "client_operation_id": str(uuid.uuid4()),
                    "note": "Continuous biotelemetry stream"
                }
                self.observations.append(obs_hr)

                # SpO2
                spo2_val = round(base_spo2 + random.uniform(-0.8, 0.8), 1)
                # Introduce a mild drop for Sarah Jenkins 5 hours ago
                if crew_id == "c4-sarah-jenkins" and (now - t).total_seconds() < 20000 and (now - t).total_seconds() > 14000:
                    spo2_val = 93.4
                
                obs_spo2 = {
                    "id": str(uuid.uuid4()),
                    "subject_id": crew_id,
                    "measurement_type": "spo2",
                    "value_numeric": min(100.0, spo2_val),
                    "value_text": None,
                    "unit": "%",
                    "observed_at": t_iso,
                    "recorded_at": t_iso,
                    "source": "bio_harness_telemetry",
                    "is_simulated": True,
                    "created_by": "telemetry_daemon",
                    "client_operation_id": str(uuid.uuid4()),
                    "note": "Pulse oximetry continuous feed"
                }
                self.observations.append(obs_spo2)

                # Core Temp
                temp_val = round(base_temp + random.uniform(-0.2, 0.2), 1)
                if crew_id == "c2-alex-chen" and (now - t).total_seconds() < 15000 and (now - t).total_seconds() > 9000:
                    temp_val = 37.9

                obs_temp = {
                    "id": str(uuid.uuid4()),
                    "subject_id": crew_id,
                    "measurement_type": "core_temp",
                    "value_numeric": temp_val,
                    "value_text": None,
                    "unit": "°C",
                    "observed_at": t_iso,
                    "recorded_at": t_iso,
                    "source": "thermal_skin_sensor",
                    "is_simulated": True,
                    "created_by": "telemetry_daemon",
                    "client_operation_id": str(uuid.uuid4()),
                    "note": "Continuous deep-tissue sensor"
                }
                self.observations.append(obs_temp)

                # Respiration Rate
                rr_val = round(base_rr + random.uniform(-1.5, 1.5), 1)
                obs_rr = {
                    "id": str(uuid.uuid4()),
                    "subject_id": crew_id,
                    "measurement_type": "respiration_rate",
                    "value_numeric": rr_val,
                    "value_text": None,
                    "unit": "brpm",
                    "observed_at": t_iso,
                    "recorded_at": t_iso,
                    "source": "chest_strain_gauge",
                    "is_simulated": True,
                    "created_by": "telemetry_daemon",
                    "client_operation_id": str(uuid.uuid4()),
                    "note": "Thoracic expansion frequency"
                }
                self.observations.append(obs_rr)

            # Daily metrics: Sleep duration for each of the last 7 days
            for d in range(7, 0, -1):
                sleep_t = (now - timedelta(days=d, hours=2)).isoformat()
                sleep_hours = 7.5 if crew_id != "c1-elena-rostova" else (4.6 if d == 1 else 7.1)
                obs_sleep = {
                    "id": str(uuid.uuid4()),
                    "subject_id": crew_id,
                    "measurement_type": "sleep_duration",
                    "value_numeric": sleep_hours,
                    "value_text": None,
                    "unit": "hrs",
                    "observed_at": sleep_t,
                    "recorded_at": sleep_t,
                    "source": "sleep_station_accelerometer",
                    "is_simulated": True,
                    "created_by": "sleep_tracker",
                    "client_operation_id": str(uuid.uuid4()),
                    "note": "Polysomnography & actigraphy estimation"
                }
                self.observations.append(obs_sleep)

        # 3. Seed initial transparent review flags based on the injected events
        self.review_flags = [
            {
                "id": "flag-001",
                "observation_id": None,
                "subject_id": "c3-marcus-vance",
                "rule_code": "R-101",
                "severity": "MEDIUM",
                "reason": "Review suggested: Heart rate 114 bpm exceeds configured resting threshold (>105 bpm) during EVA pre-breathing protocol. Not a clinical diagnosis.",
                "created_at": (now - timedelta(hours=2, minutes=45)).isoformat(),
                "acknowledged_by": None,
                "acknowledged_at": None,
                "notes": None
            },
            {
                "id": "flag-002",
                "observation_id": None,
                "subject_id": "c4-sarah-jenkins",
                "rule_code": "R-102",
                "severity": "HIGH",
                "reason": "Review suggested: SpO2 dipped to 93.4% (<94% safety margin) during airlock maintenance. Check seal integrity. Not a clinical diagnosis.",
                "created_at": (now - timedelta(hours=4, minutes=10)).isoformat(),
                "acknowledged_by": "Dr. Alex Chen",
                "acknowledged_at": (now - timedelta(hours=3, minutes=15)).isoformat(),
                "notes": "Reviewed with crew member. Sensor repositioned; subsequent SpO2 reads 98.4%. Continued monitoring."
            },
            {
                "id": "flag-003",
                "observation_id": None,
                "subject_id": "c2-alex-chen",
                "rule_code": "R-103",
                "severity": "HIGH",
                "reason": "Review suggested: Core body temperature elevation to 37.9°C (>37.8°C threshold) following resistive countermeasure exercise. Not a clinical diagnosis.",
                "created_at": (now - timedelta(hours=3, minutes=30)).isoformat(),
                "acknowledged_by": None,
                "acknowledged_at": None,
                "notes": None
            },
            {
                "id": "flag-004",
                "observation_id": None,
                "subject_id": "c1-elena-rostova",
                "rule_code": "R-104",
                "severity": "LOW",
                "reason": "Review suggested: Total sleep duration 4.6 hours reflects acute sleep deficit (<5.0h) prior to orbital rendezvous burn. Not a clinical diagnosis.",
                "created_at": (now - timedelta(hours=8)).isoformat(),
                "acknowledged_by": None,
                "acknowledged_at": None,
                "notes": None
            }
        ]

        # 4. Seed initial Audit Events
        self.audit_events = [
            {
                "id": str(uuid.uuid4()),
                "actor_user_id": "system_boot",
                "actor_role": "system",
                "event_type": "system.init",
                "resource_type": "mission_system",
                "resource_id": "ares-iv-telemetry",
                "occurred_at": (now - timedelta(days=7)).isoformat(),
                "request_id": "req-init-001",
                "metadata": {"status": "nominal", "mission_day": 142}
            },
            {
                "id": str(uuid.uuid4()),
                "actor_user_id": "dr_alex_chen",
                "actor_role": "flight_surgeon",
                "event_type": "review_flag.acknowledged",
                "resource_type": "review_flag",
                "resource_id": "flag-002",
                "occurred_at": (now - timedelta(hours=3, minutes=15)).isoformat(),
                "request_id": "req-ack-092",
                "metadata": {"rule_code": "R-102", "crew_id": "c4-sarah-jenkins"}
            },
            {
                "id": str(uuid.uuid4()),
                "actor_user_id": "crew_marcus_vance",
                "actor_role": "astronaut",
                "event_type": "observation.sync_batch",
                "resource_type": "sync_queue",
                "resource_id": "batch-108",
                "occurred_at": (now - timedelta(hours=1, minutes=10)).isoformat(),
                "request_id": "req-sync-108",
                "metadata": {"items_synced": 4, "network": "dsm_link_restored"}
            }
        ]

    def get_subjects(self) -> List[Dict[str, Any]]:
        return list(self.subjects.values())

    def get_subject(self, subject_id: str) -> Optional[Dict[str, Any]]:
        return self.subjects.get(subject_id)

    def get_observations(self, subject_id: Optional[str] = None, measurement_type: Optional[str] = None, limit: int = 300) -> List[Dict[str, Any]]:
        res = self.observations
        if subject_id:
            res = [o for o in res if o["subject_id"] == subject_id]
        if measurement_type:
            res = [o for o in res if o["measurement_type"] == measurement_type]
        # Sort descending by observed_at
        res = sorted(res, key=lambda x: x["observed_at"], reverse=True)
        return res[:limit]

    def add_observation(self, obs_data: Dict[str, Any]) -> Dict[str, Any]:
        obs_id = obs_data.get("id") or str(uuid.uuid4())
        now_iso = datetime.now(timezone.utc).isoformat()
        
        record = {
            "id": obs_id,
            "subject_id": obs_data["subject_id"],
            "measurement_type": obs_data["measurement_type"],
            "value_numeric": float(obs_data["value_numeric"]),
            "value_text": obs_data.get("value_text"),
            "unit": obs_data["unit"],
            "observed_at": obs_data.get("observed_at") or now_iso,
            "recorded_at": now_iso,
            "source": obs_data.get("source", "manual_crew_entry"),
            "is_simulated": True,
            "created_by": obs_data.get("created_by", "crew_member"),
            "client_operation_id": obs_data.get("client_operation_id"),
            "note": obs_data.get("note")
        }

        # Track client idempotency key if present
        if record["client_operation_id"]:
            self.client_operation_ids.add(record["client_operation_id"])

        self.observations.append(record)

        # Record audit event
        self.record_audit_event(
            actor_user_id=record["created_by"] or "crew_member",
            actor_role="contributor",
            event_type="observation.created",
            resource_type="observation",
            resource_id=obs_id,
            metadata={"measurement_type": record["measurement_type"], "value": record["value_numeric"], "unit": record["unit"]}
        )

        return record

    def get_review_flags(self, subject_id: Optional[str] = None) -> List[Dict[str, Any]]:
        flags = self.review_flags
        if subject_id:
            flags = [f for f in flags if f["subject_id"] == subject_id]
        return sorted(flags, key=lambda x: x["created_at"], reverse=True)

    def acknowledge_flag(self, flag_id: str, acknowledged_by: str, notes: Optional[str] = None) -> Optional[Dict[str, Any]]:
        for f in self.review_flags:
            if f["id"] == flag_id:
                now_iso = datetime.now(timezone.utc).isoformat()
                f["acknowledged_by"] = acknowledged_by
                f["acknowledged_at"] = now_iso
                if notes:
                    f["notes"] = notes
                
                self.record_audit_event(
                    actor_user_id=acknowledged_by,
                    actor_role="flight_surgeon",
                    event_type="review_flag.acknowledged",
                    resource_type="review_flag",
                    resource_id=flag_id,
                    metadata={"rule_code": f["rule_code"], "subject_id": f["subject_id"]}
                )
                return f
        return None

    def add_review_flag(self, flag: Dict[str, Any]):
        self.review_flags.append(flag)

    def record_audit_event(self, actor_user_id: str, actor_role: str, event_type: str, resource_type: str, resource_id: Optional[str] = None, metadata: Optional[Dict[str, Any]] = None):
        event = {
            "id": str(uuid.uuid4()),
            "actor_user_id": actor_user_id,
            "actor_role": actor_role,
            "event_type": event_type,
            "resource_type": resource_type,
            "resource_id": resource_id,
            "occurred_at": datetime.now(timezone.utc).isoformat(),
            "request_id": f"req-{uuid.uuid4().hex[:8]}",
            "metadata": metadata or {}
        }
        self.audit_events.insert(0, event)

    def get_audit_events(self, limit: int = 50) -> List[Dict[str, Any]]:
        return self.audit_events[:limit]

# Singleton data store instance
db = DataStore()

