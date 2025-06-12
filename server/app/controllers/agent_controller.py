from typing import List, Optional, Dict, Any
from fastapi import HTTPException, status
from postgrest import APIError 
import uuid 

from app.models.user_model import User # Added import
from ..models.agent import Agent, AgentUpdate
from ..schemas.tool_schemas import ToolResponseSchema # Added import
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
            # Ensure tool_ids are strings for the 'in' filter
            str_tool_ids = [str(tid) for tid in tool_ids]
            tools_res = user_supabase_client.table("tools").select("*, parameters:tool_parameters(*)").in_("id", str_tool_ids).execute()
            if tools_res.data:
                for tool_db_data in tools_res.data:
                    if "parameters" not in tool_db_data or tool_db_data["parameters"] is None:
                         params_res = user_supabase_client.table("tool_parameters").select("*").eq("tool_id", str(tool_db_data["id"])).order("created_at").execute()
                         tool_db_data["parameters"] = params_res.data if params_res.data else []
                    
                    tools_data.append(ToolResponseSchema.model_validate(tool_db_data))
    return tools_data

# Helper function to get agent data and its tools
def _get_agent_data_with_tools(agent_id: str, current_user: User, jwt_token: str) -> Optional[Dict[str, Any]]:
    """Fetches agent data and its associated tools."""
    user_supabase_client = create_supabase_client_with_jwt(jwt_token)
    try:
        # Validate agent_id format
        uuid.UUID(agent_id)
    except ValueError:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Invalid agent ID format.")

    agent_response = user_supabase_client.table("agents").select("*", count="exact").eq("id", agent_id).eq("user_id", current_user.id).maybe_single().execute()

    if not agent_response.data:
        return None

    agent_data = agent_response.data
    # Pass jwt_token to _fetch_tools_for_agent
    agent_data['tools'] = _fetch_tools_for_agent(agent_id=agent_id, jwt_token=jwt_token)
    return agent_data

def create_agent(agent_payload: Agent, current_user: User, jwt_token: str) -> Agent:
    """
    Creates a new agent in the Supabase database.
    The user_id is taken from the authenticated user (JWT token).
    `id`, `created_at`, `updated_At` are handled by the database.
    """
    user_supabase_client = create_supabase_client_with_jwt(jwt_token)
    try:
        agent_dict_to_insert = agent_payload.model_dump(
            exclude={'id', 'createdAt', 'updatedAt', 'user_id', 'tools'}, 
            exclude_none=True 
        )
        agent_dict_to_insert['user_id'] = current_user.id
        
        response = user_supabase_client.table("agents").insert(agent_dict_to_insert).execute()
        
        if response.data:
            created_agent_data = response.data[0]
            created_agent_data["tools"] = [] 
            return Agent.model_validate(created_agent_data)
        else:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,                detail="Failed to create agent: No data returned from database."
            )

    except APIError as e:
        if "23505" in str(e.code): 
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=f"Agent creation conflict: {e.message}")
        elif "23503" in str(e.code): # foreign_key_violation
             raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=f"Invalid reference (e.g., user_id not found): {e.message}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Database error during agent creation: {e.message}")
    except HTTPException: # Re-raise HTTPException if it's already one
        raise
    except Exception as e: # Catch any other unexpected errors
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"An unexpected error occurred during agent creation: {str(e)}")

def get_all_agents(current_user: User, jwt_token: str) -> List[Agent]:
    user_supabase_client = create_supabase_client_with_jwt(jwt_token)
    try:
        response = user_supabase_client.table("agents").select("*").eq("user_id", current_user.id).execute()
        agents_data = []
        if response.data:
            for agent_db_data in response.data:
                # Pass jwt_token to _fetch_tools_for_agent
                agent_db_data["tools"] = _fetch_tools_for_agent(agent_id=agent_db_data["id"], jwt_token=jwt_token)
                agents_data.append(Agent.model_validate(agent_db_data))
        return agents_data
    except APIError as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Database error: {e.message}")
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Unexpected error: {str(e)}")

