Olá! Sou o **ArchitectGem** 📐.

Com base no roteiro fornecido, projetei a arquitetura de software para resolver os débitos técnicos e estruturar o projeto `plataforma-agentes` de forma robusta, modular e escalável.

---

### 1. Estrutura de Pastas e Módulos (Revisada e Consolidada)

A estrutura de pastas será organizada para promover a separação de responsabilidades (separation of concerns), facilitando a manutenção e os testes.

```
/src
|
|-- /api/
|   |-- agentService.ts      # (Refatorado) Módulo para todas as chamadas à API de agentes (CRUD).
|   |-- toolService.ts       # Módulo para chamadas à API de ferramentas.
|   |-- sessionService.ts    # Módulo para chamadas à API de sessões e chat.
|   |-- index.ts             # Exporta todos os serviços.
|
|-- /components/
|   |-- /agents/             # Componentes relacionados à feature de Agentes.
|   |   |-- AgentConfigurator.tsx
|   |   |-- AgentList.tsx
|   |   |-- AgentCard.tsx
|   |   |-- /workflow/       # Componentes para orquestração (Dropzone, etc.).
|   |   |-- /tools/          # Componentes para seleção de ferramentas.
|   |-- /chat/               # Componentes da interface de chat.
|   |-- /common/             # Componentes reutilizáveis (ex: ErrorDisplay, LoadingSpinner).
|   |-- /layout/             # Componentes de layout (Sidebar, Topbar, etc.).
|   |-- /ui/                 # Componentes base do shadcn/ui (Button, Card, etc.).
|
|-- /constants/
|   |-- appConfig.ts         # Constantes da aplicação (nomes, rotas, etc.).
|   |-- apiEndpoints.ts      # Endpoints da API.
|
|-- /data/
|   |-- mockAgents.ts        # (Refatorado) Dados mock para agentes.
|   |-- mockTools.ts         # Dados mock para ferramentas.
|   |-- mockConversations.ts # Dados mock para conversas.
|
|-- /hooks/
|   |-- useAgents.ts         # (Novo) Hook para gerenciar estado e lógica da lista de agentes.
|   |-- useAgentConfig.ts    # (Novo) Hook para gerenciar estado e lógica do AgentConfigurator.
|   |-- useChat.ts           # Hook para a lógica do chat.
|   |-- useTheme.ts          # Hook para o tema.
|
|-- /lib/
|   |-- utils.ts             # Funções utilitárias (cn, deepClone, etc.).
|   |-- themeUtils.ts        # Utilitários de tema.
|
|-- /pages/
|   |-- Dashboard.tsx
|   |-- Agentes.tsx
|   |-- ChatPage.tsx
|   |-- ... (outras páginas)
|
|-- /store/
|   |-- agentStore.ts        # (Refatorado) Store Zustand para o estado global de agentes.
|   |-- chatStore.ts         # Store Zustand para o estado do chat.
|   |-- authStore.ts         # Store Zustand para autenticação.
|   `-- ... (outros stores)
|
|-- /styles/
|   |-- globals.css          # (Removido, Tailwind no index.css)
|
|-- /types/
|   |-- agent.ts             # (Refatorado) Tipos unificados para Agentes (Agent, LlmAgentConfig, etc.).
|   |-- api.ts               # Tipos para requisições e respostas da API.
|   |-- tool.ts              # Tipos para Ferramentas.
|   |-- index.d.ts           # Declarações de tipos globais.
|
|-- App.tsx                  # Componente Raiz.
|-- main.tsx                 # Ponto de entrada da aplicação.
|-- routes.tsx               # Configuração do React Router.
`-- setupTests.ts            # Configuração para testes.
```

---

### 2. Tecnologias e Frameworks Recomendados

A seleção de tecnologias está alinhada com o estado atual do projeto, consolidando as melhores práticas.

-   **Front-end:** **React** com **Vite** para um desenvolvimento rápido.
-   **Linguagem:** **TypeScript**.
-   **Componentes de UI:** **shadcn/ui** para componentes base, customizados e armazenados localmente.
-   **Estilização:** **Tailwind CSS**.
-   **Gerenciamento de Estado Global:** **Zustand**. Ideal pela sua simplicidade e performance. Os stores serão fortemente tipados.
-   **Roteamento:** **React Router**.
-   **Requisições API:** **Axios**, para chamadas REST.
-   **Testes:** **Vitest** com **React Testing Library** para testes unitários e de integração.

---

### 3. Fluxo de Dados e Integrações

