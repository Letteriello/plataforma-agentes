from typing import List, Optional
from uuid import uuid4
from datetime import datetime

from .. import database
from ..models.agent import Agent, AgentUpdate

def get_all_agents() -> List[Agent]:
    return list(database._agents.values())

def get_agent_by_id(agent_id: str) -> Optional[Agent]:
    return database._agents.get(agent_id)

def create_agent(agent_data: Agent) -> Agent:
    agent_id = f"agent-{uuid4()}"
    now = datetime.utcnow().isoformat() + "Z"
    
    new_agent = agent_data.copy(update={
        'id': agent_id,
        'createdAt': now,
        'updatedAt': now
    })
    
    database._agents[agent_id] = new_agent
    return new_agent

def update_agent(agent_id: str, agent_update: AgentUpdate) -> Optional[Agent]:
    agent = get_agent_by_id(agent_id)
    if not agent:
        return None

    update_data = agent_update.dict(exclude_unset=True)
    updated_agent = agent.copy(update=update_data)
    updated_agent.updatedAt = datetime.utcnow().isoformat() + "Z"
    
    database._agents[agent_id] = updated_agent
    return updated_agent

def delete_agent(agent_id: str) -> bool:
    if agent_id in database._agents:
        del database._agents[agent_id]
        return True
    return False
