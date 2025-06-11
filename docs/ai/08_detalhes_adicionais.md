## **08_detalhes_adicionais.md**

### Detalhes Adicionais e Estratégias Transversais v3.0

#### 1. Estratégia de API e Comunicação

- **Padrão de API:** A comunicação seguirá estritamente os princípios **RESTful**, com recursos bem definidos (ex: `/agents`, `/tools`). O backend, construído em FastAPI, exporá uma documentação **Swagger/OpenAPI** gerada automaticamente, que servirá como um contrato vivo para o desenvolvimento do frontend e para a comunidade de desenvolvedores de ferramentas.
    
- **Comunicação em Tempo Real:** A escolha da tecnologia será orientada pelo caso de uso:
    
    - **WebSockets:** Para funcionalidades altamente interativas e bidirecionais, como uma sessão de co-edição de um agente ou depuração interativa na Torre de Controle.
    - **Server-Sent Events (SSE):** Para comunicação unidirecional do servidor para o cliente, ideal para o streaming de logs no "Painel de Raciocínio (Live Trace)" e notificações da plataforma, por ser mais leve e simples que WebSockets para este fim.
        
- **Versionamento:** A API será versionada via URL (ex: `/api/v1/agents`) para garantir que mudanças futuras não quebrem as integrações existentes. Mudanças não-retrocompatíveis resultarão em um incremento da versão (ex: `/api/v2/`).
    

#### 2. Filosofia de Gestão de Estado (Frontend)

- **Estado Global (Zustand):** Usado exclusivamente para estado que afeta a aplicação como um todo e não está diretamente ligado aos dados do servidor. Exemplos: estado de autenticação do usuário, tema da UI (claro/escuro), estado de um tour guiado para novos usuários. As chamadas de API **não** devem ser gerenciadas aqui.
- **Estado Local (React Hooks):** Para estado transitório e contido em um componente, como o valor de um campo de formulário antes do envio, o estado de abertura de um modal ou a aba ativa em um painel de navegação. A regra é: se o estado não precisa ser conhecido fora do componente e seus filhos imediatos, ele permanece local.
- **Estado do Servidor (React Query / TanStack Query):** Esta será nossa principal ferramenta para buscar, armazenar em cache e atualizar dados do servidor. Ela simplifica radicalmente a lógica de dados, eliminando a necessidade de gerenciar manualmente estados de `isLoading`, `error`, `data`. Isso melhora a experiência do usuário com recursos como `stale-while-revalidate` (mostrando dados antigos enquanto busca novos) e `refetch-on-window-focus`. **Fluxo Típico:** Um componente chama um hook customizado (ex: `useGetAgents()`) que, por sua vez, usa `useQuery` para chamar o serviço de API correspondente.
    

#### 3. Estratégia de Segurança e Permissões

- **Autenticação (JWT Flow):** O processo de login retornará um **access token** de curta duração (ex: 15 minutos) e um **refresh token** de longa duração (ex: 7 dias). O access token é enviado em cada requisição à API. Quando ele expira, a aplicação usa o refresh token (armazenado de forma segura, ex: cookie HttpOnly) para obter um novo access token silenciosamente, sem interromper o usuário.
    
- **Gestão de Segredos ("Cofre"):** Chaves de API para ferramentas serão criptografadas em repouso no banco de dados com um algoritmo forte (ex: AES-256). O serviço de backend que executa a ferramenta será o único com permissão para descriptografar a chave just-in-time para uso, minimizando a exposição.
    
- **Modelo de Roles (RBAC):** O sistema de RBAC será aplicado em duas camadas:
    
    - **Backend:** Endpoints da API serão protegidos com base no papel do usuário (ex: apenas um `Administrador` pode acessar `/users`).
    - **Frontend:** A UI se adaptará dinamicamente, ocultando botões e seções que o usuário não tem permissão para acessar, garantindo uma experiência limpa e segura.
        

#### 4. Internacionalização (i18n) e Acessibilidade (a11y)

- **i18n:** A plataforma será multilíngue usando `i18next` com `react-i18next`. As chaves de tradução serão estruturadas por funcionalidade para facilitar a manutenção (ex: `teamDesigner.buttons.addAgent`).
    
- **a11y:** Acessibilidade é um requisito, não uma opção. Além de usar Radix UI, garantiremos que:
    
    - Toda a plataforma seja navegável via teclado.
    - Imagens tenham atributos `alt` descritivos.
    - As cores do Design System tenham taxas de contraste que atendam aos padrões WCAG AA.
    - Usaremos landmarks HTML5 e atributos ARIA para melhorar a navegação para leitores de tela.
        

#### 5. Observabilidade e Monitoramento

- **Frontend:** Usaremos o **Sentry** (ou similar) para capturar erros inesperados, mas também para monitorar a performance através dos Core Web Vitals e rastrear a "saúde" das releases, identificando regressões de performance.
- **Backend:** Adotaremos **structured logging** (logs em formato JSON) para facilitar a busca e análise. Implementaremos **distributed tracing** com OpenTelemetry para seguir uma requisição desde o frontend, passando pelos serviços do backend até o banco de dados, o que é crucial para depurar problemas em nosso sistema distribuído. Esses traços serão a espinha dorsal dos dados exibidos na **Torre de Controle**.
    

#### 6. Evolução do Design System

- **Processo Formalizado:** A evolução do nosso Design System seguirá um processo claro para manter a consistência e a qualidade:
    
    1. **Proposta (RFC):** Um desenvolvedor ou designer abre uma "Request for Comments" para um novo componente ou uma mudança significativa.
    2. **Design (Figma):** A equipe de design cria os mockups e protótipos visuais.
    3. **Desenvolvimento Isolado (Storybook):** O componente é construído no Storybook, documentando todas as suas `props`, variantes e estados (ex: `hover`, `disabled`, `loading`).
    4. **Revisão de Código e Design:** O PR do componente é revisado tanto pelo código quanto pela fidelidade ao design proposto.
    5. **Integração:** Após a aprovação, o componente é publicado no pacote interno e pode ser usado na aplicação principal.