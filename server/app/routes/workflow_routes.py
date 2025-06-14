from fastapi import APIRouter, HTTPException, status, Body
from typing import List, Dict, Any
from uuid import uuid4
from datetime import datetime

from ..models.workflow import WorkflowPayload, WorkflowStored, WorkflowNode
from .. import database
from ..services import execution_engine

router = APIRouter(
    prefix="/workflows",
    tags=["Workflows"],
)

@router.post("/", response_model=WorkflowStored, status_code=status.HTTP_201_CREATED)
def save_new_workflow(payload: WorkflowPayload):
    """Cria e armazena uma nova estrutura de workflow."""
    workflow_id = f"wf-{uuid4()}"
    now = datetime.utcnow().isoformat() + "Z"
    new_workflow = WorkflowStored(
        id=workflow_id,
        created_at=now,
        workflow_tree=payload.workflow
    )
    database._workflows[workflow_id] = new_workflow
    return new_workflow

@router.get("/", response_model=List[WorkflowStored])
def list_all_workflows():
    """Lista todos os workflows salvos."""
    return list(database._workflows.values())

@router.get("/{workflow_id}", response_model=WorkflowStored)
def get_single_workflow(workflow_id: str):
    """Recupera um workflow específico pelo seu ID."""
    workflow = database._workflows.get(workflow_id)
    if not workflow:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Workflow com ID '{workflow_id}' não encontrado."
        )
    return workflow

@router.post("/{workflow_id}/execute", response_model=List[Any])
def execute_existing_workflow(workflow_id: str, initial_data: Dict[str, Any] = Body(...)):
    """Executa um workflow salvo, passando dados iniciais."""
    workflow = database._workflows.get(workflow_id)
    if not workflow:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Workflow com ID '{workflow_id}' não encontrado para execução."
        )
    final_outputs = execution_engine.run_workflow(workflow.workflow_tree, initial_data)
    return final_outputs
