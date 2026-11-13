import { Subject, Observation, ReviewFlag, AuditEvent, RuleDefinition } from '../types';

export const SEED_SUBJECTS: Subject[] = [
  {
    id: "c1-elena-rostova",
    display_label: "Commander Elena Rostova",
    role: "Mission Commander",
    mission_phase: "Ares-IV Transit (Sol 142)",
    avatar_initials: "ER",
    is_simulated: true,
    created_at: new Date(Date.now() - 150 * 86400000).toISOString()
  },
  {
    id: "c2-alex-chen",
    display_label: "Dr. Alex Chen",
    role: "Flight Surgeon / Medical Officer",
    mission_phase: "Ares-IV Transit (Sol 142)",
    avatar_initials: "AC",
    is_simulated: true,
    created_at: new Date(Date.now() - 150 * 86400000).toISOString()
  },
  {
    id: "c3-marcus-vance",
    display_label: "Marcus Vance",
    role: "Chief Flight Engineer",
    mission_phase: "Ares-IV Transit (Sol 142)",
    avatar_initials: "MV",
    is_simulated: true,
    created_at: new Date(Date.now() - 150 * 86400000).toISOString()
  },
  {
    id: "c4-sarah-jenkins",
    display_label: "Sarah Jenkins",
    role: "Payload & Astrobiology Specialist",
    mission_phase: "Ares-IV Transit (Sol 142)",
    avatar_initials: "SJ",
    is_simulated: true,
    created_at: new Date(Date.now() - 150 * 86400000).toISOString()
  }
];

export const SEED_RULES: RuleDefinition[] = [
  {
    code: "R-101",
    name: "Resting Tachycardia / Sustained Elevation",
    metric: "heart_rate",
    threshold_high: 105.0,
    threshold_low: 45.0,
    unit: "bpm",
    severity: "MEDIUM",
    description: "Flags heart rate readings deviating significantly from standard resting baselines."
  },
  {
    code: "R-102",
    name: "Hypoxia / Desaturation Warning",
    metric: "spo2",
    threshold_low: 94.0,
    critical_low: 90.0,
    unit: "%",
    severity: "HIGH",
    description: "Flags arterial blood oxygen saturation falling below nominal cabin safety margin."
  },
  {
    code: "R-103",
    name: "Core Temperature Hyperthermia / Hypothermia",
    metric: "core_temp",
    threshold_high: 37.8,
    threshold_low: 35.8,
    unit: "°C",
    severity: "HIGH",
    description: "Identifies thermal dysregulation risks during extravehicular activity (EVA) or cabin duty."
  },
  {
    code: "R-104",
    name: "Acute Sleep Deprivation",
    metric: "sleep_duration",
    threshold_low: 5.0,
    unit: "hrs",
    severity: "LOW",
    description: "Tracks cumulative sleep deficits that may impair cognitive and motor performance."
  },
  {
    code: "R-105",
    name: "Telemetry Loss / Stale Observation",
    metric: "telemetry_freshness",
    unit: "hours",
    severity: "MEDIUM",
    description: "Detects gaps in bio-harness transmission indicating sensor disconnection or comms disruption."
  },
  {
    code: "R-106",
    name: "Multivariate Biometric Drift (Experimental Z-Score)",
    metric: "multivariate",
    unit: "sigma",
    severity: "MEDIUM",
    description: "Statistical anomaly scoring detecting combined deviations in heart rate and respiration rate."
  }
];

export const generateSeedObservations = (): Observation[] => {
  const obs: Observation[] = [];
  const now = Date.now();

  for (const sub of SEED_SUBJECTS) {
    const baseHr = sub.id === "c3-marcus-vance" ? 74.0 : 68.0;

    // 24 hours of hourly records
    for (let h = 24; h >= 0; h--) {
      const timeIso = new Date(now - h * 3600000).toISOString();
      
      // Heart Rate
      let hrVal = Math.round((baseHr + (Math.sin(h) * 4)) * 10) / 10;
      if (sub.id === "c3-marcus-vance" && h >= 2 && h <= 3) {
        hrVal = 114.0;
      }
      obs.push({
        id: `seed-hr-${sub.id}-${h}`,
        subject_id: sub.id,
        measurement_type: "heart_rate",
        value_numeric: hrVal,
        unit: "bpm",
        observed_at: timeIso,
        recorded_at: timeIso,
        source: "bio_harness_telemetry",
        is_simulated: true,
        created_by: "telemetry_daemon"
      });

      // SpO2
      let spo2Val = 98.4;
      if (sub.id === "c4-sarah-jenkins" && h >= 4 && h <= 5) {
        spo2Val = 93.4;
      }
      obs.push({
        id: `seed-spo2-${sub.id}-${h}`,
        subject_id: sub.id,
        measurement_type: "spo2",
        value_numeric: spo2Val,
        unit: "%",
        observed_at: timeIso,
        recorded_at: timeIso,
        source: "bio_harness_telemetry",
        is_simulated: true,
        created_by: "telemetry_daemon"
      });

      // Core Temp
      let tempVal = 36.7;
      if (sub.id === "c2-alex-chen" && h >= 3 && h <= 4) {
        tempVal = 37.9;
      }
      obs.push({
        id: `seed-temp-${sub.id}-${h}`,
        subject_id: sub.id,
        measurement_type: "core_temp",
        value_numeric: tempVal,
        unit: "°C",
        observed_at: timeIso,
        recorded_at: timeIso,
        source: "thermal_skin_sensor",
        is_simulated: true,
        created_by: "telemetry_daemon"
      });

      // Respiration Rate
      obs.push({
        id: `seed-rr-${sub.id}-${h}`,
        subject_id: sub.id,
        measurement_type: "respiration_rate",
        value_numeric: Math.round((14.0 + (Math.cos(h) * 1.5)) * 10) / 10,
        unit: "brpm",
        observed_at: timeIso,
        recorded_at: timeIso,
        source: "chest_strain_gauge",
        is_simulated: true,
        created_by: "telemetry_daemon"
      });
    }

    // Daily sleep
    for (let d = 7; d >= 1; d--) {
      const timeIso = new Date(now - d * 86400000).toISOString();
      const sleepVal = sub.id === "c1-elena-rostova" && d === 1 ? 4.6 : 7.4;
      obs.push({
        id: `seed-sleep-${sub.id}-${d}`,
        subject_id: sub.id,
        measurement_type: "sleep_duration",
        value_numeric: sleepVal,
        unit: "hrs",
        observed_at: timeIso,
        recorded_at: timeIso,
        source: "sleep_station_accelerometer",
        is_simulated: true,
        created_by: "sleep_tracker"
      });
    }
  }

  return obs;
};

