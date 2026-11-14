export type UserRole = 'flight_surgeon' | 'reviewer' | 'astronaut';

export interface Subject {
  id: string;
  display_label: string;
  role: string;
  mission_phase: string;
  avatar_initials: string;
  is_simulated: boolean;
  created_at: string;
}

export type HealthDomain =
  | 'cardiovascular'
  | 'bone_physical'
  | 'behavioral'
  | 'radiation'
  | 'environmental'
  | 'confinement'
  | 'altered_gravity'
  | 'immune';

export type MeasurementType = 
  | 'heart_rate'
  | 'spo2'
  | 'core_temp'
  | 'respiration_rate'
  | 'blood_pressure_sys'
  | 'blood_pressure_dia'
  | 'bone_resorption_marker'
  | 'sleep_duration'
  | 'stress_index'
  | 'mood_score'
  | 'cabin_radiation_flux'
  | 'cumulative_radiation_mGy'
  | 'cabin_co2_ppm'
  | 'cabin_temp_c'
  | 'cabin_humidity_pct'
  | 'confinement_days'
  | 'vestibular_score'
  | 'immune_cytokine_index';

export type DataSourceType = 'nasa' | 'synthetic_demo' | 'calculated' | 'ml_output';

export interface Observation {
  id: string;
  subject_id: string;
  measurement_type: MeasurementType | string;
  domain?: HealthDomain;
  value_numeric: number;
  value_text?: string | null;
  unit: string;
  observed_at: string;
  recorded_at: string;
  source_type?: DataSourceType;
  source_name?: string;
  source?: string;
  dataset_id?: string | null;
  is_simulated: boolean;
  created_by?: string | null;
  client_operation_id?: string | null;
  note?: string | null;
}

export type FlagSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface ReviewFlag {
  id: string;
  observation_id?: string | null;
  subject_id: string;
  rule_code: string;
  severity: FlagSeverity;
  domain?: HealthDomain;
  what_changed?: string;
  baseline_reference?: string;
  period_considered?: string;
  flag_reason?: string;
  action_to_review?: string;
  reason: string;
  created_at: string;
  acknowledged_by?: string | null;
  acknowledged_at?: string | null;
  notes?: string | null;
}

export interface QueuedOperation {
  operation_id: string;
  operation_type: string;
  created_at: string;
  payload: {
    subject_id: string;
    measurement_type: string;
    domain?: HealthDomain;
    value_numeric: number;
    unit: string;
    observed_at: string;
    source?: string;
    source_type?: DataSourceType;
    source_name?: string;
    dataset_id?: string | null;
    is_simulated: boolean;
    note?: string;
  };
  status: 'pending' | 'syncing' | 'synced' | 'failed';
  client_attempt_count: number;
  error?: string;
}

export interface AuditEvent {
  id: string;
  actor_user_id: string;
  actor_role: string;
  event_type: string;
  resource_type: string;
  resource_id?: string | null;
  occurred_at: string;
  request_id?: string | null;
  metadata: Record<string, any>;
}

export interface RuleDefinition {
  code: string;
  name: string;
  metric: string;
  domain: HealthDomain;
  severity: FlagSeverity;
  threshold_high?: number;
  threshold_low?: number;
  critical_low?: number;
  unit: string;
  description: string;
  nasa_context?: string;
}

export interface NasaResource {
  id: string;
  resource_name: string;
  resource_url: string;
  dataset_id?: string | null;
  source_type: 'nasa';
  domain: string;
  description: string;
  application_usage: string;
}
