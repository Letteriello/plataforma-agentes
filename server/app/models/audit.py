from pydantic import BaseModel
from typing import Any, Dict, Optional

class AuditLogActor(BaseModel):
    type: str  # 'user' or 'agent'
    id: str
    name: str

class AuditLog(BaseModel):
    id: str
    timestamp: str
    actor: AuditLogActor
    action: str
    details: Dict[str, Any]
    ipAddress: Optional[str] = None
