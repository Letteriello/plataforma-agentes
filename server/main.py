from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
from uuid import uuid4

app = FastAPI(title="Plataforma Agentes API", version="0.1.0")

# Pydantic models for Agent CRUD
class AgentBase(BaseModel):
    name: str
    description: str | None = None
    type: str

class AgentCreate(AgentBase):
    pass

class Agent(AgentBase):
    id: str

# In-memory storage for simplicity
_agents: dict[str, Agent] = {}

@app.get("/agents", response_model=List[Agent])
def list_agents():
    return list(_agents.values())

@app.get("/agents/{agent_id}", response_model=Agent)
def get_agent(agent_id: str):
    agent = _agents.get(agent_id)
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")
    return agent

@app.post("/agents", response_model=Agent, status_code=201)
def create_agent(agent_in: AgentCreate):
    agent = Agent(id=str(uuid4()), **agent_in.dict())
    _agents[agent.id] = agent
    return agent

@app.put("/agents/{agent_id}", response_model=Agent)
def update_agent(agent_id: str, agent_in: AgentCreate):
    if agent_id not in _agents:
        raise HTTPException(status_code=404, detail="Agent not found")
    updated = Agent(id=agent_id, **agent_in.dict())
    _agents[agent_id] = updated
    return updated

@app.delete("/agents/{agent_id}", status_code=204)
def delete_agent(agent_id: str):
    if agent_id not in _agents:
        raise HTTPException(status_code=404, detail="Agent not found")
    del _agents[agent_id]
    return None

class SecretCreate(BaseModel):
    key_name: str
    value: str

_secrets: set[str] = set()

@app.post("/secrets", status_code=201)
def store_secret(secret: SecretCreate):
    # In real implementation, store hashed/encrypted
    _secrets.add(secret.key_name)
    return {"name": secret.key_name}
