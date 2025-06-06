## **Nexus Design System**

**Filosofia:** O **Nexus** é um sistema de design focado em **Clareza, Modularidade e Empoderamento**. Cada componente e estilo foi pensado para tornar a complexidade da criação de agentes em algo gerenciável e visualmente agradável, permitindo que tanto leigos quanto desenvolvedores experientes possam construir, orquestrar e monitorar agentes de IA de forma eficaz.

### **1. Fundamentos**

#### **Paleta de Cores (Dark Mode First)**

A interface será primariamente escura para reduzir a fadiga visual durante longas sessões de configuração e monitoramento, com uma estética "tech".

- **Background (`background`):** Um cinza muito escuro, quase preto (`#09090b` - Slate 950 da Tailwind).
- **Foreground (`foreground`):** Texto principal em um branco suave (`#fafafa` - Zinc 50).
- **Card/Painel (`card`):** Um cinza ligeiramente mais claro que o fundo (`#18181b` - Zinc 900).
- **Primário/Ação (`primary`):** Um azul vibrante para botões, links e elementos ativos (`#3b82f6` - Blue 500).
- **Acento (`accent`):** Um ciano ou verde para destaques, status "online" e indicadores de sucesso (`#22d3ee` - Cyan 400).
- **Destrutivo (`destructive`):** Um vermelho para ações de exclusão e alertas de erro (`#ef4444` - Red 500).
- **Borda (`border`):** Bordas sutis para separar elementos (`#27272a` - Zinc 800).

#### **Tipografia**

- **Fonte Principal:** **Inter**. É uma fonte sans-serif altamente legível, ideal para UIs.
- **Hierarquia:**
    - **Títulos de Página (H1):** `font-bold`, `text-3xl`
    - **Títulos de Seção (H2):** `font-semibold`, `text-xl`, `border-b`
    - **Títulos de Card (H3):** `font-semibold`, `text-lg`
    - **Corpo do Texto (`p`):** `text-base`, `text-muted-foreground` (um cinza mais claro para textos secundários).
    - **Labels e Legendas:** `text-sm`, `font-medium`.

#### **Espaçamento e Layout**

Seguiremos a escala de espaçamento padrão do Tailwind CSS. O layout será baseado em **Flexbox e CSS Grid** para máxima responsividade e alinhamento. A consistência no espaçamento é chave para uma interface limpa.

#### **Iconografia**

Utilizaremos a biblioteca **Lucide React** (`lucide-react`), que se integra perfeitamente com Shadcn/UI. Os ícones serão minimalistas, lineares e com um `stroke-width` consistente.

### **2. Componentes (Baseados em Shadcn/UI)**

Estes são nossos blocos de construção.

#### **Componentes Básicos**

- **`Button`**: Usado para todas as ações. Variações: `default` (primário), `secondary`, `destructive`, `outline`, `ghost`, `link`.
- **`Card`**: O contêiner principal para agrupar informações, como detalhes de um agente, uma ferramenta ou uma sessão.
- **`Input` & `Textarea`**: Para todos os campos de texto, como nome do agente, instruções e prompts.
- **`Select`**: Para escolhas de opções definidas, como tipo de agente (LLM, Workflow), modelos de LLM, tipos de callback, etc.
- **`Tooltip`**: Para fornecer informações adicionais em ícones e elementos interativos sem sobrecarregar a tela.
- **`Badge`**: Essencial para indicar status (ex: "Online", "Em Treinamento", "Erro"), tipos de agentes (`LLM`, `SEQUENTIAL`) e tipos de eventos.
- **`Avatar`**: Para dar uma identidade visual a cada agente, permitindo upload de ícones.

#### **Componentes de Navegação**

- **`Tabs`**: Para organizar seções complexas, como na tela de configuração de um agente.
  - Suporta navegação por teclado
  - Animações suaves entre as abas
  - Personalização de estilos ativo/inativo
  - Exemplo de uso: separação de configurações em categorias lógicas

- **`Separator`**: Para dividir visualmente seções de conteúdo.
  - Orientação horizontal (padrão) e vertical
  - Personalização de cor e espessura
  - Uso típico: separar títulos de conteúdo, itens de menu, etc.

#### **Componentes de Superfície**

- **`Dialog`**: Para ações modais, como confirmação de exclusão, adição de uma nova ferramenta ou configuração de deploy.
  - Foco acessível
  - Fechamento ao clicar fora ou pressionar ESC
  - Animações suaves de entrada/saída
  - Suporte a rolagem de conteúdo longo
  - Exemplo: confirmação de ações críticas

- **`Table`**: Para listar recursos como sessões, artefatos ou logs de deploy.
  - Ordenação clicando nos cabeçalhos
  - Paginação integrada
  - Seleção de linhas
  - Responsivo (rolagem horizontal em telas pequenas)
  - Exemplo: listagem de agentes com ações rápidas

