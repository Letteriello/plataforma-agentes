### **Documentação: Stack Tecnológica da Plataforma**

Esta documentação define o conjunto de tecnologias, bibliotecas e frameworks que constituem a arquitetura da plataforma de agentes. A escolha de cada componente foi feita para garantir uma base moderna, escalável, manutenível e que suporte a visão de uma plataforma _low-code/no-code_ para utilizadores iniciantes e avançados.

---

### **1. Arquitetura Geral**

A plataforma é dividida em duas camadas principais, projetadas para operar de forma desacoplada:

- **Frontend (Aplicação Cliente):** Uma Single-Page Application (SPA) reativa e moderna, responsável por toda a experiência do utilizador, desde a configuração dos agentes até à interação via chat.
- **Backend (Motor de Agentes):** A camada de servidor que irá orquestrar a lógica dos agentes, executar as ferramentas e gerir a comunicação com os modelos de linguagem. O objetivo é que esta camada consuma as lógicas de bibliotecas como Google ADK, Langchain e CrewAI, expondo-as através de uma API.

---

### **2. Frontend**

- **Framework Principal:** **React 18+**
    
    - **Justificativa:** Um ecossistema maduro, performance excecional com o seu DOM virtual, e a base para o resto da nossa stack de UI.
- **Linguagem:** **TypeScript**
    
    - **Justificativa:** Essencial para a segurança de tipos e manutenibilidade do projeto, especialmente ao lidar com as estruturas de dados complexas dos agentes e suas configurações.
- **Build Tool e Servidor de Desenvolvimento:** **Vite**
    
    - **Justificativa:** Oferece uma experiência de desenvolvimento extremamente rápida com Hot Module Replacement (HMR) e um processo de build otimizado.
- **Componentes de UI:** **shadcn/ui**
    
    - **Justificativa:** Em vez de uma biblioteca de componentes tradicional, o shadcn/ui permite-nos "possuir" os componentes, instalando-os diretamente na nossa base de código (`/components/ui`). Isso garante máxima flexibilidade para alinhamento com o nosso Design System. Os componentes são construídos sobre **Radix UI** (para acessibilidade e comportamento) e estilizados com Tailwind CSS.
- **Estilização:** **Tailwind CSS**
    
    - **Justificativa:** Um framework _utility-first_ que permite a construção rápida de interfaces customizadas e é a base para o `shadcn/ui`. As nossas cores, fontes e espaçamentos do Nexus Design System são implementados como uma extensão do tema do Tailwind.
- **Gerenciamento de Estado Global:** **Zustand**
    
    - **Justificativa:** Uma solução de gerenciamento de estado leve, moderna e poderosa, que simplifica a partilha de estado entre componentes sem o _boilerplate_ de outras soluções. Teremos stores separados por funcionalidade (ex: `agentStore`, `authStore`, `sessionStore`).
- **Roteamento:** **React Router**
    
    - **Justificativa:** A solução padrão da indústria para roteamento em aplicações React, permitindo-nos definir as diferentes páginas da plataforma (`/dashboard`, `/agentes`, `/chat`, etc.).
- **Comunicação com API:** **Axios**
    
    - **Justificativa:** Um cliente HTTP robusto e popular para realizar requisições à API do backend.
- **Ícones:** **Lucide React**
    
    - **Justificativa:** Uma biblioteca de ícones limpa, consistente e altamente personalizável, que se alinha perfeitamente com a estética do nosso Design System.

---

### **3. Backend (Visão Arquitetural)**

- **Linguagem:** **Python** ou **Node.js/TypeScript** (a ser definido).
    
    - **Justificativa:** Ambas as linguagens possuem um ecossistema robusto para desenvolvimento de backend e excelentes SDKs para interagir com modelos de IA e bibliotecas como Langchain, Google ADK, etc. A persona do "Desenvolvedor Inovador" está familiarizada com Python.
- **Framework Web:** **FastAPI** (para Python) ou **Express/NestJS** (para Node.js/TypeScript).
    
    - **Justificativa:** Frameworks modernos e de alta performance para construir as APIs RESTful que servirão o frontend. A documentação do ADK frequentemente exemplifica o uso com FastAPI.
- **Orquestração de Agentes:**
    
    - A camada de serviço irá integrar bibliotecas como **Google ADK**, **Langchain**, **CrewAI**, etc., para fornecer a lógica de execução dos agentes.
- **Banco de Dados:** **PostgreSQL** (para dados relacionais) e um **Banco de Dados Vetorial** (ex: Pinecone, Weaviate, ou Vertex AI Vector Search) para a funcionalidade de Memória (RAG).
    
    - **Justificativa:** PostgreSQL oferece robustez para dados estruturados (utilizadores, configurações de agentes). Um banco de dados vetorial é essencial para a busca semântica de alta performance necessária para a memória de longo prazo dos agentes.

---

### **4. Testes e Qualidade de Código**

- **Testes de Frontend:** **Vitest** com **React Testing Library**.
    
    - **Justificativa:** Vitest oferece uma experiência de teste rápida e integrada ao ambiente Vite. React Testing Library promove as melhores práticas ao testar o comportamento dos componentes do ponto de vista do utilizador.
- **Desenvolvimento de Componentes Isolados:** **Storybook**.
    
    - **Justificativa:** Permite-nos desenvolver e documentar componentes de UI de forma isolada, garantindo consistência e facilitando a reutilização.
- **Linting e Formatação:** **ESLint** e **Prettier**.
    
    - **Justificativa:** Para manter um padrão de código consistente e limpo em toda a base de código, conforme o princípio de arquitetura do projeto.