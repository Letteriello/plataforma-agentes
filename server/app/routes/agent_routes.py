from fastapi import APIRouter, HTTPException, status, Depends
from typing import List, Dict, Any, Optional

import json
from ..models.user_model import User
from ..models.agent import Agent, AgentCreate, AgentUpdate
from ..schemas.tool_schemas import ToolResponseSchema
from ..schemas.auth_schemas import CurrentUserWithToken
from ..security import get_current_user_and_token
from ..supabase_client import create_supabase_client_with_jwt


def _fetch_tools_for_agent(agent_id: str, jwt_token: str) -> List[ToolResponseSchema]:
    user_supabase_client = create_supabase_client_with_jwt(jwt_token)
    tools_data: List[ToolResponseSchema] = []
    agent_tools_res = user_supabase_client.table("agent_tools").select("tool_id").eq("agent_id", agent_id).execute()
    if agent_tools_res.data:
        tool_ids = [item['tool_id'] for item in agent_tools_res.data]
        if tool_ids:
            str_tool_ids = [str(tid) for tid in tool_ids]
            tools_res = user_supabase_client.table("tools").select("*, parameters:tool_parameters(*)").in_("id", str_tool_ids).execute()
            if tools_res.data:
                for tool_db_data in tools_res.data:
                    if "parameters" not in tool_db_data or tool_db_data["parameters"] is None:
                        params_res = user_supabase_client.table("tool_parameters").select("*").eq("tool_id", str(tool_db_data["id"])).order("created_at").execute()
                        tool_db_data["parameters"] = params_res.data if params_res.data else []
                    tools_data.append(ToolResponseSchema.model_validate(tool_db_data))
    return tools_data


def _get_knowledge_base_ids_for_agent(agent_id: str, jwt_token: str) -> List[str]:
    user_supabase_client = create_supabase_client_with_jwt(jwt_token)
    response = user_supabase_client.table("agent_knowledge_bases").select("knowledge_base_id").eq("agent_id", agent_id).execute()
    if response.data:
        return [str(item['knowledge_base_id']) for item in response.data]
    return []


def _construct_agent_response(agent_data: Dict[str, Any], jwt_token: str) -> Agent:
    agent_id = str(agent_data['id'])
    agent_data['tools'] = _fetch_tools_for_agent(agent_id, jwt_token)
    agent_data['knowledge_base_ids'] = _get_knowledge_base_ids_for_agent(agent_id, jwt_token)
    return Agent.model_validate(agent_data)


def create_agent(agent_payload: AgentCreate, current_user: User, jwt_token: str) -> Agent:
    user_supabase_client = create_supabase_client_with_jwt(jwt_token)
    agent_dict = agent_payload.model_dump(exclude_unset=True)
    agent_dict['user_id'] = str(current_user.id)

    tool_ids_to_associate = agent_dict.pop('tool_ids', [])
    knowledge_base_ids = agent_dict.pop('knowledge_base_ids', [])

    for key in ['security_config', 'planner_config', 'code_executor_config', 'input_schema', 'output_schema']:
        if key in agent_dict and agent_dict[key] is not None:
            agent_dict[key] = json.dumps(agent_dict[key])

    response = user_supabase_client.table("agents").insert(agent_dict).execute()
    if not response.data:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to create agent.")

    created_agent_data = response.data[0]
    agent_id = str(created_agent_data['id'])

    if tool_ids_to_associate:
        for tool_id in tool_ids_to_associate:
            add_tool_to_agent(agent_id, str(tool_id), current_user, jwt_token)

    if knowledge_base_ids:
        for kb_id in knowledge_base_ids:
            user_supabase_client.table("agent_knowledge_bases").insert({
                "agent_id": agent_id,
                "knowledge_base_id": kb_id
            }).execute()

    return _construct_agent_response(created_agent_data, jwt_token)


def get_all_agents(current_user: User, jwt_token: str) -> List[Agent]:
    user_supabase_client = create_supabase_client_with_jwt(jwt_token)
    response = user_supabase_client.table("agents").select("*").eq("user_id", current_user.id).execute()
    if not response.data:
        return []
    return [_construct_agent_response(agent_data, jwt_token) for agent_data in response.data]


def get_agent_by_id(agent_id: str, current_user: User, jwt_token: str) -> Optional[Agent]:
    user_supabase_client = create_supabase_client_with_jwt(jwt_token)
    response = user_supabase_client.table("agents").select("*").eq("id", agent_id).eq("user_id", current_user.id).maybe_single().execute()
    if not response.data:
        return None
    return _construct_agent_response(response.data, jwt_token)