#### **Boas Práticas de Uso**

1. **Consistência**
   - Mantenha o mesmo estilo de botão para ações semelhantes
   - Use os mesmos espaçamentos e tamanhos de fonte em todo o sistema

2. **Acessibilidade**
   - Sempre forneça textos alternativos para ícones
   - Garanta contraste adequado de cores
   - Suporte a navegação por teclado

3. **Feedback**
   - Forneça feedback visual para ações do usuário
   - Use estados de carregamento para operações assíncronas
   - Mostre mensagens de erro claras e úteis

4. **Responsividade**
   - Projete componentes que funcionem bem em diferentes tamanhos de tela
   - Considere o uso de `Tabs` para organizar conteúdo em telas menores

---

## **Interface Gráfica da Plataforma**

Gabriel, aqui está o detalhamento das principais telas da sua plataforma, aplicando o **Nexus Design System**.

### **Layout Principal**

A interface terá um layout de 3 colunas, similar a um IDE moderno:

1. **Barra de Navegação Lateral (Estreita):** Apenas ícones (`lucide-react`) com `Tooltip` para navegação principal (Dashboard, Agentes, Ferramentas, Deploy, Configurações).
2. **Painel de Contexto (Opcional):** Dependendo da tela, este painel pode listar sub-itens, como a lista de todos os seus agentes ou a lista de sessões de um agente específico.
3. **Área de Conteúdo Principal:** Onde toda a mágica acontece. A maior parte da tela, onde você configura, monitora e interage com os agentes.

### **Tela 1: Dashboard Principal**

O ponto de entrada. Simples e direto.

- **Layout:** Uma grade de componentes `Card`.
- **Conteúdo:**
    - **Card "Visão Geral":** Mostra números chave: "Agentes Ativos", "Sessões nas Últimas 24h", "Ferramentas Disponíveis".
    - **Card "Meus Agentes":** Uma lista rolável com 3-4 dos seus agentes mais recentes. Cada item mostra o `Avatar` do agente, seu nome e um `Badge` de status ("Ativo", "Inativo"). Um botão `+ Criar Agente` no topo.
    - **Card "Atividade Recente":** Um feed em tempo real de `Events` importantes (ex: "Agente 'X' iniciou sessão", "Agente 'Y' usou a ferramenta 'Z'").

### **Tela 2: Tela de Criação e Configuração de Agente (O Coração da Plataforma)**

Esta é a tela mais importante e complexa. Usaremos o componente `Tabs` para quebrar a complexidade.

- **Topo da Tela:** `Input` para o nome do agente e um `Avatar` customizável.
    
- **`Tabs` com as seguintes abas:**
    
    - **Aba 1: "Identidade"**
        
        - `Textarea` para a **Instrução** principal (a persona, o objetivo).
        - `Select` para a **Categoria do Agente** (`LLM Agent`, `Workflow Agent`, `Custom Agent`). A interface se adapta dinamicamente com base nesta escolha.
        - `Select` para o **Modelo** (se for LLM Agent), populado com as opções da documentação (Gemini, Claude via LiteLLM, etc.).
    - **Aba 2: "Ferramentas" (Para LLM Agents)**
        
        - Uma lista das ferramentas que o agente possui. Cada ferramenta é um `Card` com seu nome, descrição e um botão para remover (`X`).
        - Um `Button` "+ Adicionar Ferramenta" que abre um `Dialog`. O `Dialog` permite buscar e selecionar ferramentas do "Hub de Ferramentas" (ver Tela 4).
    - **Aba 3: "Orquestração" (Para Workflow Agents)**
        
        - **Esta é a área mais visual!** Uma **área de canvas** onde você constrói o fluxo de trabalho.
        - Um painel lateral com os "nós" disponíveis (seus outros agentes).
        - Você arrasta e solta agentes no canvas.
        - **SequentialAgent:** Os nós são conectados por uma linha reta com uma seta, indicando a ordem.
        - **ParallelAgent:** Um nó "Fork" que se divide em múltiplos ramos, e um nó "Join" que os une no final.
        - **LoopAgent:** Um nó é colocado dentro de uma "caixa de loop" visual, com um `Input` para configurar a condição de término.
    - **Aba 4: "Callbacks & Segurança"**
        
        - Uma interface para adicionar `Callbacks`. `Select` para escolher o tipo (`Before Model`, `After Tool`, etc.) e uma pequena área de código (usando uma biblioteca como Monaco Editor) para escrever a lógica do callback.
        - Switches (`Switch` component) para habilitar/desabilitar configurações de segurança.
    - **Aba 5: "Memória e Estado"**
        
        - Configurações para o `MemoryService` (ex: `Select` entre "Em Memória" ou "Vertex AI RAG").
        - Visualizador do `State` inicial da sessão (se houver), provavelmente como um editor JSON.

