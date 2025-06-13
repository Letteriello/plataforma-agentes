import pytest
from httpx import AsyncClient
import uuid

from app.models import schemas

# TODO: Importar ou definir aqui fixtures para:
# - test_user_token_headers: Cabeçalho de autenticação para usuário normal
# - test_superuser_token_headers: Cabeçalho de autenticação para superusuário
# - test_user: Objeto do usuário de teste normal
# - test_another_user_token_headers: Cabeçalho para um segundo usuário normal (para testes de acesso cruzado)

# As fixtures de token (test_user_token_headers, test_superuser_token_headers, etc.)
# agora são importadas de conftest.py e devem fornecer tokens reais ou fallbacks.


@pytest.mark.asyncio
async def test_create_agent_success(async_client: AsyncClient, test_user_token_headers: dict):
    if "FAKE_USER_TOKEN" in test_user_token_headers.get("Authorization", ""):
        pytest.skip("Skipping test, real token not available for test_user_token_headers")

    agent_data = {
        "name": f"My Test Agent {uuid.uuid4()}",
        "description": "A test agent for API checks",
        "model": "test-model-v1",
        "instruction": "Be helpful.",
        "temperature": 0.7,
        "max_output_tokens": 512,
        "tool_ids": []
    }
    response = await async_client.post("/api/v1/agents/", json=agent_data, headers=test_user_token_headers)
    assert response.status_code == 201
    created_agent = response.json()
    assert created_agent["name"] == agent_data["name"]
    assert "id" in created_agent
    # A limpeza será feita pela fixture created_agent_id se este agente for usado em outros testes,
    # ou manualmente se necessário para este teste específico.
    # Por enquanto, este agente criado aqui não é automaticamente limpo por uma fixture.
    # Para limpeza, podemos deletá-lo explicitamente no final do teste ou usar a fixture `created_agent_id`.
    if created_agent.get("id"):
        await async_client.delete(f"/api/v1/agents/{created_agent['id']}", headers=test_user_token_headers)


@pytest.mark.asyncio
async def test_read_my_agents_success(async_client: AsyncClient, test_user_token_headers: dict):
    if "FAKE_USER_TOKEN" in test_user_token_headers.get("Authorization", ""):
        pytest.skip("Skipping test, real token not available for test_user_token_headers")
    response = await async_client.get("/api/v1/agents/my", headers=test_user_token_headers)
    assert response.status_code == 200
    agents = response.json()
    assert isinstance(agents, list)

@pytest.mark.asyncio
async def test_read_all_agents_as_superuser_success(async_client: AsyncClient, test_superuser_token_headers: dict):
    if "FAKE_SUPERUSER_TOKEN" in test_superuser_token_headers.get("Authorization", ""):
        pytest.skip("Skipping test, real token not available for test_superuser_token_headers")
    response = await async_client.get("/api/v1/agents/", headers=test_superuser_token_headers)
    assert response.status_code == 200
    agents = response.json()
    assert isinstance(agents, list)

@pytest.mark.asyncio
async def test_read_all_agents_forbidden_for_normal_user(async_client: AsyncClient, test_user_token_headers: dict):
    if "FAKE_USER_TOKEN" in test_user_token_headers.get("Authorization", ""):
        pytest.skip("Skipping test, real token not available for test_user_token_headers")
    response = await async_client.get("/api/v1/agents/", headers=test_user_token_headers)
    assert response.status_code == 403 # Usuário normal não pode listar todos os agentes

# --- Testes de acesso a um agente específico usando a fixture created_agent_id ---

@pytest.mark.asyncio
async def test_read_specific_agent_owner_success(async_client: AsyncClient, test_user_token_headers: dict, created_agent_id: Optional[str]):
    if not created_agent_id:
        pytest.skip("Agent creation failed or skipped, cannot run test")
    
    response = await async_client.get(f"/api/v1/agents/{created_agent_id}", headers=test_user_token_headers)
    assert response.status_code == 200
    agent = response.json()
    assert agent["id"] == created_agent_id

