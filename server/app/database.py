from typing import Any, List, Dict
from datetime import datetime, timedelta

from .models.agent import Agent
from .models.audit import AuditLog, AuditLogActor
from .models.governance import ApprovalItem, HistoryItem
from .models.workflow import WorkflowStored

# --- In-Memory Storage (Substituir por um banco de dados real em produção) ---

# Agent storage
_agents: Dict[str, Agent] = {}

# Secret storage (armazena valores criptografados)
_secrets: Dict[str, bytes] = {}

# Workflow storage
_workflows: Dict[str, WorkflowStored] = {}

# Audit log storage com dados mockados
_audit_logs: List[AuditLog] = [
    AuditLog(
        id='log-001',
        timestamp='2024-05-22T10:00:00Z',
        actor=AuditLogActor(type='user', id='user-123', name='Alice'),
        action='AGENT_CREATE',
        details={'agentId': 'agent-abc', 'name': 'Sales Assistant'},
        ipAddress='192.168.1.1',
    ),
    AuditLog(
        id='log-002',
        timestamp='2024-05-22T10:05:00Z',
        actor=AuditLogActor(type='agent', id='agent-abc', name='Sales Assistant'),
        action='TASK_EXECUTE_SUCCESS',
        details={'taskId': 'task-xyz', 'result': 'Lead captured'},
    ),
]

# Governance DB com dados mockados
governance_db: Dict[str, Any] = {
    "settings": {
        "defaultAutonomyLevel": "ask"
    },
    "approvals": [
        ApprovalItem(
            id="appr-001",
            agentName="Data Analyst",
            action="EXECUTE_QUERY",
            details={"query": "SELECT * FROM users;"},
            timestamp=datetime.utcnow() - timedelta(hours=1)
        )
    ],
    "history": [
        HistoryItem(
            id="hist-001",
            agentName="Marketing Bot",
            action="SEND_EMAIL_CAMPAIGN",
            status="approved",
            timestamp=datetime.utcnow() - timedelta(days=1),
            actor="Bob"
        )
    ]
}
