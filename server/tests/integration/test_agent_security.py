import pytest
from fastapi.testclient import TestClient
import uuid

# Test to ensure protected endpoints require authentication
def test_get_agents_unauthenticated(test_client: TestClient):
    response = test_client.get("/agents")
    assert response.status_code == 401
    assert response.json()["detail"] == "Not authenticated"

# Test to ensure a user can only see their own agents
def test_user_can_only_see_own_agents(
    test_client: TestClient, 
    test_user_token: str, 
    test_user: dict,
    supabase_admin_client
):
    # 1. Create an agent for User A (the primary test_user)
    headers = {"Authorization": f"Bearer {test_user_token}"}
    agent_payload_a = {
        "name": "Agent for User A",
        "description": "This is my agent.",
        "system_prompt": "You are a helpful assistant.",
        "model": "claude-3-opus-20240229",
        "temperature": 0.7
    }
    response_a = test_client.post("/agents/", headers=headers, json=agent_payload_a)
    assert response_a.status_code == 201
    agent_a_id = response_a.json()["id"]

    # 2. Create a second user (User B)
    user_b_email = f"user_b_{uuid.uuid4()}@example.com"
    user_b_password = "password123"
    user_b_res = supabase_admin_client.auth.sign_up({"email": user_b_email, "password": user_b_password})
    assert user_b_res.user
    user_b_id = user_b_res.user.id

    # 3. Get a token for User B
    session_b_res = supabase_admin_client.auth.sign_in_with_password({"email": user_b_email, "password": user_b_password})
    assert session_b_res.session
    user_b_token = session_b_res.session.access_token

    # 4. User B tries to get all agents. They should see 0 agents.
    headers_b = {"Authorization": f"Bearer {user_b_token}"}
    response_b_get_all = test_client.get("/agents/", headers=headers_b)
    assert response_b_get_all.status_code == 200
    assert len(response_b_get_all.json()) == 0

    # 5. User B tries to get User A's agent by its ID. This should fail.
    response_b_get_one = test_client.get(f"/agents/{agent_a_id}", headers=headers_b)
    assert response_b_get_one.status_code == 404 # Controller returns 404 if not found or not authorized

    # 6. User A lists their agents and should see exactly one.
    response_a_get_all = test_client.get("/agents/", headers=headers)
    assert response_a_get_all.status_code == 200
    assert len(response_a_get_all.json()) == 1
    assert response_a_get_all.json()[0]["id"] == agent_a_id

    # Teardown User B
    supabase_admin_client.auth.admin.delete_user(user_b_id)

# Test to ensure a user cannot update another user's agent
def test_user_cannot_update_others_agent(
    test_client: TestClient, 
    test_user_token: str, 
    supabase_admin_client
):
    # 1. User A creates an agent
    headers_a = {"Authorization": f"Bearer {test_user_token}"}
    agent_payload_a = {
        "name": "Agent to be updated",
        "description": "Original description.",
        "system_prompt": "You are a helpful assistant.",
        "model": "claude-3-opus-20240229",
        "temperature": 0.5
    }
    response_a = test_client.post("/agents/", headers=headers_a, json=agent_payload_a)
    assert response_a.status_code == 201
    agent_a_id = response_a.json()["id"]

    # 2. Create User B and get their token
    user_b_email = f"user_b_update_{uuid.uuid4()}@example.com"
    user_b_password = "password123"
    user_b_res = supabase_admin_client.auth.sign_up({"email": user_b_email, "password": user_b_password})
    user_b_id = user_b_res.user.id
    session_b_res = supabase_admin_client.auth.sign_in_with_password({"email": user_b_email, "password": user_b_password})
    user_b_token = session_b_res.session.access_token

    # 3. User B tries to update User A's agent
    headers_b = {"Authorization": f"Bearer {user_b_token}"}
    update_payload = {"description": "Updated by User B"}
    response_b_update = test_client.patch(f"/agents/{agent_a_id}", headers=headers_b, json=update_payload)
    assert response_b_update.status_code == 404 # Controller returns 404 for not found/authorized

    # 4. Verify the agent was not updated
    response_a_get = test_client.get(f"/agents/{agent_a_id}", headers=headers_a)
    assert response_a_get.status_code == 200
    assert response_a_get.json()["description"] == "Original description."

    # Teardown User B
    supabase_admin_client.auth.admin.delete_user(user_b_id)

