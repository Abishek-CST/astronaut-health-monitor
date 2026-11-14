from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field

class SubjectBase(BaseModel):
    id: str
    display_label: str
    role: str
    mission_phase: str
    avatar_initials: str
    is_simulated: bool = True
    created_at: str

class ObservationCreate(BaseModel):
    subject_id: str
    measurement_type: str
    domain: Optional[str] = "cardiovascular"
    value_numeric: float
    value_text: Optional[str] = None
    unit: str
    observed_at: str
    source_type: str = "synthetic_demo"
    source_name: str = "Bio-Harness Telemetry Simulator"
    dataset_id: Optional[str] = None
    is_simulated: bool = True
    created_by: Optional[str] = "crew_member"
    client_operation_id: Optional[str] = None
    note: Optional[str] = None

class ObservationOut(ObservationCreate):
    id: str
    recorded_at: str

class ReviewFlagOut(BaseModel):
    id: str
    observation_id: Optional[str] = None
    subject_id: str
    rule_code: str
    severity: str
    domain: Optional[str] = "cardiovascular"
    what_changed: str
    baseline_reference: str
    period_considered: str
    flag_reason: str
    action_to_review: str
    reason: str
    created_at: str
    acknowledged_by: Optional[str] = None
    acknowledged_at: Optional[str] = None
    notes: Optional[str] = None

class FlagAcknowledgeRequest(BaseModel):
    acknowledged_by: str = "flight_surgeon"
    notes: Optional[str] = None

class SyncOperationItem(BaseModel):
    operation_id: str
    operation_type: str = "observation.create"
    created_at: str
    payload: Dict[str, Any]
    client_attempt_count: Optional[int] = 1

class SyncBatchRequest(BaseModel):
    operations: List[SyncOperationItem]

class SyncBatchResponse(BaseModel):
    synced_count: int
    duplicates_ignored: int
    failed_count: int
    results: List[Dict[str, Any]]

class AuditEventOut(BaseModel):
    id: str
    actor_user_id: str
    actor_role: str
    event_type: str
    resource_type: str
    resource_id: Optional[str] = None
    occurred_at: str
    request_id: Optional[str] = None
    metadata: Dict[str, Any] = Field(default_factory=dict)

class NasaResourceOut(BaseModel):
    id: str
    resource_name: str
    resource_url: str
    dataset_id: Optional[str] = None
    source_type: str = "nasa"
    domain: str
    description: str
    application_usage: str