export const SEED_FLAGS: ReviewFlag[] = [
  {
    id: "flag-001",
    observation_id: null,
    subject_id: "c3-marcus-vance",
    rule_code: "R-101",
    severity: "MEDIUM",
    reason: "Review suggested: Heart rate 114 bpm exceeds configured resting threshold (>105 bpm) during EVA pre-breathing protocol. Not a clinical diagnosis.",
    created_at: new Date(Date.now() - 2.5 * 3600000).toISOString(),
    acknowledged_by: null,
    acknowledged_at: null,
    notes: null
  },
  {
    id: "flag-002",
    observation_id: null,
    subject_id: "c4-sarah-jenkins",
    rule_code: "R-102",
    severity: "HIGH",
    reason: "Review suggested: SpO2 dipped to 93.4% (<94% safety margin) during airlock maintenance. Check seal integrity. Not a clinical diagnosis.",
    created_at: new Date(Date.now() - 4 * 3600000).toISOString(),
    acknowledged_by: "Dr. Alex Chen",
    acknowledged_at: new Date(Date.now() - 3 * 3600000).toISOString(),
    notes: "Reviewed with crew member. Sensor repositioned; subsequent SpO2 reads 98.4%. Continued monitoring."
  },
  {
    id: "flag-003",
    observation_id: null,
    subject_id: "c2-alex-chen",
    rule_code: "R-103",
    severity: "HIGH",
    reason: "Review suggested: Core body temperature elevation to 37.9°C (>37.8°C threshold) following resistive countermeasure exercise. Not a clinical diagnosis.",
    created_at: new Date(Date.now() - 3.5 * 3600000).toISOString(),
    acknowledged_by: null,
    acknowledged_at: null,
    notes: null
  },
  {
    id: "flag-004",
    observation_id: null,
    subject_id: "c1-elena-rostova",
    rule_code: "R-104",
    severity: "LOW",
    reason: "Review suggested: Total sleep duration 4.6 hours reflects acute sleep deficit (<5.0h) prior to orbital rendezvous burn. Not a clinical diagnosis.",
    created_at: new Date(Date.now() - 8 * 3600000).toISOString(),
    acknowledged_by: null,
    acknowledged_at: null,
    notes: null
  }
];

export const SEED_AUDITS: AuditEvent[] = [
  {
    id: "audit-001",
    actor_user_id: "system_boot",
    actor_role: "system",
    event_type: "system.init",
    resource_type: "mission_system",
    resource_id: "ares-iv-telemetry",
    occurred_at: new Date(Date.now() - 7 * 86400000).toISOString(),
    request_id: "req-init-001",
    metadata: { status: "nominal", mission_day: 142 }
  },
  {
    id: "audit-002",
    actor_user_id: "dr_alex_chen",
    actor_role: "flight_surgeon",
    event_type: "review_flag.acknowledged",
    resource_type: "review_flag",
    resource_id: "flag-002",
    occurred_at: new Date(Date.now() - 3 * 3600000).toISOString(),
    request_id: "req-ack-092",
    metadata: { rule_code: "R-102", crew_id: "c4-sarah-jenkins" }
  },
  {
    id: "audit-003",
    actor_user_id: "crew_marcus_vance",
    actor_role: "astronaut",
    event_type: "observation.sync_batch",
    resource_type: "sync_queue",
    resource_id: "batch-108",
    occurred_at: new Date(Date.now() - 1.2 * 3600000).toISOString(),
    request_id: "req-sync-108",
    metadata: { items_synced: 4, network: "dsm_link_restored" }
  }
];

