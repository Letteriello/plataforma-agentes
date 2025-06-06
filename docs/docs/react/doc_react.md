Claro. Aqui está a documentação detalhada da arquitetura front-end, 100% em formato Markdown, utilizando React e a abordagem `shadcn/ui`.

# **Documentação da Arquitetura Front-end (React + shadcn/ui)**

## **1. Visão Geral e Filosofia**

O front-end desta plataforma será a interface principal para a poderosa engine do **ADK (Agent Development Kit)**. Nossa filosofia é criar uma UI limpa, acessível e altamente personalizável, utilizando a abordagem de componentização oferecida pelo **shadcn/ui**.

Não usaremos uma biblioteca de componentes tradicional. Em vez disso, teremos componentes que podemos possuir e adaptar, copiados diretamente para nossa base de código. Isso nos dá máxima flexibilidade para construir uma experiência única, permitindo que qualquer usuário possa:

- **Interagir** com agentes de forma fluida e conversacional.
- **Visualizar** o "raciocínio" do agente (ex: uso de ferramentas, status).
- **Configurar** o comportamento dos agentes através de formulários claros e intuitivos.
- **Gerenciar** sessões, agentes e seus recursos (artefatos).

---

## **2. Stack Tecnológica Principal**

A stack foi refinada para se alinhar com o ecossistema do shadcn/ui:

- **Framework:** **React 18+** (utilizando Hooks).
- **Linguagem:** **TypeScript** para segurança de tipos robusta, essencial para as complexas estruturas de dados do ADK.
- **Componentes:** **shadcn/ui**. Coleção de componentes reutilizáveis, lindamente projetados, que você pode instalar e possuir. Usaremos componentes como `Button`, `Input`, `Card`, `Dialog`, `Select`, `Textarea`, e `Alert`.
- **Estilização:** **Tailwind CSS**. Utilitário CSS que nos permite construir designs customizados rapidamente, sendo a base de estilização do shadcn/ui.
- **Gerenciamento de Estado:** **Zustand**. Leve, moderno e poderoso para gerenciar nosso estado global (sessão, agente ativo, etc.).
- **Roteamento:** **React Router**.
- **Comunicação com API:** **Axios** para requisições RESTful e a API nativa **`EventSource`** para a comunicação via streaming (SSE).

---

## **3. Estrutura de Pastas do Projeto**

A estrutura será otimizada para acomodar os componentes do shadcn/ui:

```
src/
|-- /app/                # Roteamento e páginas (se usando Next.js App Router)
|-- /assets/             # Imagens, fontes, etc.
|-- /components/         # Componentes específicos do nosso projeto
|   |-- /features/       # Agrupamento de componentes por funcionalidade (chat, config)
|   |-- /ui/             # LOCAL ONDE OS COMPONENTES DO SHADCN/UI SÃO INSTALADOS
|-- /hooks/              # Hooks personalizados (useAgentStream, useSession)
|-- /lib/                # Funções utilitárias, incluindo a `cn` do shadcn/ui
|-- /services/           # Lógica de comunicação com o backend
|-- /store/              # Configuração do Zustand
|-- /types/              # Definições de tipos TypeScript
|-- layout.tsx           # Layout principal
|-- page.tsx             # Página de entrada
```

---

## **4. Arquitetura de Componentes com shadcn/ui**

Mapeamos os conceitos do ADK para uma hierarquia de componentes React, utilizando o shadcn/ui.

### **`<ChatPage />`** (Página Principal)

Componente que orquestra a interface. Usará o componente `Resizable` do shadcn/ui para criar um layout com painéis redimensionáveis.

- **`<AgentSidebar />`**: Um `<ResizablePanel />` contendo uma lista de agentes. Cada agente pode ser um `<Button variant="ghost">` dentro de uma lista.
- **`<ChatWindow />`**: O painel principal (`<ResizablePanel />`).
    - **`<MessageList />`**: Um `div` com scroll que renderiza a lista de `Events` da sessão.
    - **`<Message />`**: Componente inteligente que usa `Card`, `Alert` e `Avatar` do shadcn/ui para renderizar diferentes tipos de eventos:
        - **Mensagem de Texto:** Um `div` estilizado com Tailwind CSS para a "bolha" de chat.
        - **Chamada de Ferramenta (`tool_code`):** Um componente `<Alert>` para destacar a ação. Ex: `<Alert><Terminal className="h-4 w-4" /> <AlertTitle>Executando Ferramenta</AlertTitle><AlertDescription>get_current_weather(...)</AlertDescription></Alert>`.
        - **Resultado de Ferramenta:** Pode ser exibido dentro de um `<Card>` com um `<CardContent>`.
        - **Artefato (`Artifact`):** Um `<Card>` com um `<Avatar>` para o ícone do tipo de arquivo e um `<Button>` para download/visualização, que pode abrir um `<Dialog>`.
    - **`<InputBar />`**: A barra de entrada na parte inferior.
        - Utiliza o `<Input />` e `<Button />` do shadcn/ui.
        - Um botão com um ícone de clipe usará um `<input type="file" hidden />` para upload de **artefatos**.

