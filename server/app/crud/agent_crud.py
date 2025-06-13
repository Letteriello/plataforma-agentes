# server/app/crud/agent_crud.py
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timezone

from supabase import Client, PostgrestAPIError
from app.models import schemas
from app.crud import tool_crud # Para buscar detalhes das ferramentas

async def _get_tools_for_agent(db: Client, agent_id: uuid.UUID) -> List[schemas.Tool]:
    """Helper para buscar ferramentas associadas a um agente."""
    tools = []
    try:
        # 1. Buscar IDs das ferramentas da tabela de junção agent_tools
        response_junction = await db.table("agent_tools").select("tool_id").eq("agent_id", str(agent_id)).execute()
        if response_junction.data:
            tool_ids = [item["tool_id"] for item in response_junction.data]
            # 2. Buscar os objetos Tool completos para cada ID
            for tool_id_str in tool_ids:
                tool = await tool_crud.get_tool(db, tool_id=uuid.UUID(tool_id_str))
                if tool:
                    tools.append(tool)
    except PostgrestAPIError as e:
        print(f"Erro ao buscar ferramentas para o agente {agent_id}: {e.message}")
    except Exception as e:
        print(f"Erro inesperado ao buscar ferramentas para o agente {agent_id}: {e}")
    return tools

async def create_agent(db: Client, *, agent_in: schemas.AgentCreate, user_id: uuid.UUID) -> Optional[schemas.Agent]:
    """
    Cria um novo agente e suas associações com ferramentas.
    """
    agent_data_dict = agent_in.model_dump(exclude={"tool_ids"}, exclude_unset=True)
    agent_data_dict["user_id"] = str(user_id) # Garante que o user_id seja o do usuário autenticado

    try:
        # Inserir o agente na tabela 'agents'
        response_agent = await db.table("agents").insert(agent_data_dict).execute()
        if not response_agent.data:
            print(f"Falha ao criar agente no Supabase: {response_agent.status_code} {response_agent.error}")
            return None
        
        created_agent_data = response_agent.data[0]
        agent_id = uuid.UUID(created_agent_data["id"])

        # Lidar com associações de ferramentas
        associated_tools = []
        if agent_in.tool_ids:
            for tool_id_str in agent_in.tool_ids:
                tool = await tool_crud.get_tool(db, tool_id=uuid.UUID(str(tool_id_str))) # Ensure tool_id_str is string for UUID
                if tool:
                    await db.table("agent_tools").insert({"agent_id": str(agent_id), "tool_id": str(tool_id_str)}).execute()
                    associated_tools.append(tool)
                else:
                    print(f"Aviso: Ferramenta com ID {tool_id_str} não encontrada ou inacessível, não associada ao agente {agent_id}.")
        
        final_agent_data = {**created_agent_data, "tools": associated_tools}
        return schemas.Agent(**final_agent_data)

    except PostgrestAPIError as e:
        print(f"Erro Postgrest ao criar agente: {e.message} (Code: {e.code}, Details: {e.details}, Hint: {e.hint})")
        return None
    except Exception as e:
        print(f"Erro inesperado ao criar agente: {e}")
        return None

async def get_agent(db: Client, agent_id: uuid.UUID) -> Optional[schemas.Agent]:
    """
    Obtém um agente pelo seu ID, incluindo suas ferramentas associadas.
    """
    try:
        response = await db.table("agents").select("*").eq("id", str(agent_id)).maybe_single().execute()
        if response.data:
            agent_data = response.data
            agent_data["tools"] = await _get_tools_for_agent(db, agent_id=uuid.UUID(agent_data["id"]))
            return schemas.Agent(**agent_data)
        return None
    except PostgrestAPIError as e:
        print(f"Erro Postgrest ao buscar agente: {e.message}")
        return None
    except Exception as e:
        print(f"Erro inesperado ao buscar agente: {e}")
        return None

