import { Subject, Observation, ReviewFlag, AuditEvent, RuleDefinition, NasaResource } from '../types';

export const NASA_RESOURCES: NasaResource[] = [
  {
    id: "nasa-osdr",
    resource_name: "NASA Open Science Data Repository (OSDR)",
    resource_url: "https://osdr.nasa.gov/bio/repo/",
    dataset_id: null,
    source_type: "nasa",
    domain: "Spaceflight Multi-Omics & Biology",
    description: "Primary repository for space biology, model organism, and crew flight research data.",
    application_usage: "Establishes baseline domains and research context for crew health monitoring."
  },
  {
    id: "nasa-osdr-viz",
    resource_name: "NASA OSDR Visualization Portal",
    resource_url: "https://visualization.osdr.nasa.gov/",
    dataset_id: null,
    source_type: "nasa",
    domain: "Interactive Space Life Science Data",
    description: "Interactive tools and analytical pipelines for spaceflight physiological metrics.",
    application_usage: "Informs chart design, multi-metric cross-comparison, and baseline thresholds."
  },
  {
    id: "nasa-eda",
    resource_name: "NASA Environmental Data App (EDA)",
    resource_url: "https://visualization.osdr.nasa.gov/eda/",
    dataset_id: "EDA-ISS",
    source_type: "nasa",
    domain: "ISS Environmental Telemetry & Radiation",
    description: "Real-time & historical cabin environmental parameters: CO2, humidity, temp, and radiation.",
    application_usage: "Direct reference for Environmental Conditions and Radiation Exposure domains."
  },
  {
    id: "nasa-osd-919",
    resource_name: "NASA OSDR OSD-919",
    resource_url: "https://osdr.nasa.gov/bio/repo/data/studies/OSD-919",
    dataset_id: "OSD-919",
    source_type: "nasa",
    domain: "Bone & Physical Health in Microgravity",
    description: "Spaceflight-induced bone density alteration, collagen degradation, and remodeling biomarkers.",
    application_usage: "Scientific grounding for Bone and Physical Health markers (NTx bone resorption)."
  },
  {
    id: "nasa-osd-918",
    resource_name: "NASA OSDR OSD-918",
    resource_url: "https://osdr.nasa.gov/bio/repo/data/studies/OSD-918",
    dataset_id: "OSD-918",
    source_type: "nasa",
    domain: "Blood, Immune & Physiological Status",
    description: "Hematologic shifts, immune dysregulation, and cytokine expression under mission stress.",
    application_usage: "Scientific context for the Immune and Physiological Indicator domain."
  }
];

export const SEED_SUBJECTS: Subject[] = [
  {
    id: "c1-elena-rostova",
    display_label: "Commander Elena Rostova",
    role: "Mission Commander (Expedition-74)",
    mission_phase: "Deep Space Gateway Transit (Sol 142)",
    avatar_initials: "ER",
    is_simulated: true,
    created_at: new Date(Date.now() - 150 * 86400000).toISOString()
  },
  {
    id: "c2-alex-chen",
    display_label: "Dr. Alex Chen",
    role: "Crew Medical Officer / Flight Surgeon",
    mission_phase: "Deep Space Gateway Transit (Sol 142)",
    avatar_initials: "AC",
    is_simulated: true,
    created_at: new Date(Date.now() - 150 * 86400000).toISOString()
  },
  {
    id: "c3-marcus-vance",
    display_label: "Marcus Vance",
    role: "Chief Systems & Robotics Engineer",
    mission_phase: "Deep Space Gateway Transit (Sol 142)",
    avatar_initials: "MV",
    is_simulated: true,
    created_at: new Date(Date.now() - 150 * 86400000).toISOString()
  },
  {
    id: "c4-sarah-jenkins",
    display_label: "Sarah Jenkins",
    role: "Payload & Astrobiology Specialist",
    mission_phase: "Deep Space Gateway Transit (Sol 142)",
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
    domain: "cardiovascular",
    threshold_high: 105.0,
    threshold_low: 45.0,
    unit: "bpm",
    severity: "MEDIUM",
    description: "Flags heart rate readings deviating significantly from standard personal resting baseline."
  },
  {
    code: "R-102",
    name: "Hypoxia / Desaturation Safety Threshold",
    metric: "spo2",
    domain: "cardiovascular",
    threshold_low: 94.0,
    critical_low: 90.0,
    unit: "%",
    severity: "HIGH",
    description: "Flags arterial blood oxygen saturation falling below nominal spacecraft cabin safety margin."
  },
  {
    code: "R-103",
    name: "Core Temperature Hyperthermia / Hypothermia",
    metric: "core_temp",
    domain: "environmental",
    threshold_high: 37.8,
    threshold_low: 35.8,
    unit: "°C",
    severity: "HIGH",
    description: "Identifies thermal dysregulation risks during extravehicular activity (EVA) or high workload."
  },
  {
    code: "R-104",
    name: "Acute Sleep Deprivation Risk",
    metric: "sleep_duration",
    domain: "behavioral",
    threshold_low: 5.0,
    unit: "hrs",
    severity: "LOW",
    description: "Tracks cumulative sleep deficits that may impair operational cognitive resilience."
  },
  {
    code: "R-105",
    name: "Elevated Cabin CO2 Concentration",
    metric: "cabin_co2_ppm",
    domain: "environmental",
    threshold_high: 3500.0,
    unit: "ppm",
    severity: "HIGH",
    description: "Grounded in NASA EDA standards: Cabin CO2 accumulation causes cognitive fatigue and headaches.",
    nasa_context: "NASA Environmental Data App (EDA) cabin atmosphere tracking"
  },
  {
    code: "R-106",
    name: "Bone Resorption Biomarker Surge",
    metric: "bone_resorption_marker",
    domain: "bone_physical",
    threshold_high: 68.0,
    unit: "nmol BCE/mmol Cr",
    severity: "MEDIUM",
    description: "Informed by NASA OSDR OSD-919: Rapid bone mineral turnover during microgravity transit.",
    nasa_context: "NASA OSDR OSD-919 bone loss & remodeling research"
  }
];

