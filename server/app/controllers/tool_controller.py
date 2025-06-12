# server/app/controllers/tool_controller.py
import logging
from uuid import UUID
from typing import Optional, Union, Dict

from fastapi import HTTPException, status

from ..schemas.tool_schemas import (
    ToolCreateRequestSchema,
    CustomApiToolCreateRequestSchema,
    ToolUpdateRequestSchema,
    ToolResponseSchema,
    PaginatedToolResponseSchema
)
from ..services.tool_service import tool_service

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class ToolController:
    """
    Controller for handling business logic related to tools.
    It orchestrates operations by calling the ToolService.
    """

    async def create_tool(
        self, 
        tool_data: Union[ToolCreateRequestSchema, CustomApiToolCreateRequestSchema], 
        user_id: UUID, 
        jwt_token: str
    ) -> ToolResponseSchema:
        """
        Creates a new tool by calling the tool service.
        """
        try:
            created_tool = await tool_service.create_tool_with_parameters(
                tool_data=tool_data, 
                user_id=user_id, 
                jwt_token=jwt_token
            )
            return ToolResponseSchema.model_validate(created_tool)
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Unexpected error in ToolController create_tool: {e}")
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="An unexpected error occurred while creating the tool.")

    async def get_tool(self, tool_id: UUID, user_id: UUID, jwt_token: str) -> ToolResponseSchema:
        """
        Retrieves a single tool by its ID using the tool service.
        """
        tool = await tool_service._get_tool_and_parameters(tool_id=tool_id, user_id=user_id, jwt_token=jwt_token)
        if not tool:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Tool not found or not authorized.")
        return ToolResponseSchema.model_validate(tool)ate(tool)

    async def get_all_tools(
        self, 
        user_id: UUID, 
        jwt_token: str, 
        query: Optional[str], 
        page: int, 
        size: int, 
        include_system_tools: bool
    ) -> PaginatedToolResponseSchema:
        """
        Retrieves a paginated list of tools using the tool service.
        """
        return await tool_service.get_paginated_tools(
            user_id=user_id,
            jwt_token=jwt_token,
            query=query,
            page=page,
            size=size,
            include_system_tools=include_system_tools
        )

    async def update_tool(
        self, 
        tool_id: UUID, 
        tool_update_data: ToolUpdateRequestSchema, 
        user_id: UUID, 
        jwt_token: str
    ) -> ToolResponseSchema:
        """
        Updates an existing tool by calling the tool service.
        """
        try:
            updated_tool = await tool_service.update_tool_with_parameters(
                tool_id=tool_id,
                tool_update_data=tool_update_data,
                user_id=user_id,
                jwt_token=jwt_token
            )
            return ToolResponseSchema.model_validate(updated_tool)
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Unexpected error in ToolController update_tool: {e}")
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="An unexpected error occurred while updating the tool.")

    async def delete_tool(self, tool_id: UUID, user_id: UUID, jwt_token: str) -> Dict[str, str]:
        """
        Deletes a tool by calling the tool service.
        """
        try:
            await tool_service.delete_tool_by_id(tool_id=tool_id, user_id=user_id, jwt_token=jwt_token)
            return {"message": "Tool deleted successfully"}
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Unexpected error in ToolController delete_tool: {e}")
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="An unexpected error occurred while deleting the tool.")

tool_controller = ToolController()
