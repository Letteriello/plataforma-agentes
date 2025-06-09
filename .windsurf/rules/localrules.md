---
trigger: always_on
---

{
  "name": "protocolo_agente_plataforma_ia",
  "version": "1.1.0",
  "description": "Regra mestra que governa o comportamento dos agentes de IA no desenvolvimento da Plataforma de Criação de Agentes. Garante a assimilação completa do contexto e a execução padronizada de tarefas.",
  "recipes": {
    "onboarding_e_sincronizacao_de_contexto": {
      "name": "Protocolo de Assimilação e Manutenção de Contexto",
      "description": "Etapa obrigatória inicial para carregar e internalizar todo o conhecimento do projeto. Deve ser executado sempre que o agente iniciar uma nova sessão de trabalho para garantir que seu contexto está atualizado.",
      "steps": [
        {
          "step": 1,
          "action": "read_and_summarize",
          "target": "docs/docs/ai/01_visao_geral_app.md",
          "instruction": "Internalize a **Missão do Projeto**: democratizar a criação de IA. Entenda os **Módulos Principais** (Construtor, Memória, Ferramentas, Chat) e os **Modos de Operação** (No-Code e Low-Code)."
        },
        {
          "step": 2,
          "action": "read_and_map",
          "target": "docs/docs/ai/02_funcionalidades_app.md",
          "instruction": "Mapeie em detalhes cada **funcionalidade** dentro de cada módulo. Crie um mapa mental da relação entre recursos como 'Assistente de Criação Guiada' e 'Construtor Visual de Orquestração'."
        },
        {
          "step": 3,
          "action": "read_and_internalize_personas",
          "target": ["docs/docs/ai/03_publico_alvo.md", "docs/docs/ai/04_personas.md"],
          "instruction": "Compreenda para **quem** estamos construindo. Internalize as dores, objetivos e a jornada da **Sofia Oliveira (No-Code)** e do **David Martins (Low-Code)**. Toda decisão de UI/UX deve visar resolver as frustrações deles."
        },
        {
          "step": 4,
          "action": "read_and_understand_architecture",
          "target": ["docs/docs/ai/05_pilha_tecnologica.md", "docs/docs/ai/07_estrutura_do_projeto.md"],
          "instruction": "Memorize a **Stack Tecnológica** e as **justificativas** de cada escolha. Analise a **Estrutura de Diretórios** e a filosofia de 'Separação de Responsabilidades' e 'Modularidade por Funcionalidade'."
        },
        {
          "step": 5,
          "action": "read_and_assimilate_strategies",
          "target": "docs/docs/ai/08_detalhes_adicionais.md",
          "instruction": "Absorva as estratégias transversais: o padrão da **API RESTful**, a gestão de estado com **Zustand vs. Hooks**, o modelo de segurança com **JWT** e o 'Cofre', e a futura **internacionalização (i18n)**."
        },
        {
          "step": 6,
          "action": "read_and_commit_to_protocol",
          "target": "docs/docs/ai/06_colaboracao.md",
          "instruction": "Estude seu próprio **Protocolo de Colaboração**. Este documento é sua diretiva primária. Confirme que você compreendeu o 'Ciclo de Execução de Tarefas' que deverá seguir."
        }
      ]
    },
    "ciclo_de_execucao_de_tarefa": {
      "name": "Ciclo de Execução de Tarefa (Task Workflow)",
      "description": "Processo cognitivo a ser seguido para cada tarefa (Issue) atribuída, garantindo alinhamento com a visão e arquitetura do projeto.",
      "steps": [
        {
          "step": 1,
          "action": "analyze_task_requirements",
          "input": "ID da Issue do GitHub",
          "instruction": "Extraia o objetivo principal e os critérios de aceitação da Issue. Em seguida, correlacione a tarefa com o seu conhecimento base: Qual funcionalidade (`02_funcionalidades_app.md`) ela implementa? Qual persona (`04_personas.md`) será mais impactada?"
        },
        {
          "step": 2,
          "action": "generate_implementation_plan",
          "output": "Plano de Ação Detalhado (texto)",
          "instruction": "Antes de codificar, formule um plano de ação. Liste: 1. Arquivos a serem criados/modificados. 2. Componentes a reutilizar. 3. Novos componentes a criar. 4. Estratégia de gerenciamento de estado. 5. Testes necessários."
        },
        {
          "step": 3,
          "action": "execute_development",
          "instruction": "Execute o plano de implementação. Codifique de forma consistente com a stack (`05_pilha_tecnologica.md`) e a estrutura do projeto (`07_estrutura_do_projeto.md`). Reutilize componentes `shadcn/ui` sempre que possível."
        },
        {
          "step": 4,
          "action": "validate_and_self_assess",
          "instruction": "Execute os testes (`npm run test`) e o linter (`npm run lint`). Faça uma autoavaliação crítica: A solução atende 100% à Issue? A UX está alinhada com a Sofia ou o David? O código está limpo, legível e manutenível?"
        },
        {
          "step": 5,
          "action": "generate_pull_request",
          "output": "Descrição do Pull Request (Markdown)",
          "instruction": "Crie o Pull Request. A descrição DEVE conter: 1. Link da Issue (`Closes #ID`). 2. Contexto da Solução. 3. Resumo do seu plano de implementação. 4. Descrição dos testes realizados."
        }
      ]
    }
  }
}