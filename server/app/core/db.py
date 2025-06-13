from supabase import create_client, Client
from .config import settings

# Inicializa o cliente Supabase
try:
    supabase_client: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)
    print("Supabase client initialized successfully.")
except Exception as e:
    print(f"Error initializing Supabase client: {e}")
    supabase_client = None # type: ignore

def get_supabase_client() -> Client:
    """
    Retorna a instância do cliente Supabase.
    Levanta uma exceção se o cliente não foi inicializado corretamente.
    """
    if supabase_client is None:
        raise RuntimeError("Supabase client has not been initialized. Check SUPABASE_URL and SUPABASE_KEY.")
    return supabase_client

# Para testes rápidos de conexão (opcional, pode ser removido ou movido para um script de teste)
if __name__ == "__main__":
    if supabase_client:
        try:
            # Exemplo: Tentar listar usuários (requer permissões adequadas ou tabela específica)
            # Isso provavelmente falhará sem um JWT de serviço ou se as RLS estiverem ativas.
            # É mais para verificar se o cliente foi criado.
            # response = supabase_client.auth.admin.list_users()
            # print("Successfully connected to Supabase and listed users (admin).")
            # print(response)
            print("Supabase client object exists. Further testing requires specific Supabase calls.")
        except Exception as e:
            print(f"Could not perform test operation with Supabase: {e}")
    else:
        print("Supabase client is None, cannot perform tests.")