def get_agent_by_id(agent_id: str, current_user: User, jwt_token: str) -> Optional[Agent]:
    try:
        # Pass jwt_token to _get_agent_data_with_tools
        agent_data_with_tools = _get_agent_data_with_tools(agent_id=agent_id, current_user=current_user, jwt_token=jwt_token)
        if not agent_data_with_tools:
            return None
        return Agent.model_validate(agent_data_with_tools)
    except APIError as e: 
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Database error: {e.message}")
    except HTTPException: 
        raise
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Unexpected error: {str(e)}")

def update_agent(agent_id: str, agent_update: AgentUpdate, current_user: User, jwt_token: str) -> Optional[Agent]:
    """
    Updates an agent by its ID, ensuring it belongs to the given user_id.
    `user_id` cannot be changed via this method.
    """
    user_supabase_client = create_supabase_client_with_jwt(jwt_token)
    try:
        # Validate agent_id format
        try:
            uuid.UUID(agent_id)
        except ValueError:
            raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Invalid agent ID format.")

        # Pass jwt_token to _get_agent_data_with_tools
        existing_agent_data = _get_agent_data_with_tools(agent_id=agent_id, current_user=current_user, jwt_token=jwt_token)
        if not existing_agent_data:
            return None 

        update_data = agent_update.model_dump(exclude_unset=True, exclude={'id', 'user_id', 'createdAt', 'updatedAt', 'tools'})

        if not update_data:
            return Agent.model_validate(existing_agent_data) # Return existing if no actual updates

        response = user_supabase_client.table("agents").update(update_data).eq("id", agent_id).eq("user_id", current_user.id).execute()

        if response.data:
            # Pass jwt_token to _get_agent_data_with_tools for re-fetching
            updated_agent_full_data = _get_agent_data_with_tools(agent_id=agent_id, current_user=current_user, jwt_token=jwt_token)
            if not updated_agent_full_data: 
                 raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to retrieve agent after update.")
            return Agent.model_validate(updated_agent_full_data)
        else:
            # This case might also indicate that the agent was not found for the user_id during update, or RLS prevented it.
            # Or simply no data was returned despite a successful operation (less common for update with returning data).
            # Consider if a 404 might be more appropriate if the update affected 0 rows due to not matching user_id.
            # However, the .eq("user_id", user_id) should handle this. If it's not found, response.data would be empty.
            # If the agent_id exists but not for this user, it also results in empty data.
            # So, if existing_agent_data was found, but update yields no data, it's an issue.
            # If existing_agent_data was NOT found, we'd have returned None already.
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Agent not found or update failed.")
            
    except APIError as e:
        if "23505" in str(e.code): # unique_violation (e.g. agent name for that user)
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=f"Agent update conflict: {e.message}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Database error: {e.message}")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Unexpected error: {str(e)}")

def delete_agent(agent_id: str, current_user: User, jwt_token: str) -> bool:
    """
    Deletes an agent by its ID. Returns True if deletion was successful.
    Ensures the agent belongs to the given user_id.
    """
    try:
        # Validate agent_id format
        try:
            uuid.UUID(agent_id)
        except ValueError:
            raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Invalid agent ID format.")
            
        user_supabase_client = create_supabase_client_with_jwt(jwt_token)
        response = user_supabase_client.table("agents").delete().eq("id", agent_id).eq("user_id", current_user.id).execute()
        
        if response.data and len(response.data) > 0:
            return True
        else:
            # Agent not found for this user_id or RLS prevented (though service_key bypasses RLS for write)
            return False
            
    except APIError as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Database error: {e.message}")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Unexpected error: {str(e)}")

# --- Agent-Tool Association Functions ---

