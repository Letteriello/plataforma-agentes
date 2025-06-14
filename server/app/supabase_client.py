import os
from supabase import create_client, Client
from supabase.lib.client_options import ClientOptions
from dotenv import load_dotenv

# Load environment variables from .env file in the project root
# Assumes supabase_client.py is in server/app/
dotenv_path = os.path.join(os.path.dirname(__file__), '..', '..', '.env')
load_dotenv(dotenv_path=dotenv_path)

# Get Supabase URL and Anon Key from environment variables
url: str = os.environ.get("SUPABASE_URL")
anon_key: str = os.environ.get("SUPABASE_ANON_KEY")

# Check if the environment variables are set
if not url:
    raise EnvironmentError(f"SUPABASE_URL environment variable not set. Check {dotenv_path}")
if not anon_key:
    raise EnvironmentError(f"SUPABASE_ANON_KEY environment variable not set. Check {dotenv_path}")

# Service role client (used cautiously)
supabase_service_client: Client | None = None
try:
    supabase_service_key = os.environ.get("SUPABASE_SERVICE_KEY")
    if supabase_service_key:
        supabase_service_client = create_client(url, supabase_service_key)
except Exception as e:
    print(f"Could not initialize Supabase service client: {e}")

def create_supabase_client_with_jwt(jwt_token: str) -> Client:
    """
    Creates a Supabase client instance configured to use the provided JWT for authorization.
    RLS policies will apply based on the user associated with the JWT.
    """
    if not url or not anon_key:
        raise EnvironmentError("Supabase URL or Anon Key not properly configured to create user-scoped client.")

    headers = {
        "Authorization": f"Bearer {jwt_token}",
        "apikey": anon_key, # PostgREST requires an apikey header even with JWT
    }
    
    try:
        user_client = create_client(url, anon_key, options=ClientOptions(headers=headers))
        # Attempt a simple read to validate the JWT and client setup if necessary, e.g.:
        # user_client.auth.get_user(jwt=jwt_token) 
        # However, direct usage will reveal if the token is valid upon first API call.
        return user_client
    except Exception as e:
        print(f"Error creating user-scoped Supabase client: {e}")
        # Depending on desired error handling, could re-raise or return None/custom error
        raise