### **`<AgentConfigPage />`** (Página de Configuração)

Uma página de formulário construída inteiramente com componentes shadcn/ui para uma experiência de usuário limpa e consistente.

- **`<InstructionEditor />`**: Um `<Card>` contendo um `<Label htmlFor="instructions">Instruções do Agente</Label>` e um `<Textarea id="instructions" />` para o usuário definir o comportamento do agente.
- **`<ToolSelector />`**: Um `<Card>` com o título "Ferramentas Disponíveis". Dentro, uma lista de ferramentas, cada uma com um `<Checkbox />` e `<Label />` para habilitar/desabilitar.
- **`<ModelSelector />`**: Um `<Select />` para que o usuário escolha o `Model` (Gemini, Claude, etc.) para o `LlmAgent`.

---

## **5. Gerenciamento de Estado com Zustand**

Nosso store global (`src/store/sessionStore.ts`) gerenciará o estado da interação. Ele é agnóstico à biblioteca de UI.

TypeScript

```
// src/store/sessionStore.ts
import create from 'zustand';
import { Session, Agent } from '../types/adk.types';

interface SessionState {
  activeSession: Session | null;
  availableAgents: Agent[];
  activeAgent: Agent | null;
  isStreaming: boolean;
  setSession: (session: Session) => void;
  addEventToSession: (event: Event) => void;
  setActiveAgent: (agent: Agent) => void;
  setStreaming: (isStreaming: boolean) => void;
}

export const useSessionStore = create<SessionState>((set) => ({
  activeSession: null,
  availableAgents: [],
  activeAgent: null,
  isStreaming: false,
  setSession: (session) => set({ activeSession: session }),
  addEventToSession: (event) => set((state) => ({
    activeSession: state.activeSession
      ? { ...state.activeSession, events: [...state.activeSession.events, event] }
      : null,
  })),
  setActiveAgent: (agent) => set({ activeAgent: agent }),
  setStreaming: (isStreaming) => set({ isStreaming }),
}));
```

---

## **6. Comunicação com o Backend (API & Streaming)**

A camada de serviço é responsável pela comunicação de dados.

- **`apiService.ts`**: Continuará usando Axios para chamadas REST.
- **`useAgentStream.ts`**: Nosso hook personalizado usará `EventSource` para gerenciar a conexão de streaming SSE, permitindo a comunicação em tempo real entre o agente e o cliente.

---

## **7. Traduzindo Conceitos ADK para a UI (com shadcn/ui)**

|   |   |
|---|---|
|**Conceito do ADK**|**Implementação no Front-end (React + shadcn/ui)**|
|**Session** & **Events**|O estado `activeSession` no **Zustand**. O componente **`<MessageList />`** renderiza `Events` usando **`<Card>`** e **`<Alert>`** para diferentes tipos de mensagem.|
|**Streaming**|O hook **`useAgentStream`** com `EventSource`. O texto dentro do componente `<Message />` é atualizado token a token, criando um efeito de digitação em tempo real.|
|**Tools** & **Function Calling**|O componente **`<Alert>`** é usado para notificar visualmente que uma ferramenta está em uso, com o nome da ferramenta e seus parâmetros.|
|**Artifacts**|O upload é feito via **`<Input type="file">`** no `<InputBar />`. Artefatos são exibidos em um **`<Card>`**, e a visualização completa pode ser feita em um **`<Dialog>`**.|
|**LLM, Workflow Agents**|Na **`<AgentSidebar />`**, cada agente é um **`<Button variant="ghost">`**. Podemos usar ícones do `lucide-react` para diferenciar os tipos de agente.|
|**RunConfig** & **Callbacks**|A UI pode exibir um ícone de carregamento diferente se o streaming estiver desabilitado (`RunConfig`). Um `Callback` de segurança pode resultar em um `<Alert variant="destructive">` com a mensagem de bloqueio.|
|**Authentication for Tools**|A página de configuração terá campos **`<Input type="password">`** e **`<Label>`** para o usuário inserir credenciais de forma segura, que serão enviadas para o backend.|

---

## **8. Conclusão**

Adotar **shadcn/ui** e **Tailwind CSS** nos posiciona na vanguarda do desenvolvimento front-end. Ganhamos uma velocidade de desenvolvimento incrível e controle total sobre a aparência e o comportamento da nossa aplicação, sem sacrificar a qualidade ou a acessibilidade. Esta arquitetura é a base ideal para construir a plataforma de agentes autônomos que você idealizou, garantindo que ela seja não apenas poderosa, mas também bonita e extremamente agradável de usar.