# Plano de Implementação: Etapa 5 – Implementação do Backend (CRUD e Autenticação)

## Visão Geral da Etapa
Esta etapa foca em construir o núcleo funcional do backend da plataforma ai.da. Isso inclui a configuração da conexão com o Supabase, a implementação das operações CRUD (Create, Read, Update, Delete) para as entidades principais (User, Agent, Tool) e o estabelecimento de um sistema de autenticação e autorização robusto usando JWT, integrado com o Supabase Auth.

## Tarefas Detalhadas

### Tarefa 5.1: Configuração Inicial do Supabase e Conexão
-   **Descrição:** Configurar as variáveis de ambiente (`SUPABASE_URL`, `SUPABASE_KEY`, `SUPABASE_JWT_SECRET`) no arquivo `.env` do backend. Implementar a lógica de inicialização do cliente Supabase (ou SQLAlchemy, se decidido) em `server/app/core/db.py`.
-   **Critérios de Aceitação:**
    -   Arquivo `.env` criado a partir do `.env.example` e preenchido com as credenciais corretas do Supabase (o USER fará isso).
    -   O cliente Supabase é inicializado corretamente e pode ser acessado pela aplicação.
    -   Uma função `get_db_session` ou similar é criada para injetar a sessão do Supabase (ou SQLAlchemy) nas rotas.
    -   Teste básico de conexão com o Supabase (ex: listar tabelas ou executar uma query simples) é bem-sucedido (pode ser um script de teste ou log na inicialização).

### Tarefa 5.2: Implementação do CRUD para Usuários (User)
-   **Descrição:** Desenvolver as rotas e a lógica de serviço/CRUD para gerenciar usuários. Inicialmente, focaremos na criação de usuários e na leitura (individual e lista). A atualização e exclusão podem ser priorizadas depois.
-   **Critérios de Aceitação:**
    -   Rotas POST `/users/` (criar usuário) e GET `/users/{user_id}` e GET `/users/` implementadas em `server/app/routers/users.py` (novo arquivo).
    -   Funções CRUD correspondentes em `server/app/crud/user_crud.py` (novo arquivo) para interagir com a tabela de usuários do Supabase (ou `auth.users` se usando Supabase Auth diretamente para algumas operações).
    -   Hashing de senhas implementado antes de salvar no banco.
    -   Validação de dados de entrada usando os schemas Pydantic de `UserCreate` e `User`.
    -   Testes unitários básicos para as operações de criação e leitura de usuários.

### Tarefa 5.3: Implementação da Autenticação JWT (Login e Validação)
-   **Descrição:** Implementar o endpoint de login que recebe email/senha, autentica contra o Supabase Auth (ou tabela de usuários), e retorna um token JWT. Criar dependências para proteger rotas e validar tokens JWT.
-   **Critérios de Aceitação:**
    -   Endpoint POST `/auth/token` (login) em `server/app/routers/auth.py` implementado.
    -   Serviço de autenticação que verifica credenciais e gera token JWT usando `SUPABASE_JWT_SECRET`.
    -   Dependência (`get_current_user`) em `server/app/dependencies/auth_deps.py` (novo arquivo) que valida o token JWT e retorna o usuário atual.
    -   Schemas `Token` e `TokenData` utilizados.
    -   Rotas de teste protegidas com a nova dependência.

### Tarefa 5.4: Implementação do CRUD para Ferramentas (Tool)
-   **Descrição:** Desenvolver as rotas e a lógica de serviço/CRUD para gerenciar ferramentas (Tools).
-   **Critérios de Aceitação:**
    -   Rotas POST, GET (lista e individual), PUT, DELETE para `/tools/` implementadas em `server/app/routers/tools.py`.
    -   Funções CRUD correspondentes em `server/app/crud/tool_crud.py` (novo arquivo).
    -   Validação de dados usando schemas Pydantic de `ToolCreate`, `ToolUpdate` e `Tool`.
    -   Rotas protegidas por autenticação JWT.
    -   Testes unitários para as operações CRUD de ferramentas.

### Tarefa 5.5: Implementação do CRUD para Agentes (Agent)
-   **Descrição:** Desenvolver as rotas e a lógica de serviço/CRUD para gerenciar agentes (Agents), incluindo a associação com ferramentas.
-   **Critérios de Aceitação:**
    -   Rotas POST, GET (lista e individual), PUT, DELETE para `/agents/` implementadas em `server/app/routers/agents.py`.
    -   Funções CRUD correspondentes em `server/app/crud/agent_crud.py` (novo arquivo).
    -   Lógica para associar/desassociar `tool_ids` ao agente.
    -   Validação de dados usando schemas Pydantic de `AgentCreate`, `AgentUpdate` e `Agent`.
    -   Rotas protegidas por autenticação JWT, garantindo que apenas o criador possa modificar/deletar (ou admin).
    -   Testes unitários para as operações CRUD de agentes.

### Tarefa 5.6: Refinamento de Segurança e Permissões
-   **Descrição:** Revisar e refinar as políticas de segurança e permissões. Implementar verificações para garantir que usuários só possam modificar seus próprios recursos (ex: agentes), a menos que sejam superusuários.
-   **Critérios de Aceitação:**
    -   Lógica de verificação de propriedade implementada nas rotas de atualização/deleção de Agentes e Ferramentas (se aplicável).
    -   Considerar o papel de `is_superuser` para acesso irrestrito.
    -   Documentação das políticas de permissão.

### Tarefa 5.7: Documentação da API e Testes de Integração Iniciais
-   **Descrição:** Gerar/atualizar a documentação da API (Swagger/OpenAPI) automaticamente pelo FastAPI. Escrever testes de integração básicos para os fluxos principais (ex: criar usuário, logar, criar agente com token).
-   **Critérios de Aceitação:**
    -   Documentação OpenAPI acessível e refletindo todos os endpoints e schemas.
    -   Testes de integração em `server/tests/integration/` (nova pasta) cobrindo os fluxos críticos.
    -   Todos os testes (unitários e de integração) passando.
    -   Registro da conclusão da Etapa 5 e atualização dos logs de progresso.
