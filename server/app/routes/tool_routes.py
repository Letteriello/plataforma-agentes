# server/app/routes/tool_routes.py
from fastapi import APIRouter, Depends, HTTPException, status, Query
from typing import List, Optional, Union
from uuid import UUID

from ..crud import tool_crud
from ..supabase_client import create_supabase_client_with_jwt
from ..schemas.tool_schemas import (
    ToolCreateRequestSchema,
    CustomApiToolCreateRequestSchema,
    ToolResponseSchema,
    ToolUpdateRequestSchema,
    PaginatedToolResponseSchema
)
from ..security import get_current_user_and_token, CurrentUser

router = APIRouter(
    prefix="/tools",
    tags=["Tools"],
    responses={404: {"description": "Not found"}},
)

@router.post("/", response_model=ToolResponseSchema, status_code=status.HTTP_201_CREATED)
async def create_new_tool(
    tool_payload: Union[ToolCreateRequestSchema, CustomApiToolCreateRequestSchema],
    current_user: CurrentUser = Depends(get_current_user_and_token)
):
    """Create a new tool."""
    db = create_supabase_client_with_jwt(current_user.token)
    tool_dict = tool_payload.model_dump(exclude_unset=True)
    tool_dict["owner_id"] = str(current_user.id)
    response = await db.table("tools").insert(tool_dict).execute()
    if not response.data:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to create tool")
    return ToolResponseSchema(**response.data[0])


@router.get("/", response_model=PaginatedToolResponseSchema)
async def list_all_tools(
    current_user: CurrentUser = Depends(get_current_user_and_token),
    page: int = Query(1, ge=1, description="Page number of the tools to return"),
    size: int = Query(20, ge=1, le=100, description="Number of tools to return per page"),
    include_system_tools: bool = Query(True, description="Whether to include system-wide tools in the response.")
):
    """
    List all tools available to the user, including system tools.
    Supports pagination.
    """
    db = create_supabase_client_with_jwt(current_user.token)
    offset = (page - 1) * size
    response = await db.table("tools").select("*", count="exact").range(offset, offset + size - 1).execute()
    tools = [ToolResponseSchema(**t) for t in response.data] if response.data else []
    total_count = response.count or len(tools)
    return PaginatedToolResponseSchema(tools=tools, total_count=total_count, skip=offset, limit=size)


@router.get("/{tool_id}", response_model=ToolResponseSchema)
async def get_single_tool(
    tool_id: UUID,
    current_user: CurrentUser = Depends(get_current_user_and_token)
):
    """
    Retrieve a single tool by its ID.
    Ensures the user has permission to view the tool (own or system tool).
    """
    db = create_supabase_client_with_jwt(current_user.token)
    response = await db.table("tools").select("*").eq("id", str(tool_id)).maybe_single().execute()
    if not response.data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Tool not found")
    return ToolResponseSchema(**response.data)


@router.put("/{tool_id}", response_model=ToolResponseSchema)
async def update_existing_tool(
    tool_id: UUID,
    tool_update_payload: ToolUpdateRequestSchema,
    current_user: CurrentUser = Depends(get_current_user_and_token)
):
    """
    Update an existing tool.
    Ensures the tool belongs to the user and is not a system tool.
    """
    db = create_supabase_client_with_jwt(current_user.token)
    update_data = tool_update_payload.model_dump(exclude_unset=True)
    if not update_data:
        response = await db.table("tools").select("*").eq("id", str(tool_id)).maybe_single().execute()
        if not response.data:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Tool not found")
        return ToolResponseSchema(**response.data)

    response = await db.table("tools").update(update_data).eq("id", str(tool_id)).execute()
    if not response.data:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to update tool")
    return ToolResponseSchema(**response.data[0])


@router.delete("/{tool_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_existing_tool(
    tool_id: UUID,
    current_user: CurrentUser = Depends(get_current_user_and_token)
):
    """
    Delete an existing tool.
    Ensures the tool belongs to the user and is not a system tool.
    """
    db = create_supabase_client_with_jwt(current_user.token)
    response = await db.table("tools").delete().eq("id", str(tool_id)).execute()
    if not response.data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Tool not found")
    return
