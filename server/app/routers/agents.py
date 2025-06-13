# server/app/routers/agents.py
from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Optional
import uuid

from app.models import schemas
from app.crud import agent_crud
from app.dependencies.auth_deps import (
    get_current_active_user,
    get_current_active_superuser,
    get_user_scoped_supabase_client,
    get_service_client
)
from supabase import Client

router = APIRouter()

@router.post("/", response_model=schemas.Agent, status_code=status.HTTP_201_CREATED)
async def create_new_agent(
    agent_in: schemas.AgentCreate,
    db: Client = Depends(get_user_scoped_supabase_client),
    current_user: schemas.User = Depends(get_current_active_user)
):
    """
    Cria um novo agente associado ao usuário autenticado.
    """
    created_agent = await agent_crud.create_agent(db=db, agent_in=agent_in, user_id=current_user.id)
    if not created_agent:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Não foi possível criar o agente."
        )
    return created_agent

@router.get("/my", response_model=List[schemas.Agent])
async def read_my_agents(
    skip: int = 0,
    limit: int = 100,
    db: Client = Depends(get_user_scoped_supabase_client),
    current_user: schemas.User = Depends(get_current_active_user)
):
    """
    Lista os agentes pertencentes ao usuário autenticado.
    """
    agents = await agent_crud.get_agents_by_user(db=db, user_id=current_user.id, skip=skip, limit=limit)
    return agents

@router.get("/{agent_id}", response_model=schemas.Agent)
async def read_agent_by_id(
    agent_id: uuid.UUID,
    db: Client = Depends(get_user_scoped_supabase_client),
    current_user: schemas.User = Depends(get_current_active_user) 
):
    """
    Obtém um agente específico pelo seu ID.
    A visualização é permitida para o proprietário ou superusuário.
    """
    db_agent = await agent_crud.get_agent(db=db, agent_id=agent_id)
    if db_agent is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Agente não encontrado")
    
    if db_agent.user_id != current_user.id and not current_user.is_superuser:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Não autorizado a visualizar este agente")
    return db_agent

@router.put("/{agent_id}", response_model=schemas.Agent)
async def update_existing_agent(
    agent_id: uuid.UUID,
    agent_in: schemas.AgentUpdate,
    db: Client = Depends(get_user_scoped_supabase_client),
    current_user: schemas.User = Depends(get_current_active_user)
):
    """
    Atualiza um agente existente. Somente o proprietário ou superusuário pode atualizar.
    """
    # A lógica de verificação de propriedade já está em agent_crud.update_agent
    # Mas podemos fazer uma verificação inicial aqui para retornar 403/404 mais cedo se desejado.
    # agent_to_check = await agent_crud.get_agent(db=db, agent_id=agent_id)
    # if not agent_to_check:
    #     raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Agente não encontrado")
    # if agent_to_check.user_id != current_user.id and not current_user.is_superuser:
    #     raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Não autorizado a atualizar este agente")

    updated_agent = await agent_crud.update_agent(db=db, agent_id=agent_id, agent_in=agent_in, current_user_id=current_user.id)
    if not updated_agent:
        # O CRUD pode retornar None se não encontrado ou não autorizado.
        # Precisamos inferir o status code correto.
        # Se o agent_crud.get_agent dentro de update_agent retornou None, é 404.
        # Se a verificação de user_id falhou, é 403.
        # Por simplicidade, se o CRUD já lida com a lógica de permissão e retorna None em caso de falha, 
        # podemos verificar se o agente existe primeiro para dar um 404 mais preciso.
        existing_agent = await agent_crud.get_agent(db=db, agent_id=agent_id)
        if not existing_agent:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Agente não encontrado")
        # Se existe mas update falhou (e.g. permissão dentro do CRUD ou outro erro)
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Não autorizado a atualizar ou falha na atualização do agente.")
    return updated_agent

@router.delete("/{agent_id}", response_model=schemas.Agent)
async def delete_existing_agent(
    agent_id: uuid.UUID,
    db: Client = Depends(get_user_scoped_supabase_client),
    current_user: schemas.User = Depends(get_current_active_user)
):
    """
    Deleta um agente existente. Somente o proprietário ou superusuário pode deletar.
    """
    # Similar ao update, a lógica de permissão está no CRUD.
    deleted_agent = await agent_crud.delete_agent(db=db, agent_id=agent_id, current_user_id=current_user.id)
    if not deleted_agent:
        existing_agent = await agent_crud.get_agent(db=db, agent_id=agent_id) # Verifica se existe para dar 404
        if not existing_agent:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Agente não encontrado")
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Não autorizado a deletar ou falha na deleção do agente.")
    return deleted_agent

@router.get("/", response_model=List[schemas.Agent], dependencies=[Depends(get_current_active_superuser)])
async def read_all_agents_as_superuser(
    skip: int = 0,
    limit: int = 100,
    db: Client = Depends(get_service_client) # ATENÇÃO: Usando service client para bypass RLS
):
    """
    (Superuser) Lista todos os agentes no sistema, incluindo suas ferramentas.
    """
    agents_list = []
    try:
        # Esta é uma forma simples de listar todos. Uma função dedicada em agent_crud seria melhor.
        response = await db.table("agents").select("*").order("created_at", desc=True).offset(skip).limit(limit).execute()
        if response.data:
            for agent_data_raw in response.data:
                # Para cada agente, buscamos suas ferramentas associadas.
                # Isso pode levar a N+1 queries se não otimizado.
                # Uma junção SQL direta seria mais eficiente se o Supabase ORM/client permitir facilmente.
                tools_for_this_agent = await agent_crud._get_tools_for_agent(db, agent_id=uuid.UUID(agent_data_raw["id"]))
                agent_data_with_tools = {**agent_data_raw, "tools": tools_for_this_agent}
                agents_list.append(schemas.Agent(**agent_data_with_tools))
        return agents_list
    except PostgrestAPIError as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Erro de banco de dados ao listar agentes: {e.message}")
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Erro inesperado ao listar todos os agentes: {str(e)}")
