from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware # Adicionar esta importação

# Adicionar importações dos routers que já existem e do novo user_router
from .routers import agents, tools, auth, users as user_router 
from .core.config import settings 

app = FastAPI(
    title=settings.PROJECT_NAME, 
    description="API para gerenciar agentes, ferramentas e interações na plataforma ai.da.", 
    version="0.1.0", 
    openapi_url=f"{settings.API_V1_STR}/openapi.json" 
)

# Configuração de CORS
# ATENÇÃO: Para produção, restrinja as origens permitidas!
# Exemplo: origins = ["http://localhost:3000", "https://seufrontend.com"]
origins = [
    "*" # Permite todas as origens para desenvolvimento
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True, # Permite cookies/autenticação baseada em cabeçalho
    allow_methods=["*"],    # Permite todos os métodos (GET, POST, PUT, etc.)
    allow_headers=["*"],    # Permite todos os cabeçalhos
)

@app.get("/", tags=["Root"])
async def read_root():
    return {"message": f"Bem-vindo à API da Plataforma {settings.PROJECT_NAME}"} 


# Incluir os routers
app.include_router(auth.router, prefix=f"{settings.API_V1_STR}/auth", tags=["auth"])
app.include_router(user_router.router, prefix=f"{settings.API_V1_STR}/users", tags=["users"])
app.include_router(agents.router, prefix=f"{settings.API_V1_STR}/agents", tags=["agents"])
app.include_router(tools.router, prefix=f"{settings.API_V1_STR}/tools", tags=["tools"])

print(f"{settings.PROJECT_NAME} main.py carregado e FastAPI app instanciado com routers e CORS.")
