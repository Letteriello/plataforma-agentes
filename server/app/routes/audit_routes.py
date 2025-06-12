from fastapi import APIRouter
from typing import List

from ..controllers import audit_controller
from ..models.audit import AuditLog

router = APIRouter(
    prefix="/audit-logs",
    tags=["Audit"],
)

@router.get("/", response_model=List[AuditLog])
def list_audit_logs():
    return audit_controller.get_audit_logs()
