### **Documentação: Protocolos de Colaboração para Agentes de IA**

#### **1.0 Diretiva Primária**

- **Objetivo:** Sua função primordial é compreender, manter e evoluir a "Plataforma de Criação de Agentes de IA" de forma coesa e inteligente. Cada contribuição sua deve ser uma extensão lógica e consistente da visão, arquitetura e funcionalidades já estabelecidas.
- **Fonte da Verdade:** A sua base de conhecimento são os documentos do projeto (`01` a `05`) e o código-fonte existente. Suas decisões devem ser sempre justificadas com base nessas fontes.
- **Rastreabilidade:** Toda tarefa deve ser iniciada a partir de uma `Issue` do GitHub para garantir que cada ação tenha um propósito claro e documentado.

#### **2.0 Protocolo de Assimilação e Manutenção de Contexto**

Para colaborar eficazmente, é fundamental que você primeiro compreenda profundamente o projeto. Este protocolo deve ser executado no início de cada sessão de trabalho para garantir que seu contexto esteja sempre atualizado.

- **2.1 Análise da Base de Conhecimento Documental:**
    
    - **Processo:** Analise sistematicamente os seguintes documentos para construir seu modelo mental do projeto:
        1. `01_visao_geral_app.md`: Internalize a **missão** do projeto (democratizar a criação de IA), os **modos de operação** (No-Code e Low-Code) e os **módulos principais** (Construtor, Memória, Ferramentas, Chat).
        2. `02_funcionalidades_app.md`: Mapeie detalhadamente **cada funcionalidade** dentro de cada módulo. Entenda o que cada recurso faz, como o "Assistente de Criação Guiada" ou o "Construtor Visual de Orquestração".
        3. `03_publico_alvo.md` & `04_personas.md`: Compreenda para **quem** estamos construindo. Internalize as dores, objetivos e a jornada da "Sofia Oliveira" (a empreendedora) e do "David Martins" (o desenvolvedor). Toda implementação de UI/UX deve visar resolver as frustrações deles.
        4. `05_pilha_tecnologica.md`: Memorize a **stack tecnológica** e, mais importante, as **justificativas** para cada escolha. Isso guiará suas decisões de implementação.
- **2.2 Análise da Arquitetura de Código:**
    
    - **Processo:** Analise a estrutura de diretórios em `client/src` para entender os padrões de código existentes.
        - `components/ui/`: Identifique os componentes base do `shadcn/ui` que devem ser priorizados.
        - `components/agents/`, `components/chat/`, etc.: Observe como os componentes são agrupados por funcionalidade.
        - `pages/`: Entenda como as páginas são estruturadas e quais componentes elas utilizam.
        - `store/`: Analise como o estado global é gerenciado com **Zustand** e como os stores são separados por domínio (`agentStore`, `authStore`).
        - `types/`: Verifique as definições de tipos do **TypeScript** para garantir a consistência dos dados.

#### **3.0 Ciclo de Execução de Tarefas (Task Workflow)**

Este é o processo cognitivo que você deve seguir para cada tarefa atribuída.

- **3.1 Análise da Tarefa (`Issue`):**
    
    1. Extraia o objetivo principal e os critérios de aceitação da `Issue`.
    2. **Passo Crítico:** Correlacione a tarefa com a sua base de conhecimento. Pergunte a si mesmo: "Qual funcionalidade (`02_funcionalidades_app.md`) esta tarefa implementa?", "Qual persona (`04_personas.md`) será mais impactada?", "Como a implementação se encaixa na arquitetura de código existente?".
- **3.2 Planejamento da Implementação:**
    
    1. Antes de escrever qualquer código, formule um plano de ação detalhado.
    2. O plano deve listar:
        - Quais arquivos serão criados ou modificados.
        - Quais componentes existentes serão reutilizados.
        - Quais novos componentes (se houver) precisam ser criados e se eles devem ser genéricos (em `components/ui`) ou específicos de uma feature.
        - Como o estado (local ou global com Zustand) será gerenciado.
        - Quais novos testes serão necessários para validar a implementação.
- **3.3 Desenvolvimento Guiado por Contexto:**
    
    1. Execute o plano de implementação.
    2. Ao codificar, consulte continuamente os padrões da `05_pilha_tecnologica.md`. Utilize **React**, **TypeScript**, **Tailwind CSS** e os componentes **shadcn/ui** como base.
    3. Garanta que sua implementação seja consistente com a arquitetura e os padrões de código existentes que você analisou na etapa 2.2.
- **3.4 Validação e Autoavaliação:**
    
    1. Após a implementação, valide seu próprio trabalho.
    2. Execute os testes (`npm run test`) e o linter (`npm run lint`).
    3. **Passo Crítico:** Realize uma autoavaliação. Pergunte: "A solução implementada atende completamente aos critérios de aceitação da `Issue`?", "A experiência do usuário está alinhada com as necessidades da Sofia ou do David?", "O código está limpo, legível e de fácil manutenção?".
- **3.5 Submissão e Transferência de Contexto (Pull Request):**
    
    1. O Pull Request (PR) não é apenas uma entrega de código, mas uma **transferência de contexto** para os revisores humanos.
    2. Na descrição do PR, inclua:
        - **Link da Issue:** `Closes #[ID_DA_ISSUE]`.
        - **Contexto da Solução:** Explique brevemente _como_ sua solução se alinha com a arquitetura do projeto e atende aos objetivos da `Issue`.
        - **Resumo do Plano de Implementação:** Apresente os pontos principais do seu plano da etapa 3.2.
        - **Testes Realizados:** Descreva os testes manuais e automatizados que foram executados e adicionados.