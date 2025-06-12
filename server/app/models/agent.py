from pydantic import BaseModel
from typing import Any, List, Dict, Optional, Literal

class AgentTool(BaseModel):
    name: str
    description: str
    parameters: Dict[str, Any]

class Agent(BaseModel):
    id: str = ""
    name: str
    description: Optional[str] = None
    model: str = "gemini-1.5-pro"
    tools: List[AgentTool] = []
    autonomyLevel: Literal['auto', 'ask'] = 'ask'
    createdAt: str = ""
    updatedAt: str = ""

class AgentUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    model: Optional[str] = None
    tools: Optional[List[AgentTool]] = None
    autonomyLevel: Optional[Literal['auto', 'ask']] = None
