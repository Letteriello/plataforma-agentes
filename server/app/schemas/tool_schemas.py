from pydantic import BaseModel, Field, HttpUrl
from typing import List, Optional, Dict, Any
from uuid import UUID
from datetime import datetime
from enum import Enum

# --- Enums ---
class ToolType(str, Enum):
    PREDEFINED = "predefined"
    CUSTOM_API = "custom_api"

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
        from_attributes = True

# --- Tool Schemas ---
class ToolBaseSchema(BaseModel):
    name: str = Field(..., description="Unique name of the tool for a given user or system.")
    description: Optional[str] = Field(None, description="Detailed description of what the tool does.")
    tool_type: ToolType = Field(ToolType.PREDEFINED, description="The type of the tool.")
    api_endpoint: Optional[HttpUrl] = Field(None, description="The API endpoint URL for custom_api tools.")
    return_type_schema: Optional[Dict[str, Any]] = Field(None, description="JSON schema defining the structure of the data returned by the tool.")

class ToolCreateRequestSchema(ToolBaseSchema):
    parameters: List[ToolParameterCreateSchema] = Field(default_factory=list, description="List of parameters for the tool.")
    tool_type: ToolType = Field(ToolType.PREDEFINED, description="The type of the tool, fixed to predefined for this endpoint.", const=True)

class CustomApiToolCreateRequestSchema(ToolBaseSchema):
    parameters: List[ToolParameterCreateSchema] = Field(default_factory=list, description="List of parameters for the tool.")
    tool_type: ToolType = Field(ToolType.CUSTOM_API, description="The type of the tool, fixed to custom_api for this endpoint.", const=True)
    api_endpoint: HttpUrl = Field(..., description="The API endpoint URL for this custom tool.")

class ToolUpdateRequestSchema(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    api_endpoint: Optional[HttpUrl] = None
    return_type_schema: Optional[Dict[str, Any]] = None
    parameters: Optional[List[ToolParameterCreateSchema]] = None

class ToolResponseSchema(ToolBaseSchema):
    id: UUID
    user_id: Optional[UUID] = Field(None, description="Owner of the tool. NULL for system tools.")
    is_system_tool: bool
    created_at: datetime
    updated_at: datetime
    parameters: List[ToolParameterResponseSchema] = Field(default_factory=list)

    class Config:
        from_attributes = True

class PaginatedToolResponseSchema(BaseModel):
    tools: List[ToolResponseSchema]
    total_count: int
    skip: int
    limit: int
