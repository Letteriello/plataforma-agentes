# **Guia de Componentes `shadcn/ui` para a Plataforma de Agentes Nexus**

## **1. Introdução**

Este documento serve como um guia de referência detalhado para a aplicação dos componentes `shadcn/ui` na interface da plataforma de agentes **Nexus**. A escolha pelo `shadcn/ui` foi estratégica, visando máxima flexibilidade, controle sobre o código e uma estética moderna e coesa através do Tailwind CSS.

Cada componente listado abaixo foi selecionado para traduzir um conceito específico do **ADK (Agent Development Kit)** ou uma necessidade da interface do usuário em um elemento visual claro e funcional, seguindo a filosofia do nosso **Nexus Design System**.

## **2. Componentes Fundamentais de Ação e Entrada**

Estes componentes são a base para a interatividade do usuário com a plataforma.

### **`Button`**
* **Uso Principal:** Para todas as ações do usuário, desde o envio de mensagens até a confirmação de configurações complexas.
* **Aplicações na Plataforma:**
    * **Envio de Mensagens:** No `<InputBar>` da tela de chat.
    * **Criação de Recursos:** Botão `+ Criar Agente` no Dashboard e `+ Nova Ferramenta` no Hub de Ferramentas.
    * **Confirmação/Cancelamento:** Dentro de componentes `<Dialog>` para ações como "Implantar" ou "Excluir".
    * **Navegação Interna:** Seleção de agentes na sidebar (`<AgentSidebar />`).
* **Props e Variações Relevantes:**
    * `variant="default"`: Para a ação primária (ex: "Salvar Configurações").
    * `variant="secondary"`: Para ações secundárias (ex: "Cancelar").
    * `variant="destructive"`: Para ações perigosas (ex: "Excluir Agente").
    * `variant="outline"`: Para ações de menor prioridade (ex: "Exportar Sessão").
    * `variant="ghost"`: Para botões com ícones e seleção de itens em listas, como na sidebar de agentes.
    * `size`: Usaremos `default`, `sm` e `icon` para consistência.

### **`Input`**
* **Uso Principal:** Captura de dados textuais curtos.
* **Aplicações na Plataforma:**
    * **Nome do Agente:** No topo da tela de configuração.
    * **Busca:** No Dashboard, Hub de Ferramentas e tela de Sessões.
    * **Configurações de Deploy:** Para inserir nome do serviço, variáveis de ambiente, etc.
* **Conexão com o ADK:** Permite ao usuário definir metadados básicos para os agentes e ferramentas.

### **`Textarea`**
* **Uso Principal:** Captura de blocos de texto longos.
* **Aplicações na Plataforma:**
    * **Instruções do Agente:** Campo principal na aba "Identidade" da tela de configuração para definir a `instruction` do `LlmAgent`.
* **Conexão com o ADK:** É a interface direta para o parâmetro mais crítico de um `LlmAgent`, moldando sua persona e comportamento.

### **`Select`**
* **Uso Principal:** Para permitir que o usuário escolha uma opção de uma lista predefinida.
* **Aplicações na Plataforma:**
    * **Tipo de Agente:** Na tela de criação, para escolher entre `LLM Agent`, `Workflow Agent` (`Sequential`, `Parallel`, `Loop`), `Custom Agent`.
    * **Modelo de LLM:** Para selecionar o modelo base (Gemini, Claude, etc.).
    * **Tipo de Callback:** Para escolher o gatilho do callback (`Before Model`, `After Tool`).
    * **Alvo de Deploy:** Para selecionar entre `Agent Engine`, `Cloud Run` ou `GKE`.
* **Conexão com o ADK:** Fornece uma interface controlada para os enums e tipos definidos pelo ADK, evitando erros de entrada do usuário.

### **`Checkbox`**
* **Uso Principal:** Para seleção múltipla de opções.
* **Aplicações na Plataforma:**
    * **Seleção de Ferramentas:** Na tela de configuração de um agente, para que o usuário possa escolher quais ferramentas o agente poderá usar.
* **Conexão com o ADK:** Mapeia diretamente a lista de `Tools` que será injetada na configuração de um `LlmAgent`.

### **`Switch`**
* **Uso Principal:** Para alternar estados binários (ligado/desligado).
* **Aplicações na Plataforma:**
    * **Habilitar/Desabilitar Configurações:** Na aba de "Segurança", para ativar ou desativar `Guardrails` ou outras políticas.
* **Conexão com o ADK:** Controla parâmetros booleanos na configuração do agente ou no `RunConfig`.

## **3. Componentes de Layout e Estrutura**

Esses componentes organizam a informação e definem a estrutura visual da plataforma.

