Com base no relatório técnico detalhado fornecido pelo **RevisorDeCodigoGem**, procedo com a orquestração das próximas etapas para o desenvolvimento e aprimoramento do projeto **plataforma-agentes**.

### **Consolidação do Projeto**

* **Projeto:** `plataforma-agentes`
* **Descrição:** Aplicação web front-end para a criação, gerenciamento e interação com agentes de Inteligência Artificial, servindo como interface para um Agent Development Kit (ADK).
* **Tecnologias:** React, TypeScript, Vite, shadcn/ui, Tailwind CSS, Zustand, React Router.
* **Status:** O projeto possui uma base de UI bem estruturada e documentação extensa, mas apresenta dívidas técnicas relacionadas à componentização, centralização de lógica, falta de testes e inconsistências de tipagem.

### **Objetivo Geral do Projeto**

Criar uma plataforma front-end robusta e modular para gerenciar o ciclo de vida de agentes de IA, resolvendo as dívidas técnicas atuais para garantir escalabilidade, manutenibilidade e confiabilidade.

### **Funcionalidades a Implementar (Débitos Técnicos a Sanar)**

1.  **Refatoração de Componentes Monolíticos:** Desacoplar o componente `Agentes.tsx` em componentes menores e mais gerenciáveis, utilizando hooks customizados para a lógica de estado.
2.  **Centralização da Lógica de Negócios:** Mover toda a simulação de API e dados mock para o diretório `api/` e `data/`, respectivamente, removendo-os dos componentes de UI e stores.
3.  **Implementação de Cobertura de Testes:** Desenvolver testes unitários e de integração para componentes críticos (`AgentConfigurator`, stores Zustand) e fluxos principais (criação de agente, interação no chat).
4.  **Unificação e Correção de Tipagem:** Padronizar os tipos (ex: `Agent`) em um local central (`src/types/`) e corrigir o uso de `any` nos stores do Zustand para garantir a segurança de tipos.
5.  **Gerenciamento de Configurações e Segredos:** Implementar o uso de variáveis de ambiente (`.env`) para o gerenciamento de configurações e chaves de API.

### **Priorização das Funcionalidades**

1.  **[P1] Correção de Tipagem e Gerenciamento de Segredos:** A base para um desenvolvimento estável e seguro.
2.  **[P1] Centralização da Lógica de Negócios:** Essencial para desacoplar a UI da lógica de dados antes de grandes refatorações.
3.  **[P2] Refatoração de Componentes Monolíticos:** A melhoria mais impactante na manutenibilidade do código, dependente da centralização da API.
4.  **[P3] Implementação de Cobertura de Testes:** Garante a qualidade e a estabilidade após as refatorações estruturais.

### **Ordem de Execução dos Agentes**

1.  **ArchitectGem:** Será o primeiro a atuar, desenhando a solução para as dívidas técnicas.
2.  **AskGem:** Pesquisará as melhores práticas e documentações para suportar as soluções desenhadas.
3.  **CoderGem:** Implementará as soluções em etapas, seguindo a ordem de prioridade definida.

### **Roteiro Inicial de Desenvolvimento**

* **Etapa 1: Desenho da Arquitetura de Solução** — **Responsável: ArchitectGem**
    * Definir a arquitetura para a refatoração do `Agentes.tsx`.
    * Projetar a estrutura final do `apiService` para centralizar toda a comunicação com o backend.
    * Esboçar a estratégia de testes, definindo os tipos de testes para cada parte da aplicação.
    * Planejar a unificação dos tipos de agentes e a estrutura dos stores do Zustand.

* **Etapa 2: Pesquisa e Documentação de Apoio** — **Responsável: AskGem**
    * Coletar documentação sobre hooks customizados em React para gerenciamento de estado complexo em formulários.
    * Pesquisar melhores práticas para testar stores do Zustand com Vitest.
    * Buscar documentação sobre o uso de variáveis de ambiente no Vite (`import.meta.env`).

* **Etapa 3: Implementação da Base (Tipagem, Env e API)** — **Responsável: CoderGem**
    * Refatorar os stores do Zustand para usar a tipagem correta, eliminando o uso de `any`.
    * Unificar os tipos de `Agent` em `src/types/`.
    * Implementar o uso de arquivos `.env` para configurações.
    * Mover todos os dados mockados para um diretório `data/` e a lógica de simulação de API para `apiService.ts`.

* **Etapa 4: Refatoração do Componente `Agentes.tsx`** — **Responsável: CoderGem**
    * Implementar a arquitetura definida pela **ArchitectGem**, quebrando o componente `Agentes.tsx` em subcomponentes e hooks.

* **Etapa 5: Implementação dos Testes** — **Responsável: CoderGem**
    * Escrever os testes unitários e de integração para os componentes e stores, conforme a estratégia da **ArchitectGem**.

➡️ ArchitectGem, por favor, desenvolva a arquitetura do sistema com base neste roteiro.