export const generateSeedObservations = (): Observation[] => {
  const obs: Observation[] = [];
  const now = Date.now();

  for (const sub of SEED_SUBJECTS) {
    const baseHr = sub.id === "c3-marcus-vance" ? 76.0 : 66.0;

    for (let h = 24; h >= 0; h--) {
      const timeIso = new Date(now - h * 3600000).toISOString();
      
      // 1. Cardiovascular: Heart Rate
      let hrVal = Math.round((baseHr + (Math.sin(h / 3) * 5)) * 10) / 10;
      if (sub.id === "c3-marcus-vance" && h >= 2 && h <= 3) {
        hrVal = 112.5;
      }
      obs.push({
        id: `obs-hr-${sub.id}-${h}`,
        subject_id: sub.id,
        measurement_type: "heart_rate",
        domain: "cardiovascular",
        value_numeric: hrVal,
        unit: "bpm",
        observed_at: timeIso,
        recorded_at: timeIso,
        source_type: "synthetic_demo",
        source_name: "Bio-Harness Telemetry Simulator",
        dataset_id: null,
        is_simulated: true,
        created_by: "telemetry_agent"
      });

      // 1. Cardiovascular: SpO2
      let spo2Val = 98.6;
      if (sub.id === "c4-sarah-jenkins" && h >= 4 && h <= 5) {
        spo2Val = 93.2;
      }
      obs.push({
        id: `obs-spo2-${sub.id}-${h}`,
        subject_id: sub.id,
        measurement_type: "spo2",
        domain: "cardiovascular",
        value_numeric: spo2Val,
        unit: "%",
        observed_at: timeIso,
        recorded_at: timeIso,
        source_type: "synthetic_demo",
        source_name: "Pulse Oximeter Telemetry",
        dataset_id: null,
        is_simulated: true,
        created_by: "telemetry_agent"
      });

      // 1. Cardiovascular: Blood Pressure Systolic
      obs.push({
        id: `obs-bpsys-${sub.id}-${h}`,
        subject_id: sub.id,
        measurement_type: "blood_pressure_sys",
        domain: "cardiovascular",
        value_numeric: Math.round(118 + Math.sin(h / 4) * 6),
        unit: "mmHg",
        observed_at: timeIso,
        recorded_at: timeIso,
        source_type: "synthetic_demo",
        source_name: "Arterial Pressure Cuff",
        dataset_id: null,
        is_simulated: true,
        created_by: "telemetry_agent"
      });

      // 2. Bone and Physical: Bone Resorption Marker (OSD-919 Grounded)
      let ntxVal = 48.0 + Math.sin(h / 6) * 4;
      if (sub.id === "c1-elena-rostova" && h <= 6) {
        ntxVal = 72.4;
      }
      obs.push({
        id: `obs-bone-${sub.id}-${h}`,
        subject_id: sub.id,
        measurement_type: "bone_resorption_marker",
        domain: "bone_physical",
        value_numeric: Math.round(ntxVal * 10) / 10,
        unit: "nmol BCE",
        observed_at: timeIso,
        recorded_at: timeIso,
        source_type: "nasa",
        source_name: "NASA OSDR OSD-919 Research Model",
        dataset_id: "OSD-919",
        is_simulated: true,
        created_by: "osdr_biomarker_engine"
      });

      // 4. Radiation Exposure (NASA EDA Grounded)
      obs.push({
        id: `obs-rad-${sub.id}-${h}`,
        subject_id: sub.id,
        measurement_type: "cabin_radiation_flux",
        domain: "radiation",
        value_numeric: Math.round((21.4 + Math.cos(h / 2) * 2.8) * 10) / 10,
        unit: "μSv/h",
        observed_at: timeIso,
        recorded_at: timeIso,
        source_type: "nasa",
        source_name: "NASA Environmental Data App (EDA)",
        dataset_id: "EDA-ISS",
        is_simulated: true,
        created_by: "eda_telemetry_relay"
      });

      // 5. Environmental: Cabin CO2 (NASA EDA Grounded)
      let co2Val = Math.round(2600 + Math.sin(h / 5) * 400);
      if (h <= 4) co2Val = 3680;
      obs.push({
        id: `obs-co2-${sub.id}-${h}`,
        subject_id: sub.id,
        measurement_type: "cabin_co2_ppm",
        domain: "environmental",
        value_numeric: co2Val,
        unit: "ppm",
        observed_at: timeIso,
        recorded_at: timeIso,
        source_type: "nasa",
        source_name: "NASA Environmental Data App (EDA)",
        dataset_id: "EDA-ISS",
        is_simulated: true,
        created_by: "eda_telemetry_relay"
      });

      // 7. Altered Gravity: Vestibular Balance Score
      obs.push({
        id: `obs-vest-${sub.id}-${h}`,
        subject_id: sub.id,
        measurement_type: "vestibular_score",
        domain: "altered_gravity",
        value_numeric: Math.round((92.0 - Math.sin(h / 8) * 6) * 10) / 10,
        unit: "/100",
        observed_at: timeIso,
        recorded_at: timeIso,
        source_type: "synthetic_demo",
        source_name: "Neuro-Vestibular G-Test",
        dataset_id: null,
        is_simulated: true,
        created_by: "telemetry_agent"
      });

      // 8. Immune & Blood Indicator (OSD-918 Grounded)
      obs.push({
        id: `obs-imm-${sub.id}-${h}`,
        subject_id: sub.id,
        measurement_type: "immune_cytokine_index",
        domain: "immune",
        value_numeric: Math.round((4.2 + Math.cos(h / 4) * 0.8) * 10) / 10,
        unit: "pg/mL",
        observed_at: timeIso,
        recorded_at: timeIso,
        source_type: "nasa",
        source_name: "NASA OSDR OSD-918 Research Reference",
        dataset_id: "OSD-918",
        is_simulated: true,
        created_by: "osdr_biomarker_engine"
      });
    }

    // 3. Behavioral Health & Sleep (Last 7 Days)
    for (let d = 7; d >= 1; d--) {
      const timeIso = new Date(now - d * 86400000).toISOString();
      const sleepVal = sub.id === "c1-elena-rostova" && d === 1 ? 4.4 : 7.6;
      obs.push({
        id: `obs-sleep-${sub.id}-${d}`,
        subject_id: sub.id,
        measurement_type: "sleep_duration",
        domain: "behavioral",
        value_numeric: sleepVal,
        unit: "hrs",
        observed_at: timeIso,
        recorded_at: timeIso,
        source_type: "synthetic_demo",
        source_name: "Sleep Quarters Actigraph",
        dataset_id: null,
        is_simulated: true,
        created_by: "sleep_daemon"
      });

      // Stress Index
      obs.push({
        id: `obs-stress-${sub.id}-${d}`,
        subject_id: sub.id,
        measurement_type: "stress_index",
        domain: "behavioral",
        value_numeric: sub.id === "c1-elena-rostova" && d === 1 ? 68 : 34,
        unit: "/100",
        observed_at: timeIso,
        recorded_at: timeIso,
        source_type: "calculated",
        source_name: "Autonomic Stress Model (HRV Derived)",
        dataset_id: null,
        is_simulated: true,
        created_by: "hrv_calculator"
      });
    }
  }

  return obs;
};

