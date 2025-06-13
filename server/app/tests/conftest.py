import pytest
import asyncio
import uuid # Adicionado para a fixture test_user_email original (e pode ser útil depois)
from typing import Optional # Adicionado para type hints

from httpx import AsyncClient

from app.main import app  # Importa a instância da aplicação FastAPI
from app.models import schemas # Adicionado para o type hint em test_user

@pytest.fixture(scope="session")
def event_loop():
    """Redefine o event loop para o escopo da sessão para evitar conflitos com asyncio."""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()

@pytest.fixture(scope="module")
async def async_client() -> AsyncClient:
    """Fixture para criar um AsyncClient para fazer requisições à API."""
    async with AsyncClient(app=app, base_url="http://test") as client:
        yield client

# --- User and Auth Fixtures ---

import uuid # Certifique-se que uuid está importado no topo do conftest.py

@pytest.fixture(scope="session")
def test_user_email() -> str:
    # Usaremos um email fixo por enquanto para facilitar a criação manual do usuário no Supabase.
    # Em um fluxo mais avançado, poderíamos usar emails dinâmicos e criar/limpar usuários programaticamente.
    return "test.user.for.pytest@example.com"

@pytest.fixture(scope="session")
def test_user_password() -> str:
    return "TestPassword123!"

@pytest.fixture(scope="session")
async def test_user(async_client: AsyncClient, test_user_email: str, test_user_password: str) -> Optional[schemas.User]:
    """
    Fixture para criar um usuário de teste via API (se o endpoint de criação estiver funcional)
    ou para definir um usuário de teste existente.
    NOTA: A criação de usuário via API /users/ POST é um placeholder e retorna 501.
    Para testes reais, este usuário precisaria ser criado diretamente no Supabase Auth
    ou através de uma função de admin se disponível.
    
    Por agora, esta fixture servirá mais como um placeholder para os dados do usuário.
    O token será obtido usando estas credenciais, assumindo que o usuário existe no Supabase.
    """
    # Simulação: Assumimos que o usuário com test_user_email e test_user_password já existe no Supabase de teste.
    # Em um setup de teste completo, você garantiria a existência deste usuário.
    # Exemplo de como poderia ser se a API de criação funcionasse:
    # user_data = {"email": test_user_email, "password": test_user_password, "full_name": "Test User"}
    # response = await async_client.post("/api/v1/users/", json=user_data) 
    # if response.status_code == 201:
    #     return schemas.User(**response.json())
    # return None
    
    # Placeholder: Retorna um schema de usuário simulado. O ID não será real do DB.
    return schemas.User(id=uuid.uuid4(), email=test_user_email, full_name="Test User", is_active=True, is_superuser=False)


@pytest.fixture(scope="session")
async def test_user_token(async_client: AsyncClient, test_user_email: str, test_user_password: str) -> Optional[str]:
    """Obtém um token JWT para o usuário de teste."""
    login_data = {
        "username": test_user_email, # O endpoint de token espera 'username'
        "password": test_user_password
    }
    try:
        response = await async_client.post("/api/v1/auth/token", data=login_data)
        response.raise_for_status() # Levanta exceção para respostas 4xx/5xx
        token_data = response.json()
        return token_data.get("access_token")
    except Exception as e:
        print(f"Falha ao obter token para {test_user_email}: {e}")
        # Se não conseguir obter o token, os testes que dependem dele falharão ou usarão o token FAKE.
        # Isso ajuda a identificar problemas no fluxo de autenticação.
        return None

@pytest.fixture
async def test_user_token_headers(test_user_token: Optional[str]) -> dict:
    if test_user_token:
        return {"Authorization": f"Bearer {test_user_token}"}
    return {"Authorization": "Bearer FAKE_USER_TOKEN"} # Fallback para token fake


# --- Superuser Fixtures ---
@pytest.fixture(scope="session")
def test_superuser_email() -> str:
    return "superuser.pytest@example.com" # Defina o email do seu superusuário de teste

@pytest.fixture(scope="session")
def test_superuser_password() -> str:
    return "SuperPassword123!" # Defina a senha do seu superusuário de teste

@pytest.fixture(scope="session")
async def test_superuser(async_client: AsyncClient, test_superuser_email: str, test_superuser_password: str) -> Optional[schemas.User]:
    # Assumindo que o superusuário já existe no Supabase de teste e tem o campo is_superuser = True
    return schemas.User(id=uuid.uuid4(), email=test_superuser_email, full_name="Super User", is_active=True, is_superuser=True)

