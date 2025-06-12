from typing import List, Optional, Dict, Any
from fastapi import HTTPException, status
from postgrest import APIError
import uuid

from app.models.user_model import User
from ..models.agent import Agent, AgentUpdate
from ..schemas.tool_schemas import ToolResponseSchema
from ..supabase_client import create_supabase_client_with_jwt

# Helper function to fetch tools for a given agent_id
def _fetch_tools_for_agent(agent_id: str, jwt_token: str) -> List[ToolResponseSchema]:
    user_supabase_client = create_supabase_client_with_jwt(jwt_token)
    tools_data = []
    # 1. Get tool_ids associated with the agent
    agent_tools_res = user_supabase_client.table("agent_tools").select("tool_id").eq("agent_id", agent_id).execute()
    
    if agent_tools_res.data:
        tool_ids = [item['tool_id'] for item in agent_tools_res.data]
        if tool_ids:
            # 2. Fetch details for these tool_ids
            str_tool_ids = [str(tid) for tid in tool_ids]
            tools_res = user_supabase_client.table("tools").select("*, parameters:tool_parameters(*)").in_("id", str_tool_ids).execute()
            if tools_res.data:
                for tool_db_data in tools_res.data:
                    if "parameters" not in tool_db_data or tool_db_data["parameters"] is None:
                         params_res = user_supabase_client.table("tool_parameters").select("*").eq("tool_id", str(tool_db_data["id"])).order("created_at").execute()
                         tool_db_data["parameters"] = params_res.data if params_res.data else []
                    
                    tools_data.append(ToolResponseSchema.model_validate(tool_db_data))
    return tools_data

# Placeholder for a helper function we'll need soon
def _get_knowledge_base_ids_for_agent(agent_id: str, jwt_token: str) -> List[str]:
    # In the future, this will query the agent_knowledge_bases table
    # For now, it's a placeholder.
    print(f"Fetching knowledge base IDs for agent {agent_id}...") # Placeholder log
    # user_supabase_client = create_supabase_client_with_jwt(jwt_token)
    # response = user_supabase_client.table("agent_knowledge_bases").select("knowledge_base_id").eq("agent_id", agent_id).execute()
    # if response.data:
    #     return [item['knowledge_base_id'] for item in response.data]
    return [] # Placeholder return

# Helper function to get agent data and its tools and knowledge bases
def _get_agent_data_with_relations(agent_id: str, current_user: User, jwt_token: str) -> Optional[Dict[str, Any]]:
    """Fetches agent data and its associated tools and knowledge bases."""
    user_supabase_client = create_supabase_client_with_jwt(jwt_token)
    
    # Fetch the main agent data
    agent_res = user_supabase_client.table("agents").select("*").eq("id", agent_id).eq("user_id", str(current_user.id)).maybe_single().execute()
    if not agent_res.data:
        return None
    
    agent_data = agent_res.data
    
    # Fetch associated tools
    agent_data['tools'] = _fetch_tools_for_agent(agent_id=agent_id, jwt_token=jwt_token)
    
    # Fetch associated knowledge base IDs
    agent_data['knowledge_base_ids'] = _get_knowledge_base_ids_for_agent(agent_id=agent_id, jwt_token=jwt_token)
    
    return agent_data

