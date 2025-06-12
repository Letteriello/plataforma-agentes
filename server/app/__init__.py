from fastapi import FastAPI
from .routes import agent_routes, auth_routes, tool_routes, chat_routes # Added chat_routes
# from .routes import secret_routes, audit_routes, governance_routes, workflow_routes # Commented out unused

app = FastAPI(
    title="Plataforma Agentes API",
    version="0.4.0", # Incremented version
    description="API para gerenciamento de agentes, workflows e governança, agora com autenticação."
)

# Inclui todos os roteadores da aplicação
app.include_router(auth_routes.router, prefix="/auth", tags=["Authentication"]) # Auth router
app.include_router(agent_routes.router) # Assumes prefix is defined in agent_routes.py or defaults to /agents
app.include_router(tool_routes.router)   # Assumes prefix is defined in tool_routes.py or defaults to /tools
app.include_router(chat_routes.router) # chat_routes.router already has prefix "/chat" and tags=["Chat"]

# Ensure these other routers exist or comment them out if not yet implemented
# If they are not yet functional or defined, it's better to comment them for now
# to avoid startup errors.
# app.include_router(secret_routes.router)
# app.include_router(audit_routes.router)
# app.include_router(governance_routes.router)
# app.include_router(workflow_routes.router)


@app.get("/", tags=["Root"])
async def read_root():
    return {"message": "Bem-vindo à API da Plataforma de Agentes"}