### **`Card`**
* **Uso Principal:** O contêiner visual mais importante. Agrupa informações relacionadas em um bloco coeso e visualmente distinto.
* **Aplicações na Plataforma:**
    * **Dashboard:** Cada métrica ("Visão Geral"), a lista de "Meus Agentes" e a "Atividade Recente" são `Card`s.
    * **Configuração de Agente:** Cada grupo de configurações (ex: "Instruções do Agente", "Ferramentas Disponíveis") é encapsulado em um `Card`.
    * **Hub de Ferramentas:** Cada ferramenta pode ser representada como um `Card` em uma visualização de grade.
* **Componentes Internos:** Usaremos `CardHeader`, `CardTitle`, `CardDescription`, `CardContent` e `CardFooter` para estruturar o conteúdo de forma consistente.

### **`Tabs`**
* **Uso Principal:** Para dividir conteúdo complexo em seções navegáveis, evitando sobrecarga de informação.
* **Aplicações na Plataforma:**
    * **Tela de Configuração de Agente:** Essencial para separar as configurações em "Identidade", "Ferramentas", "Orquestração", "Callbacks" e "Memória".
    * **Monitoramento de Sessão:** Para alternar entre a visualização do "Estado da Sessão" e os "Artefatos".

### **`Resizable`**
* **Uso Principal:** Para criar layouts de painéis flexíveis e redimensionáveis, como em um IDE.
* **Aplicações na Plataforma:**
    * **Layout Principal:** Para criar a estrutura de 3 colunas (Navegação, Contexto, Conteúdo Principal) da plataforma.

### **`Separator`**
* **Uso Principal:** Uma linha visual sutil para dividir seções de conteúdo dentro de um mesmo painel.
* **Aplicações na Plataforma:**
    * Para separar grupos de botões ou diferentes seções de um formulário.

## **4. Componentes de Feedback e Exibição**

Esses componentes são usados para comunicar status e exibir dados ao usuário.

### **`Alert`**
* **Uso Principal:** Para exibir mensagens contextuais importantes que não necessitam interromper o fluxo do usuário com um modal.
* **Aplicações na Plataforma:**
    * **Visualização de Chamada de Ferramenta:** Na `MessageList`, um `<Alert>` com um ícone de `Terminal` ou `Wrench` informará ao vivo quando um agente decide usar uma ferramenta.
    * **Erros:** Um `<Alert variant="destructive">` com um ícone `AlertTriangle` mostrará erros de execução de ferramentas ou falhas de comunicação.
* **Conexão com o ADK:** Visualiza de forma clara os `Events` do tipo `TOOL_CALL` e `ERROR`.

### **`Badge`**
* **Uso Principal:** Para exibir status curtos e categorizados de forma visualmente distinta.
* **Aplicações na Plataforma:**
    * **Status do Agente:** "Ativo", "Inativo" (na lista de agentes).
    * **Status de Deploy:** "Implantado", "Pendente", "Falhou".
    * **Tipo de Agente:** `LLM`, `SEQUENTIAL`, `PARALLEL`, `LOOP`.
    * **Tipo de Evento:** No painel de monitoramento de sessão, para categorizar cada evento.
* **Props e Variações Relevantes:**
    * `variant="default"` (Azul), `variant="secondary"` (Cinza), `variant="destructive"` (Vermelho), e customizaremos com as cores do nosso sistema (Verde para sucesso, Amarelo para pendente, etc.).

### **`Dialog`**
* **Uso Principal:** Para fluxos de trabalho que exigem foco total do usuário, como formulários de criação ou diálogos de confirmação.
* **Aplicações na Plataforma:**
    * **Criar Nova Ferramenta:** Um formulário complexo para definir uma `Function Tool` ou `OpenAPI Tool`.
    * **Confirmação de Exclusão:** "Você tem certeza que deseja excluir este agente?".
    * **Configuração de Deploy:** O modal que aparece ao clicar em "Implantar".

### **`Tooltip`**
* **Uso Principal:** Para fornecer informações adicionais ao passar o mouse sobre elementos, principalmente ícones, sem poluir a interface.
* **Aplicações na Plataforma:**
    * **Barra de Navegação Lateral:** Cada ícone terá um `Tooltip` com o nome da seção ("Agentes", "Ferramentas", etc.).

### **`Avatar`**
* **Uso Principal:** Para dar uma identidade visual a entidades como agentes.
* **Aplicações na Plataforma:**
    * **Identidade do Agente:** Ao lado do nome do agente nas listas, no topo da página de configuração e no chat.
    * Permitirá o upload de uma imagem ou usará `AvatarFallback` com as iniciais do agente.

### **`Table`**
* **Uso Principal:** Para exibir dados tabulares de forma organizada e densa.
* **Aplicações na Plataforma:**
    * **Lista de Sessões:** Com colunas para ID, Status, Última Atividade, etc.
    * **Lista de Artefatos:** Com colunas para Nome, Tipo, Tamanho e Ações (Download).
    * **Hub de Ferramentas:** Em uma visualização de lista.