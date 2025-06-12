import os
from supabase import create_client, Client
from dotenv import load_dotenv

# Load environment variables from .env file in the project root
# Assumes supabase_client.py is in server/app/
dotenv_path = os.path.join(os.path.dirname(__file__), '..', '..', '.env')
load_dotenv(dotenv_path=dotenv_path)

# Get Supabase URL and Service Role Key from environment variables
# We use the service_role_key for backend operations to bypass RLS when necessary,
# allowing the backend to manage data across users as an administrator.
# User-specific RLS will still be enforced for requests coming from the frontend
# using the anon_key or user-specific JWTs.
url: str = os.environ.get("SUPABASE_URL")
service_key: str = os.environ.get("SUPABASE_SERVICE_KEY")

# Check if the environment variables are set
if not url:
    raise EnvironmentError(f"SUPABASE_URL environment variable not set. Check {dotenv_path}")
if not service_key:
    raise EnvironmentError(f"SUPABASE_SERVICE_KEY environment variable not set. Check {dotenv_path}")

# Initialize Supabase client
try:
    supabase: Client = create_client(url, service_key)
    print("Supabase client initialized successfully using Service Role Key.")
except Exception as e:
    print(f"Error initializing Supabase client: {e}")
    supabase: Client = None # type: ignore

# Optional: Function to get a client instance if needed elsewhere,
# though the global `supabase` client is typically used.
def get_supabase_client() -> Client:
    if supabase is None:
        raise RuntimeError("Supabase client has not been initialized.")
    return supabase