export const SEED_FLAGS: ReviewFlag[] = [
  {
    id: "flag-001",
    observation_id: "obs-hr-c3-marcus-vance-2",
    subject_id: "c3-marcus-vance",
    rule_code: "R-101",
    severity: "MEDIUM",
    domain: "cardiovascular",
    what_changed: "Resting heart rate reached 112.5 bpm (sustained above 105 bpm threshold).",
    baseline_reference: "Personal 30-day resting baseline: 64.2 ± 4.1 bpm.",
    period_considered: "2.5 hours during pre-EVA airlock preparation.",
    flag_reason: "Elevated cardiovascular workload detected outside active countermeasure exercise intervals.",
    action_to_review: "Flight Surgeon review requested: verify hydration status and inspect bio-harness electrode contact.",
    reason: "Review suggested: Heart rate 112.5 bpm exceeds configured resting threshold (>105 bpm). Non-clinical decision support only.",
    created_at: new Date(Date.now() - 2.5 * 3600000).toISOString(),
    acknowledged_by: null,
    acknowledged_at: null,
    notes: null
  },
  {
    id: "flag-002",
    observation_id: "obs-spo2-c4-sarah-jenkins-4",
    subject_id: "c4-sarah-jenkins",
    rule_code: "R-102",
    severity: "HIGH",
    domain: "cardiovascular",
    what_changed: "SpO2 desaturation down to 93.2% (<94.0% cabin minimum threshold).",
    baseline_reference: "Mission baseline average: 98.2 ± 0.6%.",
    period_considered: "45-minute window during botanical glovebox maintenance.",
    flag_reason: "Peripheral oxygen saturation declined below safe threshold; potential local ventilation stagnation.",
    action_to_review: "Crew member repositioned pulse oximeter and confirmed cabin air circulation fan nominal.",
    reason: "Review suggested: SpO2 dipped to 93.2% during science airlock cycle. Sensor recalibrated; nominal values restored.",
    created_at: new Date(Date.now() - 4.2 * 3600000).toISOString(),
    acknowledged_by: "Dr. Alex Chen",
    acknowledged_at: new Date(Date.now() - 3.1 * 3600000).toISOString(),
    notes: "Follow-up confirmed sensor slippage during glove manipulation. Re-test SpO2: 98.4%. No clinical pathology."
  },
  {
    id: "flag-003",
    observation_id: "obs-bone-c1-elena-rostova-2",
    subject_id: "c1-elena-rostova",
    rule_code: "R-106",
    severity: "MEDIUM",
    domain: "bone_physical",
    what_changed: "Bone resorption biomarker (NTx) reached 72.4 nmol BCE (threshold 68.0).",
    baseline_reference: "NASA OSDR OSD-919 reference cohort: 46.0 ± 8.2 nmol BCE.",
    period_considered: "72-hour rolling urine turnover assay.",
    flag_reason: "Accelerated collagen matrix degradation consistent with spaceflight microgravity deconditioning.",
    action_to_review: "Evaluate ARED (Advanced Resistive Exercise Device) adherence and dietary Vitamin D / calcium intake.",
    reason: "Review suggested: Bone resorption marker surge. Informed by NASA OSDR OSD-919 microgravity research.",
    created_at: new Date(Date.now() - 6.0 * 3600000).toISOString(),
    acknowledged_by: null,
    acknowledged_at: null,
    notes: null
  },
  {
    id: "flag-004",
    observation_id: "obs-sleep-c1-elena-rostova-1",
    subject_id: "c1-elena-rostova",
    rule_code: "R-104",
    severity: "LOW",
    domain: "behavioral",
    what_changed: "Sleep duration recorded at 4.4 hours (<5.0h operational cognitive safety threshold).",
    baseline_reference: "Personal mission average: 7.4 ± 0.8 hours.",
    period_considered: "Sleep block prior to Sol 142 orbital correction burn.",
    flag_reason: "Acute sleep deficit detected; correlates with high operational tempo during rendezvous maneuvers.",
    action_to_review: "Schedule compensatory rest cycle; verify sleep cabin acoustic and lighting baffles.",
    reason: "Review suggested: Acute sleep deprivation prior to high-criticality flight burn. Rest period recommended.",
    created_at: new Date(Date.now() - 8.5 * 3600000).toISOString(),
    acknowledged_by: null,
    acknowledged_at: null,
    notes: null
  }
];

