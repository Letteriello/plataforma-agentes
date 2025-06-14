# API Documentation

Todos os endpoints abaixo estão disponíveis com o prefixo `/api/v1`.

## Auth

- **POST /auth/token**
  - Autentica o usuário e retorna um objeto `Token` com `access_token` e `token_type`.
  - Corpo da requisição: `username` e `password` via `OAuth2PasswordRequestForm`.

## Users

- **GET /users/me**
  - Retorna o usuário autenticado (`User`).
- **POST /users**
  - Cria um novo usuário (placeholder).
  - Corpo: `UserCreate`.
  - Resposta: `User` ou erro 501 se não implementado.
- **GET /users**
  - Lista usuários (requer privilégio de administrador).
  - Query params: `skip`, `limit`.
  - Resposta: lista de `User`.
- **GET /users/{user_id}**
  - Obtém usuário específico pelo ID.
  - Resposta: `User`.

## Agents

- **POST /agents**
  - Cria um agente associado ao usuário autenticado.
  - Corpo: `AgentCreate`.
  - Resposta: `Agent`.
- **GET /agents/my**
  - Lista agentes do usuário atual.
  - Query params: `skip`, `limit`.
- **GET /agents/{agent_id}**
  - Detalhes de um agente específico.
- **PUT /agents/{agent_id}**
  - Atualiza um agente. Corpo: `AgentUpdate`.
- **DELETE /agents/{agent_id}**
  - Remove um agente.
- **GET /agents**
  - (Superuser) Lista todos os agentes do sistema.
  - Query params: `skip`, `limit`.

## Tools

- **POST /tools**
  - Cria uma ferramenta. Corpo: `ToolCreate` ou `CustomApiToolCreateRequestSchema`.
- **GET /tools**
  - Lista todas as ferramentas.
  - Query params: `skip`, `limit`.
- **GET /tools/my**
  - Lista ferramentas do usuário atual.
- **GET /tools/{tool_id}**
  - Detalhes de uma ferramenta específica.
- **PUT /tools/{tool_id}**
  - Atualiza uma ferramenta. Corpo: `ToolUpdate`.
- **DELETE /tools/{tool_id}**
  - Remove uma ferramenta.

