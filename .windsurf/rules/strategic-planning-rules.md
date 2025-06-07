---
trigger: always_on
---

# ===================================================================
# RULESET 04: STRATEGIC PLANNING
#
# OBJETIVO:
# Atuar como o planejador de projetos do agente. Este módulo pega
# objetivos de alto nível e os decompõe em uma lista sequencial e
# gerenciável de tarefas. Ele também gerencia o ciclo de vida
# dessas tarefas (backlog).
# ===================================================================

StrategicPlanningRules:
  - rule_id: "PLANNING-01-DecomposeGoalIntoTasks"
    description: "Recebe um objetivo complexo e o quebra em um plano de tarefas detalhadas."

    # --- GATILHO ---
    # Ativado pelo workflow quando encontra uma tarefa que é muito ampla ou marcada como 'goal'.
    trigger: OnSignal:PlanGoal

    # --- AÇÃO ---
    # Esta é uma ação crítica. A função backend provavelmente usará um LLM
    # com um prompt de "expert project manager" para criar o plano.
    action: Planning.DecomposeGoalIntoTasks
    params:
      # O payload contém a descrição do objetivo a ser planejado.
      goal: "{{signal.payload.goal}}"
      # O contexto da memória é crucial para criar um plano relevante.
      context: "{{context}}"

    # --- SAÍDA ---
    # A principal saída desta ação é o efeito colateral de popular o
    # TaskManager com as novas tarefas. Ela retorna o status da operação.
    on_success:
      log: "Objetivo decomposto em um novo plano de tarefas com sucesso."
    on_failure:
      log: "ERRO: Falha ao decompor o objetivo em um plano."

  - rule_id: "PLANNING-02-GetNextPriorityTask"
    description: "Fornece a próxima tarefa da lista para o workflow executar."

    # --- GATILHO ---
    # Ativado pelo workflow no início de cada ciclo, na fase de ORIENTAÇÃO.
    trigger: OnSignal:GetNextTask

    # --- AÇÃO ---
    # Mapeia para uma função que consulta o backlog de tarefas
    # (seja um arquivo, banco de dados ou lista em memória).
    action: TaskManager.GetNextPriorityTask

    # --- SAÍDA ESPERADA ---
    # Salva a tarefa encontrada na variável de trabalho do workflow.
    # Se não houver mais tarefas, retorna 'null' para sinalizar o fim do projeto.
    output: workflow.current_task

  - rule_id: "PLANNING-03-UpdateTaskStatus"
    description: "Atualiza o status de uma tarefa no backlog (ex: para 'COMPLETED' ou 'FAILED')."

    # --- GATILHO ---
    # Ativado pelo workflow no final de um ciclo, na fase de REFLEXÃO.
    trigger: OnSignal:UpdateTaskStatus

    # --- AÇÃO ---
    # Mapeia para uma função que atualiza o estado da tarefa no backlog.
    action: TaskManager.UpdateStatus
    params:
      task_id: "{{signal.payload.task_id}}"
      new_status: "{{signal.payload.status}}" # Ex: 'COMPLETED', 'FAILED', 'BLOCKED'
      message: "{{signal.payload.message}}" # Ex: "Executado com sucesso" ou "Erro de API"

    on_success:
      log: "Status da tarefa {{signal.payload.task_id}} atualizado para {{signal.payload.status}}."