async def get_agents_by_user(db: Client, user_id: uuid.UUID, skip: int = 0, limit: int = 100) -> List[schemas.Agent]:
    """
    Obtém uma lista de agentes por user_id, incluindo suas ferramentas.
    """
    agents_list = []
    try:
        response = await db.table("agents").select("*").eq("user_id", str(user_id)).order("created_at", desc=True).offset(skip).limit(limit).execute()
        if response.data:
            for agent_data in response.data:
                agent_data["tools"] = await _get_tools_for_agent(db, agent_id=uuid.UUID(agent_data["id"]))
                agents_list.append(schemas.Agent(**agent_data))
        return agents_list
    except PostgrestAPIError as e:
        print(f"Erro Postgrest ao listar agentes por usuário: {e.message}")
        return []
    except Exception as e:
        print(f"Erro inesperado ao listar agentes por usuário: {e}")
        return []

async def update_agent(db: Client, agent_id: uuid.UUID, agent_in: schemas.AgentUpdate, current_user_id: uuid.UUID) -> Optional[schemas.Agent]:
    """
    Atualiza um agente existente e suas associações de ferramentas.
    Somente o proprietário pode atualizar.
    """
    agent_to_update = await get_agent(db, agent_id=agent_id)
    if not agent_to_update:
        return None 
    if agent_to_update.user_id != current_user_id:
        print(f"Usuário {current_user_id} não autorizado a atualizar agente {agent_id} de {agent_to_update.user_id}")
        return None 

    update_data_dict = agent_in.model_dump(exclude={"tool_ids"}, exclude_unset=True)
    if update_data_dict:
        update_data_dict["updated_at"] = datetime.now(timezone.utc).isoformat()
        try:
            await db.table("agents").update(update_data_dict).eq("id", str(agent_id)).execute()
        except PostgrestAPIError as e:
            print(f"Erro Postgrest ao atualizar dados do agente {agent_id}: {e.message}")
            return None

    if agent_in.tool_ids is not None:
        try:
            await db.table("agent_tools").delete().eq("agent_id", str(agent_id)).execute()
            if agent_in.tool_ids:
                for tool_id_str in agent_in.tool_ids:
                    tool = await tool_crud.get_tool(db, tool_id=uuid.UUID(str(tool_id_str)))
                    if tool: 
                         await db.table("agent_tools").insert({"agent_id": str(agent_id), "tool_id": str(tool_id_str)}).execute()
                    else:
                        print(f"Aviso: Ferramenta com ID {tool_id_str} não encontrada, não associada ao agente {agent_id} durante atualização.")
        except PostgrestAPIError as e:
            print(f"Erro Postgrest ao atualizar associações de ferramentas para o agente {agent_id}: {e.message}")
            return None
            
    return await get_agent(db, agent_id=agent_id)


async def delete_agent(db: Client, agent_id: uuid.UUID, current_user_id: uuid.UUID) -> Optional[schemas.Agent]:
    """
    Deleta um agente e suas associações de ferramentas.
    Somente o proprietário pode deletar. Retorna o agente deletado.
    """
    agent_to_delete = await get_agent(db, agent_id=agent_id)
    if not agent_to_delete:
        return None
    if agent_to_delete.user_id != current_user_id:
        print(f"Usuário {current_user_id} não autorizado a deletar agente {agent_id} de {agent_to_delete.user_id}")
        return None

    try:
        # A FK com ON DELETE CASCADE na tabela agent_tools deve cuidar da remoção das associações.
        # Se não estiver configurado, descomente a linha abaixo:
        # await db.table("agent_tools").delete().eq("agent_id", str(agent_id)).execute()
        
        response = await db.table("agents").delete().eq("id", str(agent_id)).execute()
        
        if response.data:
            return agent_to_delete 
        
        return agent_to_delete

    except PostgrestAPIError as e:
        print(f"Erro Postgrest ao deletar agente: {e.message}")
        return None
    except Exception as e:
        print(f"Erro inesperado ao deletar agente: {e}")
        return None
