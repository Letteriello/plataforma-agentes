## **05_pilha_tecnologica.md**

### Stack Tecnológica v3.0: Plataforma ai.da

Esta documentação define a stack tecnológica da **ai.da**, estrategicamente escolhida para suportar nossa visão de um Sistema Operacional Evolutivo, modular, de alta performance e com uma experiência de desenvolvedor de primeira classe.

#### 1. Arquitetura Geral: O Modelo "Núcleo & Shell"

A plataforma é projetada sobre um modelo de duas camadas para garantir anti-fragilidade e adaptabilidade, separando a infraestrutura estável da lógica de aplicação que evolui rapidamente.

- **Núcleo (Core) - Backend:** A camada de base, estável e agnóstica.
    
    - **Linguagem:** **Python 3.11+**. Escolhido pelo seu ecossistema maduro em IA/ML, vasta disponibilidade de bibliotecas e por ser a linguagem primária do Google ADK, facilitando a integração nativa.
    - **Framework Web:** **FastAPI**. Selecionado por sua performance excepcional, tipagem de dados moderna com Pydantic (que garante a robustez das APIs) e a geração automática de documentação interativa (Swagger/OpenAPI), um pilar para nossa estratégia de DevEx.
    - **Comunicação Interna:** **Agent Messaging Bus (AMB)**. Utilizaremos uma implementação baseada em **RabbitMQ** ou **NATS** para garantir comunicação assíncrona, persistente e observável entre agentes. Isso resolve o gargalo de comunicação identificado na pesquisa e é crucial para a escalabilidade de sistemas multiagente.
    - **Banco de Dados:** Uma estratégia de banco de dados duplo:
        
        - **PostgreSQL:** Para dados relacionais que exigem integridade transacional, como contas de usuários, configurações de agentes, permissões do RBAC e transações do Marketplace.
        - **Banco de Dados Vetorial (ex: Pinecone, Milvus):** Essencial para o Módulo de Memória (RAG), permitindo buscas semânticas de alta velocidade em grandes volumes de dados não estruturados, o que é fundamental para agentes com conhecimento profundo.
            
    - **Conteinerização e Orquestração:** **Docker** para empacotar nossos serviços de forma consistente, orquestrado com **Kubernetes (K8s)**. O K8s nos dará a escalabilidade horizontal, a resiliência e a eficiência de recursos necessárias para uma plataforma de nível empresarial.
        
- **Shell (Camada de Runtimes) - Backend:** Camada dinâmica e plugável onde a lógica de "inteligência" reside.
    
    - **Runtime Principal:** **Google Agent Development Kit (ADK)** implementado como o primeiro plugin. Ele lida com a execução e orquestração de agentes.
    - **Runtime de Interoperabilidade:** **Protocolo A2A** implementado como um segundo plugin, atuando como um gateway para comunicação externa. Esta arquitetura nos permite adotar futuros runtimes ou frameworks (ex: um sucessor do ADK) sem reescrever o Núcleo, garantindo a longevidade da plataforma.
        
- **Frontend (Aplicação Cliente):** Uma Single-Page Application (SPA) moderna e reativa.
    
    - **Framework Principal:** **React 18+** com **TypeScript**. A tipagem estrita do TypeScript é vital para gerenciar os complexos estados de configuração dos agentes e para a manutenibilidade do código a longo prazo.
    - **Build Tool:** **Vite**. Sua velocidade de desenvolvimento com Hot Module Replacement (HMR) e build otimizado reduz a fricção para os desenvolvedores e acelera nosso ciclo de iteração.
    - **Componentes de UI:** **shadcn/ui**, construído sobre **Radix UI** (para acessibilidade) e estilizado com **Tailwind CSS**. Esta escolha nos dá controle total sobre nosso Design System, permitindo a construção rápida de interfaces customizadas e consistentes.
        
    - **Gerenciamento de Estado:**
        
        - **Estado Global (UI):** **Zustand**, por sua simplicidade e performance, para gerenciar estados de UI compartilhados como tema, estado de autenticação, etc.
        - **Estado do Servidor:** **React Query (ou TanStack Query)** para gerenciar o cache de dados, revalidação e estado de carregamento/erro das chamadas à API, o que simplifica a lógica de dados e melhora drasticamente a experiência do usuário.

#### 2. Testes, Qualidade de Código e DevOps

Uma cultura de engenharia robusta é fundamental para a qualidade e confiabilidade da **ai.da**.

- **Frontend:**
    
    - **Testes:** **Vitest** com **React Testing Library** para testes unitários e de componentes, focando no comportamento do ponto de vista do usuário.
    - **Testes End-to-End:** **Playwright** ou **Cypress** para simular jornadas completas do usuário e garantir que os fluxos críticos funcionem como esperado.
    - **Desenvolvimento de Componentes:** **Storybook** para desenvolver, documentar e testar visualmente os componentes de UI de forma isolada, criando um Design System vivo.
        
- **Backend:** **Pytest** para testes unitários, de integração e de API, com medição de cobertura de código para garantir a qualidade da lógica de negócio e dos runtimes.
    
- **Qualidade de Código:** **ESLint** e **Prettier** (Frontend), **Black** e **Ruff** (Backend) serão impostos em um hook de pré-commit para garantir um padrão de código consistente e limpo em toda a base de código.
    
- **CI/CD e Infraestrutura:** **GitHub Actions** será nosso motor de automação. As pipelines irão:
    
    1. Executar linters e testes em cada Pull Request.
    2. Construir imagens Docker otimizadas.
    3. Publicar as imagens em um registro (ex: Google Artifact Registry).
    4. Usar **Terraform** ou **Pulumi** (Infrastructure as Code) para gerenciar nossa infraestrutura no Kubernetes, garantindo implantações consistentes e reprodutíveis em ambientes de staging e produção.