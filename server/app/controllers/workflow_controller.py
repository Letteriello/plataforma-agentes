from typing import List
from uuid import uuid4
from datetime import datetime

from .. import database
from ..models.workflow import WorkflowNode, WorkflowStored
from ..services import execution_engine

def create_workflow(workflow_tree: List[WorkflowNode]) -> WorkflowStored:
    workflow_id = f"wf-{uuid4()}"
    now = datetime.utcnow().isoformat() + "Z"

    new_workflow = WorkflowStored(
        id=workflow_id,
        created_at=now,
        workflow_tree=workflow_tree
    )

    database._workflows[workflow_id] = new_workflow
    return new_workflow

def get_all_workflows() -> List[WorkflowStored]:
    return list(database._workflows.values())

def get_workflow_by_id(workflow_id: str) -> WorkflowStored:
    return database._workflows.get(workflow_id)

def execute_workflow(workflow_id: str, initial_data: dict) -> List[any]:
    workflow = get_workflow_by_id(workflow_id)
    if not workflow:
        return None # O roteador tratará o 404

    final_outputs = execution_engine.run_workflow(workflow.workflow_tree, initial_data)
    return final_outputs
