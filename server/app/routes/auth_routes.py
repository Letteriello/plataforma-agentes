from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm 
from pydantic import BaseModel
from typing import Optional # Para campos opcionais em schemas
import uuid # Para o tipo de ID do usuário
from datetime import datetime # Para timestamps

from postgrest import APIError # Para erros específicos do Supabase

from .. import supabase_client 
from ..security import create_access_token 

router = APIRouter(
    tags=["Authentication"],
)

class Token(BaseModel):
    access_token: str
    token_type: str

class UserCreateSchema(BaseModel):
    email: str
    password: str
    # full_name: Optional[str] = None # Exemplo se quiser coletar mais dados

class UserResponseSchema(BaseModel): 
    id: uuid.UUID
    email: str
    created_at: datetime

@router.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    user_email = form_data.username 
    plain_password = form_data.password
    try:
        auth_response = supabase_client.supabase.auth.sign_in_with_password({
            "email": user_email,
            "password": plain_password
        })
        if auth_response.user:
            user_id = auth_response.user.id
            access_token = create_access_token(
                data={"sub": str(user_id)} 
            )
            return {"access_token": access_token, "token_type": "bearer"}
        else:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password (no user data)",
                headers={"WWW-Authenticate": "Bearer"},
            )
    except APIError as e: # Captura erros específicos do Supabase (como credenciais inválidas)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Incorrect email or password: {e.message}",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except Exception as e: 
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An unexpected error occurred during login: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )

@router.post("/register", response_model=UserResponseSchema, status_code=status.HTTP_201_CREATED)
async def register_new_user(user_data: UserCreateSchema):
    try:
        # sign_up_options = {}
        # if user_data.full_name:
        #     sign_up_options['data'] = {'full_name': user_data.full_name}
        
        auth_response = supabase_client.supabase.auth.sign_up({
            "email": user_data.email,
            "password": user_data.password,
            # "options": sign_up_options
        })

        if auth_response.user:
            return UserResponseSchema(
                id=auth_response.user.id,
                email=auth_response.user.email,
                created_at=auth_response.user.created_at
            )
        # Supabase client >= 1.0.0 pode retornar um objeto de erro dentro da resposta de sucesso
        # em vez de levantar uma exceção para certos erros (ex: usuário já existe).
        # A documentação do supabase-py ou testes seriam necessários para confirmar o comportamento exato.
        # O exemplo abaixo assume que um erro na resposta indica falha.
        # No entanto, o `auth_response.user` sendo None e `auth_response.session` sendo None
        # após um sign_up geralmente indica que um email de confirmação é necessário,
        # mas o usuário FOI criado. Se o usuário já existe, o Supabase retorna um erro específico.

        # Tentativa de tratamento de erro mais granular baseado na estrutura de resposta do Supabase:
        # (Esta parte pode precisar de ajuste com base no comportamento real do supabase-py para erros de sign_up)
        if hasattr(auth_response, 'error') and auth_response.error:
             raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Failed to register user: {auth_response.error.message}"
            )
        # Se user é None mas não há erro explícito, pode ser um caso não esperado ou que requer confirmação.
        # Para o propósito da API, se o user object não é retornado, consideramos falha.
        if not auth_response.user:
             raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, # Ou 500 se for um estado inesperado
                detail="Failed to register user: User object not returned and no explicit error."
            )
            
    except APIError as e: 
        # Exemplo: "User already registered" resultará em APIError com status 400 ou 422
        # O código de erro exato e status podem variar.
        error_detail = f"Registration failed: {e.message}"
        error_status_code = status.HTTP_400_BAD_REQUEST # Default
        if hasattr(e, 'status_code'): # Se o APIError tiver um status_code
            error_status_code = e.status_code
        if "User already registered" in e.message:
            error_status_code = status.HTTP_409_CONFLICT
            error_detail = "User with this email already exists."

        raise HTTPException(
            status_code=error_status_code,
            detail=error_detail
        )
    except HTTPException: 
        raise
    except Exception as e: 
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An unexpected error occurred during registration: {str(e)}"
        )
