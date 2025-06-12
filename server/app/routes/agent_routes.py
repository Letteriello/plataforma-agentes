from fastapi import APIRouter, HTTPException, status
from typing import List

from ..controllers import agent_controller
from ..models.agent import Agent, AgentUpdate

router = APIRouter(
    prefix="/agents",
    tags=["Agents"],
)

@router.post("/", response_model=Agent, status_code=status.HTTP_201_CREATED)
def create_new_agent(agent: Agent):
    return agent_controller.create_agent(agent)

@router.get("/", response_model=List[Agent])
def list_all_agents():
    return agent_controller.get_all_agents()

@router.get("/{agent_id}", response_model=Agent)
def get_single_agent(agent_id: str):
    agent = agent_controller.get_agent_by_id(agent_id)
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")
    return agent

@router.patch("/{agent_id}", response_model=Agent)
def update_existing_agent(agent_id: str, agent_update: AgentUpdate):
    updated_agent = agent_controller.update_agent(agent_id, agent_update)
    if not updated_agent:
        raise HTTPException(status_code=404, detail="Agent not found")
    return updated_agent

@router.delete("/{agent_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_existing_agent(agent_id: str):
    if not agent_controller.delete_agent(agent_id):
        raise HTTPException(status_code=404, detail="Agent not found")
    return
