from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from supabase import Client, PostgrestAPIError # Adicionado PostgrestAPIError para tratar erros do Supabase
from gotrue.errors import AuthApiError # Para erros específicos de autenticação do Supabase

from app.models import schemas # Nossos schemas Pydantic
from app.core.db import get_supabase_client # Para obter o cliente Supabase
# from app.core.config import settings # Para API_V1_STR, se necessário aqui (já usado no main.py para prefixo)

router = APIRouter() # Removido tags=["Authentication"] aqui, será definido no main.py ao incluir o router

@router.post("/token", response_model=schemas.Token)
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Client = Depends(get_supabase_client)
):
    """
    Endpoint de login OAuth2.
    Utiliza email e senha para autenticar com Supabase Auth.
    Retorna um access_token JWT emitido pelo Supabase.
    """
    try:
        # Supabase usa email como username
        auth_response = await db.auth.sign_in_with_password(
            {"email": form_data.username, "password": form_data.password}
        )
        
        if auth_response.session and auth_response.session.access_token:
            return {
                "access_token": auth_response.session.access_token,
                "token_type": "bearer" # Tipo de token padrão
            }
        else:
            # Isso não deveria acontecer se não houver erro, mas é uma salvaguarda
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Falha na autenticação: resposta inesperada do Supabase",
                headers={"WWW-Authenticate": "Bearer"},
            )
            
    except AuthApiError as e:
        # Erros específicos da API de autenticação do Supabase (ex: "Invalid login credentials")
        detail_message = "Email ou senha incorretos."
        if "invalid login credentials" in str(e.message).lower():
            detail_message = "Email ou senha incorretos."
        elif "email not confirmed" in str(e.message).lower():
            detail_message = "Email não confirmado. Por favor, verifique sua caixa de entrada."
        else:
            detail_message = f"Erro de autenticação: {e.message}"
            print(f"AuthApiError: {e.status} - {e.message}") # Log do erro

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=detail_message,
            headers={"WWW-Authenticate": "Bearer"},
        )
    except Exception as e:
        # Outros erros inesperados
        print(f"Erro inesperado durante o login: {e}") # Log do erro
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Ocorreu um erro interno ao tentar fazer login.",
            headers={"WWW-Authenticate": "Bearer"},
        )

# Remover a linha de print antiga, pois o carregamento é gerenciado pelo FastAPI
# print("auth.py router carregado.")
