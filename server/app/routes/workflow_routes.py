from fastapi import APIRouter, HTTPException, status, Body
from typing import List, Dict, Any

from ..controllers import workflow_controller
from ..models.workflow import WorkflowPayload, WorkflowStored

router = APIRouter(
    prefix="/workflows",
    tags=["Workflows"],
)

@router.post("/", response_model=WorkflowStored, status_code=status.HTTP_201_CREATED)
def save_new_workflow(payload: WorkflowPayload):
    """Cria e armazena uma nova estrutura de workflow."""
    new_workflow = workflow_controller.create_workflow(payload.workflow)
    return new_workflow

@router.get("/", response_model=List[WorkflowStored])
def list_all_workflows():
    """Lista todos os workflows salvos."""
    return workflow_controller.get_all_workflows()

@router.get("/{workflow_id}", response_model=WorkflowStored)
def get_single_workflow(workflow_id: str):
    """Recupera um workflow específico pelo seu ID."""
    workflow = workflow_controller.get_workflow_by_id(workflow_id)
    if not workflow:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Workflow com ID '{workflow_id}' não encontrado."
        )
    return workflow

@router.post("/{workflow_id}/execute", response_model=List[Any])
def execute_existing_workflow(workflow_id: str, initial_data: Dict[str, Any] = Body(...)):
    """Executa um workflow salvo, passando dados iniciais."""
    results = workflow_controller.execute_workflow(workflow_id, initial_data)
    if results is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Workflow com ID '{workflow_id}' não encontrado para execução."
        )
    return results
