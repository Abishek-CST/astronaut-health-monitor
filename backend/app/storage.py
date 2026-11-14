"""
In-Memory Storage & Synthetic Data Seed Layer
Adheres to DATABASE.md entities and provides thread-safe access.
Includes full NASA OSDR & Environmental Data App provenance records.
"""

import uuid
from datetime import datetime, timezone, timedelta
from typing import List, Dict, Any, Optional
import random

NASA_RESOURCES_DATA = [
    {
        "id": "nasa-osdr",
        "resource_name": "NASA Open Science Data Repository (OSDR)",
        "resource_url": "https://osdr.nasa.gov/bio/repo/",
        "dataset_id": None,
        "source_type": "nasa",
        "domain": "Spaceflight Multi-Omics & Biology",
        "description": "Primary repository for space biology, model organism, and crew flight research data.",
        "application_usage": "Establishes baseline domains and research context for crew health monitoring."
    },
    {
        "id": "nasa-osdr-viz",
        "resource_name": "NASA OSDR Visualization Portal",
        "resource_url": "https://visualization.osdr.nasa.gov/",
        "dataset_id": None,
        "source_type": "nasa",
        "domain": "Interactive Space Life Science Data",
        "description": "Interactive tools and analytical pipelines for spaceflight physiological metrics.",
        "application_usage": "Informs chart design, multi-metric cross-comparison, and baseline thresholds."
    },
    {
        "id": "nasa-eda",
        "resource_name": "NASA Environmental Data App (EDA)",
        "resource_url": "https://visualization.osdr.nasa.gov/eda/",
        "dataset_id": "EDA-ISS",
        "source_type": "nasa",
        "domain": "ISS Environmental Telemetry & Radiation",
        "description": "Real-time & historical cabin environmental parameters: CO2, humidity, temp, and radiation.",
        "application_usage": "Direct reference for Environmental Conditions and Radiation Exposure domains."
    },
    {
        "id": "nasa-osd-919",
        "resource_name": "NASA OSDR OSD-919",
        "resource_url": "https://osdr.nasa.gov/bio/repo/data/studies/OSD-919",
        "dataset_id": "OSD-919",
        "source_type": "nasa",
        "domain": "Bone & Physical Health in Microgravity",
        "description": "Spaceflight-induced bone density alteration, collagen degradation, and remodeling biomarkers.",
        "application_usage": "Scientific grounding for Bone and Physical Health markers (NTx bone resorption)."
    },
    {
        "id": "nasa-osd-918",
        "resource_name": "NASA OSDR OSD-918",
        "resource_url": "https://osdr.nasa.gov/bio/repo/data/studies/OSD-918",
        "dataset_id": "OSD-918",
        "source_type": "nasa",
        "domain": "Blood, Immune & Physiological Status",
        "description": "Hematologic shifts, immune dysregulation, and cytokine expression under mission stress.",
        "application_usage": "Scientific context for the Immune and Physiological Indicator domain."
    }
]

