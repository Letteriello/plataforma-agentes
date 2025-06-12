from typing import List, Optional
from datetime import datetime
from uuid import uuid4

from .. import database
from ..models.governance import GovernanceSettings, ApprovalItem, HistoryItem, RejectPayload

def get_settings() -> GovernanceSettings:
    return database.governance_db["settings"]

def update_settings(new_level: str) -> GovernanceSettings:
    database.governance_db["settings"]["defaultAutonomyLevel"] = new_level
    return database.governance_db["settings"]

def get_pending_approvals() -> List[ApprovalItem]:
    return [item for item in database.governance_db["approvals"] if item.status == 'pending']

def get_approval_history() -> List[HistoryItem]:
    return database.governance_db["history"]

def approve_action(item_id: str, actor_name: str) -> bool:
    item_index = next((i for i, item in enumerate(database.governance_db["approvals"]) if item.id == item_id), None)
    if item_index is None:
        return False
    
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
    return True

def reject_action(item_id: str, payload: RejectPayload, actor_name: str) -> bool:
    item_index = next((i for i, item in enumerate(database.governance_db["approvals"]) if item.id == item_id), None)
    if item_index is None:
        return False

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
    return True
