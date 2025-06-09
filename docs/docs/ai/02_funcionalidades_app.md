## **Documentação de Funcionalidades da Plataforma de Agentes**

### **1.0 Módulo: Construtor de Agentes**

Este é o módulo central da plataforma, onde os usuários criam, configuram e orquestram os agentes. Ele operará em dois modos distintos para atender a diferentes níveis de habilidade.

#### **1.1 Modo Assistido (No-Code)**

Destinado a usuários iniciantes, focando na simplicidade e em resultados rápidos.

- **1.1.1 Assistente de Criação Guiada:** Um agente de IA da própria plataforma guiará o usuário passo a passo através de uma interface de chat ou um formulário dinâmico.
- **1.1.2 Templates de Agentes:** O usuário poderá escolher a partir de uma lista de templates pré-definidos (ex: "Agente de Atendimento ao Cliente", "Agente de Pesquisa Web", "Agente Gerador de Conteúdo").
- **1.1.3 Configuração Simplificada:** O assistente fará perguntas em linguagem natural para configurar o agente (ex: "Qual é o principal objetivo deste agente?", "Que tipo de personalidade ele deve ter?"), traduzindo as respostas para as configurações técnicas necessárias.
- **1.1.4 Sugestão de Ferramentas e Memória:** Com base no objetivo descrito, o assistente sugerirá a ativação de ferramentas pré-configuradas e a conexão com bases de conhecimento relevantes.

#### **1.2 Modo Avançado (Low-Code)**

Oferece controle granular para usuários experientes e desenvolvedores.

- **1.2.1 Dashboard de Agentes:** Uma área para visualizar, gerenciar, duplicar e excluir todos os agentes criados.
- **1.2.2 Configuração de Identidade e Modelo:**
    - Formulários para definir nome, descrição e instruções do agente (prompt principal).
    - Seleção do modelo de linguagem (LLM) a ser utilizado (ex: Gemini, Claude, etc.), com acesso a parâmetros de geração (temperatura, top-k, etc.).
- **1.2.3 Construtor Visual de Orquestração:**
    - Uma interface de canvas para arrastar e soltar (drag-and-drop) para construir fluxos de trabalho.
    - Suporte para criar `Sequential Agents` (agentes em sequência), `Parallel Agents` (agentes em paralelo) e `Loop Agents` (agentes em loop) conectando visualmente diferentes sub-agentes.
- **1.2.4 Conexão com Módulos:** Interface clara para conectar um agente a recursos dos módulos de **Memória** e **Ferramentas**.

### **2.0 Módulo: Memória**

Este módulo centraliza todos os recursos de conhecimento que potencializam a capacidade dos agentes, como RAG (Retrieval-Augmented Generation) e Fine-Tuning.

#### **2.1 Gerenciador de Fontes de Conhecimento (RAG)**

- **2.1.1 Upload de Documentos:** Interface para upload de arquivos (PDF, .txt, .md, CSV) para servirem como base de conhecimento.
- **2.1.2 Conexão com Fontes Web:** Funcionalidade para adicionar URLs de sites para que o conteúdo seja extraído e indexado.
- **2.1.3 Gerenciamento de Fontes:** Visualização de todas as fontes de dados adicionadas, com status de indexação (Pendente, Indexado, Erro) e opção de remover ou reindexar.
- **2.1.4 Conexão com Agentes:** No Construtor de Agentes, o usuário poderá selecionar quais fontes de conhecimento um agente específico deve consultar.

#### **2.2 Gerenciamento de Fine-Tuning (Afinamento Fino)**

- **2.2.1 Upload de Datasets:** Interface para upload de conjuntos de dados de treinamento em formatos específicos (ex: JSONL) para o afinamento fino de modelos.
- **2.2.2 Gerenciamento de Jobs:** Painel para iniciar novos jobs de fine-tuning, monitorar o status dos jobs em andamento (Rodando, Concluído, Falhou) e visualizar logs.
- **2.2.3 Seleção de Modelo Afinado:** Uma vez concluído, o modelo afinado ficará disponível para seleção no campo "Modelo LLM" dentro do **Construtor de Agentes**.

### **3.0 Módulo: Ferramentas**

Hub central para gerenciar as capacidades de ação dos agentes.

#### **3.1 Hub de Ferramentas**

- **3.1.1 Visualização e Busca:** Um painel com todas as ferramentas disponíveis (pré-configuradas e customizadas), com campos de busca e filtros.
- **3.1.2 Ativação/Desativação:** Controle para habilitar ou desabilitar ferramentas globalmente na plataforma.

#### **3.2 Ferramentas Pré-Configuradas**

- **3.2.1 Ferramentas Nativas:** A plataforma virá com um conjunto de ferramentas prontas para uso, como "Busca na Web", "Calculadora" e possíveis integrações com APIs populares (ex: Clima, Notícias).

#### **3.3 Criação de Ferramentas Customizadas (Low-Code)**

- **3.3.1 Criador Baseado em API:** Um formulário guiado onde o usuário poderá configurar uma nova ferramenta que interage com uma API REST.
    - **Campos:** Nome da Ferramenta, Descrição para o LLM, URL do Endpoint, Método HTTP (GET, POST, etc.), Definição de Parâmetros e Esquema de Autenticação (Chave de API, Bearer Token).

#### **3.4 Integração com MCP (Model Context Protocol) Tools**

- **3.4.1 Adição de Servidor MCP:** Funcionalidade para adicionar a URL de um servidor MCP externo.
- **3.4.2 Descoberta Dinâmica:** Após a adição, a plataforma descobrirá e listará automaticamente as ferramentas expostas por aquele servidor no Hub de Ferramentas.

### **4.0 Módulo: Chat (Playground de Interação)**

Ambiente para interagir, testar e validar os agentes criados.

- **4.1 Seleção de Agente:** Um menu dropdown permitirá ao usuário escolher com qual dos seus agentes criados ele deseja interagir.
- **4.2 Interface de Chat:** Interface de conversação padrão com histórico de mensagens e campo de entrada de texto.
- **4.3 Painel de "Raciocínio" (Logs de Execução):** Uma área adjacente ao chat que mostrará em tempo real as etapas de execução do agente (ex: "Pensando...", "Decidi usar a ferramenta X", "Resultado da ferramenta Y", "Formulando resposta final").
- **4.4 Gerenciamento de Sessão de Chat:** Botões para iniciar uma nova conversa (limpando o histórico) e visualizar sessões anteriores com aquele agente.

### **5.0 Funcionalidades Gerais da Plataforma**

Recursos que permeiam toda a experiência do usuário.

- **5.1 Extensibilidade e Comunidade:**
    - **Importar/Exportar Agentes:** Funcionalidade para exportar a configuração de um agente como um arquivo JSON e importá-lo em outra conta ou compartilhar com a comunidade.
    - **Hub da Comunidade (Futuro):** Uma área onde usuários poderão submeter e navegar por templates de agentes e ferramentas criadas pela comunidade.
- **5.2 Gestão de Conta e Segurança:**
    - Autenticação de usuários para acesso à plataforma.
    - Uma área de "Cofre" para que os usuários possam armazenar de forma segura as chaves de API necessárias para suas ferramentas customizadas.