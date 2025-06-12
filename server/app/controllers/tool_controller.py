# server/app/controllers/tool_controller.py
from uuid import UUID
from typing import List, Optional, Dict, Any
from datetime import datetime

from ..supabase_client import supabase
from ..schemas.tool_schemas import (
    ToolCreateRequestSchema,
    ToolResponseSchema,
    ToolParameterCreateSchema,
    ToolParameterResponseSchema,
    ToolUpdateRequestSchema,
    PaginatedToolResponseSchema
)
from fastapi import HTTPException, status

class ToolController:
    async def _get_tool_and_parameters(self, tool_id: UUID, user_id: Optional[UUID] = None) -> Optional[ToolResponseSchema]:
        """
        Helper function to fetch a single tool and its parameters.
        If user_id is provided, it implies an RLS check might be relevant if not using service key.
        For now, service key bypasses RLS for direct fetches like this.
        """
        tool_res = supabase.table("tools").select("*").eq("id", str(tool_id)).execute()
        if not tool_res.data:
            return None
        
        tool_db_data = tool_res.data[0]

        params_res = supabase.table("tool_parameters").select("*").eq("tool_id", str(tool_id)).order("created_at").execute()
        
        tool_db_data["parameters"] = params_res.data
        return ToolResponseSchema.model_validate(tool_db_data) # Pydantic v2
        # return ToolResponseSchema.parse_obj(tool_db_data) # Pydantic v1

    async def create_tool(self, tool_data: ToolCreateRequestSchema, user_id: UUID) -> ToolResponseSchema:
        # 1. Create the main tool entry
        tool_insert_data = {
            "user_id": str(user_id),
            "name": tool_data.name,
            "description": tool_data.description,
            "return_type_schema": tool_data.return_type_schema,
            "is_system_tool": False # User-created tools are not system tools
        }
        
        try:
            tool_res = supabase.table("tools").insert(tool_insert_data).execute()
        except Exception as e: # Catch potential Supabase/DB errors (e.g., unique constraint)
            # Log the error e
            if "unique constraint" in str(e).lower() and "unique_user_tool_name" in str(e).lower():
                 raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail=f"A tool with the name '{tool_data.name}' already exists for this user."
                )
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to create tool: {str(e)}"
            )

        if not tool_res.data:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Could not create tool entry.")
        
        created_tool_id_str = tool_res.data[0]['id']
        created_tool_id = UUID(created_tool_id_str)

        # 2. Create tool parameters
        created_parameters_data = []
        if tool_data.parameters:
            for param_schema in tool_data.parameters:
                param_insert_data = {
                    "tool_id": created_tool_id_str,
                    "name": param_schema.name,
                    "type": param_schema.type,
                    "description": param_schema.description,
                    "default_value": param_schema.default_value,
                    "is_required": param_schema.is_required
                }
                try:
                    param_res = supabase.table("tool_parameters").insert(param_insert_data).execute()
                    if param_res.data:
                        created_parameters_data.append(param_res.data[0])
                    else:
                        # This indicates a partial failure. Ideally, we'd roll back the tool creation.
                        # For now, raise an error.
                        # Consider deleting the just-created tool if parameters fail.
                        supabase.table("tools").delete().eq("id", created_tool_id_str).execute() # Attempt rollback
                        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Could not create parameter: {param_schema.name}")
                except Exception as e:
                     # Attempt rollback
                    supabase.table("tools").delete().eq("id", created_tool_id_str).execute()
                    if "unique constraint" in str(e).lower() and "unique_tool_parameter_name" in str(e).lower():
                        raise HTTPException(
                            status_code=status.HTTP_409_CONFLICT,
                            detail=f"A parameter with the name '{param_schema.name}' already exists for this tool."
                        )
                    raise HTTPException(
                        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                        detail=f"Failed to create parameter '{param_schema.name}': {str(e)}"
                    )
        
        # 3. Fetch and return the complete tool with parameters
        # The tool_res.data[0] might not have all fields correctly typed for Pydantic (e.g. UUIDs, datetimes)
        # and it won't have the parameters nested. So, we re-fetch.
        complete_tool = await self._get_tool_and_parameters(tool_id=created_tool_id)
        if not complete_tool:
             # This should ideally not happen if creation was successful
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to retrieve created tool.")
        return complete_tool

    async def get_tool(self, tool_id: UUID, user_id: UUID) -> Optional[ToolResponseSchema]:
        # RLS: Users can only get their own tools or system tools.
        # The service key bypasses RLS, so logic here must enforce it if not relying on endpoint RLS.
        # For simplicity, assuming endpoint will handle auth and pass user_id for ownership check.
        
        # First, try to get it as a user-owned tool
        query = supabase.table("tools").select("*, tool_parameters(*)").eq("id", str(tool_id)).eq("user_id", str(user_id))
        
        # If we want to allow fetching system tools as well:
        # query = supabase.table("tools").select("*, tool_parameters(*)") \
        # .eq("id", str(tool_id)) \
        # .or_(f"user_id.eq.{str(user_id)},is_system_tool.eq.true")

        tool_res = query.execute()

        if not tool_res.data:
            # Check if it's a system tool the user might have access to
            system_tool_res = supabase.table("tools").select("*, tool_parameters(*)").eq("id", str(tool_id)).eq("is_system_tool", True).execute()
            if not system_tool_res.data:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Tool not found or access denied.")
            db_data = system_tool_res.data[0]
        else:
            db_data = tool_res.data[0]
            
        # Ensure parameters are ordered if not done by default by Supabase join/select
        if 'tool_parameters' in db_data and db_data['tool_parameters']:
            db_data['tool_parameters'] = sorted(db_data['tool_parameters'], key=lambda p: p['created_at'])
            
        return ToolResponseSchema.model_validate(db_data) # Pydantic v2
        # return ToolResponseSchema.parse_obj(db_data) # Pydantic v1

    async def list_tools(
        self, 
        user_id: UUID, 
        page: int = 1, 
        size: int = 20,
        include_system_tools: bool = True
    ) -> PaginatedToolResponseSchema:
        offset = (page - 1) * size
        
        query = supabase.table("tools").select("*, tool_parameters(*)", count="exact")
        
        if include_system_tools:
            query = query.or_(f"user_id.eq.{str(user_id)},is_system_tool.eq.true")
        else:
            query = query.eq("user_id", str(user_id))
            
        tools_res = query.order("updated_at", desc=True).range(offset, offset + size - 1).execute()

        if tools_res.data is None: # Can happen if error or no data
            items_data = []
        else:
            items_data = tools_res.data

        # Sort parameters for each tool
        for tool_dict in items_data:
            if 'tool_parameters' in tool_dict and tool_dict['tool_parameters']:
                tool_dict['tool_parameters'] = sorted(tool_dict['tool_parameters'], key=lambda p: p['created_at'])

        items = [ToolResponseSchema.model_validate(t) for t in items_data] # Pydantic v2
        # items = [ToolResponseSchema.parse_obj(t) for t in items_data] # Pydantic v1
        
        total_count = tools_res.count if tools_res.count is not None else 0
        
        return PaginatedToolResponseSchema(
            items=items,
            total=total_count,
            page=page,
            size=size,
            pages=(total_count + size - 1) // size if size > 0 else 0
        )

    async def update_tool(
        self, 
        tool_id: UUID, 
        tool_data: ToolUpdateRequestSchema, 
        user_id: UUID
    ) -> ToolResponseSchema:
        # Verify the tool exists and belongs to the user (and is not a system tool)
        existing_tool_res = supabase.table("tools").select("id, user_id, is_system_tool").eq("id", str(tool_id)).execute()
        if not existing_tool_res.data:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Tool not found.")
        
        existing_tool = existing_tool_res.data[0]
        if existing_tool["user_id"] != str(user_id):
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="User does not have permission to update this tool.")
        if existing_tool["is_system_tool"]:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="System tools cannot be modified.")

        update_payload = tool_data.model_dump(exclude_unset=True) # Pydantic v2
        # update_payload = tool_data.dict(exclude_unset=True) # Pydantic v1
        
        # Handle parameters update: delete old ones, insert new ones if provided
        if 'parameters' in update_payload and update_payload['parameters'] is not None:
            new_parameters_schemas = update_payload.pop('parameters') # Remove from tool update payload
            
            # Delete existing parameters for this tool
            supabase.table("tool_parameters").delete().eq("tool_id", str(tool_id)).execute()
            
            # Insert new parameters
            for param_schema_data in new_parameters_schemas:
                # param_schema = ToolParameterCreateSchema(**param_schema_data) # Already validated by ToolUpdateRequestSchema
                param_insert_data = {
                    "tool_id": str(tool_id),
                    "name": param_schema_data['name'], # Access dict keys
                    "type": param_schema_data['type'],
                    "description": param_schema_data.get('description'),
                    "default_value": param_schema_data.get('default_value'),
                    "is_required": param_schema_data.get('is_required', True)
                }
                try:
                    supabase.table("tool_parameters").insert(param_insert_data).execute()
                except Exception as e:
                    # This is tricky: tool update might be partially applied.
                    # For simplicity, we raise. A more robust solution might involve transactions or compensating actions.
                    if "unique constraint" in str(e).lower() and "unique_tool_parameter_name" in str(e).lower():
                         raise HTTPException(
                            status_code=status.HTTP_409_CONFLICT,
                            detail=f"A parameter with the name '{param_schema_data['name']}' already exists for this tool version."
                        )
                    raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Failed to update parameter {param_schema_data['name']}: {str(e)}")
        
        if update_payload: # If there's anything left to update in the tool itself
            try:
                updated_tool_res = supabase.table("tools").update(update_payload).eq("id", str(tool_id)).execute()
                if not updated_tool_res.data:
                    raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to update tool details.")
            except Exception as e:
                if "unique constraint" in str(e).lower() and "unique_user_tool_name" in str(e).lower():
                    raise HTTPException(
                        status_code=status.HTTP_409_CONFLICT,
                        detail=f"A tool with the name '{tool_data.name}' already exists for this user."
                    )
                raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error updating tool: {str(e)}")

        complete_tool = await self._get_tool_and_parameters(tool_id=tool_id)
        if not complete_tool:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to retrieve updated tool.")
        return complete_tool

    async def delete_tool(self, tool_id: UUID, user_id: UUID) -> Dict[str, str]:
        # Verify the tool exists and belongs to the user (and is not a system tool)
        existing_tool_res = supabase.table("tools").select("id, user_id, is_system_tool").eq("id", str(tool_id)).execute()
        if not existing_tool_res.data:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Tool not found.")
        
        existing_tool = existing_tool_res.data[0]
        if existing_tool["user_id"] != str(user_id):
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="User does not have permission to delete this tool.")
        if existing_tool["is_system_tool"]:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="System tools cannot be deleted.")

        # Parameters will be deleted by ON DELETE CASCADE constraint
        deleted_res = supabase.table("tools").delete().eq("id", str(tool_id)).execute()

        if not deleted_res.data: # Should return the deleted record(s)
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to delete tool.")
            
        return {"message": "Tool deleted successfully"}

tool_controller = ToolController()
