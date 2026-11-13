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

export type MeasurementType = 
  | 'heart_rate'
  | 'spo2'
  | 'core_temp'
  | 'respiration_rate'
  | 'blood_pressure_sys'
  | 'blood_pressure_dia'
  | 'sleep_duration'
  | 'radiation_dose'
  | 'stress_index';

export interface Observation {
  id: string;
  subject_id: string;
  measurement_type: MeasurementType | string;
  value_numeric: number;
  value_text?: string | null;
  unit: string;
  observed_at: string;
  recorded_at: string;
  source: string;
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
    value_numeric: number;
    unit: string;
    observed_at: string;
    source: string;
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
  severity: FlagSeverity;
  threshold_high?: number;
  threshold_low?: number;
  critical_low?: number;
  unit: string;
  description: string;
}