def create_agent(agent_payload: Agent, current_user: User, jwt_token: str) -> Dict[str, Any]:
    user_supabase_client = create_supabase_client_with_jwt(jwt_token)

    # Separate relational data from the main agent data
    tools_data = agent_payload.tools
    knowledge_base_ids = agent_payload.knowledge_base_ids
    agent_dict = agent_payload.model_dump(exclude={'tools', 'knowledge_base_ids'})

    agent_dict['user_id'] = str(current_user.id)

    try:
        # Insert the main agent data
        response = user_supabase_client.table("agents").insert(agent_dict).execute()

        if not response.data or len(response.data) == 0:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to create agent: No data returned from DB")

        new_agent_data = response.data[0]
        agent_id = new_agent_data['id']

        # Handle tool associations
        if tools_data:
            tool_associations = []
            for tool in tools_data:
                tool_res = user_supabase_client.table("tools").select("id").eq("id", str(tool.id)).maybe_single().execute()
                if tool_res.data:
                    tool_associations.append({"agent_id": agent_id, "tool_id": str(tool.id)})
            
            if tool_associations:
                user_supabase_client.table("agent_tools").insert(tool_associations).execute()

        # TODO: Handle Knowledge Base associations
        if knowledge_base_ids:
            # This is a placeholder for future implementation.
            # We will need a new junction table: agent_knowledge_bases
            # For now, we can just log that we received the IDs.
            print(f"Agent {agent_id} to be associated with knowledge bases: {knowledge_base_ids}")
            # Example of what it would look like:
            # kb_associations = [{"agent_id": agent_id, "knowledge_base_id": kb_id} for kb_id in knowledge_base_ids]
            # if kb_associations:
            #     user_supabase_client.table("agent_knowledge_bases").insert(kb_associations).execute()

        # Fetch the complete agent data with relations to return
        final_agent_data = _get_agent_data_with_relations(agent_id=agent_id, current_user=current_user, jwt_token=jwt_token)
        if not final_agent_data:
             raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Newly created agent not found.")

        return final_agent_data

    except APIError as e:
        if "23505" in str(e.code): # unique_violation
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=f"Agent creation conflict: {e.message}")
        elif "23503" in str(e.code): # foreign_key_violation
             raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=f"Invalid reference (e.g., user_id not found): {e.message}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Database error during agent creation: {e.message}")
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"An unexpected error occurred during agent creation: {str(e)}")

def get_all_agents(current_user: User, jwt_token: str) -> List[Dict[str, Any]]:
    user_supabase_client = create_supabase_client_with_jwt(jwt_token)
    try:
        response = user_supabase_client.table("agents").select("*").eq("user_id", str(current_user.id)).execute()
        if response.data:
            agents_full_data = []
            for agent_data in response.data:
                # Fetch relations for each agent
                full_data = _get_agent_data_with_relations(agent_id=agent_data['id'], current_user=current_user, jwt_token=jwt_token)
                if full_data:
                    agents_full_data.append(full_data)
            return agents_full_data
        return []
    except APIError as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Database error: {e.message}")
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Unexpected error: {str(e)}")

def get_agent_by_id(agent_id: str, current_user: User, jwt_token: str) -> Optional[Dict[str, Any]]:
    try:
        uuid.UUID(agent_id)
    except ValueError:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Invalid agent ID format.")
    
    agent_data = _get_agent_data_with_relations(agent_id=agent_id, current_user=current_user, jwt_token=jwt_token)
    
    if not agent_data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Agent not found or not authorized.")
    
    return agent_data

