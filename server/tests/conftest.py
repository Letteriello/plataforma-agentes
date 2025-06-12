import pytest
from fastapi.testclient import TestClient
import uuid
from typing import Dict, Tuple

# Ajuste o caminho de importação conforme a estrutura do seu projeto
# Supondo que a instância do app FastAPI está em server/main.py
from app.main import app  # Alterado de server.main import app

@pytest.fixture(scope="module")
def client():
    """Fixture para fornecer um TestClient para a aplicação FastAPI."""
    with TestClient(app) as c:
        yield c

def generate_unique_user_credentials() -> Dict[str, str]:
    """Gera credenciais de usuário únicas para teste."""
    unique_id = uuid.uuid4().hex[:8]  # Gera um ID único curto
    return {
        "email": f"testuser_{unique_id}@example.com",
        "password": f"testpassword{unique_id}"
    }

def register_user(client: TestClient, user_credentials: Dict[str, str]) -> Dict[str, any]: # Alterado para retornar user_details
    """Registra um novo usuário usando o endpoint /register."""
    response = client.post("/register", json=user_credentials)
    assert response.status_code == 200  # Ou 201, dependendo da sua API
    user_details = response.json()
    assert "id" in user_details, "A resposta de /register deve conter 'id' do usuário"
    assert "email" in user_details, "A resposta de /register deve conter 'email' do usuário"
    assert user_details["email"] == user_credentials["email"], "O email na resposta de /register não corresponde ao enviado"
    return user_details

def get_user_token(client: TestClient, user_credentials: Dict[str, str]) -> str:
    """Obtém um token JWT para um usuário usando o endpoint /token."""
    login_data = {
        "username": user_credentials["email"],
        "password": user_credentials["password"]
    }
    response = client.post("/token", data=login_data) # /token espera FormData
    assert response.status_code == 200
    token_data = response.json()
    assert "access_token" in token_data
    assert token_data["token_type"] == "bearer"
    return token_data["access_token"]

@pytest.fixture(scope="module")
def test_user_1(client: TestClient) -> Tuple[Dict[str, any], str]: # Alterado para user_details, token
    """Cria um primeiro usuário de teste e retorna seus detalhes (incluindo ID) e token."""
    credentials = generate_unique_user_credentials()
    user_details = register_user(client, credentials) # Captura user_details
    token = get_user_token(client, credentials)
    return user_details, token

@pytest.fixture(scope="module")
def test_user_2(client: TestClient) -> Tuple[Dict[str, any], str]: # Alterado para user_details, token
    """Cria um segundo usuário de teste e retorna seus detalhes (incluindo ID) e token."""
    credentials = generate_unique_user_credentials()
    user_details = register_user(client, credentials) # Captura user_details
    token = get_user_token(client, credentials)
    return user_details, token

# Exemplo de como usar as fixtures em um teste (coloque em seus arquivos de teste):
# def test_some_protected_route_user1(client: TestClient, test_user_1: Tuple[Dict[str, str], str]):
#     user1_credentials, user1_token = test_user_1
#     response = client.get(
#         "/some_protected_endpoint",
#         headers={"Authorization": f"Bearer {user1_token}"}
#     )
#     assert response.status_code == 200

# def test_some_protected_route_user2(client: TestClient, test_user_2: Tuple[Dict[str, str], str]):
#     user2_credentials, user2_token = test_user_2
#     response = client.get(
#         "/some_protected_endpoint_for_user2_only",
#         headers={"Authorization": f"Bearer {user2_token}"}
#     )
#     assert response.status_code == 200

