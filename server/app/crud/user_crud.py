# server/app/crud/user_crud.py
from supabase import Client, PostgrestAPIResponse
from fastapi import HTTPException, status
from typing import Optional, List
import uuid
from datetime import datetime # Adicionado para simulação

from app.models import schemas
from app.core.security import get_password_hash # Precisaremos criar este módulo/função

async def create_user(db: Client, user: schemas.UserCreate) -> Optional[schemas.User]:
    """
    Cria um novo usuário no Supabase.
    Utiliza a função de sign_up do Supabase Auth.
    """
    try:
        # Idealmente, o Supabase Auth lida com o hashing da senha.
        # Se estivermos criando usuários diretamente na tabela 'users' (não recomendado para auth),
        # precisaríamos hashear a senha aqui.
        # Por agora, vamos assumir que usaremos Supabase Auth para o registro.
        
        # O Supabase Auth sign_up retorna um objeto UserResponse que contém o usuário e a sessão.
        # Se você estiver usando a tabela 'users' diretamente, o fluxo seria diferente.
        # Para este exemplo, vamos focar no Supabase Auth.
        
        # Nota: Supabase Python client `gotrue.errors.AuthApiError: User already registered`
        # é uma exceção comum aqui.
        
        # O Supabase Auth sign_up não retorna diretamente o objeto User como definido em schemas.User.
        # Ele retorna um objeto User da biblioteca supabase-py.
        # Precisaremos mapear isso ou, mais comumente, o registro é feito pelo frontend
        # e o backend apenas lida com usuários já autenticados ou gerencia dados adicionais.

        # Para simplificar o CRUD inicial, vamos simular a criação e assumir que
        # o Supabase Auth cuidará do registro real e do hashing.
        # Em uma implementação real, você chamaria:
        # response = db.auth.sign_up({
        #     "email": user.email,
        #     "password": user.password,
        #     "options": {
        #         "data": {
        #             "full_name": user.full_name
        #         }
        #     }
        # })
        # if response.user:
        #     # O ID do usuário e outros campos viriam da resposta do Supabase Auth
        #     # Precisamos adaptar para o nosso schema.User
        #     # Este é um ponto complexo na integração direta com Supabase Auth via backend CRUD.
        #     # Geralmente, o frontend faz o sign_up.
        #     # Se o backend PRECISA criar usuários, pode usar o admin API:
        #     # admin_user = db.auth.admin.create_user({
        #     #    "email": user.email, "password": user.password, "email_confirm": True,
        #     #    "user_metadata": {"full_name": user.full_name}
        #     # })
        #     # return schemas.User(**admin_user.dict()) # Adaptação necessária
        #     pass # Placeholder para lógica de criação real
        # else:
        #     # Tratar erro de criação (ex: usuário já existe)
        #     # A biblioteca supabase-py levantará uma exceção em caso de erro.
        #     raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User already exists or invalid data")

        # *** Simulação para CRUD inicial, focando na estrutura ***
        # Em um cenário real, esta função seria mais complexa ou o fluxo de criação de usuário
        # seria tratado de forma diferente (ex: via Supabase Auth diretamente do frontend,
        # ou usando as funções de admin do Supabase Auth no backend).

        # Para este CRUD, vamos assumir que estamos inserindo em uma tabela 'users'
        # que espelha `auth.users` ou é uma tabela de perfis.
        # Se for a tabela `auth.users`, ela é gerenciada pelo Supabase Auth.
        
        # Vamos criar uma função para obter um usuário, que é mais direto.
        # A criação de usuário é mais complexa devido ao Supabase Auth.

        # Placeholder: A lógica de criação de usuário real com Supabase Auth
        # é tipicamente feita via `db.auth.sign_up` ou `db.auth.admin.create_user`.
        # Este CRUD servirá mais para ler e, potencialmente, atualizar dados de perfil
        # que não estão diretamente no `auth.users` ou que o admin pode gerenciar.
        
        # Para o propósito deste CRUD inicial, vamos focar em `get_user` e `get_users`.
        # A criação será um placeholder por enquanto.
        print(f"Simulando criação de usuário: {user.email}")
        # Esta é uma simplificação extrema. Não use em produção para auth.
        # hashed_password = get_password_hash(user.password) # Removido pois get_password_hash não é async
        
        # Supondo uma tabela 'user_profiles' ou similar, não a 'auth.users' diretamente.
        # Se for 'auth.users', a inserção direta não é a maneira padrão.
        # data, error = await db.table("users").insert({ # Usar await se for async
        # data, count = db.table("user_profiles").insert({ # Exemplo de tabela de perfis
        #     "email": user.email,
        #     "full_name": user.full_name,
        #     # "hashed_password": hashed_password, # Se guardando senha aqui, o que não é ideal se usando Supabase Auth
        #     # "is_active": True,
        #     # "is_superuser": False
        # }).execute()
        # if error:
        #     raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=error.message)
        # if data and len(data[1]) > 0:
        #     created_user_data = data[1][0]
        #     # Mapear para schemas.User, incluindo id, created_at, updated_at que seriam gerados pelo DB
        #     return schemas.User(**created_user_data, id=uuid.uuid4(), created_at=datetime.utcnow(), updated_at=datetime.utcnow()) # Simulação
        
        # Retornando None para indicar que a criação real é complexa e fora do escopo deste CRUD simples.
        # O foco será em get_user.
        raise NotImplementedError("User creation via backend CRUD with Supabase Auth needs careful design. Typically handled by Supabase client libs or admin functions.")

    except NotImplementedError as nie:
        raise nie # Re-lança para o router tratar
    except Exception as e: # Captura AuthApiError do Supabase ou outras exceções
        # Logar o erro e.args ou str(e)
        print(f"Error in create_user: {e}")
        # Não levante HTTPException genérica aqui, deixe o router decidir ou trate erros específicos do Supabase.
        # Se for um erro específico do Supabase Auth (ex: usuário já existe), pode ser um 400 ou 409.
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Internal server error during user creation: {str(e)}")


