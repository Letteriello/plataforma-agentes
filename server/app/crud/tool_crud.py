# server/app/crud/tool_crud.py
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timezone # Adicionado timezone

from supabase import Client, PostgrestAPIError
from app.models import schemas

async def create_tool(db: Client, *, tool_in: schemas.ToolCreate, owner_id: uuid.UUID) -> Optional[schemas.Tool]:
    """
    Cria uma nova ferramenta no banco de dados.
    """
    tool_data = tool_in.model_dump(exclude_unset=True)
    tool_data["owner_id"] = str(owner_id) # Garante que UUID seja string para Supabase
    # created_at e updated_at são gerenciados pelo DB (default now()) ou trigger
    
    try:
        response = await db.table("tools").insert(tool_data).execute()
        if response.data:
            created_tool_data = response.data[0]
            return schemas.Tool(**created_tool_data)
        print(f"Supabase create_tool response sem data: {response.status_code} {response.error}")
        return None
    except PostgrestAPIError as e:
        print(f"Erro Postgrest ao criar ferramenta: {e.message} (Code: {e.code}, Details: {e.details}, Hint: {e.hint})")
        return None
    except Exception as e:
        print(f"Erro inesperado ao criar ferramenta: {e}")
        return None

async def get_tool(db: Client, tool_id: uuid.UUID) -> Optional[schemas.Tool]:
    """
    Obtém uma ferramenta pelo seu ID.
    """
    try:
        response = await db.table("tools").select("*").eq("id", str(tool_id)).maybe_single().execute()
        if response.data:
            return schemas.Tool(**response.data)
        return None
    except PostgrestAPIError as e:
        print(f"Erro Postgrest ao buscar ferramenta: {e.message}")
        return None
    except Exception as e:
        print(f"Erro inesperado ao buscar ferramenta: {e}")
        return None

async def get_tools(db: Client, skip: int = 0, limit: int = 100) -> List[schemas.Tool]:
    """
    Obtém uma lista de todas as ferramentas.
    """
    try:
        response = await db.table("tools").select("*").order("created_at", desc=True).offset(skip).limit(limit).execute()
        if response.data:
            return [schemas.Tool(**tool_data) for tool_data in response.data]
        return []
    except PostgrestAPIError as e:
        print(f"Erro Postgrest ao listar ferramentas: {e.message}")
        return []
    except Exception as e:
        print(f"Erro inesperado ao listar ferramentas: {e}")
        return []

async def get_tools_by_owner(db: Client, owner_id: uuid.UUID, skip: int = 0, limit: int = 100) -> List[schemas.Tool]:
    """
    Obtém uma lista de ferramentas por owner_id.
    """
    try:
        response = await db.table("tools").select("*").eq("owner_id", str(owner_id)).order("created_at", desc=True).offset(skip).limit(limit).execute()
        if response.data:
            return [schemas.Tool(**tool_data) for tool_data in response.data]
        return []
    except PostgrestAPIError as e:
        print(f"Erro Postgrest ao listar ferramentas por proprietário: {e.message}")
        return []
    except Exception as e:
        print(f"Erro inesperado ao listar ferramentas por proprietário: {e}")
        return []

async def update_tool(db: Client, tool_id: uuid.UUID, tool_in: schemas.ToolUpdate, current_owner_id: uuid.UUID) -> Optional[schemas.Tool]:
    """
    Atualiza uma ferramenta existente. Somente o proprietário pode atualizar.
    """
    update_data = tool_in.model_dump(exclude_unset=True)
    if not update_data:
        return await get_tool(db, tool_id=tool_id) # Retorna o original se não há o que atualizar

    # Garante que updated_at seja atualizado
    update_data["updated_at"] = datetime.now(timezone.utc).isoformat()

    try:
        # Verifica se o usuário atual é o proprietário da ferramenta
        tool_to_update = await get_tool(db, tool_id=tool_id)
        if not tool_to_update:
            return None # Ferramenta não encontrada
        if tool_to_update.owner_id != current_owner_id:
            # Idealmente, isso seria uma HTTPException(status.HTTP_403_FORBIDDEN) no router
            print(f"Usuário {current_owner_id} não autorizado a atualizar ferramenta {tool_id} de {tool_to_update.owner_id}")
            return None # Não autorizado

        response = await db.table("tools").update(update_data).eq("id", str(tool_id)).execute()
        if response.data:
            return schemas.Tool(**response.data[0])
        # Se o update não retornou dados, mas não deu erro, pode ser RLS ou o item não foi encontrado após a verificação.
        # Retornar None é mais seguro do que retornar o item antigo, pois o update pode não ter ocorrido.
        print(f"Supabase update_tool response sem data: {response.status_code} {response.error}")
        return None 

    except PostgrestAPIError as e:
        print(f"Erro Postgrest ao atualizar ferramenta: {e.message}")
        return None
    except Exception as e:
        print(f"Erro inesperado ao atualizar ferramenta: {e}")
        return None

async def delete_tool(db: Client, tool_id: uuid.UUID, current_owner_id: uuid.UUID) -> Optional[schemas.Tool]:
    """
    Deleta uma ferramenta. Somente o proprietário pode deletar. Retorna a ferramenta deletada.
    """
    try:
        tool_to_delete = await get_tool(db, tool_id=tool_id)
        if not tool_to_delete:
            return None # Ferramenta não encontrada
        if tool_to_delete.owner_id != current_owner_id:
            # Idealmente, isso seria uma HTTPException(status.HTTP_403_FORBIDDEN) no router
            print(f"Usuário {current_owner_id} não autorizado a deletar ferramenta {tool_id} de {tool_to_delete.owner_id}")
            return None # Não autorizado

        response = await db.table("tools").delete().eq("id", str(tool_id)).execute()
        
        if response.data:
             return schemas.Tool(**response.data[0])
        
        # Se não retornou dados, mas não houve erro, a deleção ocorreu.
        # Retornamos o objeto que buscamos antes da deleção como confirmação.
        return tool_to_delete

    except PostgrestAPIError as e:
        print(f"Erro Postgrest ao deletar ferramenta: {e.message}")
        return None
    except Exception as e:
        print(f"Erro inesperado ao deletar ferramenta: {e}")
        return None
