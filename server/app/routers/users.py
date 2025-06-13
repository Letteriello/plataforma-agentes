# server/app/routers/users.py
from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Optional
import uuid

from app.models import schemas
from app.crud import user_crud
from app.dependencies.auth_deps import get_service_client # Usado para operações de admin
from supabase import Client

from app.dependencies.auth_deps import get_current_active_user # Para obter o usuário logado
# from app.dependencies.auth_deps import get_current_active_superuser # Para proteger rotas de admin

router = APIRouter()


@router.get("/me", response_model=schemas.User, summary="Obter usuário atual")
async def read_users_me(
    current_user: schemas.User = Depends(get_current_active_user)
):
    """
    Obtém os detalhes do usuário autenticado atualmente.
    """
    return current_user

@router.post("/", response_model=Optional[schemas.User], status_code=status.HTTP_201_CREATED,
             summary="Criar um novo usuário (Placeholder)",
             description="""Endpoint para criar um novo usuário. 
             NOTA: A criação de usuários com Supabase Auth é geralmente tratada pelo frontend 
             ou via funções de admin do Supabase. Esta rota é um placeholder e pode necessitar 
             de uma implementação mais robusta ou ser removida/restringida.""")
async def create_new_user(
    user_in: schemas.UserCreate,
    db: Client = Depends(get_service_client)
    # current_user: schemas.User = Depends(get_current_active_superuser) # Exemplo de proteção
):
    """
    Cria um novo usuário.
    - **email**: email do usuário (obrigatório)
    - **password**: senha (obrigatório, min 8 caracteres)
    - **full_name**: nome completo (opcional)
    """
    # A lógica em user_crud.create_user é um placeholder e levanta NotImplementedError.
    # Esta rota precisa ser cuidadosamente considerada no contexto do Supabase Auth.
    # Se o backend for criar usuários, deve usar db.auth.admin.create_user(...)
    # que requer a service_role_key.
    try:
        # A função user_crud.create_user agora levanta NotImplementedError intencionalmente.
        # O router deve capturar isso e retornar 501.
        created_user = await user_crud.create_user(db=db, user=user_in)
        # O código abaixo não será alcançado se NotImplementedError for levantada e não capturada no CRUD.
        # No entanto, se create_user for modificado para retornar None em outros cenários de falha:
        if not created_user: 
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Não foi possível criar o usuário. Verifique os dados ou o usuário pode já existir.",
            )
        return created_user
    except NotImplementedError:
         raise HTTPException(
            status_code=status.HTTP_501_NOT_IMPLEMENTED,
            detail="A criação de usuários via esta API não está implementada. Use o fluxo de Supabase Auth.",
        )
    except HTTPException as e:
        raise e # Re-raise HTTPExceptions vindas do CRUD (se houver)
    except Exception as e:
        # Log e
        print(f"Erro inesperado ao criar usuário: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro interno ao tentar criar usuário.",
        )


@router.get("/", response_model=List[schemas.User], summary="Listar usuários")
async def read_users(
    skip: int = 0,
    limit: int = 100,
    db: Client = Depends(get_service_client)
    # current_user: schemas.User = Depends(get_current_active_superuser) # Proteger esta rota
):
    """
    Recupera uma lista de usuários.
    Acesso restrito a superusuários é recomendado.
    """
    users = await user_crud.get_users(db=db, skip=skip, limit=limit)
    return users


@router.get("/{user_id}", response_model=schemas.User, summary="Obter usuário por ID")
async def read_user_by_id(
    user_id: uuid.UUID,
    db: Client = Depends(get_service_client)
    # current_user: schemas.User = Depends(get_current_active_superuser) # Ou verificar se é o próprio usuário
):
    """
    Obtém um usuário específico pelo seu ID.
    """
    db_user = await user_crud.get_user(db=db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuário não encontrado")
    return db_user

# TODO: Adicionar endpoints para PUT (atualizar usuário) e DELETE (deletar usuário)
# Estes também precisarão de lógica de permissão cuidadosa.

# É importante notar que para interagir com `auth.users` do Supabase,
# o backend precisaria da `service_role_key` para muitas operações,
# ou as operações seriam limitadas pelas Row Level Security (RLS) policies.
# Se estivermos usando uma tabela separada `user_profiles`, as RLS também se aplicam.