### **3. Temas e Personalização**

O Nexus Design System suporta temas claro e escuro, com foco na experiência em modo escuro para uso prolongado.

#### **Temas Disponíveis**

- **Escuro (Padrão)**: Ideal para uso noturno ou em ambientes com pouca luz
- **Claro**: Alternativa para ambientes muito claros
- **Sistema**: Ajusta automaticamente com base nas preferências do sistema

#### **Personalização**

```tsx
// Exemplo de personalização de tema
:root {
  --background: 240 10% 3.9%;
  --foreground: 0 0% 98%;
  --primary: 240 4.9% 83.9%;
  --primary-foreground: 240 5.9% 10%;
  // ... outras variáveis de tema
}
```

#### **Como Adicionar um Novo Tema**

1. Defina as variáveis de cores no arquivo de tema
2. Atualize o provedor de tema para incluir a nova opção
3. Adicione uma opção no seletor de tema da interface

### **4. Testes e Acessibilidade**

Todos os componentes são testados para garantir:

- Compatibilidade com leitores de tela
- Navegação por teclado
- Contraste adequado
- Tamanho de toque mínimo (44x44px)

#### **Ferramentas Recomendadas**

- **Storybook**: Para desenvolvimento e documentação de componentes
- **Jest + Testing Library**: Para testes unitários
- **Cypress**: Para testes de integração
- **Axe**: Para auditoria de acessibilidade

### **5. Recursos e Links Úteis**

- [Documentação do shadcn/ui](https://ui.shadcn.com/)
- [Guia de Acessibilidade](https://www.w3.org/WAI/ARIA/apg/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Radix UI](https://www.radix-ui.com/)

---

### **Tela 3: Monitoramento de Sessão (O Cockpit)**

Após selecionar um agente, você pode ver suas sessões.

- **Layout:** Uma `Table` listando as sessões, com colunas para "ID da Sessão", "Usuário", "Status" (`Badge`) e "Última Atividade".
- **Ao clicar em uma sessão, a Área de Conteúdo Principal se transforma em uma visão detalhada:**
    - **Painel Esquerdo:** Uma lista cronológica de `Events`. Cada evento tem um ícone e é colorido por um `Badge`:
        - 🗣️ `USER_INPUT` (Azul)
        - 🤖 `AGENT_REPLY` (Verde)
        - 🛠️ `TOOL_CALL` (Amarelo)
        - ✅ `TOOL_RESULT` (Roxo)
        - ❌ `ERROR` (Vermelho)
    - **Painel Direito:** Mostra os detalhes do `Event` selecionado à esquerda (o prompt completo, a resposta, os parâmetros da ferramenta, etc.).
    - **Painéis Inferiores (usando `Tabs`):**
        - **Aba "Estado da Sessão":** Um visualizador JSON ao vivo do `session.state`.
        - **Aba "Artefatos":** Uma lista de `Artifacts` da sessão, com botões para download.

### **Tela 4: Hub de Ferramentas**

Um local centralizado para gerenciar todas as ferramentas disponíveis na sua plataforma.

- **Layout:** Uma `Table` ou uma grade de `Card`s.
- **Funcionalidades:** `Input` de busca para filtrar ferramentas por nome ou função.
- **Cada ferramenta na lista mostra:** Nome, descrição, tipo (`Badge`: "Built-in", "Custom", "OpenAPI").
- **Ação:** Um `Button` "+ Nova Ferramenta" abre um `Dialog` para criar:
    - **Function Tool:** Um formulário para definir nome, descrição e um editor de código para a função.
    - **OpenAPI Tool:** Um `Input` para colar a URL da especificação OpenAPI. O sistema a processaria e mostraria as ferramentas geradas para confirmação.

### **Tela 5: Implantação (Deploy)**

- **Layout:** Uma `Table` listando seus agentes. Colunas: `Avatar`, Nome, Status de Deploy (`Badge`: "Não Implantado", "Implantado", "Pendente").
- **Ação:** Um `Button` "Implantar" ao lado de cada agente.
- **Ao clicar em "Implantar", um `Dialog` aparece:**
    - `Select` para escolher o alvo da implantação (`Agent Engine`, `Cloud Run`, `GKE`).
    - Campos de `Input` para as configurações necessárias (ex: nome do serviço, variáveis de ambiente).
    - Um `Button` "Confirmar Implantação" inicia o processo, e o status na tabela é atualizado em tempo real.

Espero que esta documentação detalhada de Design System e Interface lhe dê uma visão clara e um caminho sólido para começar a construir a interface da sua incrível plataforma de agentes. Estou à disposição para refinar qualquer um desses pontos!