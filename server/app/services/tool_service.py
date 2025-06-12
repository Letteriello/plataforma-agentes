# server/app/services/tool_service.py
import json
from uuid import UUID
from typing import List, Dict, Any, Optional, Union
from fastapi import HTTPException, status
from postgrest import APIResponse

from ..schemas.tool_schemas import (
    ToolCreateRequestSchema,
    CustomApiToolCreateRequestSchema,
    ToolUpdateRequestSchema,
    PaginatedToolResponseSchema
)
from ..supabase_client import create_supabase_client_with_jwt

class ToolService:
    async def _get_tool_and_parameters(self, tool_id: UUID, user_id: UUID, jwt_token: str) -> Optional[Dict[str, Any]]:
        """Helper to fetch a tool and its parameters, relying on RLS for security."""
        user_supabase_client = create_supabase_client_with_jwt(jwt_token)
        
        response = (
            user_supabase_client.table("tools")
            .select("*, parameters:tool_parameters(*)")
            .eq("id", str(tool_id))
            .maybe_single()
            .execute()
        )

        return response.data

    async def get_paginated_tools(self, user_id: UUID, jwt_token: str, query: Optional[str], page: int, size: int, include_system_tools: bool) -> PaginatedToolResponseSchema:
        user_supabase_client = create_supabase_client_with_jwt(jwt_token)
        
        offset = (page - 1) * size
        
        # RLS handles user-specific data access.
        # The RLS policy allows selecting user's own tools OR system tools.
        query_builder = user_supabase_client.table("tools").select(
            "*, parameters:tool_parameters(*)", count="exact"
        )

        if not include_system_tools:
            # If we should not include system tools, we explicitly filter for the user's tools.
            query_builder = query_builder.eq("user_id", str(user_id))

        if query:
            query_builder = query_builder.ilike("name", f"%{query}%")

        response = query_builder.range(offset, offset + size - 1).execute()

        if not hasattr(response, 'count') or response.count is None:
             raise HTTPException(status_code=500, detail="Could not retrieve count for pagination.")

        return PaginatedToolResponseSchema(
            tools=response.data,
            total_count=response.count,
            skip=offset,
            limit=size,
        )

    async def create_tool_with_parameters(
        self, 
        tool_data: Union[ToolCreateRequestSchema, CustomApiToolCreateRequestSchema], 
        user_id: UUID, 
        jwt_token: str
    ) -> Dict[str, Any]:
        """Creates a tool and its parameters atomically using a Postgres function."""
        user_supabase_client = create_supabase_client_with_jwt(jwt_token)

        params_for_rpc = {
            "p_user_id": str(user_id),
            "p_name": tool_data.name,
            "p_description": tool_data.description,
            "p_tool_type": tool_data.tool_type.value,
            "p_api_endpoint": str(tool_data.api_endpoint) if hasattr(tool_data, 'api_endpoint') and tool_data.api_endpoint else None,
            "p_return_type_schema": tool_data.return_type_schema,
            "p_parameters": json.dumps([p.model_dump() for p in tool_data.parameters]) if tool_data.parameters else '[]'
        }

        try:
            response: APIResponse = user_supabase_client.rpc(
                "create_tool_and_parameters", params_for_rpc
            ).execute()

            if not response.data:
                raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to create tool using RPC call.")
            
            created_tool_id = response.data[0]['id']
            
            full_tool = await self._get_tool_and_parameters(tool_id=UUID(created_tool_id), user_id=user_id, jwt_token=jwt_token)
            if not full_tool:
                 raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Could not retrieve tool after creation.")
            return full_tool

        except Exception as e:
            if 'duplicate key value' in str(e):
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail=f"A tool with the name '{tool_data.name}' already exists."
                )
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error creating tool via RPC: {e}")

    async def update_tool_with_parameters(
        self, 
        tool_id: UUID, 
        tool_update_data: ToolUpdateRequestSchema, 
        user_id: UUID, 
        jwt_token: str
    ) -> Dict[str, Any]:
        """Updates a tool and its parameters atomically using a Postgres function."""
        user_supabase_client = create_supabase_client_with_jwt(jwt_token)

        params_for_rpc = {
            "p_tool_id": str(tool_id),
            "p_user_id": str(user_id),
            "p_name": tool_update_data.name,
            "p_description": tool_update_data.description,
            "p_api_endpoint": str(tool_update_data.api_endpoint) if tool_update_data.api_endpoint else None,
            "p_return_type_schema": tool_update_data.return_type_schema,
            "p_parameters": json.dumps([p.model_dump() for p in tool_update_data.parameters]) if tool_update_data.parameters is not None else None
        }

        try:
            response: APIResponse = user_supabase_client.rpc(
                "update_tool_and_parameters", params_for_rpc
            ).execute()

            if not response.data:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Tool not found, user not authorized, or failed to update.")

            full_tool = await self._get_tool_and_parameters(tool_id=tool_id, user_id=user_id, jwt_token=jwt_token)
            if not full_tool:
                 raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Could not retrieve tool after update.")
            return full_tool

        except Exception as e:
            if 'duplicate key value' in str(e):
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail=f"A tool with the name '{tool_update_data.name}' already exists."
                )
            if 'Tool not found or user not authorized' in str(e):
                 raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=str(e))
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error updating tool via RPC: {e}")

    async def delete_tool_by_id(self, tool_id: UUID, user_id: UUID, jwt_token: str) -> None:
        """Deletes a tool. RLS policies will enforce ownership and prevent deletion of system tools."""
        user_supabase_client = create_supabase_client_with_jwt(jwt_token)

        response = user_supabase_client.table("tools").delete().eq("id", str(tool_id)).execute()
        
        if not response.data:
            check_existence = user_supabase_client.table("tools").select("id", count="exact").eq("id", str(tool_id)).execute()
            if check_existence.count == 0:
                 raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Tool not found.")
            else:
                 raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="User not authorized to delete this tool.")

tool_service = ToolService()
