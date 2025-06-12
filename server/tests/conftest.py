import pytest
from fastapi.testclient import TestClient
import os
from dotenv import load_dotenv
import supabase
from app.main import app  # Assuming your FastAPI app instance is in app/main.py
from app.models.user_model import User
import uuid

# Load environment variables from .env file
load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

if not SUPABASE_URL or not SUPABASE_SERVICE_KEY:
    raise ValueError("Supabase URL and Service Key must be set in environment variables for testing.")

@pytest.fixture(scope="session")
def supabase_admin_client():
    """Provides a Supabase admin client for the entire test session."""
    return supabase.create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

@pytest.fixture(scope="session")
def test_client():
    """Provides a TestClient instance for making requests to the FastAPI app."""
    with TestClient(app) as client:
        yield client

def create_test_user_and_token(supabase_admin_client):
    """Helper function to create a user and return details and token."""
    test_email = f"test_user_{uuid.uuid4()}@example.com"
    test_password = "password123"

    # Create user
    user_response = supabase_admin_client.auth.sign_up({
        "email": test_email,
        "password": test_password,
    })
    assert user_response.user, f"Failed to create test user: {user_response}"
    user_id = user_response.user.id

    # Sign in to get the token
    session_response = supabase_admin_client.auth.sign_in_with_password({
        "email": test_email,
        "password": test_password,
    })
    assert session_response.session, f"Failed to get session: {session_response}"
    token = session_response.session.access_token

    user_details = {"id": user_id, "email": test_email, "password": test_password}

    return user_details, token

@pytest.fixture(scope="function")
def test_user_1(supabase_admin_client):
    """Creates user 1 and cleans up afterward."""
    user_details, token = create_test_user_and_token(supabase_admin_client)
    yield user_details, token
    # Teardown
    try:
        supabase_admin_client.auth.admin.delete_user(user_details["id"])
    except Exception as e:
        print(f"Error during test user 1 teardown: {e}")

@pytest.fixture(scope="function")
def test_user_2(supabase_admin_client):
    """Creates user 2 and cleans up afterward."""
    user_details, token = create_test_user_and_token(supabase_admin_client)
    yield user_details, token
    # Teardown
    try:
        supabase_admin_client.auth.admin.delete_user(user_details["id"])
    except Exception as e:
        print(f"Error during test user 2 teardown: {e}")
