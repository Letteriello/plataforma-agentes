# server/app/routes/tool_routes.py
from fastapi import APIRouter, Depends, HTTPException, status, Query
from typing import List, Optional
from uuid import UUID

from ..controllers.tool_controller import tool_controller # Use the instance
from ..schemas.tool_schemas import (
    ToolCreateRequestSchema,
    ToolResponseSchema,
    ToolUpdateRequestSchema,
    PaginatedToolResponseSchema
)
from ..security import get_current_user_and_token, CurrentUser # Updated dependency

router = APIRouter(
    prefix="/tools",
    tags=["Tools"],
    responses={404: {"description": "Not found"}},
)

@router.post("/", response_model=ToolResponseSchema, status_code=status.HTTP_201_CREATED)
async def create_new_tool(
    tool_payload: ToolCreateRequestSchema,
    current_user: CurrentUser = Depends(get_current_user_and_token) # Updated dependency
):
    """
    Create a new tool with its parameters.
    The user_id and jwt_token are extracted from the JWT token.
    """
    try:
        # user_uuid = UUID(current_user.id) # UUID conversion handled by Pydantic model or controller
        return await tool_controller.create_tool(
            tool_data=tool_payload, 
            user_id=current_user.id, 
            jwt_token=current_user.token
        )
    except ValueError:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid user ID format.")
    except HTTPException as e:
        raise e
    except Exception as e:
        # Log the error e
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"An unexpected error occurred: {str(e)}")


@router.get("/", response_model=PaginatedToolResponseSchema)
async def list_all_tools(
    current_user: CurrentUser = Depends(get_current_user_and_token), # Updated dependency
    skip: int = Query(0, ge=0, description="Number of tools to skip"),
    limit: int = Query(10, ge=1, le=100, description="Number of tools to return per page"),
    include_system_tools: bool = Query(True, description="Whether to include system tools in the listing")
):
    """
    List all tools for the authenticated user.
    Supports pagination and optionally includes system tools.
    """
    try:
        # user_uuid = UUID(current_user.id)
        return await tool_controller.get_all_tools(
            user_id=current_user.id,
            jwt_token=current_user.token,
            skip=skip,
            limit=limit,
            include_system_tools=include_system_tools
        )
    except ValueError: # If current_user_id is not a valid UUID string
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid user ID format.")
    except HTTPException as e:
        raise e
    except Exception as e:
        # Log the error e
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"An unexpected error occurred: {str(e)}")

@router.get("/{tool_id}", response_model=ToolResponseSchema)
async def get_single_tool(
    tool_id: UUID,
    current_user: CurrentUser = Depends(get_current_user_and_token) # Updated dependency
):
    """
    Retrieve a specific tool by its ID.
    Ensures the tool belongs to the user or is a system tool.
    """
    try:
        # user_uuid = UUID(current_user.id)
        tool = await tool_controller.get_tool_by_id(
            tool_id=tool_id, 
            user_id=current_user.id, 
            jwt_token=current_user.token
        )
        return tool
    except ValueError: # Catches invalid UUID format for tool_id or current_user_id
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid ID format for tool or user.")
    except HTTPException as e:
        raise e
    except Exception as e:
        # Log the error e
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"An unexpected error occurred: {str(e)}")


@router.put("/{tool_id}", response_model=ToolResponseSchema)
async def update_existing_tool(
    tool_id: UUID,
    tool_update_payload: ToolUpdateRequestSchema,
    current_user: CurrentUser = Depends(get_current_user_and_token) # Updated dependency
):
    """
    Update an existing tool.
    Ensures the tool belongs to the user and is not a system tool.
    """
    try:
        # user_uuid = UUID(current_user.id)
        updated_tool = await tool_controller.update_tool(
            tool_id=tool_id,
            tool_data=tool_update_payload,
            user_id=current_user.id,
            jwt_token=current_user.token
        )
        return updated_tool
    except ValueError:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid ID format for tool or user.")
    except HTTPException as e:
        raise e
    except Exception as e:
        # Log the error e
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"An unexpected error occurred: {str(e)}")


@router.delete("/{tool_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_existing_tool(
    tool_id: UUID,
    current_user: CurrentUser = Depends(get_current_user_and_token) # Updated dependency
):
    """
    Delete an existing tool.
    Ensures the tool belongs to the user and is not a system tool.
    """
    try:
        # user_uuid = UUID(current_user.id)
        await tool_controller.delete_tool(
            tool_id=tool_id, 
            user_id=current_user.id, 
            jwt_token=current_user.token
        )
        # No return needed for 204
    except ValueError:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid ID format for tool or user.")
    except HTTPException as e:
        raise e
    except Exception as e:
        # Log the error e
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"An unexpected error occurred: {str(e)}")
