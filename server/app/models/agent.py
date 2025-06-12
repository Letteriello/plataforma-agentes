from pydantic import BaseModel, Field
from typing import Any, List, Dict, Optional, Literal
from ..schemas.tool_schemas import ToolResponseSchema # Import ToolResponseSchema

# Removed local AgentTool class definition

class Agent(BaseModel):
    id: Optional[str] = None
    user_id: Optional[str] = None 
    createdAt: Optional[str] = None # Alias for created_at
    updatedAt: Optional[str] = None # Alias for updated_at

    name: str
    description: Optional[str] = None
    model: str = "gemini-1.5-pro"
    instruction: str

    temperature: Optional[float] = Field(default=0.7, ge=0.0, le=2.0)
    max_output_tokens: Optional[int] = Field(default=2048, gt=0)
    top_p: Optional[float] = Field(default=1.0, ge=0.0, le=1.0)
    top_k: Optional[int] = Field(default=40, ge=0)

    input_schema: Optional[Dict[str, Any]] = None
    output_schema: Optional[Dict[str, Any]] = None
    output_key: Optional[str] = None
    include_contents: Optional[str] = Field(default='default')
    
    autonomy_level: Optional[Literal['auto', 'ask']] = Field(default='ask') 
    security_config: Optional[Dict[str, Any]] = None
    planner_config: Optional[Dict[str, Any]] = None
    code_executor_config: Optional[Dict[str, Any]] = None

    tools: List[ToolResponseSchema] = [] # Changed to ToolResponseSchema
    knowledge_base_ids: Optional[List[str]] = Field(default_factory=list)
    
    class Config:
        model_config = {
            "from_attributes": True,
            "populate_by_name": True, # Allows using DB column names (snake_case) and Pydantic model field names
            # Example alias generator if you prefer camelCase in API but snake_case in DB/Pydantic
            # "alias_generator": lambda string: ''.join(word.capitalize() if i > 0 else word for i, word in enumerate(string.split('_')))
        }

class AgentUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    model: Optional[str] = None
    instruction: Optional[str] = None
    
    temperature: Optional[float] = Field(default=None, ge=0.0, le=2.0)
    max_output_tokens: Optional[int] = Field(default=None, gt=0)
    top_p: Optional[float] = Field(default=None, ge=0.0, le=1.0)
    top_k: Optional[int] = Field(default=None, ge=0)
    
    input_schema: Optional[Dict[str, Any]] = None
    output_schema: Optional[Dict[str, Any]] = None
    output_key: Optional[str] = None
    include_contents: Optional[str] = None

    autonomy_level: Optional[Literal['auto', 'ask']] = None
    security_config: Optional[Dict[str, Any]] = None
    planner_config: Optional[Dict[str, Any]] = None
    code_executor_config: Optional[Dict[str, Any]] = None

    tool_ids: Optional[List[str]] = None # Accepts a list of tool UUIDs for update
    knowledge_base_ids: Optional[List[str]] = None


class AgentCreate(BaseModel):
    name: str
    description: Optional[str] = None
    model: str = "gemini-1.5-pro"
    instruction: str
    temperature: Optional[float] = Field(default=0.7, ge=0.0, le=2.0)
    max_output_tokens: Optional[int] = Field(default=2048, gt=0)
    top_p: Optional[float] = Field(default=1.0, ge=0.0, le=1.0)
    top_k: Optional[int] = Field(default=40, ge=0)
    input_schema: Optional[Dict[str, Any]] = None
    output_schema: Optional[Dict[str, Any]] = None
    output_key: Optional[str] = None
    include_contents: Optional[str] = Field(default='default')
    autonomy_level: Optional[Literal['auto', 'ask']] = Field(default='ask')
    security_config: Optional[Dict[str, Any]] = None
    planner_config: Optional[Dict[str, Any]] = None
    code_executor_config: Optional[Dict[str, Any]] = None
    tool_ids: Optional[List[str]] = Field(default_factory=list)
    knowledge_base_ids: Optional[List[str]] = Field(default_factory=list)

    class Config:
        model_config = {
            "populate_by_name": True,
        }
