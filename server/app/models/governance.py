from pydantic import BaseModel
from typing import Any, Dict, Optional, Literal
from datetime import datetime

class GovernanceSettings(BaseModel):
    defaultAutonomyLevel: Literal['auto', 'ask']

class ApprovalItem(BaseModel):
    id: str
    agentName: str
    action: str
    details: Dict[str, Any]
    status: Literal['pending', 'approved', 'rejected'] = 'pending'
    timestamp: datetime

class HistoryItem(BaseModel):
    id: str
    agentName: str
    action: str
    status: Literal['approved', 'rejected']
    timestamp: datetime
    actor: str
    reason: Optional[str] = None

class RejectPayload(BaseModel):
    reason: str
