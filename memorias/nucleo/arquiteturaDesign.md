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

Para expor os agentes a aplicações externas de forma segura e escalável, a arquitetura adota um **API Gateway**.

- **Endpoint Unificado:** Um único endpoint (`/api/v1/agents/{agentId}/invoke`) serve como ponto de entrada para todas as requisições externas.
- **Responsabilidades do Gateway:**
    - **Autenticação:** Validação de chaves de API.
    - **Rate Limiting:** Controle de tráfego para evitar abusos.
    - **Logging e Monitoramento:** Centralização de logs e métricas de uso.
- **Roteamento:** O gateway encaminha a requisição para o serviço de runtime do agente apropriado para execução.