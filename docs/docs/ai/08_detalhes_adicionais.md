### **Documentação 08: Detalhes Adicionais e Estratégias Transversais**

#### **1. Estratégia de API e Comunicação Backend-Frontend**

Embora a arquitetura desacoplada esteja definida, é vital especificar a natureza da comunicação.

- **Padrão de API:** A comunicação entre o frontend e o backend será padronizada através de uma **API RESTful**. Todas as interações seguirão os verbos HTTP padrão (GET, POST, PUT, DELETE) para as operações de CRUD em recursos como agentes, ferramentas e memória.
- **Contrato da API e Documentação:** O backend deverá expor uma documentação de API gerada automaticamente (ex: via **Swagger/OpenAPI**). Isso servirá como a "fonte da verdade" para o `apiService` do frontend, garantindo que as equipes possam trabalhar em paralelo.
- **Versionamento da API:** Para garantir que o frontend não quebre com futuras atualizações do backend, a API será versionada. A estratégia inicial será o versionamento via URL (ex: `/api/v1/agents`).

---

#### **2. Filosofia de Gestão de Estado (Frontend)**

Para manter o código limpo e previsível, a gestão de estado seguirá diretrizes estritas.

- **Estado Global (Zustand):** O `store/` conterá apenas o estado que é verdadeiramente global e partilhado por múltiplos componentes não relacionados.
    - **O quê armazenar:** Estado de autenticação do utilizador, lista de agentes/ferramentas/sessões obtida da API, configurações globais da aplicação e o agente ativo selecionado.
    - **Ações Assíncronas:** Todas as chamadas de API (via `apiService`) devem ser iniciadas e geridas exclusivamente dentro das ações do Zustand. Os componentes React não devem chamar a API diretamente, apenas as ações do store.
- **Estado Local (React Hooks):** O estado que é relevante apenas para um único componente ou seus filhos diretos (ex: visibilidade de um modal, conteúdo de um campo de formulário, estado de carregamento de um único card) deve ser gerido localmente com `useState` e `useReducer`.

---

#### **3. Estratégia de Segurança e Permissões**

A segurança é um pilar da plataforma.

- **Autenticação de API:** Todas as requisições para a API do backend serão autenticadas usando **JSON Web Tokens (JWT)**. O token será obtido no login e armazenado de forma segura no cliente (gerido pelo `authStore` do Zustand) e enviado em cada pedido subsequente.
- **Gestão de Segredos do Utilizador ("Cofre"):** A funcionalidade de "Cofre", onde os utilizadores guardam chaves de API para as suas ferramentas personalizadas, terá as seguintes características:
    - As chaves serão enviadas uma única vez para o backend e **encriptadas em repouso** (at-rest).
    - O frontend **nunca** terá acesso para ler o valor de uma chave após ela ser salva. Ele só poderá referenciá-la pelo nome/ID.
- **Modelo de Roles (Funções de Utilizador):** Para o futuro, a plataforma suportará um sistema de roles. Inicialmente, definiremos duas funções:
    - **`user`:** Perfil padrão para "Sofia" e "David", com acesso para criar e gerir os seus próprios agentes.
    - **`admin`:** Para gestão da plataforma, visualização de estatísticas globais e moderação de conteúdo da comunidade.

---

#### **4. Internacionalização (i18n) e Localização (L10n)**

Para democratizar verdadeiramente a criação de agentes, a plataforma deve ser multilíngue.

- **Estratégia:** Será implementada uma biblioteca de i18n padrão para React (ex: `i18next`).
- **Estrutura de Ficheiros:** Todas as strings de texto da UI serão extraídas para ficheiros JSON (ex: `/locales/en/common.json`, `/locales/pt/common.json`).
- **Linguagem Padrão:** O **inglês (en)** será a língua de desenvolvimento padrão para as chaves de tradução. O **português (pt-BR)** será a primeira língua alvo de tradução, dado o contexto da UI atual.

---

#### **5. Observabilidade: Logging, Erros e Monitorização**

Uma plataforma robusta requer uma boa observabilidade.

- **Tratamento de Erros no Frontend:**
    - **Feedback ao Utilizador:** Erros previsíveis (ex: falha de validação de formulário) e falhas de API serão comunicados de forma amigável ao utilizador através do `Toaster` já existente.
    - **Captura de Erros Críticos:** Erros inesperados no cliente serão capturados e enviados para um serviço de monitorização de terceiros (ex: Sentry, LogRocket) para análise pela equipa de desenvolvimento.
- **Painel de "Raciocínio" do Agente:** A funcionalidade de logs de execução no chat será a principal ferramenta de depuração para os utilizadores entenderem o fluxo de pensamento dos seus agentes, e deve ser tratada como uma funcionalidade de primeira classe.

---

#### **6. Evolução do Design System**

Para manter a consistência visual à medida que a plataforma cresce, o processo de evolução do design system precisa ser formalizado.

- **Proposta de Novos Componentes:** Qualquer novo componente reutilizável deve primeiro ser proposto e desenhado (ex: num ficheiro Figma) para garantir que se alinha com o **Nexus Design System**.
- **Desenvolvimento Isolado:** Novos componentes de UI devem ser desenvolvidos de forma isolada no **Storybook**, documentando todas as suas variantes e estados, antes de serem integrados na aplicação principal.
- **Diretório de Componentes:** Apenas componentes verdadeiramente genéricos e reutilizáveis devem ser colocados em `components/ui`. Componentes específicos de uma funcionalidade devem residir na sua pasta de feature correspondente.