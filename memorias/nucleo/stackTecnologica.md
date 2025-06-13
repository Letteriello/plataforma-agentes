# Pilha Tecnológica e Dependências

## 1. Backend (Core)

- **Linguagem:** Python 3.11+
- **Framework Web:** FastAPI (com Pydantic para validação de dados)
  - **Estrutura de Aplicações Maiores (`APIRouter`):**
    - Organização: Dividir em módulos/subpacotes (`__init__.py`). `main.py` com instância FastAPI principal; `routers/` para `APIRouter`s por funcionalidade.
    - `APIRouter`: Agrupa path operations. Incluído no `main.py` via `app.include_router()`.
    - Customização na Inclusão: `prefix`, `tags`, `dependencies`, `responses` podem ser definidos ao incluir o router.
  - **Modelos Pydantic Aninhados:**
    - Tipos Aninhados: Atributos de modelos Pydantic podem ser outros modelos Pydantic para estruturas JSON complexas e validação multi-nível.
    - Listas e Conjuntos (`set`): `list[SubModel]` para listas de submodelos; `set[str]` para itens únicos (Pydantic converte duplicatas).
    - Benefícios: Suporte de editor, conversão de dados, validação robusta, documentação automática.
  - **Autenticação JWT com Supabase:**
    - Cliente Supabase (`supabase-py`): Para `sign_up`, `sign_in_with_password`.
    - Segredo JWT (`SUPABASE_JWT_SECRET`): Essencial para validar tokens no backend (encontrado nas config. do projeto Supabase).
    - Proteger Rotas: Criar classe `JWTBearer(HTTPBearer)`. No `__call__`, extrair token do header `Authorization: Bearer <token>`. Validar com `jwt.decode(token, SUPABASE_JWT_SECRET, algorithms=["HS256"], audience="authenticated")`. Usar `Depends(JWTBearer())` nas rotas.
    - Payload do Token: `sub` (subject) no payload é o `user_id` do Supabase.
    - Vinculação Local (Opcional): Armazenar `user_id` do Supabase na tabela de usuários local.
    - Bibliotecas: `fastapi`, `supabase-py`, `python-jose` ou `pyjwt`.
    - Boas Práticas: HTTPS, refresh tokens, validação de `exp`, `aud`, `iss`.
  - **Referências:**
    - Bigger Applications: [https://fastapi.tiangolo.com/tutorial/bigger-applications/](https://fastapi.tiangolo.com/tutorial/bigger-applications/)
    - Nested Models: [https://fastapi.tiangolo.com/tutorial/body-nested-models/](https://fastapi.tiangolo.com/tutorial/body-nested-models/)
    - Supabase Auth Docs (JWTs): [https://supabase.com/docs/guides/auth/jwts](https://supabase.com/docs/guides/auth/jwts)
    - Artigo DEV.to (Integração FastAPI Supabase Auth): [https://dev.to/j0/integrating-fastapi-with-supabase-auth-780](https://dev.to/j0/integrating-fastapi-with-supabase-auth-780)
    - Artigo Medium (Phil Harper - Implementando Supabase Auth em FastAPI): [https://phillyharper.medium.com/implementing-supabase-auth-in-fastapi-63d9d8272c7b](https://phillyharper.medium.com/implementing-supabase-auth-in-fastapi-63d9d8272c7b)
- **Banco de Dados Relacional:** PostgreSQL (via Supabase)
- **Banco de Dados Vetorial:** pg_vector (integrado ao Supabase para funcionalidades RAG)
- **Comunicação Assíncrona:** Planejado o uso de um message bus como RabbitMQ ou NATS para comunicação entre agentes.
- **Containerização:** Docker

## 2. Frontend (Projeto em `client/`)

- **Framework/Biblioteca Principal**: React v18.2.0
- **Build Tool/Ambiente de Desenvolvimento**: Vite v5.2.0
- **Linguagem**: TypeScript v5.2.2
- **Gerenciador de Pacotes**: npm (implícito pelo `package.json` e `package-lock.json`)
- **Roteamento**: React Router DOM v6.22.0
- **Chamadas API**: Axios v1.6.0
  - Configurado com interceptors para injeção de token JWT e tratamento básico de erros 401.
- **Gerenciamento de Estado**: Zustand
  - Utilizado para gerenciar o estado de autenticação, incluindo persistência do token JWT no localStorage.
- **Estilização**: Tailwind CSS v3.4.1
  - Configurado com PostCSS e Autoprefixer.
- **Componentes UI**:
  - `components.json` sugere o uso de uma biblioteca de componentes baseada em Tailwind, como shadcn/ui (a confirmar).
- **Storybook**: Configurado para desenvolvimento e visualização de componentes.
- **Git Hooks**: Husky.
- **Variáveis de Ambiente**: Gerenciadas por arquivos `.env` (ex: `.env.development`) com prefixo `VITE_`.
  - `VITE_API_BASE_URL` configurado para `http://localhost:8000/api/v1`.

## 3. Inteligência Artificial e LLMs

- **Provedor Principal:** Google Cloud (Vertex AI, Modelos Gemini)
- **Framework de Desenvolvimento de Agentes:** Google Agent Development Kit (ADK).
  - **Sistemas Multi-Agente (MAS):** O ADK permite compor sistemas multiagente (MAS) usando instâncias de `BaseAgent` organizadas em hierarquia (parent/sub-agents). Vantagens: modularidade, especialização, reuso, manutenção facilitada e fluxos de controle estruturados.
  - **Hierarquia de Agentes:** Estrutura em árvore (`sub_agents` na init do pai, `parent_agent` auto-definido). Define escopo e delegação. Um sub-agente só pode ter um pai.
  - **Tipos de Agentes no ADK:**
    - `LlmAgent`: Baseados em LLMs (ex: Gemini).
    - `WorkflowAgent`: Orquestram execução (`SequentialAgent`, `ParallelAgent`, `LoopAgent`).
    - `CustomAgent`: Lógica customizada, não-LLM.
  - **Workflow Agents (Orquestradores):**
    - `SequentialAgent`: Executa sub-agentes em sequência. Compartilha `InvocationContext` (estado) entre passos. Ideal para pipelines.
    - `ParallelAgent`: Executa sub-agentes em paralelo. `InvocationContext.branch` distinto para cada filho (útil para isolar histórico de memória). `session.state` compartilhado (cuidado com race conditions).
    - `LoopAgent`: Executa sub-agentes iterativamente (loop). Repete por N iterações ou até condição de término. Ideal para refinamento iterativo.
  - **Referências:**
    - Multi-Agent Systems: [https://google.github.io/adk-docs/agents/multi-agents/](https://google.github.io/adk-docs/agents/multi-agents/)
    - Workflow Agents: [https://google.github.io/adk-docs/agents/workflow-agents/](https://google.github.io/adk-docs/agents/workflow-agents/)
    - Loop Agents: [https://google.github.io/adk-docs/agents/workflow-agents/loop-agents/](https://google.github.io/adk-docs/agents/workflow-agents/loop-agents/)

## 4. DevOps e Qualidade de Código

- **Testes (Frontend):** Vitest e React Testing Library
- **Testes (Backend):** Pytest
- **Qualidade de Código (Frontend):** ESLint e Prettier
- **Qualidade de Código (Backend):** Black e Ruff
- **CI/CD:** GitHub Actions
- **Infraestrutura como Código (IaC):** Planejado o uso de Terraform ou Pulumi.