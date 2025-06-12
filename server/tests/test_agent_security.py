from fastapi.testclient import TestClient
from typing import Dict, Tuple

# As fixtures test_user_1, test_user_2 e client são injetadas automaticamente pelo pytest a partir de conftest.py

AGENT_BASE_URL = "/api/v1/agents"

def test_create_agent_user1(client: TestClient, test_user_1: Tuple[Dict[str, any], str]):
    """Testa se o usuário 1 pode criar um agente."""
    user1_details, user1_token = test_user_1 # Alterado para user1_details
    agent_data = {
        "name": "Agente de Teste User1",
        "description": "Descrição do agente de teste do User1",
        "model_name": "gemini-1.5-pro-latest", # ou outro modelo válido
        "instructions": "Seja um agente de teste útil."
        # Adicione outros campos obrigatórios conforme o schema AgentCreate
    }
    response = client.post(
        AGENT_BASE_URL + "/",
        headers={"Authorization": f"Bearer {user1_token}"},
        json=agent_data
    )
    assert response.status_code == 200 # Ou 201, dependendo da sua API para criação
    created_agent = response.json()
    assert created_agent["name"] == agent_data["name"]
    assert "user_id" in created_agent, "Campo 'user_id' esperado na resposta do agente criado"
    assert created_agent["user_id"] == user1_details["id"], "user_id do agente criado não corresponde ao ID do usuário 1"
    # Guardar o ID do agente para testes subsequentes, se necessário
    # (Pode ser feito retornando o ID ou usando uma fixture/variável de classe)

def test_get_own_agents_user1(client: TestClient, test_user_1: Tuple[Dict[str, any], str]):
    """Testa se o usuário 1 pode listar seus próprios agentes."""
    user1_details, user1_token = test_user_1 # Alterado para user1_details

    # Primeiro, crie um agente para garantir que haja algo para listar
    agent_data = {
        "name": "Agente Listável User1",
        "description": "Agente para teste de listagem do User1",
        "model_name": "gemini-1.0-pro",
        "instructions": "Instruções para listagem."
    }
    create_response = client.post(
        AGENT_BASE_URL + "/",
        headers={"Authorization": f"Bearer {user1_token}"},
        json=agent_data
    )
    assert create_response.status_code == 200
    created_agent_id = create_response.json()["id"]

    response = client.get(
        AGENT_BASE_URL + "/",
        headers={"Authorization": f"Bearer {user1_token}"}
    )
    assert response.status_code == 200
    agents = response.json()
    assert isinstance(agents, list)
    # Verifica se o agente criado está na lista e se todos os agentes listados pertencem ao user1
    found_created_agent = False
    for agent in agents:
        assert "user_id" in agent, "Campo 'user_id' esperado nos agentes listados"
        assert agent["user_id"] == user1_details["id"], "Agente listado não pertence ao usuário 1"
        if agent["id"] == created_agent_id and agent["name"] == agent_data["name"]:
            found_created_agent = True
    assert found_created_agent, "Agente criado não encontrado na lista de agentes do usuário 1"


def test_user2_cannot_get_user1_agent_by_id(client: TestClient, test_user_1: Tuple[Dict[str, any], str], test_user_2: Tuple[Dict[str, any], str]):
    """Testa se o usuário 2 não pode obter um agente específico do usuário 1 pelo ID."""
    user1_details, user1_token = test_user_1 # Alterado para user1_details
    user2_details, user2_token = test_user_2 # Alterado para user2_details

    # User 1 cria um agente
    agent_data_user1 = {
        "name": "Agente Secreto User1",
        "description": "Agente que User2 não deve ver",
        "model_name": "gemini-1.0-pro",
        "instructions": "Segredo."
    }
    create_response_user1 = client.post(
        AGENT_BASE_URL + "/",
        headers={"Authorization": f"Bearer {user1_token}"},
        json=agent_data_user1
    )
    assert create_response_user1.status_code == 200
    agent1_id = create_response_user1.json()["id"]

    # User 2 tenta obter o agente do User 1
    response_user2_get = client.get(
        f"{AGENT_BASE_URL}/{agent1_id}",
        headers={"Authorization": f"Bearer {user2_token}"}
    )
    # Espera-se um erro de Não Encontrado (404) ou Proibido (403)
    # O ideal é 404 para não vazar a existência do recurso para quem não tem permissão
    assert response_user2_get.status_code == 404

# Mais testes virão aqui, como:
# - test_user2_cannot_list_user1_agents()
# - test_user1_can_get_own_agent_by_id()
# - test_user1_can_update_own_agent()
# - test_user2_cannot_update_user1_agent()
# - test_user1_can_delete_own_agent()
# - test_user2_cannot_delete_user1_agent()
