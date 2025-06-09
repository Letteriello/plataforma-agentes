## **Documentação Estrutura do Projeto**

### 1. Filosofia Arquitetural

A estrutura do projeto é um reflexo direto da sua visão: criar uma plataforma limpa, modular e extensível. As decisões arquiteturais foram guiadas pelos seguintes princípios:

- **Separação de Responsabilidades (Separation of Concerns):** Cada parte do código tem um propósito claro e único. A lógica de UI é separada da lógica de estado, que por sua vez é separada da lógica de comunicação com a API. Isso reduz o acoplamento e facilita a manutenção.
- **Modularidade por Funcionalidade (Feature-Based Modularity):** A estrutura é organizada em torno dos módulos principais da plataforma (Construtor, Memória, Ferramentas, Chat). Isso permite que equipes ou agentes de IA trabalhem em funcionalidades de forma independente e com menor risco de conflitos.
- **Escalabilidade e Manutenibilidade:** A estrutura foi projetada para crescer. Adicionar uma nova funcionalidade significa criar um novo módulo autocontido, em vez de modificar arquivos existentes de forma dispersa, o que é crucial para a longevidade do projeto.

---

### 2. Estrutura de Diretórios do Frontend (`client/src`)

A seguir, a estrutura de diretórios da aplicação React (Vite + TypeScript), com a justificativa arquitetural para cada pasta.

```
client/src/
|
├── api/
├── assets/
├── components/
│   ├── features/
│   ├── layouts/
│   └── ui/
├── data/
├── hooks/
├── lib/
├── pages/
├── routes/
├── store/
└── types/
```

---

### 3. Detalhamento dos Diretórios

#### `api/`

- **Propósito:** Centralizar toda a lógica de comunicação com o backend.
- **Justificativa Arquitetural:** Abstrai a camada de dados da camada de visualização. Os componentes não sabem como os dados são obtidos; eles apenas os solicitam. Isso permite substituir facilmente o serviço de mock atual por uma API real sem alterar os componentes.
- **Conteúdo Típico:** `agentService.ts`, `toolService.ts`.

#### `assets/`

- **Propósito:** Armazenar recursos estáticos como imagens (SVG, PNG), fontes e outros arquivos de mídia.
- **Justificativa Arquitetural:** Organização padrão que separa código de recursos estáticos.

#### `components/`

- **Propósito:** O coração da interface, contendo todos os componentes React.
- **Justificativa Arquitetural:** Este diretório é subdividido para impor uma clara hierarquia de componentes, desde os átomos de UI até composições complexas.
    - `components/ui/`
        - **Propósito:** Contém os componentes base, primitivos e não estilizados, instalados via **`shadcn/ui`**.
        - **Justificativa:** Segue a filosofia de "possuir seus componentes", dando controle total sobre os blocos de construção da UI e garantindo consistência com o **Nexus Design System**.
        - **Conteúdo:** `Button.tsx`, `Card.tsx`, `Dialog.tsx`, `Input.tsx`, etc.
    - `components/features/` (ou `components/agents/`, `components/chat/` etc.)
        - **Propósito:** Componentes compostos que implementam uma funcionalidade específica, utilizando os primitivos de `components/ui`.
        - **Justificativa:** Encapsula a lógica e a apresentação de uma feature, tornando o sistema modular. Atende diretamente aos módulos definidos na visão do projeto.
        - **Conteúdo:** `AgentCard.tsx`, `ChatInterface.tsx`, `KnowledgeBaseManager.tsx`.
    - `components/layouts/`
        - **Propósito:** Componentes que definem a estrutura das páginas (ex: sidebar, topbar, layout principal).
        - **Justificativa:** Separa a estrutura da página de seu conteúdo, permitindo a reutilização de layouts em diferentes rotas.
        - **Conteúdo:** `MainLayout.tsx`, `Sidebar.tsx`.

#### `data/`

- **Propósito:** Armazenar dados mockados para desenvolvimento e testes.
- **Justificativa Arquitetural:** Permite o desenvolvimento do frontend de forma independente do backend, simulando respostas de API e facilitando a criação de cenários de teste.
- **Conteúdo Típico:** `mock-tools.json`, `mock-initial-agents.ts`.

#### `hooks/`

- **Propósito:** Armazenar hooks React personalizados.
- **Justificativa Arquitetural:** Promove a reutilização de lógica de estado e efeitos colaterais entre componentes, mantendo os próprios componentes mais limpos e focados na renderização.
- **Conteúdo Típico:** `useTheme.ts`.

#### `lib/`

- **Propósito:** Funções utilitárias que não são específicas do React (helpers genéricos).
- **Justificativa Arquitetural:** Centraliza a lógica reutilizável que não depende do ciclo de vida ou do estado do React, como formatação de dados ou funções de conveniência.
- **Conteúdo Típico:** `utils.ts` (contendo a função `cn` para classes CSS), `theme-utils.ts`.

#### `pages/`

- **Propósito:** Componentes que representam as páginas da aplicação, cada um mapeado a uma rota.
- **Justificativa Arquitetural:** Fornece um mapeamento claro e direto entre as URLs da aplicação e os componentes de nível superior que as renderizam.
- **Conteúdo Típico:** `Dashboard.tsx`, `Agentes.tsx`, `ChatPage.tsx`.

#### `routes/`

- **Propósito:** Definição centralizada das rotas da aplicação.
- **Justificativa Arquitetural:** Cria uma única fonte da verdade para a navegação, facilitando a visualização e o gerenciamento de todas as páginas e layouts disponíveis.
- **Conteúdo Típico:** `router.tsx`.

#### `store/`

- **Propósito:** Arquivos de gerenciamento de estado global com **Zustand**.
- **Justificativa Arquitetural:** Desacopla o estado da aplicação da árvore de componentes, permitindo que qualquer componente acesse ou modifique o estado sem a necessidade de "prop drilling". A separação dos stores por domínio (`agentStore`, `authStore`, `sessionStore`) reforça a modularidade.
- **Conteúdo Típico:** `agentStore.ts`, `authStore.ts`, `sessionStore.ts`.

#### `types/`

- **Propósito:** Definições de tipos e interfaces do **TypeScript**.
- **Justificativa Arquitetural:** Centraliza os "contratos de dados" do projeto, garantindo consistência e segurança de tipos em toda a aplicação. Facilita o entendimento das estruturas de dados utilizadas.
- **Conteúdo Típico:** `agent.ts`, `custom.d.ts`.