from fastapi import FastAPI
from .routes import agent_routes, secret_routes, audit_routes, governance_routes, workflow_routes

app = FastAPI(
    title="Plataforma Agentes API",
    version="0.3.0",
    description="API para gerenciamento de agentes, workflows e governança."
)

# Inclui todos os roteadores da aplicação
app.include_router(agent_routes.router)
app.include_router(secret_routes.router)
app.include_router(audit_routes.router)
app.include_router(governance_routes.router)
app.include_router(workflow_routes.router)

@app.get("/", tags=["Root"])
async def read_root():
    return {"message": "Bem-vindo à API da Plataforma de Agentes"}
