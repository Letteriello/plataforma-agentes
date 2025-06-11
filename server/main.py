from fastapi import FastAPI, HTTPException, status
from pydantic import BaseModel
from typing import Any, List, Dict, Optional, Literal
from uuid import uuid4
import os
from cryptography.fernet import Fernet
from datetime import datetime, timedelta

# --- App Setup ---
app = FastAPI(title="Plataforma Agentes API", version="0.2.0")

# --- Cryptography Setup ---
KEY_FILE = "secret.key"

# Em um ambiente de produção, esta chave DEVE ser gerenciada por um serviço de segredos (ex: AWS Secrets Manager, HashiCorp Vault)
if not os.path.exists(KEY_FILE):
    key = Fernet.generate_key()
    with open(KEY_FILE, "wb") as key_file:
        key_file.write(key)

def load_key():
    return open(KEY_FILE, "rb").read()

key = load_key()
fernet = Fernet(key)

def encrypt_value(value: str) -> bytes:
    return fernet.encrypt(value.encode())

def decrypt_value(encrypted_value: bytes) -> str:
    return fernet.decrypt(encrypted_value).decode()

# --- In-Memory Storage (for simplicity) ---
# Agent storage
_agents: Dict[str, 'Agent'] = {}
# Secret storage (stores encrypted values)
_secrets: Dict[str, bytes] = {}

# --- Audit Log Models and Storage ---
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

# In-memory storage for audit logs (mock data)
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
        details={'taskId': 'task-xyz', 'result': 'Lead qualified'},
        ipAddress='10.0.0.5',
    ),
    AuditLog(
        id='log-003',
        timestamp='2024-05-22T10:10:00Z',
        actor=AuditLogActor(type='user', id='user-456', name='Bob'),
        action='SECRET_DELETE',
        details={'secretName': 'STRIPE_API_KEY'},
        ipAddress='203.0.113.25',
    ),
    AuditLog(
        id='log-004',
        timestamp='2024-05-22T10:15:00Z',
        actor=AuditLogActor(type='user', id='user-123', name='Alice'),
        action='AGENT_UPDATE_CONFIG',
        details={'agentId': 'agent-abc', 'changes': {'temperature': 0.8}},
        ipAddress='192.168.1.1',
    ),
]

# --- Pydantic Models ---

# Agent Models
class AgentBase(BaseModel):
    name: str
    description: str | None = None
    type: str

class AgentCreate(AgentBase):
    pass

class Agent(AgentBase):
    id: str

# Secret Models
class Secret(BaseModel):
    name: str
    # O valor não é exposto na listagem

class SecretCreate(BaseModel):
    name: str
    value: str

# --- Agent Endpoints ---

@app.get("/agents", response_model=List[Agent])
def list_agents():
    return list(_agents.values())

@app.post("/agents", response_model=Agent, status_code=status.HTTP_201_CREATED)
def create_agent(agent_in: AgentCreate):
    agent = Agent(id=str(uuid4()), **agent_in.dict())
    _agents[agent.id] = agent
    return agent

# --- Secrets Vault Endpoints ---

@app.get("/secrets", response_model=List[Secret])
def list_secrets():
    """Lists the names of all stored secrets without exposing their values."""
    return [Secret(name=name) for name in _secrets.keys()]

@app.post("/secrets", response_model=Secret, status_code=status.HTTP_201_CREATED)
def create_or_update_secret(secret_in: SecretCreate):
    """Creates a new secret or updates an existing one.
    The secret value is encrypted before being stored.
    """
    if not secret_in.name or not secret_in.value:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Name and value cannot be empty."
        )
    
    encrypted_value = encrypt_value(secret_in.value)
    _secrets[secret_in.name] = encrypted_value
    return Secret(name=secret_in.name)

@app.delete("/secrets/{secret_name}", status_code=status.HTTP_204_NO_CONTENT)
def delete_secret(secret_name: str):
    """Deletes a secret by its name."""
    if secret_name not in _secrets:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Secret not found"
        )
    del _secrets[secret_name]
    return None


# --- Audit Log Endpoints ---

@app.get("/audit-logs", response_model=List[AuditLog])
def get_audit_logs():
    """Retrieve all audit logs."""
    return _audit_logs

