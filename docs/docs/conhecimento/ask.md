Olá, ArchitectGem\! 📐 Pesquisa concluída.

A seguir, apresento a documentação técnica e as melhores práticas para cada tecnologia que você recomendou. Este guia foi elaborado para ser uma referência clara e direta para o CoderGem.

-----

### **1. Front-end: React com Vite**

  * **TL;DR:** Vite é uma ferramenta de construção moderna que oferece um ambiente de desenvolvimento extremamente rápido para projetos React. Ele utiliza os módulos ES nativos do navegador durante o desenvolvimento, eliminando a necessidade de empacotamento em cada alteração.

  * **Melhores Práticas:**

      * **Inicialização:** Utilize o comando oficial para criar o projeto: `npm create vite@latest nome-do-projeto -- --template react-ts`.
      * **Estrutura de Projeto:** Mantenha a estrutura de pastas simples, com `index.html` na raiz e todo o código-fonte dentro de `/src`.
      * **Assets Estáticos:** Coloque imagens, fontes e outros assets que não são importados diretamente no código dentro da pasta `/public`.
      * **Performance:** Evite o uso excessivo de plugins, pois eles podem tornar o servidor de desenvolvimento mais lento.

  * **Links:**

      * [Guia Oficial do Vite](https://vitejs.dev/guide/)
      * [Guia Avançado de Vite com React (CodeParrot)](https://codeparrot.ai/blogs/advanced-guide-to-using-vite-with-react-in-2025)

-----

### **2. Linguagem: TypeScript**

  * **TL;DR:** TypeScript adiciona tipagem estática ao JavaScript, o que ajuda a prevenir bugs em tempo de desenvolvimento, melhora o autocompletar e torna o código mais legível e manutenível.

  * **Melhores Práticas:**

      * **Modo Estrito (Strict Mode):** Habilite a flag `strict` no seu `tsconfig.json` para uma verificação de tipos mais robusta.
      * **Evite o `any`:** O uso do tipo `any` desabilita as checagens do TypeScript. Prefira criar tipos e interfaces específicas ou usar `unknown` quando o tipo for realmente desconhecido.
      * **Inferência de Tipos:** Deixe o TypeScript inferir os tipos sempre que possível, mas seja explícito em assinaturas de funções e objetos complexos.
      * **Tipos de Utilidade (Utility Types):** Utilize tipos como `Partial<T>`, `Pick<T>`, etc., para criar novos tipos a partir de tipos existentes de forma flexível.

  * **Links:**

      * [TypeScript para Iniciantes em React](https://react.dev/learn/typescript)
      * [Boas Práticas de TypeScript (DEV Community)](https://dev.to/alisamir/best-practices-for-writing-clean-typescript-code-57hf)

-----

### **3. Componentes de UI: shadcn/ui**

  * **TL;DR:** Não é uma biblioteca de componentes tradicional, mas uma coleção de componentes reutilizáveis que você pode copiar e colar no seu projeto, dando controle total sobre o código. Utiliza Tailwind CSS para estilização.

  * **Melhores Práticas:**

      * **Instalação:** Utilize a CLI do shadcn/ui para adicionar novos componentes ao seu projeto. Isso garante que todas as dependências sejam instaladas corretamente.
      * **Customização:** Como os componentes são parte do seu código-fonte (em `src/components/ui`), sinta-se à vontade para adaptá-los conforme as necessidades do design system do projeto.
      * **Composição:** Construa componentes mais complexos compondo os blocos de construção fornecidos pelo shadcn/ui.

  * **Links:**

      * [Documentação Oficial do shadcn/ui](https://ui.shadcn.com/docs)
      * [Repositório no GitHub](https://github.com/shadcn-ui/ui)

-----

### **4. Estilização: Tailwind CSS**

  * **TL;DR:** Um framework CSS "utility-first" que permite construir designs customizados diretamente no seu HTML/JSX. Altamente configurável e performático, pois remove o CSS não utilizado em produção.

  * **Melhores Práticas:**

      * **Configuração:** Defina suas cores, fontes, espaçamentos e outros tokens de design no arquivo `tailwind.config.js` para manter a consistência.
      * **Componentes Abstratos:** Para componentes reutilizáveis, considere criar classes de componentes no seu arquivo CSS principal usando a diretiva `@apply` para evitar a repetição de longas listas de classes de utilitários.
      * **Plugins:** Utilize plugins oficiais como `@tailwindcss/typography` e `@tailwindcss/forms` para estilizar conteúdo de markdown e formulários, respectivamente.

  * **Links:**

      * [Documentação Oficial do Tailwind CSS](https://tailwindcss.com/docs)

-----

### **5. Gerenciamento de Estado Global: Zustand**

  * **TL;DR:** Uma biblioteca de gerenciamento de estado minimalista, rápida e sem "boilerplate". É ideal para gerenciar o estado global de forma simples e reativa, sem a necessidade de provedores de contexto complexos.

  * **Melhores Práticas:**

      * **Modularização dos Stores:** Divida seu estado em múltiplos "stores" lógicos (ex: `agentStore`, `chatStore`, `authStore`) em vez de um único store monolítico.
      * **Seletores:** Para otimizar a performance, utilize seletores para que os componentes só re-renderizem quando a parte do estado que eles consomem realmente mudar.
      * **Tipagem Forte:** Defina interfaces claras para o estado e as ações de cada store para aproveitar ao máximo a segurança do TypeScript.

  * **Links:**

      * [Repositório Oficial do Zustand no GitHub](https://github.com/pmndrs/zustand)
      * [Guia de Zustand com TypeScript](https://tillitsdone.com/blogs/zustand-typescript-guide-2024/)

-----

### **6. Roteamento: React Router**

  * **TL;DR:** A biblioteca padrão para roteamento em aplicações React. Permite a navegação entre diferentes páginas e a criação de layouts aninhados.

  * **Melhores Práticas:**

      * **Rotas Centralizadas:** Defina todas as suas rotas em um único arquivo (ex: `routes.tsx`) para facilitar a manutenção.
      * **Layouts Aninhados:** Utilize a funcionalidade de rotas aninhadas (`<Outlet />`) para criar layouts consistentes (ex: `MainLayout` com `Sidebar` e `Topbar`).
      * **Lazy Loading:** Utilize `React.lazy()` para carregar componentes de página sob demanda, melhorando o tempo de carregamento inicial da aplicação.

  * **Links:**

      * [Tutorial Oficial do React Router](https://www.google.com/search?q=https://reactrouter.com/en/main/start/tutorial)

-----

### **7. Requisições API: Axios**

  * **TL;DR:** Um cliente HTTP baseado em Promises para fazer requisições a APIs. É popular por sua simplicidade, API intuitiva e recursos como interceptors.

  * **Melhores Práticas:**

      * **Instância Centralizada:** Crie uma instância do Axios com as configurações base (baseURL, headers) para reutilização em toda a aplicação.
      * **Serviços de API:** Abstraia as chamadas de API em "serviços" (ex: `agentService.ts`, `toolService.ts`). Isso desacopla a lógica de comunicação da camada de UI.
      * **Interceptors:** Utilize interceptors para tarefas como adicionar tokens de autenticação a todas as requisições ou para um tratamento global de erros.
      * **Cancelamento de Requisições:** Use `CancelToken` para cancelar requisições que não são mais necessárias (ex: quando o usuário navega para outra página).

  * **Links:**

      * [Guia de Requisições com Axios (Apidog)](https://apidog.com/blog/how-to-make-rest-api-calls-with-axios/)
      * [Axios no React.js (NxtWave)](https://www.ccbp.in/blog/articles/axios-in-react-js)

-----

### **8. Testes: Vitest com React Testing Library**

  * **TL;DR:** Vitest é um framework de testes unitários extremamente rápido, otimizado para Vite. React Testing Library fornece utilitários para testar componentes React da forma como os usuários os utilizam.

  * **Melhores Práticas:**

      * **Configuração:** Configure o Vitest no seu `vite.config.ts` e crie um arquivo de setup (ex: `setupTests.ts`) para configurar o `jest-dom`.
      * **Foco nos Testes:**
          * **Testes Unitários:** Teste a lógica de hooks customizados e stores do Zustand de forma isolada.
          * **Testes de Componentes:** Teste componentes de UI puros, verificando se eles renderizam corretamente com base nas props.
          * **Testes de Integração:** Teste fluxos de usuário completos, simulando interações e garantindo que todas as camadas da aplicação (componente -\> hook -\> store) se comuniquem corretamente.

  * **Links:**

      * [Guia de Testes com Vitest (Mantine)](https://mantine.dev/guides/vitest/)

-----

### **9. Segurança e Performance**

  * **Gerenciamento de Segredos (Vite):**

      * **TL;DR:** Utilize arquivos `.env` para armazenar variáveis de ambiente. Apenas variáveis com o prefixo `VITE_` são expostas ao código do cliente.
      * **Prática:** Adicione `.env.local` ao seu `.gitignore` para armazenar chaves de API e outros segredos que não devem ser commitados.
      * **Link:** [Variáveis de Ambiente e Modos (Vite Docs)](https://pt.vite.dev/guide/env-and-mode)

  * **Otimização de Performance (React):**

      * **`React.memo`:** Use para envolver componentes que não precisam re-renderizar se suas props não mudarem.
      * **`useCallback`:** Use para memoizar funções, evitando que elas sejam recriadas em cada renderização. É útil ao passar callbacks para componentes otimizados (envolvidos com `React.memo`).
      * **`useMemo`:** Use para memoizar o resultado de cálculos pesados, evitando que eles sejam re-executados em cada renderização.
      * **Lazy Loading:** Utilize `React.lazy` e `Suspense` para dividir o código e carregar componentes de página apenas quando eles forem necessários.
      * **Links:**
          * [Otimização com `useMemo` e `useCallback` (GeeksForGeeks)](https://www.google.com/search?q=%5Bhttps://www.geeksforgeeks.org/optimizing-performance-with-usememo-and-usecallback-hooks/%5D\(https://www.geeksforgeeks.org/optimizing-performance-with-usememo-and-usecallback-hooks/\))
          * [`React.lazy` (React Docs)](https://www.google.com/search?q=%5Bhttps://react.dev/reference/react/lazy%5D\(https://react.dev/reference/react/lazy\))

-----

### **10. Fluxo de Dados e Padrões de Arquitetura**

  * **TL;DR:** A arquitetura proposta com fluxo de dados unidirecional (UI -\> Hook -\> Store -\> Serviço) é um padrão robusto que promove a separação de responsabilidades e a manutenibilidade.

  * **Hooks Customizados para Data Fetching:**

      * **Padrão:** Crie hooks customizados (ex: `useAgents.ts`, `useChat.ts`) que encapsulam a lógica de busca de dados, gerenciamento de estado de carregamento (`isLoading`) e tratamento de erros (`error`).
      * **Funcionamento:** Esses hooks interagem com os serviços de API para buscar dados e com os stores do Zustand para atualizar o estado global, fornecendo os dados prontos para a camada de UI.
      * **Link:** [Criando um Hook Customizado para Fetching de Dados (Cloud Devs)](https://clouddevs.com/react/custom-hook-for-data-fetching/)

-----

➡️ **CoderGem**, agora você pode começar a implementação dos módulos usando estas referências e boas práticas.