async def get_user(db: Client, user_id: uuid.UUID) -> Optional[schemas.User]:
    """
    Obtém um usuário pelo ID.
    Isso pode buscar da tabela 'auth.users' (via admin API) ou de uma tabela de perfis.
    """
    try:
        # Exemplo buscando de uma tabela 'user_profiles'
        # Assegure-se que esta tabela 'user_profiles' exista no seu Supabase DB
        # e tenha colunas correspondentes a schemas.User (id, email, full_name, is_active, is_superuser, created_at, updated_at)
        response: PostgrestAPIResponse = await db.table("user_profiles").select("*").eq("id", str(user_id)).maybe_single().execute()
        if response.data:
            return schemas.User(**response.data)
        return None
    except Exception as e:
        print(f"Error in get_user (user_id: {user_id}): {e}")
        # Não levantar HTTPException aqui, deixar o router tratar se for None
        return None

async def get_user_by_email(db: Client, email: str) -> Optional[schemas.User]:
    """
    Obtém um usuário pelo email.
    """
    try:
        # Exemplo buscando de uma tabela 'user_profiles'
        response: PostgrestAPIResponse = await db.table("user_profiles").select("*").eq("email", email).maybe_single().execute()
        if response.data:
            return schemas.User(**response.data)
        return None
    except Exception as e:
        print(f"Error in get_user_by_email (email: {email}): {e}")
        return None

async def get_users(db: Client, skip: int = 0, limit: int = 100) -> List[schemas.User]:
    """
    Obtém uma lista de usuários.
    """
    try:
        # Exemplo buscando de uma tabela 'user_profiles'
        response: PostgrestAPIResponse = await db.table("user_profiles").select("*").offset(skip).limit(limit).execute()
        if response.data:
            return [schemas.User(**user_data) for user_data in response.data]
        return []
    except Exception as e:
        print(f"Error in get_users: {e}")
        return []

# Funções de Update e Delete seriam similares, usando db.table("user_profiles").update({...}).eq(...).execute()
# e db.table("user_profiles").delete().eq(...).execute()

# Nota: A interação direta com a tabela `auth.users` do Supabase para operações de escrita (create, update, delete)
# geralmente não é feita via PostgREST diretamente do backend, mas sim através das funções
# `db.auth.admin.*` que requerem a service_role_key, ou pelo frontend usando a anon_key.
# Este CRUD assume uma tabela `user_profiles` para dados adicionais ou um cenário onde o admin gerencia perfis.
# Se a tabela 'user_profiles' não existir, estas queries falharão. Crie-a no Supabase com os campos esperados.
