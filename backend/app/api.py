from fastapi import APIRouter, HTTPException, Query, Header
from typing import List, Optional, Dict, Any
from .schemas import (
    SubjectBase, ObservationCreate, ObservationOut, ReviewFlagOut,
    FlagAcknowledgeRequest, SyncBatchRequest, SyncBatchResponse, AuditEventOut
)
from .storage import db
import sys
import os

# Import review rules
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))
from ml.rules import TransparentReviewEngine

router = APIRouter(prefix="/api/v1")

@router.get("/subjects", response_model=List[SubjectBase])
def get_subjects():
    return db.get_subjects()

@router.get("/subjects/{subject_id}", response_model=SubjectBase)
def get_subject_detail(subject_id: str):
    sub = db.get_subject(subject_id)
    if not sub:
        raise HTTPException(status_code=404, detail="Subject not found")
    return sub

@router.get("/observations", response_model=List[ObservationOut])
def list_observations(
    subject_id: Optional[str] = Query(None, description="Filter by crew subject ID"),
    measurement_type: Optional[str] = Query(None, description="Filter by vital type"),
    limit: int = Query(300, ge=1, le=1000)
):
    return db.get_observations(subject_id=subject_id, measurement_type=measurement_type, limit=limit)

@router.post("/observations", response_model=ObservationOut, status_code=201)
def create_observation(obs: ObservationCreate):
    # Idempotency check: if client_operation_id already registered, avoid duplication
    if obs.client_operation_id and obs.client_operation_id in db.client_operation_ids:
        for existing in db.observations:
            if existing.get("client_operation_id") == obs.client_operation_id:
                return existing

    record = db.add_observation(obs.model_dump())

    # Evaluate transparent review rules
    recent = db.get_observations(subject_id=record["subject_id"], measurement_type=record["measurement_type"], limit=10)
    flag = TransparentReviewEngine.evaluate_observation(record, recent_history=recent)
    if flag:
        db.add_review_flag(flag)

    return record

@router.get("/observations/{obs_id}", response_model=ObservationOut)
def get_observation_detail(obs_id: str):
    for obs in db.observations:
        if obs["id"] == obs_id:
            return obs
    raise HTTPException(status_code=404, detail="Observation not found")

@router.get("/review-flags", response_model=List[ReviewFlagOut])
def list_review_flags(subject_id: Optional[str] = Query(None)):
    return db.get_review_flags(subject_id=subject_id)

@router.post("/review-flags/{flag_id}/acknowledge", response_model=ReviewFlagOut)
def acknowledge_review_flag(flag_id: str, req: FlagAcknowledgeRequest):
    updated = db.acknowledge_flag(flag_id, acknowledged_by=req.acknowledged_by, notes=req.notes)
    if not updated:
        raise HTTPException(status_code=404, detail="Review flag not found")
    return updated

@router.post("/sync", response_model=SyncBatchResponse)
def batch_sync_operations(batch: SyncBatchRequest):
    """
    Submits queued client operations idempotently.
    Enforces uniqueness on client_operation_id so retries never create duplicates.
    """
    synced = 0
    duplicates = 0
    failed = 0
    results = []

    for item in batch.operations:
        op_id = item.operation_id
        payload = item.payload

        if op_id in db.client_operation_ids:
            duplicates += 1
            results.append({
                "operation_id": op_id,
                "status": "duplicate_ignored",
                "message": "Operation already processed idempotently."
            })
            continue

        try:
            # Map payload to observation
            payload_with_op = dict(payload)
            payload_with_op["client_operation_id"] = op_id
            record = db.add_observation(payload_with_op)
            
            # Check review rules
            flag = TransparentReviewEngine.evaluate_observation(record)
            if flag:
                db.add_review_flag(flag)

            synced += 1
            results.append({
                "operation_id": op_id,
                "status": "success",
                "server_record_id": record["id"]
            })
        except Exception as e:
            failed += 1
            results.append({
                "operation_id": op_id,
                "status": "failed",
                "error": str(e)
            })

    # Log audit event for synchronization
    db.record_audit_event(
        actor_user_id="sync_client",
        actor_role="contributor",
        event_type="observation.sync_batch",
        resource_type="sync_queue",
        metadata={
            "synced_count": synced,
            "duplicates_ignored": duplicates,
            "failed_count": failed,
            "total_submitted": len(batch.operations)
        }
    )

    return {
        "synced_count": synced,
        "duplicates_ignored": duplicates,
        "failed_count": failed,
        "results": results
    }

@router.get("/audit-events", response_model=List[AuditEventOut])
def list_audit_events(limit: int = Query(50, ge=1, le=200)):
    return db.get_audit_events(limit=limit)

@router.get("/rules")
def get_rules_manifest():
    return {
        "disclaimer": "Experimental review rules for decision support. NOT clinical diagnostic criteria.",
        "rules": TransparentReviewEngine.RULES_MANIFEST
    }

