# server/app/dependencies/auth_deps.py
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from pydantic import ValidationError, EmailStr # Adicionado EmailStr
from supabase import Client
import uuid # Para converter user_id de string para UUID
from typing import Optional # Adicionado Optional

from app.core.config import settings
from app.core.db import get_supabase_client
from app.models import schemas
from app.crud import user_crud

# O tokenUrl deve apontar para o endpoint de login que criaremos em routers/auth.py
oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl=f"{settings.API_V1_STR}/auth/token" 
)

async def get_current_user(
    token: str = Depends(oauth2_scheme), 
    db: Client = Depends(get_supabase_client)
) -> schemas.User:
    """
    Decodifica o token JWT, valida e retorna o usuário atual.
    Este token é esperado ser o JWT emitido pelo Supabase Auth.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Não foi possível validar as credenciais",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        # Decodifica o token usando o JWT Secret do Supabase
        # O Supabase usa 'HS256' por padrão para seus JWTs.
        # O 'aud' (audiência) claim deve ser 'authenticated'.
        # O 'iss' (emissor) deve ser a URL do seu projeto Supabase + /auth/v1.
        payload = jwt.decode(
            token, 
            settings.SUPABASE_JWT_SECRET, 
            algorithms=["HS256"],
            audience="authenticated", # Audiência padrão para tokens Supabase
            options={"verify_iss": True, "issuer": f"{settings.SUPABASE_URL}/auth/v1"} # Habilitada verificação do emissor
        )
        
        # O ID do usuário no Supabase JWT está no claim 'sub' (subject)
        user_id_str: Optional[str] = payload.get("sub")
        if user_id_str is None:
            print("Claim 'sub' (user_id) não encontrado no token.")
            raise credentials_exception
        
        # O email pode estar no payload, dependendo da configuração do Supabase
        email_str: Optional[str] = payload.get("email") 
        
        # Validar email se presente, mas não obrigatório para TokenData
        valid_email: Optional[EmailStr] = None
        if email_str:
            try:
                valid_email = EmailStr(email_str)
            except ValueError:
                print(f"Formato de email inválido no token: {email_str}")
                # Não levantar exceção aqui, email é opcional em TokenData
                pass

        token_data = schemas.TokenData(user_id=uuid.UUID(user_id_str), email=valid_email)

    except JWTError as e:
        print(f"JWTError ao decodificar token: {e}") # Log do erro
        raise credentials_exception
    except ValidationError as e: # Se TokenData falhar na validação
        print(f"TokenData ValidationError: {e}") # Log do erro
        raise credentials_exception
    except ValueError: # Se a conversão de user_id_str para UUID falhar
        print(f"UUID ValueError para o claim 'sub': {user_id_str}") # Log do erro
        raise credentials_exception

    if token_data.user_id is None: # Verificação redundante se 'sub' já foi checado, mas seguro.
        raise credentials_exception
        
    # Busca o usuário na nossa tabela de perfis (user_profiles)
    user = await user_crud.get_user(db, user_id=token_data.user_id)
    
    if user is None:
        print(f"Usuário com ID {token_data.user_id} não encontrado na tabela de perfis.")
        raise credentials_exception
        
    if not user.is_active: 
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Usuário inativo")
        
    return user

async def get_current_active_user(
    current_user: schemas.User = Depends(get_current_user)
) -> schemas.User:
    """
    Wrapper para get_current_user que pode ser usado para verificações adicionais
    se necessário, mas por enquanto apenas garante que is_active foi verificado.
    """
    return current_user

async def get_current_active_superuser(
    current_user: schemas.User = Depends(get_current_user),
) -> schemas.User:
    """
    Verifica se o usuário atual é um superusuário.
    """
    if not current_user.is_superuser:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="O usuário não tem privilégios suficientes"
        )
    return current_user
