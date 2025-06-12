import pytest
from fastapi.testclient import TestClient
from typing import Dict, Tuple

# Fixtures test_user_1, test_user_2, and client are injected from conftest.py

TOOL_BASE_URL = "/tools"

@pytest.fixture(scope="function")
def created_tool_user_1(client: TestClient, test_user_1: Tuple[Dict, str]):
    """Creates a tool for user 1 and yields it for a test."""
    user1_details, user1_token = test_user_1
    tool_data = {
        "name": "Tool for User 1",
        "description": "A test tool belonging to user 1",
        "tool_type": "TOOL_CODE",
        "parameters": []
    }
    response = client.post(
        TOOL_BASE_URL + "/",
        headers={"Authorization": f"Bearer {user1_token}"},
        json=tool_data
    )
    assert response.status_code == 201
    return response.json()

def test_create_tool(client: TestClient, test_user_1: Tuple[Dict, str]):
    """Test if a user can create a tool for themselves."""
    user1_details, user1_token = test_user_1
    tool_data = {
        "name": "My New Tool",
        "description": "A fresh tool",
        "tool_type": "API",
        "api_endpoint": "https://api.example.com/test",
        "parameters": []
    }
    response = client.post(
        TOOL_BASE_URL + "/",
        headers={"Authorization": f"Bearer {user1_token}"},
        json=tool_data
    )
    assert response.status_code == 201
    created_tool = response.json()
    assert created_tool["name"] == tool_data["name"]
    assert created_tool["user_id"] == user1_details["id"]

def test_get_own_tool(client: TestClient, test_user_1: Tuple[Dict, str], created_tool_user_1: Dict):
    """Test if a user can retrieve their own tool by ID."""
    user1_details, user1_token = test_user_1
    tool_id = created_tool_user_1["id"]

    response = client.get(
        f"{TOOL_BASE_URL}/{tool_id}",
        headers={"Authorization": f"Bearer {user1_token}"}
    )
    assert response.status_code == 200
    assert response.json()["id"] == tool_id

def test_user2_cannot_get_user1_tool(client: TestClient, test_user_2: Tuple[Dict, str], created_tool_user_1: Dict):
    """Test if user 2 is blocked from getting user 1's tool by ID."""
    user2_details, user2_token = test_user_2
    tool_id = created_tool_user_1["id"]

    response = client.get(
        f"{TOOL_BASE_URL}/{tool_id}",
        headers={"Authorization": f"Bearer {user2_token}"}
    )
    assert response.status_code == 404

def test_list_tools_isolation(client: TestClient, test_user_1: Tuple[Dict, str], test_user_2: Tuple[Dict, str], created_tool_user_1: Dict):
    """Test that listing tools only returns the user's own tools."""
    user1_details, user1_token = test_user_1
    user2_details, user2_token = test_user_2
    tool1_id = created_tool_user_1["id"]

    # User 1 lists tools and should see their tool
    response1 = client.get(TOOL_BASE_URL + "/", headers={"Authorization": f"Bearer {user1_token}"})
    assert response1.status_code == 200
    tools1 = response1.json()["items"]
    assert any(t["id"] == tool1_id for t in tools1)

    # User 2 lists tools and should NOT see user 1's tool
    response2 = client.get(TOOL_BASE_URL + "/", headers={"Authorization": f"Bearer {user2_token}"})
    assert response2.status_code == 200
    tools2 = response2.json()["items"]
    assert not any(t["id"] == tool1_id for t in tools2)

def test_update_own_tool(client: TestClient, test_user_1: Tuple[Dict, str], created_tool_user_1: Dict):
    """Test if a user can update their own tool."""
    user1_details, user1_token = test_user_1
    tool_id = created_tool_user_1["id"]
    update_data = {"description": "An updated description"}

    response = client.put(
        f"{TOOL_BASE_URL}/{tool_id}",
        headers={"Authorization": f"Bearer {user1_token}"},
        json=update_data
    )
    assert response.status_code == 200
    assert response.json()["description"] == update_data["description"]

def test_user2_cannot_update_user1_tool(client: TestClient, test_user_1: Tuple[Dict, str], test_user_2: Tuple[Dict, str], created_tool_user_1: Dict):
    """Test if user 2 is blocked from updating user 1's tool."""
    user1_details, user1_token = test_user_1
    user2_details, user2_token = test_user_2
    tool_id = created_tool_user_1["id"]
    original_description = created_tool_user_1["description"]
    update_data = {"description": "Malicious update attempt"}

    # User 2 attempts to update
    response = client.put(
        f"{TOOL_BASE_URL}/{tool_id}",
        headers={"Authorization": f"Bearer {user2_token}"},
        json=update_data
    )
    assert response.status_code == 404

    # Verify as User 1 that the description is unchanged
    verify_response = client.get(
        f"{TOOL_BASE_URL}/{tool_id}",
        headers={"Authorization": f"Bearer {user1_token}"}
    )
    assert verify_response.status_code == 200
    assert verify_response.json()["description"] == original_description

def test_delete_own_tool(client: TestClient, test_user_1: Tuple[Dict, str]):
    """Test if a user can delete their own tool."""
    user1_details, user1_token = test_user_1
    # Create a tool to delete
    tool_data = {"name": "To be deleted", "tool_type": "TOOL_CODE", "parameters": []}
    create_response = client.post(TOOL_BASE_URL + "/", headers={"Authorization": f"Bearer {user1_token}"}, json=tool_data)
    assert create_response.status_code == 201
    tool_id = create_response.json()["id"]

    # Delete it
    delete_response = client.delete(f"{TOOL_BASE_URL}/{tool_id}", headers={"Authorization": f"Bearer {user1_token}"})
    assert delete_response.status_code == 204

    # Verify it's gone
    get_response = client.get(f"{TOOL_BASE_URL}/{tool_id}", headers={"Authorization": f"Bearer {user1_token}"})
    assert get_response.status_code == 404

def test_user2_cannot_delete_user1_tool(client: TestClient, test_user_1: Tuple[Dict, str], test_user_2: Tuple[Dict, str], created_tool_user_1: Dict):
    """Test if user 2 is blocked from deleting user 1's tool."""
    user1_details, user1_token = test_user_1
    user2_details, user2_token = test_user_2
    tool_id = created_tool_user_1["id"]

    # User 2 attempts to delete
    response = client.delete(
        f"{TOOL_BASE_URL}/{tool_id}",
        headers={"Authorization": f"Bearer {user2_token}"}
    )
    assert response.status_code == 404

    # Verify as User 1 that the tool still exists
    verify_response = client.get(
        f"{TOOL_BASE_URL}/{tool_id}",
        headers={"Authorization": f"Bearer {user1_token}"}
    )
    assert verify_response.status_code == 200
    assert verify_response.json()["id"] == tool_id

