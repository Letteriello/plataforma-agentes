# server/app/routers/tools.py
from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Optional
import uuid

from app.models import schemas
from app.crud import tool_crud
from app.core.db import get_supabase_client
from app.dependencies.auth_deps import get_current_active_user, get_current_active_superuser # Adicionado get_current_active_superuser
from supabase import Client

router = APIRouter()

@router.post("/", response_model=schemas.Tool, status_code=status.HTTP_201_CREATED)
async def create_new_tool(
    tool_in: schemas.ToolCreate,
    db: Client = Depends(get_supabase_client),
    current_user: schemas.User = Depends(get_current_active_user)
):
    """
    Cria uma nova ferramenta associada ao usuário autenticado.
    """
    created_tool = await tool_crud.create_tool(db=db, tool_in=tool_in, owner_id=current_user.id)
    if not created_tool:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Não foi possível criar a ferramenta."
        )
    return created_tool

@router.get("/", response_model=List[schemas.Tool])
async def read_all_tools(
    skip: int = 0,
    limit: int = 100,
    db: Client = Depends(get_supabase_client),
    # current_user: schemas.User = Depends(get_current_active_user) # Descomentar se todas as ferramentas listadas devem ser apenas para usuários logados
):
    """
    Lista todas as ferramentas. 
    Pode-se adicionar lógica para filtrar por ferramentas públicas ou do usuário.
    Por padrão, lista todas as ferramentas para qualquer usuário autenticado (se descomentado) ou público.
    """
    tools = await tool_crud.get_tools(db=db, skip=skip, limit=limit)
    return tools

@router.get("/my", response_model=List[schemas.Tool])
async def read_my_tools(
    skip: int = 0,
    limit: int = 100,
    db: Client = Depends(get_supabase_client),
    current_user: schemas.User = Depends(get_current_active_user)
):
    """
    Lista as ferramentas pertencentes ao usuário autenticado.
    """
    tools = await tool_crud.get_tools_by_owner(db=db, owner_id=current_user.id, skip=skip, limit=limit)
    return tools


@router.get("/{tool_id}", response_model=schemas.Tool)
async def read_tool_by_id(
    tool_id: uuid.UUID,
    db: Client = Depends(get_supabase_client),
    # current_user: schemas.User = Depends(get_current_active_user) # Descomentar se o acesso é restrito a usuários logados
):
    """
    Obtém uma ferramenta específica pelo seu ID.
    """
    db_tool = await tool_crud.get_tool(db=db, tool_id=tool_id)
    if db_tool is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Ferramenta não encontrada")
    return db_tool

@router.put("/{tool_id}", response_model=schemas.Tool)
async def update_existing_tool(
    tool_id: uuid.UUID,
    tool_in: schemas.ToolUpdate,
    db: Client = Depends(get_supabase_client),
    current_user: schemas.User = Depends(get_current_active_user)
):
    """
    Atualiza uma ferramenta existente. Somente o proprietário ou superusuário pode atualizar.
    """
    tool_to_update = await tool_crud.get_tool(db=db, tool_id=tool_id)
    if not tool_to_update:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Ferramenta não encontrada")
    
    # Verifica permissão: ou é o proprietário ou é superusuário
    if tool_to_update.owner_id != current_user.id and not current_user.is_superuser:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Não autorizado a atualizar esta ferramenta")

    # A função CRUD update_tool agora também recebe current_owner_id para uma verificação interna, mas a lógica principal de permissão está aqui.
    updated_tool = await tool_crud.update_tool(db=db, tool_id=tool_id, tool_in=tool_in, current_owner_id=current_user.id)
    if not updated_tool:
        # Se o CRUD retornou None, pode ser que a verificação interna de owner falhou (redundante aqui) ou outro erro.
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Não foi possível atualizar a ferramenta.")
    return updated_tool

@router.delete("/{tool_id}", response_model=schemas.Tool)
async def delete_existing_tool(
    tool_id: uuid.UUID,
    db: Client = Depends(get_supabase_client),
    current_user: schemas.User = Depends(get_current_active_user)
):
    """
    Deleta uma ferramenta existente. Somente o proprietário ou superusuário pode deletar.
    """
    tool_to_delete = await tool_crud.get_tool(db=db, tool_id=tool_id)
    if not tool_to_delete:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Ferramenta não encontrada")

    # Verifica permissão: ou é o proprietário ou é superusuário
    if tool_to_delete.owner_id != current_user.id and not current_user.is_superuser:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Não autorizado a deletar esta ferramenta")

    # A função CRUD delete_tool agora também recebe current_owner_id para uma verificação interna.
    deleted_tool = await tool_crud.delete_tool(db=db, tool_id=tool_id, current_owner_id=current_user.id)
    if not deleted_tool:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Não foi possível deletar a ferramenta.")
    return deleted_tool