def update_agent(agent_id: str, agent_update: AgentUpdate, current_user: User, jwt_token: str) -> Agent:
    user_supabase_client = create_supabase_client_with_jwt(jwt_token)
    agent_check_response = user_supabase_client.table("agents").select("id, user_id").eq("id", agent_id).eq("user_id", current_user.id).maybe_single().execute()
    if not agent_check_response.data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Agent not found or not authorized")

    if agent_update.tool_ids is not None:
        user_supabase_client.table("agent_tools").delete().eq("agent_id", agent_id).execute()
        if agent_update.tool_ids:
            for tool_id in agent_update.tool_ids:
                add_tool_to_agent(agent_id, str(tool_id), current_user, jwt_token)

    update_data = agent_update.model_dump(exclude_unset=True, exclude_none=True)
    if 'tool_ids' in update_data:
        del update_data['tool_ids']

    if 'knowledge_base_ids' in update_data:
        user_supabase_client.table("agent_knowledge_bases").delete().eq("agent_id", agent_id).execute()
        kb_ids = update_data.pop('knowledge_base_ids', [])
        for kb_id in kb_ids:
            user_supabase_client.table("agent_knowledge_bases").insert({
                "agent_id": agent_id,
                "knowledge_base_id": kb_id
            }).execute()

    for key in ['security_config', 'planner_config', 'code_executor_config', 'input_schema', 'output_schema']:
        if key in update_data and update_data[key] is not None:
            update_data[key] = json.dumps(update_data[key])

    if update_data:
        response = user_supabase_client.table("agents").update(update_data).eq("id", agent_id).execute()
        if not response.data:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to update agent.")

    updated_agent = get_agent_by_id(agent_id, current_user, jwt_token)
    if not updated_agent:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Agent not found after update")
    return updated_agent


def delete_agent(agent_id: str, current_user: User, jwt_token: str) -> None:
    user_supabase_client = create_supabase_client_with_jwt(jwt_token)
    response = user_supabase_client.table("agents").delete().eq("id", agent_id).eq("user_id", current_user.id).execute()
    if not response.data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Agent not found or failed to delete.")
    return None


def add_tool_to_agent(agent_id: str, tool_id: str, current_user: User, jwt_token: str) -> Dict[str, Any]:
    user_supabase_client = create_supabase_client_with_jwt(jwt_token)
    agent_res = user_supabase_client.table("agents").select("id").eq("id", agent_id).eq("user_id", current_user.id).maybe_single().execute()
    if not agent_res.data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Agent not found or not authorized.")

    tool_res = user_supabase_client.rpc('get_accessible_tools', {'p_user_id': str(current_user.id)}).eq('id', tool_id).maybe_single().execute()
    if not tool_res.data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Tool not found or not accessible.")

    association = {"agent_id": agent_id, "tool_id": tool_id}
    response = user_supabase_client.table("agent_tools").insert(association).execute()
    if response.data:
        return response.data[0]
    raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to associate tool.")


def remove_tool_from_agent(agent_id: str, tool_id: str, current_user: User, jwt_token: str) -> Dict[str, str]:
    user_supabase_client = create_supabase_client_with_jwt(jwt_token)
    response = user_supabase_client.table("agent_tools").delete().eq("agent_id", agent_id).eq("tool_id", tool_id).execute()
    if response.data and len(response.data) > 0:
        return {"message": "Tool successfully disassociated from agent."}
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Tool association not found or action prevented.")


def get_agent_tools(agent_id: str, current_user: User, jwt_token: str) -> List[ToolResponseSchema]:
    user_supabase_client = create_supabase_client_with_jwt(jwt_token)
    agent_res = user_supabase_client.table("agents").select("id").eq("id", agent_id).eq("user_id", current_user.id).maybe_single().execute()
    if not agent_res.data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Agent not found or not authorized.")
    return _fetch_tools_for_agent(agent_id=agent_id, jwt_token=jwt_token)

router = APIRouter(
    prefix="/agents",
    tags=["Agents"],
)

@router.post("/", response_model=Agent, status_code=status.HTTP_201_CREATED)
def create_new_agent(agent_payload: AgentCreate, user_data: CurrentUserWithToken = Depends(get_current_user_and_token)):
    return create_agent(agent_payload=agent_payload, current_user=user_data.user, jwt_token=user_data.jwt_token)

@router.get("/", response_model=List[Agent])
def list_all_agents(user_data: CurrentUserWithToken = Depends(get_current_user_and_token)):
    return get_all_agents(current_user=user_data.user, jwt_token=user_data.jwt_token)

@router.get("/{agent_id}", response_model=Agent)
def get_single_agent(agent_id: str, user_data: CurrentUserWithToken = Depends(get_current_user_and_token)):
    agent = get_agent_by_id(agent_id=agent_id, current_user=user_data.user, jwt_token=user_data.jwt_token)
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found or not authorized")
    return agent

@router.patch("/{agent_id}", response_model=Agent)
def update_existing_agent(agent_id: str, agent_update: AgentUpdate, user_data: CurrentUserWithToken = Depends(get_current_user_and_token)):
    return update_agent(
        agent_id=agent_id,
        agent_update=agent_update,
        current_user=user_data.user,
        jwt_token=user_data.jwt_token
    )

@router.delete("/{agent_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_agent_by_id(agent_id: str, user_data: CurrentUserWithToken = Depends(get_current_user_and_token)):
    delete_agent(agent_id=agent_id, current_user=user_data.user, jwt_token=user_data.jwt_token)
    return

@router.post("/{agent_id}/tools/{tool_id}", status_code=status.HTTP_201_CREATED, response_model=Dict[str, Any])
def associate_tool_with_agent(
    agent_id: str,
    tool_id: str,
    user_data: CurrentUserWithToken = Depends(get_current_user_and_token)
):
    try:
        result = add_tool_to_agent(
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
        result = remove_tool_from_agent(
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
        tools = get_agent_tools(agent_id=agent_id, current_user=user_data.user, jwt_token=user_data.jwt_token)
        return tools
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An unexpected error occurred while listing agent tools: {str(e)}"
        )
