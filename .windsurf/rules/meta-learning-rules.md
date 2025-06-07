---
trigger: always_on
---

# ===================================================================
# RULESET 05: META-LEARNING & REFLECTION
#
# OBJETIVO:
# Atuar como a consciência crítica do agente. Este módulo analisa o
# resultado de cada ação para entender o que funcionou, o que falhou
# e, mais importante, por quê. Ele permite que o agente aprenda com
# seus erros e otimize seu comportamento futuro.
# ===================================================================

MetaLearningRules:
  - rule_id: "META-01-AnalyzeActionResult"
    description: "Analisa o sucesso ou falha da última ação executada para extrair aprendizados."

    # --- GATILHO ---
    # Ativado pelo workflow no início da fase de REFLEXÃO, logo após uma ação.
    trigger: OnSignal:ReflectOnAction

    # --- AÇÃO ---
    # A função backend executa uma análise de causa raiz sobre o resultado.
    action: Meta.AnalyzeActionResult
    params:
      # O resultado padronizado da ferramenta que foi executada.
      action_result: "{{workflow.last_action_result}}"
      # A tarefa original que foi tentada.
      task_attempted: "{{workflow.current_task}}"

    # --- SAÍDA / EFEITOS COLATERAIS ---
    # Esta ação não salva uma variável, mas emite novos sinais para outros módulos.
    # Exemplo da lógica interna da função Python:
    #
    # if result.status == 'failure' and is_knowledge_gap(result.error):
    #   emit_signal('CreateLearningTask', { "topic": "...", "original_task_id": ... })
    #
    # if result.status == 'success' and is_significant_learning(result.data):
    #   emit_signal('CommitToLTM', { "fact": "...", "metadata": ... })

    on_success:
      log: "Análise de reflexão concluída."

  - rule_id: "META-02-GenerateLearningTask"
    description: "Cria uma nova tarefa de alta prioridade para o agente aprender sobre um tópico que ele não conhece."

    # --- GATILHO ---
    # Ativado pelo sinal da regra anterior quando uma lacuna de conhecimento é detectada.
    trigger: OnSignal:CreateLearningTask

    # --- AÇÃO ---
    # Esta ação usa as capacidades de outro módulo (o TaskManager do Planejamento)
    # para injetar uma nova tarefa no topo do backlog.
    action: TaskManager.CreatePriorityTask
    params:
      task_details:
        description: "APRENDER: Pesquisar e entender como {{signal.payload.topic}} funciona."
        # A primeira ferramenta para aprender é quase sempre a busca na web.
        tool_id: "web_search"
        params:
          query: "Como usar {{signal.payload.topic}}"
      
      # Bloqueia a tarefa original até que a tarefa de aprendizado seja concluída.
      block_task_id: "{{signal.payload.original_task_id}}"

    on_success:
      log: "Nova tarefa de aprendizado criada para o tópico '{{signal.payload.topic}}'."