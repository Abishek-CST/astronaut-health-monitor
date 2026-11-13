from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field
from datetime import datetime

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
    value_numeric: float
    value_text: Optional[str] = None
    unit: str
    observed_at: str
    source: str = "bio_harness_telemetry"
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

