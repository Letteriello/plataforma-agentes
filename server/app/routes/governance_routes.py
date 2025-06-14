from fastapi import APIRouter, HTTPException, status
from typing import List
from datetime import datetime

from ..models.governance import GovernanceSettings, ApprovalItem, HistoryItem, RejectPayload
from .. import database

router = APIRouter(
    prefix="/governance",
    tags=["Governance"],
)

@router.get("/settings", response_model=GovernanceSettings)
def get_governance_settings():
    return database.governance_db["settings"]

@router.post("/settings/autonomy")
def set_autonomy_level(new_level: str):
    database.governance_db["settings"]["defaultAutonomyLevel"] = new_level
    return {"message": f"Default autonomy level set to {new_level}"}

@router.get("/approvals", response_model=List[ApprovalItem])
def list_pending_approvals():
    return [item for item in database.governance_db["approvals"] if item.status == 'pending']

@router.post("/approvals/{item_id}/approve")
def approve_pending_action(item_id: str, actor_name: str = "System Admin"):
    item_index = next((i for i, item in enumerate(database.governance_db["approvals"]) if item.id == item_id), None)
    if item_index is None:
        raise HTTPException(status_code=404, detail="Approval item not found")
    item = database.governance_db["approvals"].pop(item_index)
    item.status = 'approved'
    history_item = HistoryItem(
        id=f"hist-{item.id}",
        agentName=item.agentName,
        action=item.action,
        status='approved',
        timestamp=datetime.utcnow(),
        actor=actor_name
    )
    database.governance_db["history"].insert(0, history_item)
    return {"message": "Action approved"}

@router.post("/approvals/{item_id}/reject")
def reject_pending_action(item_id: str, payload: RejectPayload, actor_name: str = "System Admin"):
    item_index = next((i for i, item in enumerate(database.governance_db["approvals"]) if item.id == item_id), None)
    if item_index is None:
        raise HTTPException(status_code=404, detail="Approval item not found")
    item = database.governance_db["approvals"].pop(item_index)
    item.status = 'rejected'
    history_item = HistoryItem(
        id=f"hist-{item.id}",
        agentName=item.agentName,
        action=item.action,
        status='rejected',
        timestamp=datetime.utcnow(),
        actor=actor_name,
        reason=payload.reason
    )
    database.governance_db["history"].insert(0, history_item)
    return {"message": "Action rejected"}

@router.get("/approvals/history", response_model=List[HistoryItem])
def list_approval_history():
    return database.governance_db["history"]
