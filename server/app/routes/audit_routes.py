from fastapi import APIRouter
from typing import List

from ..models.audit import AuditLog
from .. import database

router = APIRouter(
    prefix="/audit-logs",
    tags=["Audit"],
)

@router.get("/", response_model=List[AuditLog])
def list_audit_logs():
    return database._audit_logs