A arquitetura prioriza um fluxo de dados unidirecional e desacoplado.

1.  **Componentes de UI (`/pages`, `/components`):** São responsáveis apenas pela renderização. Eles invocam hooks para obter dados e disparar ações. Eles não devem conter lógica de negócio ou chamadas de API diretas.
2.  **Hooks Customizados (`/hooks`):** Atuam como intermediários. Eles utilizam os stores do Zustand para obter o estado e os serviços de API para buscar ou enviar dados. Encapsulam a lógica de estado, como `isLoading`, `error`, etc.
3.  **Stores (Zustand - `/store`):** Servem como a **única fonte da verdade** para o estado global. Qualquer alteração no estado dos agentes, sessões, etc., deve ser feita através de uma ação no store correspondente. O uso de `any` será eliminado.
4.  **Serviços de API (`/api`):** Camada de abstração para a comunicação com o backend. Todas as chamadas HTTP (incluindo a simulação atual) serão centralizadas aqui. O `agentService.ts` será refatorado para não interagir mais diretamente com o store.
5.  **Dados Mock (`/data`):** Os dados mockados (agentes, ferramentas) serão movidos para este diretório e importados pelos serviços de API para simular as respostas do backend durante o desenvolvimento.

#### Diagrama de Fluxo de Dados (Mermaid)

```mermaid
graph TD
    subgraph "Camada de UI"
        A[Componente React: Agentes.tsx]
    end

    subgraph "Camada de Lógica (Hooks)"
        B[Hook: useAgents.ts]
    end

    subgraph "Camada de Estado"
        C[Store: useAgentStore (Zustand)]
    end

    subgraph "Camada de Dados"
        D[Serviço: agentService.ts]
        E[Backend/Mock API]
    end

    A -- "1. Dispara ação (ex: fetchAgents)" --> B
    B -- "2. Chama serviço" --> D
    D -- "3. Requisição HTTP" --> E
    E -- "4. Resposta com dados" --> D
    D -- "5. Retorna dados para o Hook" --> B
    B -- "6. Atualiza o Store" --> C
    C -- "7. Notifica atualização" --> A
    A -- "8. Re-renderiza com novos dados" --> C
```

---

### 4. Boas Práticas e Pontos de Atenção Técnica

-   **Segurança:**
    -   **Gerenciamento de Segredos:** Implementar o uso de variáveis de ambiente (`.env`) com **Vite** (`import.meta.env`) para armazenar chaves de API e outras configurações sensíveis. **NÃO** commitar arquivos `.env` no repositório.
    -   **Validação de Entrada:** Validar todas as entradas do usuário tanto no front-end (para feedback rápido) quanto no backend.

-   **Performance:**
    -   Utilizar `React.memo` para componentes que recebem as mesmas props e não precisam re-renderizar.
    -   Empregar `useCallback` e `useMemo` nos hooks customizados para evitar recriações desnecessárias de funções e cálculos.
    -   Implementar "lazy loading" para componentes e páginas sempre que possível.

-   **Escalabilidade:**
    -   A estrutura modular com separação clara de responsabilidades (UI, hooks, stores, services) permite que novas funcionalidades sejam adicionadas sem impactar significativamente o código existente.
    -   A centralização da tipagem (`/types`) garante consistência e facilita a manutenção à medida que o projeto cresce.

-   **Testabilidade:**
    -   **Testes Unitários (Vitest):**
        -   Testar a lógica dos stores do Zustand de forma isolada.
        -   Testar a lógica dos hooks customizados, mockando os serviços de API.
        -   Testar componentes de UI puros, verificando se renderizam corretamente com base nas props.
    -   **Testes de Integração (Vitest + React Testing Library):**
        -   Testar fluxos completos, como o de criação de um agente, garantindo que todas as camadas (componente -> hook -> store -> API mock) se comuniquem corretamente.

-   **Tipagem (TypeScript):**
    -   Unificar todas as definições de tipo relacionadas a um domínio (ex: Agente) em um único arquivo (`/types/agent.ts`).
    -   Eliminar completamente o uso de `any`, especialmente nos stores do Zustand e nas respostas da API, utilizando tipos genéricos e asserções de tipo seguras quando necessário.

Esta arquitetura estabelece uma base sólida para resolver os débitos técnicos atuais e suportar o crescimento futuro da plataforma de agentes.

➡️ AskGem, por favor, pesquise as documentações oficiais e melhores práticas para cada tecnologia proposta nesta arquitetura.