@pytest.fixture(scope="session")
async def test_superuser_token(async_client: AsyncClient, test_superuser_email: str, test_superuser_password: str) -> Optional[str]:
    login_data = {"username": test_superuser_email, "password": test_superuser_password}
    try:
        response = await async_client.post("/api/v1/auth/token", data=login_data)
        response.raise_for_status()
        return response.json().get("access_token")
    except Exception as e:
        print(f"Falha ao obter token para SUPERUSER {test_superuser_email}: {e}")
        return None

@pytest.fixture
async def test_superuser_token_headers(test_superuser_token: Optional[str]) -> dict:
    if test_superuser_token:
        return {"Authorization": f"Bearer {test_superuser_token}"}
    return {"Authorization": "Bearer FAKE_SUPERUSER_TOKEN"}

# --- Another User Fixtures (for cross-access tests) ---
@pytest.fixture(scope="session")
def test_another_user_email() -> str:
    return "another.user.pytest@example.com"

@pytest.fixture(scope="session")
def test_another_user_password() -> str:
    return "AnotherPassword123!"

@pytest.fixture(scope="session")
async def test_another_user(async_client: AsyncClient, test_another_user_email: str, test_another_user_password: str) -> Optional[schemas.User]:
    # Assumindo que este usuário já existe no Supabase de teste.
    return schemas.User(id=uuid.uuid4(), email=test_another_user_email, full_name="Another User", is_active=True, is_superuser=False)

@pytest.fixture(scope="session")
async def test_another_user_token(async_client: AsyncClient, test_another_user_email: str, test_another_user_password: str) -> Optional[str]:
    login_data = {"username": test_another_user_email, "password": test_another_user_password}
    try:
        response = await async_client.post("/api/v1/auth/token", data=login_data)
        response.raise_for_status()
        return response.json().get("access_token")
    except Exception as e:
        print(f"Falha ao obter token para ANOTHER_USER {test_another_user_email}: {e}")
        return None

@pytest.fixture
async def test_another_user_token_headers(test_another_user_token: Optional[str]) -> dict:
    if test_another_user_token:
        return {"Authorization": f"Bearer {test_another_user_token}"}
    return {"Authorization": "Bearer FAKE_ANOTHER_USER_TOKEN"}


# --- Data Fixtures (Example for Agents) ---

@pytest.fixture
async def created_agent_id(async_client: AsyncClient, test_user_token_headers: dict) -> Optional[str]:
    """
    Fixture para criar um agente usando test_user e retornar seu ID.
    Limpa (deleta) o agente após o teste.
    Retorna None se a criação falhar.
    """
    if "FAKE_USER_TOKEN" in test_user_token_headers.get("Authorization", ""):
        # Não tentar criar/deletar com token fake, pois falhará e pode poluir logs
        print("\nSkipping agent creation/deletion due to FAKE_USER_TOKEN.")
        yield None # Ou um ID de placeholder se os testes puderem lidar com isso
        return

    agent_data = {
        "name": f"AgentForTest-{uuid.uuid4()}",
        "description": "Agent created for automated testing",
        "model": "test-fixture-model",
        "instruction": "This agent is for testing purposes.",
        "tool_ids": []
    }
    agent_id = None
    try:
        response = await async_client.post("/api/v1/agents/", json=agent_data, headers=test_user_token_headers)
        response.raise_for_status() # Garante que a criação foi bem-sucedida (201)
        agent_id = response.json().get("id")
        print(f"\nAgent {agent_id} created for test by {test_user_email}")
        yield agent_id
    except Exception as e:
        print(f"\nError creating agent for test: {e}. Response: {response.text if 'response' in locals() else 'N/A'}")
        yield None # Teste que usa esta fixture provavelmente falhará ou deve pular
    finally:
        if agent_id:
            try:
                delete_response = await async_client.delete(f"/api/v1/agents/{agent_id}", headers=test_user_token_headers)
                delete_response.raise_for_status() # Garante que a deleção foi bem-sucedida
                print(f"\nAgent {agent_id} deleted after test.")
            except Exception as e_del:
                print(f"\nError deleting agent {agent_id} after test: {e_del}. Response: {delete_response.text if 'delete_response' in locals() else 'N/A'}")

# Aqui poderão ser adicionadas fixtures para:
# - Setup e teardown de dados no banco de teste (se aplicável)
# Por exemplo, criar um agente específico antes de um teste e deletá-lo depois.
