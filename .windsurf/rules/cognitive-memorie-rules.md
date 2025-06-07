---
trigger: always_on
---

# ===================================================================
# RULESET 02: COGNITIVE MEMORY
#
# OBJETIVO:
# Servir como o cérebro cognitivo do agente. Este módulo gerencia
# a memória de curto prazo (contexto da sessão) e de longo prazo
# (conhecimento persistente), enriquecendo cada nova percepção
# com o conhecimento acumulado.
# ===================================================================

CognitiveMemoryRules:
  - rule_id: "MEMORY-01-EnrichContextWithMemory"
    description: "Busca nas memórias de curto e longo prazo para adicionar contexto relevante à interação atual."
    
    # --- GATILHO ---
    # Ativado logo após a percepção ser concluída com sucesso.
    trigger: AfterSuccess:PERCEPTION-01-ProcessNewInput

    # --- AÇÃO ---
    # Uma única ação que orquestra a busca em todas as fontes de memória.
    action: Memory.EnrichContext
    params:
      # Usa a análise da percepção para guiar a busca na memória.
      analysis: "{{turn.analysis}}"
      # Permite buscar no histórico recente da conversa.
      short_term_history: "{{session.history}}"

    # --- SAÍDA ESPERADA ---
    # Salva um objeto de contexto que será usado para a tomada de decisão.
    output: context
    # Exemplo da estrutura de 'context':
    # {
    #   "from_stm": [ "Na última mensagem, você pediu para criar um arquivo." ],
    #   "from_ltm": [
    #     { "doc": "Gabriel Letteriello prefere explicações técnicas.", "score": 0.92, "source": "session_summary_1" },
    #     { "doc": "O ADK do Google é usado para criar ferramentas para agentes.", "score": 0.88, "source": "web_search_learning_12" }
    #   ],
    #   "working_memory_prompt": "..." # Um prompt enriquecido para o LLM.
    # }

  - rule_id: "MEMORY-02-CommitToLongTermMemory"
    description: "Salva um fato ou aprendizado específico e processado na memória de longo prazo (VectorDB)."
    
    # --- GATILHO ---
    # Ativado por um sinal explícito do workflow, geralmente após a fase de reflexão (meta-learning).
    trigger: OnSignal:CommitToLTM
    
    # --- AÇÃO ---
    # Mapeia para uma função que gera um embedding e o armazena.
    action: Memory.CommitFact
    params:
      # O payload do sinal deve conter a informação já sumarizada e pronta para ser memorizada.
      fact_to_commit: "{{signal.payload.fact}}"
      metadata: "{{signal.payload.metadata}}" # Ex: { source_rule: 'META-02', timestamp: '...' }
      
    on_success:
      log: "Novo fato salvo na LTM com sucesso."

  - rule_id: "MEMORY-03-SummarizeAndStoreSession"
    description: "Cria um resumo da interação completa e o armazena na LTM."
    
    # --- GATILHO ---
    # Ativado pelo workflow ao final de um projeto ou sessão.
    trigger: OnSignal:EndSession
    
    # --- AÇÃO ---
    # Mapeia para uma função que usa um LLM para criar um resumo conciso.
    action: Memory.SummarizeAndStoreSession
    params:
      full_history: "{{session.history}}"
      
    on_success:
      log: "Sessão sumarizada e arquivada na LTM."