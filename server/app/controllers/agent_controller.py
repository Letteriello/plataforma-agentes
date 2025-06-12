from typing import List, Optional, Dict, Any
from fastapi import HTTPException, status
from postgrest import APIError
import uuid
import json

from app.models.user_model import User
from ..models.agent import Agent, AgentUpdate
from ..schemas.tool_schemas import ToolResponseSchema
from ..supabase_client import create_supabase_client_with_jwt

# Helper function to fetch tools for a given agent_id
def _fetch_tools_for_agent(agent_id: str, jwt_token: str) -> List[ToolResponseSchema]:
    user_supabase_client = create_supabase_client_with_jwt(jwt_token)
    tools_data = []
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

# Helper function to fetch knowledge base IDs for a given agent_id
def _get_knowledge_base_ids_for_agent(agent_id: str, jwt_token: str) -> List[str]:
    user_supabase_client = create_supabase_client_with_jwt(jwt_token)
    response = user_supabase_client.table("agent_knowledge_bases").select("knowledge_base_id").eq("agent_id", agent_id).execute()
    if response.data:
        return [str(item['knowledge_base_id']) for item in response.data]
    return []

# Helper function to construct the full Agent object
def _construct_agent_response(agent_data: Dict[str, Any], jwt_token: str) -> Agent:
    agent_id = str(agent_data['id'])
    agent_data['tools'] = _fetch_tools_for_agent(agent_id, jwt_token)
    agent_data['knowledge_base_ids'] = _get_knowledge_base_ids_for_agent(agent_id, jwt_token)
    return Agent.model_validate(agent_data)

def create_agent(agent_payload: Agent, current_user: User, jwt_token: str) -> Agent:
    user_supabase_client = create_supabase_client_with_jwt(jwt_token)
    
    agent_dict = agent_payload.model_dump(exclude_unset=True)
    agent_dict['user_id'] = str(current_user.id)
    
    tools = agent_dict.pop('tools', [])
    knowledge_base_ids = agent_dict.pop('knowledge_base_ids', [])

    for key in ['security_config', 'planner_config', 'code_executor_config', 'input_schema', 'output_schema']:
        if key in agent_dict and agent_dict[key] is not None:
            agent_dict[key] = json.dumps(agent_dict[key])

    response = user_supabase_client.table("agents").insert(agent_dict).execute()
    
    if not response.data:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to create agent.")
        
    created_agent_data = response.data[0]
    agent_id = str(created_agent_data['id'])

    if tools:
        tool_ids = [tool.id for tool in tools if tool.id]
        for tool_id in tool_ids:
            add_tool_to_agent(agent_id, tool_id, current_user, jwt_token)

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
    
    existing_agent = get_agent_by_id(agent_id, current_user, jwt_token)
    if not existing_agent:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Agent not found or not authorized")

    update_data = agent_update.model_dump(exclude_unset=True)

    if 'tools' in update_data:
        user_supabase_client.table("agent_tools").delete().eq("agent_id", agent_id).execute()
        tool_ids = [tool.id for tool in update_data.pop('tools', []) if tool.id]
        for tool_id in tool_ids:
            add_tool_to_agent(agent_id, tool_id, current_user, jwt_token)

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
    else:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to associate tool.")

def remove_tool_from_agent(agent_id: str, tool_id: str, current_user: User, jwt_token: str) -> Dict[str, str]:
    user_supabase_client = create_supabase_client_with_jwt(jwt_token)
    
    response = user_supabase_client.table("agent_tools").delete().eq("agent_id", agent_id).eq("tool_id", tool_id).execute()
    
    if response.data and len(response.data) > 0:
        return {"message": "Tool successfully disassociated from agent."}
    else:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Tool association not found or action prevented.")

def get_agent_tools(agent_id: str, current_user: User, jwt_token: str) -> List[ToolResponseSchema]:
    user_supabase_client = create_supabase_client_with_jwt(jwt_token)

    agent_res = user_supabase_client.table("agents").select("id").eq("id", agent_id).eq("user_id", current_user.id).maybe_single().execute()
    if not agent_res.data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Agent not found or not authorized.")
        
    return _fetch_tools_for_agent(agent_id=agent_id, jwt_token=jwt_token)