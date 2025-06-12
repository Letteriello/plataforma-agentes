from typing import List

from .. import database
from ..models.audit import AuditLog

def get_audit_logs() -> List[AuditLog]:
    return database._audit_logs
