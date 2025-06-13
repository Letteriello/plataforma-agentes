# Arquitetura e Padrões de Design

## 1. Filosofia Arquitetural

A arquitetura da plataforma ai.da é guiada pelos seguintes princípios:

- **Separação de Responsabilidades (SoC):** O frontend (cliente) é estritamente responsável pela apresentação e experiência do usuário, enquanto o backend (servidor) lida com a lógica de negócios, processamento e persistência de dados.
- **Modularidade e Componibilidade:** Tanto o frontend quanto o backend são construídos com componentes modulares e reutilizáveis, permitindo uma arquitetura evolutiva que pode se adaptar a novas tecnologias e requisitos.
- **Contratos de API Fortes:** A comunicação entre cliente e servidor é definida por contratos de API claros. O frontend utiliza schemas Zod para validação do lado do cliente, e o backend utiliza Pydantic para validação do lado do servidor, garantindo consistência.

## 2. Estrutura de Alto Nível

O projeto é um monorepo dividido em duas partes principais:

- **`/client`:** Uma aplicação de página única (SPA) construída com React, TypeScript e Vite. É responsável por toda a interface do usuário.
- **`/server`:** Uma API RESTful construída com Python e FastAPI. Orquestra a lógica de negócios, interage com os modelos de linguagem (LLMs) e gerencia a persistência de dados com o Supabase (PostgreSQL).

## 3. Fluxos de Dados Principais

### 3.1 Fluxo de Criação de Agente

```mermaid
graph TD
    A[Usuário @ AgentEditor UI] -->|Preenche Formulário e Salva| B(Componente React)
    B -->|Chama agentService com dados do agente| C{agentService.createAgent}
    C -->|POST /api/agents| D[Backend API: /api/agents]
    D -->|Valida Dados (Pydantic)| D
    D -->|Salva Agente no Banco de Dados| E[(Database: Tabela Agents)]
    E -->|Retorna agente salvo| D
    D -->|Retorna resposta para o cliente| C
    C -->|Atualiza Estado Global (Zustand)| B
    B -->|Redireciona ou Exibe Notificação| A
```

### 3.2 Fluxo de Conversação no Chat

```mermaid
graph TD
    U[Usuário @ ChatPage] -->|Envia Mensagem| CUI(Chat UI)
    CUI -->|Chama chatService.sendMessage| CS{chatService}
    CS -->|POST /api/chat/{agentId}/message| API[Backend API]

    subgraph Processamento no Backend
        API -->|Recupera Config do Agente| DB[(Database)]
        API -->|Constrói Prompt com Histórico| API
        API -->|Envia para o LLM| LLMS(Language Model)
        LLMS -->|Opcional: Requisita Chamada de Ferramenta| API
        API -->|Opcional: Executa Ferramenta| TE(Tool Executor)
        TE -->|Retorna resultado para API| API
        API -->|Opcional: Envia resultado da ferramenta para o LLM| LLMS
        LLMS -->|Gera Resposta Final| API
    end

    API -->|Retorna Resposta para o Cliente| CS
    CS -->|Atualiza Estado da UI (Zustand)| CUI
    CUI -->|Exibe Resposta para o Usuário| U
```

## 4. Arquitetura de Deploy de Agentes

## 5. Design Detalhado da Aplicação

Esta seção detalha as escolhas de design para a estrutura de diretórios e os modelos de dados iniciais da plataforma ai.da.

### 5.1 Estrutura de Diretórios

A plataforma é organizada em um monorepo com duas pastas principais: `server` para o backend FastAPI e `client` para o frontend React.

#### 5.1.1 Backend (`/server`)

A estrutura do backend visa modularidade e clareza, seguindo as convenções do FastAPI:

-   `server/app/`: Contém o núcleo da aplicação FastAPI.
    -   `main.py`: Ponto de entrada da aplicação FastAPI, configuração inicial e inclusão de routers.
    -   `core/`: Configurações centrais, como variáveis de ambiente (`config.py`) e inicialização do banco de dados (`db.py`).
    -   `models/`: Define os modelos de dados Pydantic (`schemas.py`) para validação e serialização. Eventualmente, pode conter modelos ORM se SQLAlchemy for adotado.
    -   `routers/`: Contém os `APIRouter` para diferentes recursos da API (ex: `agents.py`, `tools.py`, `auth.py`).
    -   `services/`: Lógica de negócios e interações complexas (ex: `agent_service.py`).
    -   `crud/`: Operações de Create, Read, Update, Delete diretamente com o banco de dados.
    -   `dependencies/`: Funções de dependência do FastAPI (ex: autenticação, obtenção de sessão de DB).
-   `server/tests/`: Testes unitários e de integração para o backend.
    -   `conftest.py`: Fixtures e configurações para Pytest.
-   `requirements.txt`: Dependências Python do backend.
-   `.env.example`: Arquivo de exemplo para variáveis de ambiente do backend.

#### 5.1.2 Frontend (`/client`)

A estrutura do frontend é baseada em Vite com React e TypeScript, focando na organização por features e componentes reutilizáveis:

-   `client/public/`: Arquivos estáticos.
-   `client/src/`: Código fonte da aplicação React.
    -   `main.tsx`: Ponto de entrada da aplicação React, renderiza o componente `App`.
    -   `App.tsx`: Componente raiz, configura o roteamento principal.
    -   `assets/`: Imagens, fontes e outros ativos.
    -   `components/`: Componentes React reutilizáveis (ex: `Button.tsx`, `Modal.tsx`).
        -   `ui/`: Componentes de UI puros, seguindo o padrão de design system (shadcn/ui like).
    -   `constants/`: Constantes globais da aplicação.
    -   `contexts/`: Contextos React para gerenciamento de estado global.
    -   `features/`: Módulos de funcionalidades específicas (ex: `agents/`, `tools/`). Cada feature pode ter seus próprios `components/`, `hooks/`, `pages/`, `services/`, `types/`.
    -   `hooks/`: Hooks React customizados.
    -   `layouts/`: Componentes de layout da página (ex: `AppLayout.tsx`, `AuthLayout.tsx`).
    -   `pages/`: Componentes que representam páginas completas (ex: `HomePage.tsx`, `AgentDetailPage.tsx`).
    -   `services/`: Lógica de comunicação com a API backend (ex: `apiClient.ts`, `agentService.ts`).
    -   `store/`: Configuração do gerenciador de estado (ex: Zustand, Redux Toolkit).
    -   `styles/`: Arquivos de estilo globais (`globals.css`) e configurações de TailwindCSS.
    -   `types/`: Definições de tipos TypeScript globais ou compartilhados. Poderão ser usados schemas Zod aqui para validação de formulários e dados da API.
    -   `utils/`: Funções utilitárias.
-   `index.html`: Ponto de entrada HTML para o Vite.
-   `vite.config.ts`: Configuração do bundler Vite.
-   `tsconfig.json`: Configuração do TypeScript.
-   `package.json`: Dependências e scripts do frontend.
-   `.env.example`: Arquivo de exemplo para variáveis de ambiente do frontend.

## 4. Arquitetura Detalhada do Frontend (`client/`)

O frontend existente na pasta `client/` adota uma arquitetura modular e moderna baseada em React com Vite e TypeScript.

- **Estrutura de Pastas (`src/`)**:
  - `api/`: Contém a configuração centralizada do cliente HTTP (`apiClient.ts` usando Axios) e serviços específicos por recurso (ex: `authService.ts`, `toolService.ts`, `agentService.ts`).
  - `components/`: Destinado a componentes UI reutilizáveis.
  - `contexts/`: Para React Context API.
  - `features/`: Organização de módulos por funcionalidade, promovendo separação de interesses.
  - `hooks/`: Para hooks customizados do React.
  - `layouts/`: Para componentes de layout de página.
  - `pages/`: Componentes que representam páginas completas da aplicação.
  - `routes/`: Configuração do roteamento com `react-router-dom`.
  - `stores/`: Gerenciamento de estado global com Zustand (ex: `authStore.ts` para autenticação).
  - `styles/`: Estilos globais e configuração de tema (Tailwind CSS).
  - `types/`: Definições de tipos TypeScript.

- **Fluxo de Autenticação**:
  - O login é realizado através do `authService.ts`, que envia credenciais para o endpoint `/auth/token` do backend.
  - O token JWT recebido é armazenado na store Zustand (`authStore.ts`) e persistido no localStorage.
  - O `apiClient.ts` intercepta requisições para injetar automaticamente o token JWT no header `Authorization`.
  - Interceptores de resposta no `apiClient.ts` lidam com erros 401, limpando o token da store.
  - **Ponto de Atenção**: O fluxo de registro de novos usuários precisa ser definido, pois o `authService.ts` aponta para um endpoint (`/auth/register`) não existente no backend. A recomendação é utilizar a biblioteca `@supabase/supabase-js` diretamente no frontend para o registro com o Supabase Auth, ou criar um endpoint backend dedicado que utilize a `service_role_key`.

- **Comunicação com API Backend**:
  - Centralizada através do `apiClient.ts` (Axios).
  - URL base da API configurada via variável de ambiente `VITE_API_BASE_URL`.

### 5.2 Modelos de Dados (Pydantic)

Os modelos de dados iniciais para o backend são definidos em `server/app/models/schemas.py` usando Pydantic. Eles servem para validação de requests, serialização de responses e como Data Transfer Objects (DTOs).

-   **`User`**: Representa um usuário da plataforma.
    -   Campos principais: `id`, `email`, `full_name`, `hashed_password` (não exposto na API), `is_active`, `is_superuser`, `created_at`, `updated_at`.
-   **`Tool`**: Representa uma ferramenta que pode ser utilizada por agentes.
    -   Campos principais: `id`, `name`, `description`, `input_schema` (JSON/Dict), `output_schema` (JSON/Dict), `created_at`, `updated_at`.
-   **`Agent`**: Representa um agente configurável.
    -   Campos principais: `id`, `user_id` (criador), `name`, `description`, `system_prompt`, `configuration` (JSON/Dict), `tool_ids` (lista de IDs de ferramentas associadas), `is_active`, `created_at`, `updated_at`.
-   **`Token`**: Para autenticação JWT.
    -   Campos: `access_token`, `token_type`.
-   **`TokenData`**: Dados contidos no payload do JWT.
    -   Campos: `email`, `user_id`.

Esses modelos são a base para a API e serão expandidos conforme necessário. A utilização de `from_attributes = True` (ou `orm_mode = True` para Pydantic v1) nas classes `Config` dos modelos permite fácil conversão de objetos ORM para schemas Pydantic.

Para expor os agentes a aplicações externas de forma segura e escalável, a arquitetura adota um **API Gateway**.

- **Endpoint Unificado:** Um único endpoint (`/api/v1/agents/{agentId}/invoke`) serve como ponto de entrada para todas as requisições externas.
- **Responsabilidades do Gateway:**
    - **Autenticação:** Validação de chaves de API.
    - **Rate Limiting:** Controle de tráfego para evitar abusos.
    - **Logging e Monitoramento:** Centralização de logs e métricas de uso.
- **Roteamento:** O gateway encaminha a requisição para o serviço de runtime do agente apropriado para execução.