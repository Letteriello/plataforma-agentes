from fastapi import APIRouter, HTTPException, status, Depends # Added Depends
from typing import List

from ..controllers import agent_controller
from ..models.agent import Agent, AgentUpdate
from ..schemas.tool_schemas import ToolResponseSchema # Added for agent tools response
from ..security import get_current_user_id # Import the dependency
from typing import List, Dict, Any # Added for new response models

router = APIRouter(
    prefix="/agents",
    tags=["Agents"],
)

@router.post("/", response_model=Agent, status_code=status.HTTP_201_CREATED)
def create_new_agent(agent_payload: Agent, current_user_id: str = Depends(get_current_user_id)):
    # Pass current_user_id to the controller
    return agent_controller.create_agent(agent_payload=agent_payload, user_id=current_user_id)

@router.get("/", response_model=List[Agent])
def list_all_agents(current_user_id: str = Depends(get_current_user_id)):
    # Pass current_user_id to the controller
    return agent_controller.get_all_agents(user_id=current_user_id)

@router.get("/{agent_id}", response_model=Agent)
def get_single_agent(agent_id: str, current_user_id: str = Depends(get_current_user_id)):
    # Pass current_user_id to the controller
    agent = agent_controller.get_agent_by_id(agent_id=agent_id, user_id=current_user_id)
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found or not authorized")
    return agent

@router.patch("/{agent_id}", response_model=Agent)
def update_existing_agent(agent_id: str, agent_update: AgentUpdate, current_user_id: str = Depends(get_current_user_id)):
    # Pass current_user_id to the controller
    updated_agent = agent_controller.update_agent(agent_id=agent_id, agent_update=agent_update, user_id=current_user_id)
    if not updated_agent:
        raise HTTPException(status_code=404, detail="Agent not found or not authorized")
    return updated_agent

@router.delete("/{agent_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_existing_agent(agent_id: str, current_user_id: str = Depends(get_current_user_id)):
    # Pass current_user_id to the controller
    if not agent_controller.delete_agent(agent_id=agent_id, user_id=current_user_id):
        raise HTTPException(status_code=404, detail="Agent not found or not authorized")
    return

# New routes for agent-tool associations

@router.post("/{agent_id}/tools/{tool_id}", status_code=status.HTTP_200_OK, response_model=Dict[str, Any])
def associate_tool_with_agent(
    agent_id: str, 
    tool_id: str, 
    current_user_id: str = Depends(get_current_user_id)
):
    """
    Associates a specific tool with a specific agent.
    The user_id from the JWT token is used to ensure the agent belongs to the user
    and the tool is accessible by the user.
    """
    try:
        result = agent_controller.add_tool_to_agent(
            agent_id=agent_id, 
            tool_id=tool_id, 
            user_id=current_user_id
        )
        return result
    except HTTPException as e:
        raise e # Re-raise HTTPException to let FastAPI handle it
    except Exception as e:
        # Catch any other unexpected errors from the controller
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An unexpected error occurred while associating tool: {str(e)}"
        )

@router.delete("/{agent_id}/tools/{tool_id}", status_code=status.HTTP_200_OK, response_model=Dict[str, str])
def disassociate_tool_from_agent(
    agent_id: str, 
    tool_id: str, 
    current_user_id: str = Depends(get_current_user_id)
):
    """
    Disassociates a tool from an agent.
    """
    try:
        result = agent_controller.remove_tool_from_agent(
            agent_id=agent_id, 
            tool_id=tool_id, 
            user_id=current_user_id
        )
        return result
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An unexpected error occurred while disassociating tool: {str(e)}"
        )

@router.get("/{agent_id}/tools", response_model=List[ToolResponseSchema])
def list_agent_associated_tools(
    agent_id: str, 
    current_user_id: str = Depends(get_current_user_id)
):
    """
    Lists all tools associated with a specific agent.
    """
    try:
        tools = agent_controller.get_agent_tools(agent_id=agent_id, user_id=current_user_id)
        return tools
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An unexpected error occurred while listing agent tools: {str(e)}"
        )