# Test to ensure a user cannot delete another user's agent
def test_user_cannot_delete_others_agent(
    test_client: TestClient, 
    test_user_token: str, 
    supabase_admin_client
):
    # 1. User A creates an agent
    headers_a = {"Authorization": f"Bearer {test_user_token}"}
    agent_payload_a = {
        "name": "Agent to be deleted",
        "description": "This agent will be deleted by its owner.",
        "system_prompt": "You are a helpful assistant.",
        "model": "claude-3-opus-20240229",
        "temperature": 0.5
    }
    response_a = test_client.post("/agents/", headers=headers_a, json=agent_payload_a)
    assert response_a.status_code == 201
    agent_a_id = response_a.json()["id"]

    # 2. Create User B and get their token
    user_b_email = f"user_b_delete_{uuid.uuid4()}@example.com"
    user_b_password = "password123"
    user_b_res = supabase_admin_client.auth.sign_up({"email": user_b_email, "password": user_b_password})
    user_b_id = user_b_res.user.id
    session_b_res = supabase_admin_client.auth.sign_in_with_password({"email": user_b_email, "password": user_b_password})
    user_b_token = session_b_res.session.access_token

    # 3. User B tries to delete User A's agent
    headers_b = {"Authorization": f"Bearer {user_b_token}"}
    response_b_delete = test_client.delete(f"/agents/{agent_a_id}", headers=headers_b)
    assert response_b_delete.status_code == 404 # Controller returns 404 for not found/authorized

    # 4. Verify the agent still exists
    response_a_get = test_client.get(f"/agents/{agent_a_id}", headers=headers_a)
    assert response_a_get.status_code == 200

    # 5. User A successfully deletes their own agent
    response_a_delete = test_client.delete(f"/agents/{agent_a_id}", headers=headers_a)
    assert response_a_delete.status_code == 204

    # Teardown User B
    supabase_admin_client.auth.admin.delete_user(user_b_id)


# Test to ensure a user cannot associate tools with another user's agent
def test_user_cannot_associate_tool_with_others_agent(
    test_client: TestClient, 
    test_user_token: str, 
    supabase_admin_client
):
    # 1. User A creates an agent
    headers_a = {"Authorization": f"Bearer {test_user_token}"}
    agent_payload_a = {
        "name": "Agent for Tool Association Test",
        "description": "An agent owned by User A.",
        "system_prompt": "You are a helpful assistant.",
        "model": "claude-3-opus-20240229",
    }
    response_agent = test_client.post("/agents/", headers=headers_a, json=agent_payload_a)
    assert response_agent.status_code == 201
    agent_a_id = response_agent.json()["id"]

    # 2. Create User B and get their token
    user_b_email = f"user_b_assoc_{uuid.uuid4()}@example.com"
    user_b_password = "password123"
    user_b_res = supabase_admin_client.auth.sign_up({"email": user_b_email, "password": user_b_password})
    user_b_id = user_b_res.user.id
    session_b_res = supabase_admin_client.auth.sign_in_with_password({"email": user_b_email, "password": user_b_password})
    user_b_token = session_b_res.session.access_token
    headers_b = {"Authorization": f"Bearer {user_b_token}"}

    # 3. User B creates a tool
    tool_payload_b = {
        "name": "User B's Tool",
        "description": "A tool that User B owns.",
        "parameters": []
    }
    response_tool = test_client.post("/tools/", headers=headers_b, json=tool_payload_b)
    assert response_tool.status_code == 201
    tool_b_id = response_tool.json()["id"]

    # 4. User B tries to associate their own tool (tool_b) with User A's agent (agent_a). This should fail.
    response_assoc = test_client.post(f"/agents/{agent_a_id}/tools/{tool_b_id}", headers=headers_b)
    assert response_assoc.status_code == 500 # RLS on agent_tools will cause an error that the controller should catch.
    # A more specific error code like 403 or 404 might be better, but this depends on controller/DB error handling.

    # 5. Verify the association was not created
    response_get_tools = test_client.get(f"/agents/{agent_a_id}/tools", headers=headers_a)
    assert response_get_tools.status_code == 200
    assert len(response_get_tools.json()) == 0

    # Teardown User B
    supabase_admin_client.auth.admin.delete_user(user_b_id)