# --- Governance Models and DB ---
AutonomyLevel = Literal['Manual', 'Assistido', 'Semi-Autônomo', 'Autônomo com Revisão', 'Totalmente Autônomo']

class ApprovalItem(BaseModel):
    id: str
    agentName: str
    action: str
    context: str
    status: Literal['pending', 'approved', 'rejected']
    createdAt: datetime

class HistoryItem(BaseModel):
    id: str
    agentName: str
    action: str
    status: Literal['approved', 'rejected']
    timestamp: datetime
    actor: str
    reason: Optional[str] = None

# In-memory storage for governance (mock data)
governance_db = {
    "autonomyLevel": "Semi-Autônomo",
    "approvals": [
        ApprovalItem(
            id='approval-001',
            agentName='Agente de Marketing',
            action='Enviar Campanha de Email',
            context='Enviar para a lista de \'early-adopters\' com o template \'lancamento-v2\'.',
            status='pending',
            createdAt=datetime.utcnow(),
        ),
        ApprovalItem(
            id='approval-002',
            agentName='Agente Financeiro',
            action='Executar Pagamento',
            context='Pagamento de fatura para fornecedor \'CloudServices Inc.\' no valor de $500.',
            status='pending',
            createdAt=datetime.utcnow() - timedelta(hours=2),
        ),
    ],
    "history": [
        HistoryItem(
            id='hist-001',
            agentName='Agente de Suporte',
            action='Escalar Ticket',
            status='approved',
            timestamp=datetime.utcnow() - timedelta(days=1),
            actor='Maria Silva',
            reason='Cliente VIP, requer atenção imediata da equipe de engenharia.',
        ),
        HistoryItem(
            id='hist-002',
            agentName='Agente de Marketing',
            action='Pausar Campanha',
            status='rejected',
            timestamp=datetime.utcnow() - timedelta(days=2),
            actor='João Costa',
            reason='Orçamento da campanha excedido. Rever custos antes de continuar.',
        ),
    ]
}

# --- Governance Endpoints ---

@app.get("/governance/autonomy", response_model=Dict[str, AutonomyLevel])
def get_autonomy_level():
    return {"autonomyLevel": governance_db["autonomyLevel"]}

class SetAutonomyLevelPayload(BaseModel):
    autonomyLevel: AutonomyLevel

@app.post("/governance/autonomy")
def set_autonomy_level(level: SetAutonomyLevelPayload):
    new_level = level.autonomyLevel
    governance_db["autonomyLevel"] = new_level
    return {"message": f"Autonomy level set to {new_level}"}

@app.get("/approvals", response_model=List[ApprovalItem])
def get_pending_approvals():
    return [item for item in governance_db["approvals"] if item.status == 'pending']

class RejectPayload(BaseModel):
    reason: str

@app.post("/approvals/{item_id}/approve")
def approve_action(item_id: str, actor_name: str = "System Admin"):
    item_index = next((i for i, item in enumerate(governance_db["approvals"]) if item.id == item_id), None)
    if item_index is None:
        raise HTTPException(status_code=404, detail="Approval item not found")
    
    item = governance_db["approvals"].pop(item_index)
    item.status = 'approved'
    
    history_item = HistoryItem(
        id=f"hist-{item.id}",
        agentName=item.agentName,
        action=item.action,
        status='approved',
        timestamp=datetime.utcnow(),
        actor=actor_name
    )
    governance_db["history"].insert(0, history_item)
    return {"message": "Action approved"}

@app.post("/approvals/{item_id}/reject")
def reject_action(item_id: str, payload: RejectPayload, actor_name: str = "System Admin"):
    item_index = next((i for i, item in enumerate(governance_db["approvals"]) if item.id == item_id), None)
    if item_index is None:
        raise HTTPException(status_code=404, detail="Approval item not found")

    item = governance_db["approvals"].pop(item_index)
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
    governance_db["history"].insert(0, history_item)
    return {"message": "Action rejected"}

@app.get("/approvals/history", response_model=List[HistoryItem])
def get_approval_history():
    return governance_db["history"]


# Exemplo de como usar o uvicorn para rodar a aplicação
if __name__ == "__main__":

    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
