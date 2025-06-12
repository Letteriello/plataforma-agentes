# server/app/routes/tool_routes.py
from fastapi import APIRouter, Depends, HTTPException, status, Query
from typing import List, Optional, Union
from uuid import UUID

from ..controllers.tool_controller import tool_controller # Use the instance
from ..schemas.tool_schemas import (
    ToolCreateRequestSchema,
    CustomApiToolCreateRequestSchema,
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
    tool_payload: Union[ToolCreateRequestSchema, CustomApiToolCreateRequestSchema],
    current_user: CurrentUser = Depends(get_current_user_and_token) # Updated dependency
):
    """
    Create a new tool with its parameters.
    The user_id and jwt_token are extracted from the JWT token.
    FastAPI will automatically handle the Union type based on the payload.
    """
    try:
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
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"An unexpected error occurred: {str(e)}")


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
    try:
        return await tool_controller.list_tools(
            user_id=current_user.id,
            jwt_token=current_user.token,
            page=page,
            size=size,
            include_system_tools=include_system_tools
        )
    except ValueError:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid user ID format.")
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"An unexpected error occurred: {str(e)}")


@router.get("/{tool_id}", response_model=ToolResponseSchema)
async def get_single_tool(
    tool_id: UUID, 
    current_user: CurrentUser = Depends(get_current_user_and_token) # Updated dependency
):
    """
    Retrieve a single tool by its ID.
    Ensures the user has permission to view the tool (own or system tool).
    """
    try:
        tool = await tool_controller.get_tool(
            tool_id=tool_id, 
            user_id=current_user.id, 
            jwt_token=current_user.token
        )
        return tool
    except ValueError:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid ID format.")
    except HTTPException as e:
        raise e
    except Exception as e:
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
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"An unexpected error occurred: {str(e)}")
