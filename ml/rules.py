"""
AI / ML & Transparent Review Rules Module
Astronaut Health Monitor

DISCLAIMER:
This module contains experimental decision-support rules for demonstrative and educational purposes.
It does NOT provide clinical diagnoses, medical advice, or treatment recommendations.
All generated flags are human-review advisories.
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
            "threshold_high": 105.0,
            "threshold_low": 45.0,
            "unit": "bpm",
            "severity": "MEDIUM",
            "description": "Flags heart rate readings deviating significantly from standard resting baselines."
        },
        {
            "code": "R-102",
            "name": "Hypoxia / Desaturation Warning",
            "metric": "spo2",
            "threshold_low": 94.0,
            "critical_low": 90.0,
            "unit": "%",
            "severity": "HIGH",
            "description": "Flags arterial blood oxygen saturation falling below nominal cabin safety margin."
        },
        {
            "code": "R-103",
            "name": "Core Temperature Hyperthermia / Hypothermia",
            "metric": "core_temp",
            "threshold_high": 37.8,
            "threshold_low": 35.8,
            "unit": "°C",
            "severity": "HIGH",
            "description": "Identifies thermal dysregulation risks during extravehicular activity (EVA) or cabin duty."
        },
        {
            "code": "R-104",
            "name": "Acute Sleep Deprivation",
            "metric": "sleep_duration",
            "threshold_low": 5.0,
            "unit": "hrs",
            "severity": "LOW",
            "description": "Tracks cumulative sleep deficits that may impair cognitive and motor performance."
        },
        {
            "code": "R-105",
            "name": "Telemetry Loss / Stale Observation",
            "metric": "telemetry_freshness",
            "stale_hours": 6.0,
            "unit": "hours",
            "severity": "MEDIUM",
            "description": "Detects gaps in bio-harness transmission indicating sensor disconnection or comms disruption."
        },
        {
            "code": "R-106",
            "name": "Multivariate Biometric Drift (Experimental Z-Score)",
            "metric": "multivariate",
            "z_threshold": 2.6,
            "unit": "sigma",
            "severity": "MEDIUM",
            "description": "Statistical anomaly scoring detecting combined deviations in heart rate and respiration rate."
        }
    ]

    @staticmethod
    def evaluate_observation(obs: Dict[str, Any], recent_history: Optional[List[Dict[str, Any]]] = None) -> Optional[Dict[str, Any]]:
        """
        Evaluate a single incoming observation against documented rules.
        Returns a ReviewFlag dictionary if a rule is triggered, else None.
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
                    "reason": f"Review suggested: Heart rate of {val:.0f} bpm exceeds configured resting threshold (>105 bpm). Not a diagnosis.",
                    "created_at": datetime.now(timezone.utc).isoformat(),
                    "acknowledged_by": None,
                    "acknowledged_at": None
                }
            elif val < 45.0:
                return {
                    "id": str(uuid.uuid4()),
                    "observation_id": obs_id,
                    "subject_id": subject_id,
                    "rule_code": "R-101",
                    "severity": "LOW",
                    "reason": f"Review suggested: Resting heart rate of {val:.0f} bpm is below normal baseline (<45 bpm). Inspect activity log.",
                    "created_at": datetime.now(timezone.utc).isoformat(),
                    "acknowledged_by": None,
                    "acknowledged_at": None
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
                    "reason": f"Urgent review suggested: Oxygen saturation of {val:.1f}% is critically below safety margin (<90%). Verify habitat life support & sensor seal.",
                    "created_at": datetime.now(timezone.utc).isoformat(),
                    "acknowledged_by": None,
                    "acknowledged_at": None
                }
            elif val < 94.0:
                return {
                    "id": str(uuid.uuid4()),
                    "observation_id": obs_id,
                    "subject_id": subject_id,
                    "rule_code": "R-102",
                    "severity": "HIGH",
                    "reason": f"Review suggested: SpO2 of {val:.1f}% is below nominal 94% threshold. Monitor cabin atmospheric partial pressure.",
                    "created_at": datetime.now(timezone.utc).isoformat(),
                    "acknowledged_by": None,
                    "acknowledged_at": None
                }

        # Rule R-103: Core Temperature
        elif metric == "core_temp":
            if val > 37.8:
                return {
                    "id": str(uuid.uuid4()),
                    "observation_id": obs_id,
                    "subject_id": subject_id,
                    "rule_code": "R-103",
                    "severity": "HIGH",
                    "reason": f"Review suggested: Core body temperature of {val:.1f}°C indicates hyperthermic elevation (>37.8°C). Inspect cooling garment telemetry.",
                    "created_at": datetime.now(timezone.utc).isoformat(),
                    "acknowledged_by": None,
                    "acknowledged_at": None
                }
            elif val < 35.8:
                return {
                    "id": str(uuid.uuid4()),
                    "observation_id": obs_id,
                    "subject_id": subject_id,
                    "rule_code": "R-103",
                    "severity": "MEDIUM",
                    "reason": f"Review suggested: Core temperature of {val:.1f}°C is below normal baseline (<35.8°C). Verify ambient temperature exposure.",
                    "created_at": datetime.now(timezone.utc).isoformat(),
                    "acknowledged_by": None,
                    "acknowledged_at": None
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
                    "reason": f"Review suggested: Recorded sleep of {val:.1f} hours indicates acute sleep deficit (<5.0h). Review mission workload schedule.",
                    "created_at": datetime.now(timezone.utc).isoformat(),
                    "acknowledged_by": None,
                    "acknowledged_at": None
                }

        # Rule R-106: Multivariate Anomaly Check (Synthetic Z-Score)
        if recent_history and metric in ("heart_rate", "respiration_rate"):
            matching_vals = [h.get("value_numeric", 0) for h in recent_history if h.get("measurement_type") == metric and h.get("value_numeric") is not None]
            if len(matching_vals) >= 5:
                mean_val = sum(matching_vals) / len(matching_vals)
                variance = sum((x - mean_val) ** 2 for x in matching_vals) / len(matching_vals)
                std_dev = variance ** 0.5
                if std_dev > 0.1:
                    z_score = abs(val - mean_val) / std_dev
                    if z_score > 2.8:
                        return {
                            "id": str(uuid.uuid4()),
                            "observation_id": obs_id,
                            "subject_id": subject_id,
                            "rule_code": "R-106",
                            "severity": "MEDIUM",
                            "reason": f"Statistical outlier detected: {metric} ({val}) is {z_score:.1f} standard deviations from recent personal mean ({mean_val:.1f}). Inspect recent mission activities.",
                            "created_at": datetime.now(timezone.utc).isoformat(),
                            "acknowledged_by": None,
                            "acknowledged_at": None
                        }

        return None

