# server/app/controllers/tool_controller.py
from uuid import UUID
from typing import List, Optional, Dict, Any
from datetime import datetime

from ..supabase_client import supabase, create_supabase_client_with_jwt 
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
    async def _get_tool_and_parameters(self, tool_id: UUID, jwt_token: str, user_id: Optional[UUID] = None) -> Optional[ToolResponseSchema]:
        """
        Helper function to fetch a single tool and its parameters.
        Uses user-scoped client via jwt_token.
        user_id can be used for additional application-level checks if needed.
        """
        user_supabase_client = create_supabase_client_with_jwt(jwt_token) 

        tool_query = user_supabase_client.table("tools").select("*").eq("id", str(tool_id))
        
        tool_res = tool_query.execute() 

        if not tool_res.data:
            return None
        
        tool_db_data = tool_res.data[0]

        if user_id and tool_db_data.get("user_id") and UUID(tool_db_data.get("user_id")) != user_id and not tool_db_data.get("is_system_tool"):
            return None 

        params_res = user_supabase_client.table("tool_parameters").select("*").eq("tool_id", str(tool_id)).order("created_at").execute() 
        
        tool_db_data["parameters"] = params_res.data
        return ToolResponseSchema.model_validate(tool_db_data)

    async def create_tool(self, tool_data: ToolCreateRequestSchema, user_id: UUID, jwt_token: str) -> ToolResponseSchema:
        user_supabase_client = create_supabase_client_with_jwt(jwt_token) 

        tool_insert_data = {
            "user_id": str(user_id),
            "name": tool_data.name,
            "description": tool_data.description,
            "return_type_schema": tool_data.return_type_schema,
            "is_system_tool": False
        }
        
        try:
            tool_res = user_supabase_client.table("tools").insert(tool_insert_data).execute() 
        except Exception as e:
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
                    param_res = user_supabase_client.table("tool_parameters").insert(param_insert_data).execute() 
                    if param_res.data:
                        created_parameters_data.append(param_res.data[0])
                    else:
                        user_supabase_client.table("tools").delete().eq("id", created_tool_id_str).execute() 
                        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to create one or more tool parameters. Rolled back tool creation.")
                except Exception as e:
                    user_supabase_client.table("tools").delete().eq("id", created_tool_id_str).execute() 
                    if "unique constraint" in str(e).lower() and "unique_tool_parameter_name" in str(e).lower():
                        raise HTTPException(
                            status_code=status.HTTP_409_CONFLICT,
                            detail=f"A parameter with the name '{param_schema.name}' already exists for this tool. Rolled back tool creation."
                        )
                    raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error creating parameter {param_schema.name}. Rolled back tool creation. Error: {str(e)}")

        complete_tool = await self._get_tool_and_parameters(tool_id=UUID(created_tool_id_str), user_id=user_id, jwt_token=jwt_token) 
        if not complete_tool:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to retrieve newly created tool with parameters.")
        return complete_tool

    async def get_tool(self, tool_id: UUID, user_id: UUID, jwt_token: str) -> ToolResponseSchema:
        tool = await self._get_tool_and_parameters(tool_id=tool_id, user_id=user_id, jwt_token=jwt_token) 
        if not tool:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Tool not found or not authorized.")
        
        return tool

    async def list_tools(
        self, 
        user_id: UUID, 
        jwt_token: str, 
        page: int = 1, 
        size: int = 20,
        include_system_tools: bool = True
    ) -> PaginatedToolResponseSchema:
        user_supabase_client = create_supabase_client_with_jwt(jwt_token) 
        offset = (page - 1) * size

        query = user_supabase_client.table("tools").select("*", count="exact") 

        if not include_system_tools:
            query = query.eq("user_id", str(user_id)) 
        else:
            query = query.or_(f"user_id.eq.{str(user_id)},is_system_tool.eq.true")

        tools_res = query.range(offset, offset + size - 1).order("created_at", desc=True).execute()
        
        if tools_res.count is None:
            raise HTTPException(status_code=500, detail="Could not retrieve count of tools.")

        fetched_tools_data = tools_res.data
        detailed_tools = []
        for tool_data_item in fetched_tools_data:
            tool_detail = await self._get_tool_and_parameters(tool_id=UUID(tool_data_item['id']), user_id=user_id, jwt_token=jwt_token) 
            if tool_detail:
                 detailed_tools.append(tool_detail)

        return PaginatedToolResponseSchema(
            items=detailed_tools,
            total=tools_res.count,
            page=page,
            size=size
        )

    async def update_tool(
        self, 
        tool_id: UUID, 
        tool_data: ToolUpdateRequestSchema, 
        user_id: UUID,
        jwt_token: str
    ) -> ToolResponseSchema:
        user_supabase_client = create_supabase_client_with_jwt(jwt_token) 

        existing_tool_res = user_supabase_client.table("tools").select("id, user_id, is_system_tool").eq("id", str(tool_id)).maybe_single().execute() 
        
        if not existing_tool_res.data:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Tool not found.")
        
        existing_tool = existing_tool_res.data
        if existing_tool["user_id"] != str(user_id):
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="User does not have permission to update this tool.")
        if existing_tool["is_system_tool"]:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="System tools cannot be modified.")

        update_payload = tool_data.model_dump(exclude_unset=True, exclude={'parameters'})
        
        if 'user_id' in update_payload: del update_payload['user_id']
        if 'is_system_tool' in update_payload: del update_payload['is_system_tool']

        if tool_data.parameters is not None:
            user_supabase_client.table("tool_parameters").delete().eq("tool_id", str(tool_id)).execute() 
            for param_schema in tool_data.parameters:
                param_insert_data = {
                    "tool_id": str(tool_id),
                    "name": param_schema.name,
                    "type": param_schema.type,
                    "description": param_schema.description,
                    "default_value": param_schema.default_value,
                    "is_required": param_schema.is_required
                }
                try:
                    user_supabase_client.table("tool_parameters").insert(param_insert_data).execute() 
                except Exception as e:
                    if "unique constraint" in str(e).lower() and "unique_tool_parameter_name" in str(e).lower():
                         raise HTTPException(
                            status_code=status.HTTP_409_CONFLICT,
                            detail=f"A parameter with the name '{param_schema.name}' already exists for this tool version."
                        )
                    raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Failed to update parameter {param_schema.name}: {str(e)}")
        
        if update_payload:
            try:
                updated_tool_res = user_supabase_client.table("tools").update(update_payload).eq("id", str(tool_id)).execute() 
            except Exception as e:
                if "unique constraint" in str(e).lower() and "unique_user_tool_name" in str(e).lower() and 'name' in update_payload:
                    raise HTTPException(
                        status_code=status.HTTP_409_CONFLICT,
                        detail=f"A tool with the name '{update_payload['name']}' already exists for this user."
                    )
                raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error updating tool: {str(e)}")

        complete_tool = await self._get_tool_and_parameters(tool_id=tool_id, user_id=user_id, jwt_token=jwt_token) 
        if not complete_tool:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to retrieve updated tool after update operations.")
        return complete_tool

    async def delete_tool(self, tool_id: UUID, user_id: UUID, jwt_token: str) -> Dict[str, str]:
        user_supabase_client = create_supabase_client_with_jwt(jwt_token) 

        existing_tool_res = user_supabase_client.table("tools").select("id, user_id, is_system_tool").eq("id", str(tool_id)).maybe_single().execute() 
        
        if not existing_tool_res.data:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Tool not found or not authorized for deletion.")
        
        existing_tool = existing_tool_res.data
        if existing_tool["user_id"] != str(user_id):
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="User (from route) does not match owner of the tool (fetched via JWT context). Deletion aborted.")
        if existing_tool["is_system_tool"]:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="System tools cannot be deleted.")

        deleted_res = user_supabase_client.table("tools").delete().eq("id", str(tool_id)).execute() 
        
        return {"message": "Tool deleted successfully"}

tool_controller = ToolController()
