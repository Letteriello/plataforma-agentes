## **07_estrutura_do_projeto.md**

### Estrutura do Projeto v3.0: Arquitetura para Evolução e Colaboração

#### 1. Filosofia Arquitetural

A estrutura da **ai.da** é a manifestação em código da nossa visão. Ela reflete nossos princípios de **Separação de Responsabilidades (SoC)**, **Modularidade por Funcionalidade** e, mais importante, **Design Anti-Frágil**. Nossa organização em módulos e a arquitetura "Núcleo & Shell" não são apenas decisões técnicas; são escolhas estratégicas que nos permitem evoluir e nos adaptar à velocidade da inovação em IA sem a necessidade de reconstruções dispendiosas. Esta abordagem garante escalabilidade, facilita a manutenção e, crucialmente, permite que desenvolvedores (humanos e IA) contribuam para a plataforma de forma segura e eficiente, fomentando nosso ecossistema.

#### 2. Estrutura de Diretórios do Frontend (`client/src`)

A estrutura do frontend é organizada para máxima clareza, modularidade e uma experiência de desenvolvimento de primeira classe, permitindo que a equipe encontre rapidamente o que precisa e contribua com confiança.

```
client/src/
|
├── api/             # Lógica de comunicação com o backend
├── assets/          # Imagens, fontes, ícones estáticos
├── components/
│   ├── features/    # Componentes de alto nível que compõem uma funcionalidade
│   ├── layouts/     # Estruturas reutilizáveis de página (ex: Sidebar, Header)
│   └── ui/          # Átomos de UI do shadcn/ui, a base do nosso Design System
├── hooks/           # Hooks React customizados para lógica reutilizável
├── lib/             # Funções utilitárias genéricas (ex: formatação de datas)
├── pages/           # Componentes que representam as páginas completas da aplicação
├── routes/          # Definição e configuração centralizada das rotas
├── store/           # Stores do Zustand para gerenciamento de estado global
└── types/           # Definições de tipos e interfaces do TypeScript
```

#### 3. Detalhamento dos Diretórios e Fluxo de Dados

A interação entre os diretórios segue um fluxo de dados claro e unidirecional sempre que possível:

- **`api/`:** Centraliza toda a lógica de comunicação com o backend (FastAPI) usando `axios` ou `fetch`. Este diretório abstrai completamente a camada de dados. Nenhum outro arquivo deve fazer chamadas de rede diretas. **Exemplo:** `agentService.ts` contém funções como `getAgents()` e `createAgent(data)`.
- **`store/`:** Desacopla o estado global da árvore de componentes usando `Zustand`. As "stores" (ex: `agentStore.ts`) são a única parte da aplicação que pode chamar os serviços em `api/`. Eles gerenciam o estado dos dados, incluindo estados de carregamento e erro. **Exemplo:** `agentStore.ts` importa `agentService.ts` para buscar a lista de agentes e armazená-la.
- **`hooks/`:** Promove a reutilização de lógica de estado. Hooks podem interagir com os stores do Zustand para fornecer dados aos componentes de forma limpa. **Exemplo:** `useAgents.ts` pode ser um hook que se conecta ao `agentStore` e retorna a lista de agentes e o estado de carregamento.
    
- **`components/`:** O coração da interface, com uma hierarquia clara:
    
    - `ui/`: Componentes base, primitivos e totalmente reutilizáveis do `shadcn/ui` (ex: `Button.tsx`, `Card.tsx`). Eles não possuem lógica de negócio.
    - `layouts/`: Componentes que definem a estrutura das páginas (ex: `MainLayout.tsx` que inclui uma `Sidebar` e `Header`). Eles recebem o conteúdo da página como "children".
    - `features/`: Componentes compostos que implementam uma funcionalidade específica, utilizando os primitivos de `ui/` e os hooks de `hooks/`. **Exemplo:** `AgentList.tsx` usaria o hook `useAgents()` para obter os dados e renderizaria uma lista de componentes `AgentCard.tsx`.
        
- **`pages/`:** Mapeamento direto entre as URLs e os componentes de nível superior. Uma página compõe vários componentes de `features/` e `layouts/` para construir a visão completa. **Exemplo:** `DashboardPage.tsx` importaria `MainLayout.tsx` e `AgentList.tsx`.
- **`routes/`:** Definição centralizada das rotas usando `React Router`, que mapeia caminhos de URL para os componentes em `pages/`.
- **`types/`:** Centraliza os "contratos de dados" do projeto. Qualquer estrutura de dados complexa (ex: a definição de um `Agente` ou `Ferramenta`) é definida aqui para garantir consistência e segurança de tipos em toda a aplicação.
    

#### 4. Estrutura Proposta para o Backend (`server/`)

Para refletir nossa arquitetura "Núcleo & Shell", a estrutura do backend em Python/FastAPI será organizada da seguinte forma:

```
server/
|
├── app/
│   ├── api/
│   │   └── v1/        # Endpoints da API, versionados
│   ├── core/          # Lógica do Núcleo estável
│   │   ├── auth/
│   │   └── messaging/
│   ├── models/        # Modelos de dados Pydantic
│   ├── services/      # Lógica de negócio
│   └── shells/        # Runtimes plugáveis
│       ├── adk_runtime/
│       └── a2a_runtime/
├── tests/
└── main.py            # Ponto de entrada da aplicação FastAPI
```

- **`app/core/`:** Contém a lógica de negócios fundamental e estável da plataforma, como autenticação (auth) e a interface com o Agent Messaging Bus (messaging). Esta camada é projetada para mudar raramente.
- **`app/shells/`:** O coração da nossa arquitetura evolutiva. Cada subdiretório aqui é um "plugin" de runtime que se conecta ao núcleo. `adk_runtime/` conterá a lógica para executar agentes ADK, enquanto `a2a_runtime/` gerenciará a comunicação A2A. Se uma nova tecnologia surgir, adicionamos um novo diretório aqui.
- **`app/api/v1/`:** Define os endpoints RESTful usando FastAPI. Esses endpoints atuam como a camada de controle, recebendo requisições do frontend, chamando os serviços apropriados e retornando as respostas.
- **`app/services/`:** Contém a lógica de negócio que orquestra as chamadas aos runtimes no `shells/` e interage com o banco de dados.
- **`app/models/`:** Define os esquemas de dados usando Pydantic, garantindo validação e serialização de dados robustas para as APIs.