class DataStore:
    def __init__(self):
        self.subjects: Dict[str, Dict[str, Any]] = {}
        self.observations: List[Dict[str, Any]] = []
        self.review_flags: List[Dict[str, Any]] = []
        self.audit_events: List[Dict[str, Any]] = []
        self.nasa_resources: List[Dict[str, Any]] = NASA_RESOURCES_DATA
        self.client_operation_ids: set = set()
        self._seed_initial_data()

    def _seed_initial_data(self):
        now = datetime.now(timezone.utc)

        # 1. Seed Subjects
        crew_definitions = [
            {
                "id": "c1-elena-rostova",
                "display_label": "Commander Elena Rostova",
                "role": "Mission Commander (Expedition-74)",
                "mission_phase": "Deep Space Gateway Transit (Sol 142)",
                "avatar_initials": "ER",
                "is_simulated": True,
                "created_at": (now - timedelta(days=150)).isoformat()
            },
            {
                "id": "c2-alex-chen",
                "display_label": "Dr. Alex Chen",
                "role": "Crew Medical Officer / Flight Surgeon",
                "mission_phase": "Deep Space Gateway Transit (Sol 142)",
                "avatar_initials": "AC",
                "is_simulated": True,
                "created_at": (now - timedelta(days=150)).isoformat()
            },
            {
                "id": "c3-marcus-vance",
                "display_label": "Marcus Vance",
                "role": "Chief Systems & Robotics Engineer",
                "mission_phase": "Deep Space Gateway Transit (Sol 142)",
                "avatar_initials": "MV",
                "is_simulated": True,
                "created_at": (now - timedelta(days=150)).isoformat()
            },
            {
                "id": "c4-sarah-jenkins",
                "display_label": "Sarah Jenkins",
                "role": "Payload & Astrobiology Specialist",
                "mission_phase": "Deep Space Gateway Transit (Sol 142)",
                "avatar_initials": "SJ",
                "is_simulated": True,
                "created_at": (now - timedelta(days=150)).isoformat()
            }
        ]

        for crew in crew_definitions:
            self.subjects[crew["id"]] = crew

        # 2. Seed synthetic historical observations across last 7 days
        for crew_id in self.subjects.keys():
            time_points = []
            for h in range(24, 0, -1):
                time_points.append(now - timedelta(hours=h))
            for d in range(2, 7):
                for h_step in [0, 6, 12, 18]:
                    time_points.append(now - timedelta(days=d, hours=h_step))
            time_points.sort()

            base_hr = 66.0 if crew_id != "c3-marcus-vance" else 76.0
            base_spo2 = 98.4

            for t in time_points:
                t_iso = t.isoformat()
                
                # Heart Rate (Cardiovascular)
                hr_val = round(base_hr + random.uniform(-3.0, 3.0), 1)
                if crew_id == "c3-marcus-vance" and (now - t).total_seconds() < 12000 and (now - t).total_seconds() > 7200:
                    hr_val = 112.5
                
                self.observations.append({
                    "id": str(uuid.uuid4()),
                    "subject_id": crew_id,
                    "measurement_type": "heart_rate",
                    "domain": "cardiovascular",
                    "value_numeric": hr_val,
                    "value_text": None,
                    "unit": "bpm",
                    "observed_at": t_iso,
                    "recorded_at": t_iso,
                    "source_type": "synthetic_demo",
                    "source_name": "Bio-Harness Telemetry Simulator",
                    "dataset_id": None,
                    "is_simulated": True,
                    "created_by": "telemetry_agent",
                    "client_operation_id": str(uuid.uuid4()),
                    "note": "Continuous biotelemetry stream"
                })

                # SpO2 (Cardiovascular)
                spo2_val = round(base_spo2 + random.uniform(-0.6, 0.6), 1)
                if crew_id == "c4-sarah-jenkins" and (now - t).total_seconds() < 20000 and (now - t).total_seconds() > 14000:
                    spo2_val = 93.2
                
                self.observations.append({
                    "id": str(uuid.uuid4()),
                    "subject_id": crew_id,
                    "measurement_type": "spo2",
                    "domain": "cardiovascular",
                    "value_numeric": min(100.0, spo2_val),
                    "value_text": None,
                    "unit": "%",
                    "observed_at": t_iso,
                    "recorded_at": t_iso,
                    "source_type": "synthetic_demo",
                    "source_name": "Pulse Oximeter Telemetry",
                    "dataset_id": None,
                    "is_simulated": True,
                    "created_by": "telemetry_agent",
                    "client_operation_id": str(uuid.uuid4()),
                    "note": "Pulse oximetry continuous stream"
                })

                # Bone Resorption Marker (Bone and Physical - NASA OSD-919 Grounded)
                ntx_val = 48.0 + random.uniform(-3.0, 3.0)
                if crew_id == "c1-elena-rostova" and (now - t).total_seconds() < 24000:
                    ntx_val = 72.4
                self.observations.append({
                    "id": str(uuid.uuid4()),
                    "subject_id": crew_id,
                    "measurement_type": "bone_resorption_marker",
                    "domain": "bone_physical",
                    "value_numeric": round(ntx_val, 1),
                    "value_text": None,
                    "unit": "nmol BCE",
                    "observed_at": t_iso,
                    "recorded_at": t_iso,
                    "source_type": "nasa",
                    "source_name": "NASA OSDR OSD-919 Research Model",
                    "dataset_id": "OSD-919",
                    "is_simulated": True,
                    "created_by": "osdr_biomarker_engine",
                    "client_operation_id": str(uuid.uuid4()),
                    "note": "Spaceflight bone deconditioning marker"
                })

                # Radiation Flux (Radiation - NASA EDA Grounded)
                self.observations.append({
                    "id": str(uuid.uuid4()),
                    "subject_id": crew_id,
                    "measurement_type": "cabin_radiation_flux",
                    "domain": "radiation",
                    "value_numeric": round(21.4 + random.uniform(-1.5, 1.5), 1),
                    "value_text": None,
                    "unit": "μSv/h",
                    "observed_at": t_iso,
                    "recorded_at": t_iso,
                    "source_type": "nasa",
                    "source_name": "NASA Environmental Data App (EDA)",
                    "dataset_id": "EDA-ISS",
                    "is_simulated": True,
                    "created_by": "eda_telemetry_relay",
                    "client_operation_id": str(uuid.uuid4()),
                    "note": "Active dosimeter flux"
                })

                # Cabin CO2 (Environmental - NASA EDA Grounded)
                co2_val = 2650.0 + random.uniform(-100.0, 100.0)
                if (now - t).total_seconds() < 14400:
                    co2_val = 3680.0
                self.observations.append({
                    "id": str(uuid.uuid4()),
                    "subject_id": crew_id,
                    "measurement_type": "cabin_co2_ppm",
                    "domain": "environmental",
                    "value_numeric": round(co2_val, 1),
                    "value_text": None,
                    "unit": "ppm",
                    "observed_at": t_iso,
                    "recorded_at": t_iso,
                    "source_type": "nasa",
                    "source_name": "NASA Environmental Data App (EDA)",
                    "dataset_id": "EDA-ISS",
                    "is_simulated": True,
                    "created_by": "eda_telemetry_relay",
                    "client_operation_id": str(uuid.uuid4()),
                    "note": "Cabin atmospheric sensor"
                })

            # Daily Sleep duration for the last 7 days (Behavioral Health)
            for d in range(7, 0, -1):
                sleep_t = (now - timedelta(days=d, hours=2)).isoformat()
                sleep_hours = 7.5 if crew_id != "c1-elena-rostova" else (4.4 if d == 1 else 7.2)
                self.observations.append({
                    "id": str(uuid.uuid4()),
                    "subject_id": crew_id,
                    "measurement_type": "sleep_duration",
                    "domain": "behavioral",
                    "value_numeric": sleep_hours,
                    "value_text": None,
                    "unit": "hrs",
                    "observed_at": sleep_t,
                    "recorded_at": sleep_t,
                    "source_type": "synthetic_demo",
                    "source_name": "Sleep Quarters Actigraph",
                    "dataset_id": None,
                    "is_simulated": True,
                    "created_by": "sleep_daemon",
                    "client_operation_id": str(uuid.uuid4()),
                    "note": "Actigraphy rest period analysis"
                })

        # 3. Seed Explainable Review Flags
        self.review_flags = [
            {
                "id": "flag-001",
                "observation_id": None,
                "subject_id": "c3-marcus-vance",
                "rule_code": "R-101",
                "severity": "MEDIUM",
                "domain": "cardiovascular",
                "what_changed": "Resting heart rate reached 112.5 bpm (sustained above 105 bpm threshold).",
                "baseline_reference": "Personal 30-day resting baseline: 64.2 ± 4.1 bpm.",
                "period_considered": "2.5 hours during pre-EVA airlock preparation.",
                "flag_reason": "Elevated cardiovascular workload detected outside active countermeasure exercise intervals.",
                "action_to_review": "Flight Surgeon review requested: verify hydration status and inspect bio-harness electrode contact.",
                "reason": "Review suggested: Heart rate 112.5 bpm exceeds configured resting threshold (>105 bpm). Non-clinical decision support only.",
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
                "domain": "cardiovascular",
                "what_changed": "SpO2 desaturation down to 93.2% (<94.0% cabin minimum threshold).",
                "baseline_reference": "Mission baseline average: 98.2 ± 0.6%.",
                "period_considered": "45-minute window during botanical glovebox maintenance.",
                "flag_reason": "Peripheral oxygen saturation declined below safe threshold; potential local ventilation stagnation.",
                "action_to_review": "Crew member repositioned pulse oximeter and confirmed cabin air circulation fan nominal.",
                "reason": "Review suggested: SpO2 dipped to 93.2% during science airlock cycle. Sensor recalibrated; nominal values restored.",
                "created_at": (now - timedelta(hours=4, minutes=10)).isoformat(),
                "acknowledged_by": "Dr. Alex Chen",
                "acknowledged_at": (now - timedelta(hours=3, minutes=15)).isoformat(),
                "notes": "Follow-up confirmed sensor slippage during glove manipulation. Re-test SpO2: 98.4%. No clinical pathology."
            },
            {
                "id": "flag-003",
                "observation_id": None,
                "subject_id": "c1-elena-rostova",
                "rule_code": "R-106",
                "severity": "MEDIUM",
                "domain": "bone_physical",
                "what_changed": "Bone resorption biomarker (NTx) reached 72.4 nmol BCE (threshold 68.0).",
                "baseline_reference": "NASA OSDR OSD-919 reference cohort: 46.0 ± 8.2 nmol BCE.",
                "period_considered": "72-hour rolling urine turnover assay.",
                "flag_reason": "Accelerated collagen matrix degradation consistent with spaceflight microgravity deconditioning.",
                "action_to_review": "Evaluate ARED (Advanced Resistive Exercise Device) adherence and dietary Vitamin D / calcium intake.",
                "reason": "Review suggested: Bone resorption marker surge. Informed by NASA OSDR OSD-919 microgravity research.",
                "created_at": (now - timedelta(hours=6)).isoformat(),
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
                "domain": "behavioral",
                "what_changed": "Sleep duration recorded at 4.4 hours (<5.0h operational cognitive safety threshold).",
                "baseline_reference": "Personal mission average: 7.4 ± 0.8 hours.",
                "period_considered": "Sleep block prior to Sol 142 orbital correction burn.",
                "flag_reason": "Acute sleep deficit detected; correlates with high operational tempo during rendezvous maneuvers.",
                "action_to_review": "Schedule compensatory rest cycle; verify sleep cabin acoustic and lighting baffles.",
                "reason": "Review suggested: Acute sleep deprivation prior to high-criticality flight burn. Rest period recommended.",
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
                "resource_id": "gateway-core",
                "occurred_at": (now - timedelta(days=7)).isoformat(),
                "request_id": "req-init-001",
                "metadata": {
                    "mission": "NASA Space Apps 2026 - Astronaut Health Guardian",
                    "status": "nominal",
                    "nasa_resources_loaded": 5
                }
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
                "metadata": {"items_synced": 6, "provenance": "NASA OSDR & Synthetic Hybrid"}
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
        res = sorted(res, key=lambda x: x["observed_at"], reverse=True)
        return res[:limit]

    def add_observation(self, obs_data: Dict[str, Any]) -> Dict[str, Any]:
        obs_id = obs_data.get("id") or str(uuid.uuid4())
        now_iso = datetime.now(timezone.utc).isoformat()
        
        record = {
            "id": obs_id,
            "subject_id": obs_data["subject_id"],
            "measurement_type": obs_data["measurement_type"],
            "domain": obs_data.get("domain", "cardiovascular"),
            "value_numeric": float(obs_data["value_numeric"]),
            "value_text": obs_data.get("value_text"),
            "unit": obs_data["unit"],
            "observed_at": obs_data.get("observed_at") or now_iso,
            "recorded_at": now_iso,
            "source_type": obs_data.get("source_type", "synthetic_demo"),
            "source_name": obs_data.get("source_name", "Bio-Harness Telemetry Simulator"),
            "dataset_id": obs_data.get("dataset_id"),
            "is_simulated": True,
            "created_by": obs_data.get("created_by", "crew_member"),
            "client_operation_id": obs_data.get("client_operation_id"),
            "note": obs_data.get("note")
        }

        if record["client_operation_id"]:
            self.client_operation_ids.add(record["client_operation_id"])

        self.observations.append(record)

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

    def get_nasa_resources(self) -> List[Dict[str, Any]]:
        return self.nasa_resources

db = DataStore()
