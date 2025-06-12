from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from uuid import UUID
from datetime import datetime

# --- Tool Parameter Schemas ---
class ToolParameterBaseSchema(BaseModel):
    name: str = Field(..., description="Name of the parameter, unique per tool.")
    type: str = Field(..., description="Data type of the parameter (e.g., string, number, boolean).")
    description: Optional[str] = Field(None, description="Detailed description of what the parameter does.")
    default_value: Optional[str] = Field(None, description="Default value for the parameter, stored as text.")
    is_required: bool = Field(True, description="Indicates if the parameter is mandatory for the tool execution.")

class ToolParameterCreateSchema(ToolParameterBaseSchema):
    pass

class ToolParameterResponseSchema(ToolParameterBaseSchema):
    id: UUID
    tool_id: UUID
    created_at: datetime

    class Config:
        orm_mode = True # For SQLAlchemy model conversion
        # Pydantic V2: from_attributes = True

# --- Tool Schemas ---
class ToolBaseSchema(BaseModel):
    name: str = Field(..., description="Unique name of the tool for a given user or system.")
    description: Optional[str] = Field(None, description="Detailed description of what the tool does.")
    return_type_schema: Optional[Dict[str, Any]] = Field(None, description="JSON schema defining the structure of the data returned by the tool.")

class ToolCreateRequestSchema(ToolBaseSchema):
    parameters: List[ToolParameterCreateSchema] = Field(default_factory=list, description="List of parameters for the tool.")
    # is_system_tool will be False by default for user-created tools, handled in the endpoint/service.
    # user_id will be extracted from the JWT token.

class ToolUpdateRequestSchema(BaseModel):
    name: Optional[str] = Field(None, description="Unique name of the tool for a given user or system.")
    description: Optional[str] = Field(None, description="Detailed description of what the tool does.")
    return_type_schema: Optional[Dict[str, Any]] = Field(None, description="JSON schema defining the structure of the data returned by the tool.")
    parameters: Optional[List[ToolParameterCreateSchema]] = Field(None, description="List of parameters for the tool. If provided, existing parameters will be replaced.")
    # Updating is_system_tool or user_id is generally not allowed or handled differently.

class ToolResponseSchema(ToolBaseSchema):
    id: UUID
    user_id: Optional[UUID] = Field(None, description="Owner of the tool. NULL for system tools.")
    is_system_tool: bool
    created_at: datetime
    updated_at: datetime
    parameters: List[ToolParameterResponseSchema] = Field(default_factory=list)

    class Config:
        orm_mode = True # For SQLAlchemy model conversion
        # Pydantic V2: from_attributes = True

class PaginatedToolResponseSchema(BaseModel):
    tools: List[ToolResponseSchema]
    total_count: int
    skip: int
    limit: int
