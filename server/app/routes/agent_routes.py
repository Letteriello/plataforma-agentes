from fastapi import APIRouter, HTTPException, status, Depends
from typing import List, Dict, Any

from ..controllers import agent_controller
from ..models.agent import Agent, AgentUpdate
from ..schemas.tool_schemas import ToolResponseSchema
from ..schemas.auth_schemas import CurrentUserWithToken
from ..security import get_current_user_and_token

router = APIRouter(
    prefix="/agents",
    tags=["Agents"],
)

@router.post("/", response_model=Agent, status_code=status.HTTP_201_CREATED)
def create_new_agent(agent_payload: Agent, user_data: CurrentUserWithToken = Depends(get_current_user_and_token)):
    return agent_controller.create_agent(agent_payload=agent_payload, current_user=user_data.user, jwt_token=user_data.jwt_token)

@router.get("/", response_model=List[Agent])
def list_all_agents(user_data: CurrentUserWithToken = Depends(get_current_user_and_token)):
    return agent_controller.get_all_agents(current_user=user_data.user, jwt_token=user_data.jwt_token)

@router.get("/{agent_id}", response_model=Agent)
def get_single_agent(agent_id: str, user_data: CurrentUserWithToken = Depends(get_current_user_and_token)):
    agent = agent_controller.get_agent_by_id(agent_id=agent_id, current_user=user_data.user, jwt_token=user_data.jwt_token)
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found or not authorized")
    return agent

@router.patch("/{agent_id}", response_model=Agent)
def update_existing_agent(agent_id: str, agent_update: AgentUpdate, user_data: CurrentUserWithToken = Depends(get_current_user_and_token)):
    updated_agent = agent_controller.update_agent(
        agent_id=agent_id, 
        agent_update=agent_update, 
        current_user=user_data.user, 
        jwt_token=user_data.jwt_token
    )
    return updated_agent

@router.delete("/{agent_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_agent_by_id(agent_id: str, user_data: CurrentUserWithToken = Depends(get_current_user_and_token)):
    success = agent_controller.delete_agent(agent_id=agent_id, current_user=user_data.user, jwt_token=user_data.jwt_token)
    if not success:
        raise HTTPException(status_code=404, detail="Agent not found or could not be deleted")
    # No return body for 204

@router.post("/{agent_id}/tools/{tool_id}", status_code=status.HTTP_201_CREATED, response_model=Dict[str, Any])
def associate_tool_with_agent(
    agent_id: str, 
    tool_id: str, 
    user_data: CurrentUserWithToken = Depends(get_current_user_and_token)
):
    try:
        result = agent_controller.add_tool_to_agent(
            agent_id=agent_id, 
            tool_id=tool_id, 
            current_user=user_data.user,
            jwt_token=user_data.jwt_token
        )
        return result
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An unexpected error occurred while associating tool: {str(e)}"
        )

@router.delete("/{agent_id}/tools/{tool_id}", status_code=status.HTTP_200_OK, response_model=Dict[str, str])
def disassociate_tool_from_agent(
    agent_id: str, 
    tool_id: str, 
    user_data: CurrentUserWithToken = Depends(get_current_user_and_token)
):
    try:
        result = agent_controller.remove_tool_from_agent(
            agent_id=agent_id, 
            tool_id=tool_id, 
            current_user=user_data.user,
            jwt_token=user_data.jwt_token
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
    user_data: CurrentUserWithToken = Depends(get_current_user_and_token)
):
    try:
        tools = agent_controller.get_agent_tools(agent_id=agent_id, current_user=user_data.user, jwt_token=user_data.jwt_token)
        return tools
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An unexpected error occurred while listing agent tools: {str(e)}"
        )