def add_tool_to_agent(agent_id: str, tool_id: str, current_user: User, jwt_token: str) -> Dict[str, Any]:
    """Associates a tool with an agent."""
    try:
        uuid.UUID(agent_id)
        uuid.UUID(tool_id)
    except ValueError:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Invalid agent or tool ID format.")

    # 1. Verify agent exists and belongs to the user
    user_supabase_client = create_supabase_client_with_jwt(jwt_token)
    agent_res = user_supabase_client.table("agents").select("id").eq("id", agent_id).eq("user_id", current_user.id).maybe_single().execute()
    if not agent_res.data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Agent not found or not authorized.")

    # 2. Verify tool exists and is accessible (either system tool or user's own tool)
    tool_res = user_supabase_client.table("tools").select("id, user_id, is_system_tool").eq("id", tool_id).maybe_single().execute()
    if not tool_res.data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Tool not found.")
    
    tool_data = tool_res.data
    if not tool_data["is_system_tool"] and tool_data["user_id"] != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="User does not have permission to use this tool.")

    # 3. Create association
    try:
        assoc_data = {"agent_id": agent_id, "tool_id": tool_id, "user_id": current_user.id} # user_id here refers to the agent's owner, should be consistent
        response = user_supabase_client.table("agent_tools").insert(assoc_data).execute()
        if response.data:
            return {"message": "Tool successfully associated with agent", "association": response.data[0]}
        else: 
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to create tool association.")
    except APIError as e:
        if "23505" in str(e.code): 
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Tool is already associated with this agent.")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Database error: {e.message}")
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Unexpected error: {str(e)}")


def remove_tool_from_agent(agent_id: str, tool_id: str, current_user: User, jwt_token: str) -> Dict[str, str]:
    """Disassociates a tool from an agent."""
    try:
        uuid.UUID(agent_id)
        uuid.UUID(tool_id)
    except ValueError:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Invalid agent or tool ID format.")

    user_supabase_client = create_supabase_client_with_jwt(jwt_token)
    try:
        # First, verify the agent belongs to the user to ensure authorization for this action
        # This check was present in the previous version and is good practice, though RLS should also enforce it.
        agent_check_res = user_supabase_client.table("agents").select("id").eq("id", agent_id).eq("user_id", current_user.id).maybe_single().execute()
        if not agent_check_res.data:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Agent not found or user not authorized to modify this agent's tools.")

        response = user_supabase_client.table("agent_tools").delete().match({"agent_id": agent_id, "tool_id": tool_id}).execute()
        
        if response.data and len(response.data) > 0:
            return {"message": "Tool successfully disassociated from agent."}
        else:
            # This could mean the association didn't exist, or RLS prevented the delete for a reason other than agent ownership (e.g. tool RLS)
            # For simplicity, keeping the 404, but a more granular error might be useful in a complex scenario.
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Tool association not found or action prevented.")
            
    except APIError as e:
        # Log the error for debugging purposes
        # print(f"Database error in remove_tool_from_agent: {e}") 
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Database error: {e.message}")
    except HTTPException: # Re-raise HTTPExceptions explicitly if they were raised internally
        raise
    except Exception as e:
        # Log the error for debugging purposes
        # print(f"Unexpected error in remove_tool_from_agent: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"An unexpected error occurred: {str(e)}")

def get_agent_tools(agent_id: str, current_user: User, jwt_token: str) -> List[ToolResponseSchema]:
    """Retrieves all tools associated with a specific agent."""
    user_supabase_client = create_supabase_client_with_jwt(jwt_token)
    try:
        uuid.UUID(agent_id)
    except ValueError:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Invalid agent ID format.")

    # Use user_supabase_client for the agent check
    agent_res = user_supabase_client.table("agents").select("id").eq("id", agent_id).eq("user_id", current_user.id).maybe_single().execute()
    if not agent_res.data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Agent not found or not authorized.")
        
    # Pass jwt_token to _fetch_tools_for_agent
    return _fetch_tools_for_agent(agent_id=agent_id, jwt_token=jwt_token)