def update_agent(agent_id: str, agent_update: AgentUpdate, current_user: User, jwt_token: str) -> Dict[str, Any]:
    user_supabase_client = create_supabase_client_with_jwt(jwt_token)

    # Separate relational data
    tools_data = agent_update.tools
    knowledge_base_ids = agent_update.knowledge_base_ids
    update_data = agent_update.model_dump(exclude_unset=True, exclude={'tools', 'knowledge_base_ids'})

    if not update_data and tools_data is None and knowledge_base_ids is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No update data provided.")

    try:
        # Verify agent ownership
        agent_res = user_supabase_client.table("agents").select("id").eq("id", agent_id).eq("user_id", str(current_user.id)).maybe_single().execute()
        if not agent_res.data:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Agent not found or not authorized")

        # Update main agent data
        if update_data:
            user_supabase_client.table("agents").update(update_data).eq("id", agent_id).execute()

        # Handle full replacement of tool associations
        if tools_data is not None:
            user_supabase_client.table("agent_tools").delete().eq("agent_id", agent_id).execute()
            if tools_data:
                new_associations = []
                for tool in tools_data:
                    tool_res = user_supabase_client.table("tools").select("id").eq("id", str(tool.id)).maybe_single().execute()
                    if tool_res.data:
                        new_associations.append({"agent_id": agent_id, "tool_id": str(tool.id)})
                if new_associations:
                    user_supabase_client.table("agent_tools").insert(new_associations).execute()

        # TODO: Handle full replacement of knowledge base associations
        if knowledge_base_ids is not None:
            # Placeholder for future implementation
            # 1. Delete existing associations from `agent_knowledge_bases`
            # 2. Create new associations
            print(f"Agent {agent_id} knowledge bases to be updated to: {knowledge_base_ids}")
            # Example:
            # user_supabase_client.table("agent_knowledge_bases").delete().eq("agent_id", agent_id).execute()
            # if knowledge_base_ids:
            #     kb_associations = [{"agent_id": agent_id, "knowledge_base_id": kb_id} for kb_id in knowledge_base_ids]
            #     user_supabase_client.table("agent_knowledge_bases").insert(kb_associations).execute()

        # Fetch and return the updated agent data
        final_agent_data = _get_agent_data_with_relations(agent_id=agent_id, current_user=current_user, jwt_token=jwt_token)
        if not final_agent_data:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Updated agent not found.")

        return final_agent_data

    except APIError as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Database error: {e.message}")
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"An unexpected error occurred: {str(e)}")

def delete_agent(agent_id: str, current_user: User, jwt_token: str) -> bool:
    user_supabase_client = create_supabase_client_with_jwt(jwt_token)
    try:
        uuid.UUID(agent_id)
    except ValueError:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Invalid agent ID format.")

    response = user_supabase_client.table("agents").delete().eq("id", agent_id).eq("user_id", str(current_user.id)).execute()
    
    if response.data:
        return True
    return False

def add_tool_to_agent(agent_id: str, tool_id: str, current_user: User, jwt_token: str) -> Dict[str, Any]:
    user_supabase_client = create_supabase_client_with_jwt(jwt_token)
    try:
        uuid.UUID(agent_id)
        uuid.UUID(tool_id)
    except ValueError:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Invalid agent or tool ID format.")

    # Verify agent ownership
    agent_res = user_supabase_client.table("agents").select("id").eq("id", agent_id).eq("user_id", current_user.id).maybe_single().execute()
    if not agent_res.data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Agent not found or not authorized.")

    # Verify tool accessibility (RLS on tools table handles this implicitly)
    tool_res = user_supabase_client.table("tools").select("id").eq("id", tool_id).maybe_single().execute()
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
    try:
        uuid.UUID(agent_id)
        uuid.UUID(tool_id)
    except ValueError:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Invalid agent or tool ID format.")

    # Agent ownership is checked by RLS on the agent_tools table during the delete operation.
    # The policy for agent_tools ensures the user owns the agent.
    response = user_supabase_client.table("agent_tools").delete().eq("agent_id", agent_id).eq("tool_id", tool_id).execute()
    
    if response.data and len(response.data) > 0:
        return {"message": "Tool successfully disassociated from agent."}
    else:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Tool association not found or action prevented.")

def get_agent_tools(agent_id: str, current_user: User, jwt_token: str) -> List[ToolResponseSchema]:
    user_supabase_client = create_supabase_client_with_jwt(jwt_token)
    try:
        uuid.UUID(agent_id)
    except ValueError:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Invalid agent ID format.")

    agent_res = user_supabase_client.table("agents").select("id").eq("id", agent_id).eq("user_id", current_user.id).maybe_single().execute()
    if not agent_res.data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Agent not found or not authorized.")
        
    return _fetch_tools_for_agent(agent_id=agent_id, jwt_token=jwt_token)
