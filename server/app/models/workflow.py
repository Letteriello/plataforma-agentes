from pydantic import BaseModel, Field
from typing import Any, List, Dict

class WorkflowNode(BaseModel):
    id: str
    type: str
    data: Dict[str, Any]
    children: List['WorkflowNode'] = Field(default_factory=list)

# This is needed for Pydantic to handle the recursive type reference
WorkflowNode.update_forward_refs()

class WorkflowPayload(BaseModel):
    workflow: List[WorkflowNode]

class WorkflowStored(BaseModel):
    id: str
    created_at: str
    workflow_tree: List[WorkflowNode]
