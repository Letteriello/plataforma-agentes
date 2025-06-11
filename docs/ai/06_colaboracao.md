## **06_colaboracao.md**

### Protocolos de Colaboração e Desenvolvimento v3.0

#### 1.0 Diretiva Primária e Filosofia de Colaboração

- **Objetivo:** Nossa função primordial, seja como desenvolvedor humano ou como assistente de IA, é compreender, manter e evoluir a plataforma **ai.da** de forma coesa e inteligente. Cada contribuição deve ser uma extensão lógica da visão de um Sistema Operacional Evolutivo, fortalecendo nossos pilares de DevEx, Confiança, Interoperabilidade, ROI e Arquitetura Evolutiva.
- **Fonte da Verdade:** A documentação consolidada do projeto (`01` a `08`) e o código-fonte existente são nossa base de conhecimento compartilhada. Decisões devem ser justificadas com base nessas fontes para garantir consistência e alinhamento.
- **Rastreabilidade e Propósito:** Toda tarefa, sem exceção, deve ser iniciada a partir de uma `Issue` do GitHub. Isso garante que cada linha de código escrita tenha um propósito claro, documentado e rastreável, conectando o trabalho técnico aos objetivos do negócio.

#### 2.0 Protocolo de Assimilação e Manutenção de Contexto

Para colaborar eficazmente, é fundamental que um desenvolvedor primeiro compreenda profundamente o projeto. Este protocolo deve ser executado no início de cada sessão de trabalho para garantir que o contexto esteja sempre atualizado.

- **2.1 Análise da Base de Conhecimento Documental:**
    
    - **Processo:** Analise sistematicamente os seguintes documentos para construir seu modelo mental do projeto, respondendo a perguntas-chave:
        
        1. `01_visao_geral_app.md`: Qual dos 5 pilares estratégicos esta tarefa fortalece? Como ela contribui para a visão de um "Sistema Operacional Evolutivo"?
        2. `02_funcionalidades_app.md`: Em qual módulo (`Team Designer`, `Torre de Controle`, etc.) esta funcionalidade se encaixa? Como ela se conecta com as funcionalidades existentes?
        3. `03_publico_alvo.md`: Para qual persona primária (`Especialista de Domínio`, `Arquiteto`, etc.) estou construindo? Quais são suas dores e como minha solução as aliviará? A experiência de usuário deve ser otimizada para essa persona.
        4. `05_pilha_tecnologica.md`: A minha implementação está utilizando as tecnologias corretas da stack (FastAPI, React, Zustand, etc.) e seguindo as justificativas para suas escolhas?
        5. `07_estrutura_do_projeto.md`: Onde no código esta nova funcionalidade deve viver? Estou seguindo o padrão de modularidade por funcionalidade?
            
- **2.2 Análise da Arquitetura de Código:**
    
    - **Processo:** Antes de codificar, navegue pela estrutura de diretórios em `client/src` e no backend para entender os padrões existentes. Observe como os componentes são agrupados, como os serviços são estruturados e como o estado é gerenciado. O objetivo é escrever código que pareça ter sido escrito pela mesma pessoa, mantendo a consistência.
        

#### 3.0 Ciclo de Execução de Tarefas (Task Workflow)

Este é o processo cognitivo e prático a ser seguido para cada tarefa atribuída.

- **3.1 Análise e Decomposição da Tarefa (`Issue`):**
    
    1. Extraia o objetivo principal e os critérios de aceitação da `Issue`.
    2. **Passo Crítico (Mapeamento de Contexto):** Correlacione explicitamente a tarefa com a base de conhecimento. Faça a si mesmo as perguntas do passo 2.1.
    3. **Decomposição:** Quebre a `Issue` em subtarefas lógicas e menores. Se for uma feature complexa, considere criar um "guarda-chuva" de Issues ou um pequeno Design Doc para alinhar com a equipe.
        
- **3.2 Planejamento Detalhado da Implementação:**
    
    1. Antes de escrever qualquer código, formule um plano de ação detalhado por escrito.
    2. O plano deve listar:
        
        - **Contrato da API:** Se aplicável, qual será o endpoint, o método HTTP, o payload da requisição e o formato da resposta?
        - **Componentes de UI:** Quais componentes existentes serão reutilizados (de `components/ui`)? Quais novos componentes de feature (`components/features`) precisam ser criados?
        - **Gerenciamento de Estado:** A lógica de estado será local (`useState`) ou global (`Zustand`)? Quais novas ações e seletores são necessários no store?
        - **Estratégia de Testes:** Quais testes unitários, de integração e end-to-end são necessários para validar a implementação e prevenir regressões?
            
- **3.3 Desenvolvimento Guiado por Contexto:**
    
    1. Execute o plano de implementação, criando branches com nomes descritivos (ex: `feature/TICKET-123-add-roi-dashboard`).
    2. Ao codificar, consulte continuamente os padrões da `05_pilha_tecnologica.md`. Priorize a reutilização e a composição.
    3. Escreva código limpo, comentado (quando a lógica não for óbvia) e consistente com os padrões do projeto.
        
- **3.4 Validação e Autoavaliação Rigorosa:**
    
    1. Após a implementação, valide seu próprio trabalho de forma crítica.
    2. Execute todos os testes (`npm run test`) e o linter (`npm run lint`), garantindo que todos passem.
    3. **Checklist de Autoavaliação:**
        
        - [ ] A solução atende a **todos** os critérios de aceitação da `Issue`?
        - [ ] A experiência do usuário está perfeitamente alinhada com as necessidades da persona-alvo?
        - [ ] O código está limpo, legível e de fácil manutenção por outro desenvolvedor?
        - [ ] A solução é performática e segura? Foram considerados casos extremos?
        - [ ] A documentação necessária (comentários de código, Storybook, etc.) foi atualizada?
            
- **3.5 Submissão e Transferência de Contexto (Pull Request):**
    
    1. O Pull Request (PR) não é uma entrega de código, mas uma **transferência de contexto** para os revisores humanos. Um bom PR acelera a revisão e melhora a qualidade do código.
        
    2. Na descrição do PR, use um template padronizado:
        
        - **Link da Issue:** `Closes #[ID_DA_ISSUE]`.
        - **Contexto da Solução:** Explique brevemente _por que_ esta abordagem foi escolhida e _como_ ela se alinha com a arquitetura do projeto.
        - **Resumo das Mudanças:** Apresente os pontos principais do seu plano de implementação.
        - **Como Testar Manualmente:** Forneça passos claros para que o revisor possa validar a funcionalidade.
        - **Screenshots/Vídeos:** Para mudanças de UI, inclua sempre uma prova visual do antes e depois.