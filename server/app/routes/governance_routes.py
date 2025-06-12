from fastapi import APIRouter, HTTPException, status
from typing import List

from ..controllers import governance_controller
from ..models.governance import GovernanceSettings, ApprovalItem, HistoryItem, RejectPayload

router = APIRouter(
    prefix="/governance",
    tags=["Governance"],
)

@router.get("/settings", response_model=GovernanceSettings)
def get_governance_settings():
    return governance_controller.get_settings()

@router.post("/settings/autonomy")
def set_autonomy_level(new_level: str):
    governance_controller.update_settings(new_level)
    return {"message": f"Default autonomy level set to {new_level}"}

@router.get("/approvals", response_model=List[ApprovalItem])
def list_pending_approvals():
    return governance_controller.get_pending_approvals()

@router.post("/approvals/{item_id}/approve")
def approve_pending_action(item_id: str, actor_name: str = "System Admin"):
    if not governance_controller.approve_action(item_id, actor_name):
        raise HTTPException(status_code=404, detail="Approval item not found")
    return {"message": "Action approved"}

@router.post("/approvals/{item_id}/reject")
def reject_pending_action(item_id: str, payload: RejectPayload, actor_name: str = "System Admin"):
    if not governance_controller.reject_action(item_id, payload, actor_name):
        raise HTTPException(status_code=404, detail="Approval item not found")
    return {"message": "Action rejected"}

@router.get("/approvals/history", response_model=List[HistoryItem])
def list_approval_history():
    return governance_controller.get_approval_history()
