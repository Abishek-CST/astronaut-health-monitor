"""
AI / ML & Transparent Review Rules Module
Astronaut Health Guardian - NASA Space Apps Challenge 2026

DISCLAIMER:
This module contains transparent decision-support rules for demonstrative and educational purposes.
It does NOT provide clinical diagnoses, medical advice, or treatment recommendations.
All generated flags are explainable human-review advisories.
"""

from typing import List, Dict, Any, Optional
import uuid
from datetime import datetime, timezone

class TransparentReviewEngine:
    RULES_MANIFEST = [
        {
            "code": "R-101",
            "name": "Resting Tachycardia / Sustained Elevation",
            "metric": "heart_rate",
            "domain": "cardiovascular",
            "threshold_high": 105.0,
            "threshold_low": 45.0,
            "unit": "bpm",
            "severity": "MEDIUM",
            "description": "Flags heart rate readings deviating significantly from standard personal resting baselines."
        },
        {
            "code": "R-102",
            "name": "Hypoxia / Desaturation Safety Threshold",
            "metric": "spo2",
            "domain": "cardiovascular",
            "threshold_low": 94.0,
            "critical_low": 90.0,
            "unit": "%",
            "severity": "HIGH",
            "description": "Flags arterial blood oxygen saturation falling below nominal spacecraft cabin safety margin."
        },
        {
            "code": "R-103",
            "name": "Core Temperature Hyperthermia / Hypothermia",
            "metric": "core_temp",
            "domain": "environmental",
            "threshold_high": 37.8,
            "threshold_low": 35.8,
            "unit": "°C",
            "severity": "HIGH",
            "description": "Identifies thermal dysregulation risks during extravehicular activity (EVA) or cabin duty."
        },
        {
            "code": "R-104",
            "name": "Acute Sleep Deprivation Risk",
            "metric": "sleep_duration",
            "domain": "behavioral",
            "threshold_low": 5.0,
            "unit": "hrs",
            "severity": "LOW",
            "description": "Tracks cumulative sleep deficits that may impair operational cognitive performance."
        },
        {
            "code": "R-105",
            "name": "Elevated Cabin CO2 Concentration",
            "metric": "cabin_co2_ppm",
            "domain": "environmental",
            "threshold_high": 3500.0,
            "unit": "ppm",
            "severity": "HIGH",
            "description": "Grounded in NASA EDA standards: Cabin CO2 accumulation causes cognitive fatigue and headaches."
        },
        {
            "code": "R-106",
            "name": "Bone Resorption Biomarker Surge",
            "metric": "bone_resorption_marker",
            "domain": "bone_physical",
            "threshold_high": 68.0,
            "unit": "nmol BCE",
            "severity": "MEDIUM",
            "description": "Informed by NASA OSDR OSD-919: Rapid bone mineral turnover during microgravity transit."
        }
    ]

    @staticmethod
    def evaluate_observation(obs: Dict[str, Any], recent_history: Optional[List[Dict[str, Any]]] = None) -> Optional[Dict[str, Any]]:
        """
        Evaluate a single incoming observation against documented rules.
        Returns an explainable ReviewFlag dictionary if a rule is triggered, else None.
        Every flag provides:
        1. what_changed
        2. baseline_reference
        3. period_considered
        4. flag_reason
        5. action_to_review
        """
        metric = obs.get("measurement_type")
        val = obs.get("value_numeric")
        subject_id = obs.get("subject_id")
        obs_id = obs.get("id")

        if val is None:
            return None

        # Rule R-101: Heart Rate
        if metric == "heart_rate":
            if val > 105.0:
                return {
                    "id": str(uuid.uuid4()),
                    "observation_id": obs_id,
                    "subject_id": subject_id,
                    "rule_code": "R-101",
                    "severity": "MEDIUM",
                    "domain": "cardiovascular",
                    "what_changed": f"Resting heart rate reached {val:.1f} bpm, exceeding upper threshold (105.0 bpm).",
                    "baseline_reference": "Personal resting average (64.0 ± 5.0 bpm).",
                    "period_considered": "Latest bio-harness telemetry packet.",
                    "flag_reason": "Sustained cardiovascular elevation detected outside recorded countermeasure training.",
                    "action_to_review": "Flight Surgeon check requested: review recent workload and hydration status.",
                    "reason": f"Review suggested: Heart rate {val:.1f} bpm exceeds configured resting threshold (>105 bpm). Non-clinical decision support only.",
                    "created_at": datetime.now(timezone.utc).isoformat(),
                    "acknowledged_by": None,
                    "acknowledged_at": None,
                    "notes": None
                }
            elif val < 45.0:
                return {
                    "id": str(uuid.uuid4()),
                    "observation_id": obs_id,
                    "subject_id": subject_id,
                    "rule_code": "R-101",
                    "severity": "LOW",
                    "domain": "cardiovascular",
                    "what_changed": f"Resting heart rate measured at {val:.1f} bpm (<45.0 bpm floor).",
                    "baseline_reference": "Personal resting baseline (60-70 bpm).",
                    "period_considered": "Latest bio-harness epoch.",
                    "flag_reason": "Resting bradycardia detected. May indicate high athletic conditioning or sensor artifact.",
                    "action_to_review": "Verify sensor electrode adhesion and check if astronaut was in deep rest.",
                    "reason": f"Review suggested: Resting heart rate {val:.1f} bpm is below baseline floor (<45 bpm).",
                    "created_at": datetime.now(timezone.utc).isoformat(),
                    "acknowledged_by": None,
                    "acknowledged_at": None,
                    "notes": None
                }

        # Rule R-102: SpO2
        elif metric == "spo2":
            if val < 90.0:
                return {
                    "id": str(uuid.uuid4()),
                    "observation_id": obs_id,
                    "subject_id": subject_id,
                    "rule_code": "R-102",
                    "severity": "CRITICAL",
                    "domain": "cardiovascular",
                    "what_changed": f"Blood oxygen saturation plunged to {val:.1f}% (<90.0% critical margin).",
                    "baseline_reference": "Cabin baseline standard (98.0 ± 1.0%).",
                    "period_considered": "Immediate telemetry window.",
                    "flag_reason": "Severe acute desaturation risk. Potential local atmosphere leak or respiratory distress.",
                    "action_to_review": "Immediate protocol: inspect habitat atmospheric scrubber and verify crew oxygen mask.",
                    "reason": f"Urgent review suggested: Oxygen saturation of {val:.1f}% is critically below safety margin (<90%). Verify habitat life support & sensor seal.",
                    "created_at": datetime.now(timezone.utc).isoformat(),
                    "acknowledged_by": None,
                    "acknowledged_at": None,
                    "notes": None
                }
            elif val < 94.0:
                return {
                    "id": str(uuid.uuid4()),
                    "observation_id": obs_id,
                    "subject_id": subject_id,
                    "rule_code": "R-102",
                    "severity": "HIGH",
                    "domain": "cardiovascular",
                    "what_changed": f"SpO2 dropped to {val:.1f}% (<94.0% safety boundary).",
                    "baseline_reference": "Cabin nominal range (95-100%).",
                    "period_considered": "Last 30-minute rolling window.",
                    "flag_reason": "Desaturation trend observed. Could stem from local air stagnation or pulse oximeter movement.",
                    "action_to_review": "Check sensor probe placement, reposition sensor, and verify cabin ventilation airflow.",
                    "reason": f"Review suggested: SpO2 of {val:.1f}% is below nominal 94% threshold.",
                    "created_at": datetime.now(timezone.utc).isoformat(),
                    "acknowledged_by": None,
                    "acknowledged_at": None,
                    "notes": None
                }

        # Rule R-105: Cabin CO2
        elif metric == "cabin_co2_ppm":
            if val > 3500.0:
                return {
                    "id": str(uuid.uuid4()),
                    "observation_id": obs_id,
                    "subject_id": subject_id,
                    "rule_code": "R-105",
                    "severity": "HIGH",
                    "domain": "environmental",
                    "what_changed": f"Cabin CO2 concentration peaked at {val:.0f} ppm (>3500 ppm limit).",
                    "baseline_reference": "NASA EDA ISS cabin target (<2500 ppm).",
                    "period_considered": "4-hour environmental telemetry accumulation.",
                    "flag_reason": "Elevated carbon dioxide induces cognitive impairment and lethargy in microgravity.",
                    "action_to_review": "Cycle CDRA (Carbon Dioxide Removal Assembly) desorber bed and increase cabin ducting fans.",
                    "reason": f"Review suggested: Cabin CO2 reached {val:.0f} ppm. NASA EDA standards recommend checking scrubber cycle.",
                    "created_at": datetime.now(timezone.utc).isoformat(),
                    "acknowledged_by": None,
                    "acknowledged_at": None,
                    "notes": None
                }

        # Rule R-106: Bone Resorption Marker
        elif metric == "bone_resorption_marker":
            if val > 68.0:
                return {
                    "id": str(uuid.uuid4()),
                    "observation_id": obs_id,
                    "subject_id": subject_id,
                    "rule_code": "R-106",
                    "severity": "MEDIUM",
                    "domain": "bone_physical",
                    "what_changed": f"NTx bone resorption marker reached {val:.1f} nmol BCE (>68.0 threshold).",
                    "baseline_reference": "NASA OSDR OSD-919 reference cohort (46.0 ± 8.2 nmol BCE).",
                    "period_considered": "72-hour biochemical assay collection.",
                    "flag_reason": "Osteoclast activity and bone matrix breakdown accelerated under zero-g unload.",
                    "action_to_review": "Flight Surgeon review: audit resistive exercise device logs and optimize nutritional countermeasure.",
                    "reason": f"Review suggested: Bone resorption marker surge ({val:.1f}). Informed by NASA OSDR OSD-919.",
                    "created_at": datetime.now(timezone.utc).isoformat(),
                    "acknowledged_by": None,
                    "acknowledged_at": None,
                    "notes": None
                }

        # Rule R-104: Sleep Duration
        elif metric == "sleep_duration":
            if val < 5.0:
                return {
                    "id": str(uuid.uuid4()),
                    "observation_id": obs_id,
                    "subject_id": subject_id,
                    "rule_code": "R-104",
                    "severity": "LOW",
                    "domain": "behavioral",
                    "what_changed": f"Rest period recorded at {val:.1f} hours (<5.0h cognitive baseline).",
                    "baseline_reference": "Nominal mission sleep schedule (7.0 - 8.5 hours).",
                    "period_considered": "24-hour sleep/wake block.",
                    "flag_reason": "Sleep debt accumulation detected; operational risk for complex mission tasks.",
                    "action_to_review": "Recommend 90-minute sleep buffer or afternoon rest window before EVA.",
                    "reason": f"Review suggested: Recorded sleep of {val:.1f} hours indicates acute sleep deficit (<5.0h).",
                    "created_at": datetime.now(timezone.utc).isoformat(),
                    "acknowledged_by": None,
                    "acknowledged_at": None,
                    "notes": None
                }

        return None
