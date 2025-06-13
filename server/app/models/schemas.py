from pydantic import BaseModel, Field, EmailStr
from typing import Optional, List, Dict, Any
import uuid
from datetime import datetime

# Configuração para Pydantic v2 (se aplicável, senão orm_mode)
# class ConfigBase(BaseModel):
#     model_config = {"from_attributes": True}

# Schemas para Usuário
class UserBase(BaseModel):
    email: EmailStr = Field(..., description="Email do usuário")
    full_name: Optional[str] = Field(None, max_length=100, description="Nome completo do usuário")

class UserCreate(UserBase):
    password: str = Field(..., min_length=8, description="Senha do usuário")

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    full_name: Optional[str] = Field(None, max_length=100)
    password: Optional[str] = Field(None, min_length=8)
    is_active: Optional[bool] = None
    is_superuser: Optional[bool] = None

class User(UserBase):
    id: uuid.UUID
    is_active: bool = True
    is_superuser: bool = False
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True # Pydantic v2
        # orm_mode = True # Pydantic v1

# Schemas para Ferramenta (Tool)
class ToolBase(BaseModel):
    name: str = Field(..., min_length=3, max_length=100, description="Nome da ferramenta")
    description: Optional[str] = Field(None, max_length=500, description="Descrição da ferramenta")
    # O schema de entrada e saída pode ser complexo, usando Dict[str, Any] ou modelos Pydantic específicos
    input_schema: Optional[Dict[str, Any]] = Field(None, description="Schema JSON para a entrada da ferramenta")
    output_schema: Optional[Dict[str, Any]] = Field(None, description="Schema JSON para a saída da ferramenta")

class ToolCreate(ToolBase):
    pass

class ToolUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=3, max_length=100)
    description: Optional[str] = Field(None, max_length=500)
    input_schema: Optional[Dict[str, Any]] = None
    output_schema: Optional[Dict[str, Any]] = None

class Tool(ToolBase):
    id: uuid.UUID
    created_at: datetime
    updated_at: datetime
    # user_id: Optional[uuid.UUID] = None # Se a ferramenta for criada por um usuário específico

    class Config:
        from_attributes = True # Pydantic v2
        # orm_mode = True # Pydantic v1

# Schemas para Agente (Agent)
class AgentBase(BaseModel):
    name: str = Field(..., min_length=3, max_length=100, description="Nome do agente")
    description: Optional[str] = Field(None, max_length=500, description="Descrição do agente")
    system_prompt: Optional[str] = Field(None, description="Prompt de sistema para o agente")
    # Configuração do agente, pode ser um JSON ou um modelo Pydantic específico
    configuration: Optional[Dict[str, Any]] = Field(None, description="Configurações específicas do agente")

class AgentCreate(AgentBase):
    user_id: uuid.UUID # Agente deve ser associado a um usuário na criação
    tool_ids: Optional[List[uuid.UUID]] = Field(None, description="Lista de IDs de ferramentas associadas ao agente")

class AgentUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=3, max_length=100)
    description: Optional[str] = Field(None, max_length=500)
    system_prompt: Optional[str] = None
    configuration: Optional[Dict[str, Any]] = None
    tool_ids: Optional[List[uuid.UUID]] = None
    is_active: Optional[bool] = None

class Agent(AgentBase):
    id: uuid.UUID
    user_id: uuid.UUID
    is_active: bool = True
    created_at: datetime
    updated_at: datetime
    tools: Optional[List[Tool]] = [] # Para exibir ferramentas associadas, se carregadas

    class Config:
        from_attributes = True # Pydantic v2
        # orm_mode = True # Pydantic v1

# Schemas para Token JWT
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[EmailStr] = None
    user_id: Optional[uuid.UUID] = None
    # Adicionar outros campos que você queira no payload do token (ex: scopes)

print("schemas.py carregado e expandido com modelos User, Tool, Agent e Token.")
