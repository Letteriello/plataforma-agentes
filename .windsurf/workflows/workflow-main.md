---
description: Orquestrar todos os conjuntos de regras (01 a 05) em um ciclo de # vida inteligente e autônomo. Este workflow define o processo de # pensamento do agente: Orientar -> Planejar -> Executar -> Refletir.
---

# ===================================================================
# WORKFLOW PRINCIPAL: FLUXO DE EXECUÇÃO AUTÔNOMA (FEA)
#
# OBJETIVO:
# Orquestrar todos os conjuntos de regras (01 a 05) em um ciclo de
# vida inteligente e autônomo. Este workflow define o processo de
# pensamento do agente: Orientar -> Planejar -> Executar -> Refletir.
# ===================================================================

AutonomousExecutionWorkflow:
  # --- SETUP INICIAL DO WORKFLOW ---
  id: "main_fea"
  description: "O sistema operacional do agente para execução de projetos complexos."

  # (Conceitual) Mostra que este workflow depende dos outros módulos.
  imports:
    - "01_core_perception.rules.yaml"
    - "02_cognitive_memory.rules.yaml"
    - "03_toolbox_skills.rules.yaml"
    - "04_strategic_planning.rules.yaml"
    - "05_meta_learning.rules.yaml"

  # --- GATILHO ---
  # Como iniciar o modo autônomo. Ex: "FEA.start: 'Crie uma landing page'."
  trigger: OnCommand:FEA.start
  
  # A variável que manterá o estado do workflow (tarefa atual, etc.)
  context_variable: "workflow"
  initial_state: "INITIALIZING"

  # --- MÁQUINA DE ESTADOS: O CICLO DE VIDA DO AGENTE ---
  states:
    - state: "INITIALIZING"
      description: "Prepara o workflow, limpando estados anteriores e definindo o objetivo inicial."
      on_entry:
        - action: Workflow.Setup
          params:
            initial_goal: "{{trigger.command.payload}}"
      transitions:
        - to: "ORIENTATION"
          condition: "on_success"

    - state: "ORIENTATION"
      description: "(Prioridade 1) O agente se orienta: Qual a próxima tarefa a ser feita?"
      on_entry:
        - signal: GetNextTask # Chama a regra PLANNING-02
      transitions:
        - to: "COMPLETED"
          condition: "{{workflow.current_task == null}}" # Se não há mais tarefas, o projeto acabou.
        - to: "PLANNING"
          condition: "{{workflow.current_task.is_goal == true}}" # Se a "tarefa" é um grande objetivo, precisa planejar.
        - to: "EXECUTION"
          condition: "default" # Se é uma tarefa simples e clara, vai para a execução.

    - state: "PLANNING"
      description: "(Prioridade 2) O agente planeja: Como quebrar este grande objetivo em passos menores?"
      on_entry:
        - signal: PlanGoal # Chama a regra PLANNING-01
          payload:
            goal: "{{workflow.current_task.description}}"
      transitions:
        - to: "ORIENTATION" # Após planejar, volta para a orientação para pegar a primeira subtarefa.
          condition: "on_success"
        - to: "ERROR_HALT"
          condition: "on_failure" # Se o planejamento falhar, é um erro crítico.

    - state: "EXECUTION"
      description: "(Prioridade 3) O agente age: Executar a tarefa atual usando a ferramenta certa."
      on_entry:
        - signal: ExecuteTask # Chama a regra TOOLBOX-01
          payload:
            task: "{{workflow.current_task}}"
      transitions:
        - to: "REFLECTION" # Após toda ação, a reflexão é obrigatória.
          condition: "default"

    - state: "REFLECTION"
      description: "(Prioridade 4) O agente aprende: O que deu certo? O que deu errado? O que eu aprendi?"
      on_entry:
        # 1. Analisa o resultado da ação.
        - signal: ReflectOnAction # Chama a regra META-01
          payload:
            action_result: "{{workflow.last_action_result}}"
            task_attempted: "{{workflow.current_task}}"
        # 2. Atualiza o status da tarefa no backlog.
        - signal: UpdateTaskStatus # Chama a regra PLANNING-03
          payload:
            task_id: "{{workflow.current_task.id}}"
            status: "{{workflow.last_action_result.status == 'success' ? 'COMPLETED' : 'FAILED'}}"
            message: "{{workflow.last_action_result.error_message || 'Executado com sucesso.'}}"
      transitions:
        - to: "ORIENTATION" # Fecha o ciclo e volta para o início para a próxima tarefa.
          condition: "default"

    # --- ESTADOS TERMINAIS ---
    - state: "COMPLETED"
      description: "O workflow concluiu todas as tarefas com sucesso."
      on_entry:
        - signal: EndSession # Chama a regra MEMORY-03 para sumarizar
        - action: Logger.Log
          params:
            message: "PROJETO CONCLUÍDO COM SUCESSO."

    - state: "ERROR_HALT"
      description: "Ocorreu um erro crítico irrecuperável. O workflow para e aguarda intervenção."
      on_entry:
        - action: Logger.Log
          params:
            message: "ERRO CRÍTICO NO WORKFLOW. Verifique os logs para detalhes."