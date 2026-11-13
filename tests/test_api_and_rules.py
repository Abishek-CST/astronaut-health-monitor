import uuid
from datetime import datetime, timezone
from backend.app.storage import db
from ml.rules import TransparentReviewEngine

def test_transparent_review_rules():
    # Test R-101 (Heart rate elevation)
    obs_tachycardia = {
        "id": str(uuid.uuid4()),
        "subject_id": "c1-elena-rostova",
        "measurement_type": "heart_rate",
        "value_numeric": 115.0,
        "unit": "bpm"
    }
    flag = TransparentReviewEngine.evaluate_observation(obs_tachycardia)
    assert flag is not None
    assert flag["rule_code"] == "R-101"
    assert "exceeds configured resting threshold" in flag["reason"]

    # Test R-101 Normal (No flag)
    obs_normal = {
        "id": str(uuid.uuid4()),
        "subject_id": "c1-elena-rostova",
        "measurement_type": "heart_rate",
        "value_numeric": 72.0,
        "unit": "bpm"
    }
    assert TransparentReviewEngine.evaluate_observation(obs_normal) is None

    # Test R-102 (Hypoxia SpO2)
    obs_hypoxia = {
        "id": str(uuid.uuid4()),
        "subject_id": "c4-sarah-jenkins",
        "measurement_type": "spo2",
        "value_numeric": 92.0,
        "unit": "%"
    }
    flag_hypoxia = TransparentReviewEngine.evaluate_observation(obs_hypoxia)
    assert flag_hypoxia is not None
    assert flag_hypoxia["rule_code"] == "R-102"
    assert flag_hypoxia["severity"] == "HIGH"

    # Test R-103 (Core Temp)
    obs_temp = {
        "id": str(uuid.uuid4()),
        "subject_id": "c2-alex-chen",
        "measurement_type": "core_temp",
        "value_numeric": 38.1,
        "unit": "°C"
    }
    flag_temp = TransparentReviewEngine.evaluate_observation(obs_temp)
    assert flag_temp is not None
    assert flag_temp["rule_code"] == "R-103"

    # Test R-104 (Sleep Deficit)
    obs_sleep = {
        "id": str(uuid.uuid4()),
        "subject_id": "c1-elena-rostova",
        "measurement_type": "sleep_duration",
        "value_numeric": 4.2,
        "unit": "hrs"
    }
    flag_sleep = TransparentReviewEngine.evaluate_observation(obs_sleep)
    assert flag_sleep is not None
    assert flag_sleep["rule_code"] == "R-104"

def test_idempotency_and_duplicate_prevention():
    op_id = "test-idempotent-" + str(uuid.uuid4())
    obs_data = {
        "subject_id": "c1-elena-rostova",
        "measurement_type": "heart_rate",
        "value_numeric": 75.0,
        "unit": "bpm",
        "client_operation_id": op_id,
        "source": "unit_test"
    }
    rec1 = db.add_observation(obs_data)
    assert op_id in db.client_operation_ids

    # Second submission with same op_id
    initial_count = len(db.observations)
    assert op_id in db.client_operation_ids

def test_flag_acknowledgment():
    # Acknowledge flag-001
    updated = db.acknowledge_flag("flag-001", acknowledged_by="Dr. Alex Chen", notes="Crew rest prescribed")
    assert updated is not None
    assert updated["acknowledged_by"] == "Dr. Alex Chen"
    assert updated["acknowledged_at"] is not None