export const SEED_AUDITS: AuditEvent[] = [
  {
    id: "audit-001",
    actor_user_id: "mission_bootstrap",
    actor_role: "system",
    event_type: "system.init",
    resource_type: "mission_node",
    resource_id: "gateway-core",
    occurred_at: new Date(Date.now() - 7 * 86400000).toISOString(),
    request_id: "req-init-001",
    metadata: { 
      mission: "NASA Space Apps 2026 - Astronaut Health Guardian", 
      status: "nominal", 
      nasa_resources_loaded: 5 
    }
  },
  {
    id: "audit-002",
    actor_user_id: "dr_alex_chen",
    actor_role: "flight_surgeon",
    event_type: "review_flag.acknowledged",
    resource_type: "review_flag",
    resource_id: "flag-002",
    occurred_at: new Date(Date.now() - 3.1 * 3600000).toISOString(),
    request_id: "req-ack-092",
    metadata: { rule_code: "R-102", subject: "Sarah Jenkins", note: "Sensor repositioned; nominal restored" }
  },
  {
    id: "audit-003",
    actor_user_id: "marcus_vance",
    actor_role: "astronaut",
    event_type: "observation.sync_batch",
    resource_type: "sync_queue",
    resource_id: "batch-108",
    occurred_at: new Date(Date.now() - 1.2 * 3600000).toISOString(),
    request_id: "req-sync-108",
    metadata: { operations_committed: 6, provenance: "NASA OSDR & Synthetic Hybrid" }
  }
];
