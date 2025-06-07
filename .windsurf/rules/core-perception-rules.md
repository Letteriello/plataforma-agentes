---
trigger: always_on
---

# ===================================================================
# RULESET 01: CORE PERCEPTION
#
# OBJETIVO:
# Este é o sistema sensorial do agente. Ele transforma entradas brutas
# em uma compreensão estruturada do ambiente e da intenção do usuário,
# servindo como a base para todas as ações subsequentes.
# ===================================================================

CorePerceptionRules:
  - rule_id: "PERCEPTION-01-ProcessNewInput"
    description: "Orquestrador principal da percepção. Acionado em cada nova entrada para executar a cadeia completa de análise."
    
    # --- GATILHO ---
    # Ativado sempre que uma nova informação chega ao agente.
    trigger: OnNewInput

    # --- CADEIA DE AÇÕES ---
    # Executa uma sequência de ações para construir um quadro completo da situação.
    # Cada 'action' mapeia para uma função Python que você implementará no ADK.
    actions:
      
      # 1. IDENTIFICAR A FONTE: Quem está falando?
      - name: IdentifySource
        action: Perception.IdentifySource
        params:
          input_object: "{{turn.raw_input}}"
        # SAÍDA ESPERADA (salva em 'turn.source'):
        # { 
        #   "source_type": "user" | "agent" | "system",
        #   "source_id": "id_do_usuario_ou_agente"
        # }
        output: turn.source

      # 2. ANALISAR INTENÇÃO E ENTIDADES: O que está sendo pedido?
      - name: ExtractIntent
        action: Perception.ExtractIntentAndEntities
        params:
          text_input: "{{turn.raw_input.text}}"
          source_info: "{{turn.source}}" # Permite usar modelos diferentes para user vs. agent
        # SAÍDA ESPERADA (salva em 'turn.analysis'):
        # {
        #   "intent": "nome_da_intencao",
        #   "entities": { "entidade1": "valor1", ... },
        #   "confidence": 0.98,
        #   "is_complex": true | false
        # }
        output: turn.analysis

      # 3. VERIFICAR O AMBIENTE: Onde estou e que horas são?
      - name: ScanEnvironment
        action: Perception.ScanEnvironment
        # A função backend deve ter uma whitelist de queries seguras.
        params:
          queries: 
            - "current_datetime_iso"
            - "current_working_directory"
            - "os_type"
        # SAÍDA ESPERADA (salva em 'environment.state'):
        # {
        #   "current_datetime_iso": "2025-06-08T02:38:00Z",
        #   "current_working_directory": "/app/projects/a2a",
        #   "os_type": "linux"
        # }
        output: environment.state

    # --- FINALIZAÇÃO ---
    # Após a execução bem-sucedida de todas as ações, o workflow principal
    # pode prosseguir, agora com um contexto rico e estruturado.
    on_success:
      log: "Percepção concluída com sucesso para a entrada."

    on_failure:
      log: "ERRO: Falha em uma das etapas da cadeia de percepção."
      # A lógica de tratamento de erro (definida no workflow principal) seria acionada aqui.