@pytest.mark.asyncio
async def test_read_specific_agent_other_user_forbidden(async_client: AsyncClient, test_another_user_token_headers: dict, created_agent_id: Optional[str]):
    if not created_agent_id:
        pytest.skip("Agent creation failed or skipped, cannot run test")
    if "FAKE_ANOTHER_USER_TOKEN" in test_another_user_token_headers.get("Authorization", ""):
        pytest.skip("Skipping test, real token not available for test_another_user_token_headers")

    response = await async_client.get(f"/api/v1/agents/{created_agent_id}", headers=test_another_user_token_headers)
    assert response.status_code == 404 # RLS deve fazer parecer que não existe para outro usuário

@pytest.mark.asyncio
async def test_update_agent_owner_success(async_client: AsyncClient, test_user_token_headers: dict, created_agent_id: Optional[str]):
    if not created_agent_id:
        pytest.skip("Agent creation failed or skipped, cannot run test")

    update_data = {"description": "Updated description for test agent"}
    response = await async_client.put(f"/api/v1/agents/{created_agent_id}", json=update_data, headers=test_user_token_headers)
    assert response.status_code == 200
    updated_agent = response.json()
    assert updated_agent["description"] == update_data["description"]

@pytest.mark.asyncio
async def test_update_agent_other_user_forbidden(async_client: AsyncClient, test_another_user_token_headers: dict, created_agent_id: Optional[str]):
    if not created_agent_id:
        pytest.skip("Agent creation failed or skipped, cannot run test")
    if "FAKE_ANOTHER_USER_TOKEN" in test_another_user_token_headers.get("Authorization", ""):
        pytest.skip("Skipping test, real token not available for test_another_user_token_headers")

    update_data = {"description": "Attempted update by another user"}
    response = await async_client.put(f"/api/v1/agents/{created_agent_id}", json=update_data, headers=test_another_user_token_headers)
    assert response.status_code == 404 # RLS deve fazer parecer que não existe

@pytest.mark.asyncio
async def test_delete_agent_owner_success(async_client: AsyncClient, test_user_token_headers: dict):
    # Este teste criará e deletará seu próprio agente para evitar conflito com a fixture `created_agent_id`
    # que também tenta deletar.
    if "FAKE_USER_TOKEN" in test_user_token_headers.get("Authorization", ""):
        pytest.skip("Skipping test, real token not available for test_user_token_headers")

    agent_data = {
        "name": f"AgentToDelete-{uuid.uuid4()}",
        "model": "test-model",
        "instruction": "temp agent"
    }
    create_response = await async_client.post("/api/v1/agents/", json=agent_data, headers=test_user_token_headers)
    assert create_response.status_code == 201
    agent_to_delete_id = create_response.json().get("id")
    assert agent_to_delete_id

    delete_response = await async_client.delete(f"/api/v1/agents/{agent_to_delete_id}", headers=test_user_token_headers)
    assert delete_response.status_code == 200
    assert delete_response.json()["id"] == agent_to_delete_id

    # Verificar que foi deletado
    get_response = await async_client.get(f"/api/v1/agents/{agent_to_delete_id}", headers=test_user_token_headers)
    assert get_response.status_code == 404

@pytest.mark.asyncio
async def test_delete_agent_other_user_forbidden(async_client: AsyncClient, test_another_user_token_headers: dict, created_agent_id: Optional[str]):
    if not created_agent_id:
        pytest.skip("Agent creation failed or skipped, cannot run test")
    if "FAKE_ANOTHER_USER_TOKEN" in test_another_user_token_headers.get("Authorization", ""):
        pytest.skip("Skipping test, real token not available for test_another_user_token_headers")

    response = await async_client.delete(f"/api/v1/agents/{created_agent_id}", headers=test_another_user_token_headers)
    assert response.status_code == 404 # RLS deve fazer parecer que não existe

# TODO:
# - Testes para superusuário tentando modificar/deletar agentes de outros usuários (deve ser permitido).
# - Testar tool_ids na criação e atualização de agentes.

