---
trigger: always_on
---

# ===================================================================
# RULESET 03: TOOLBOX & SKILLS
#
# OBJETIVO:
# Funcionar como o braço de ação do agente. Este módulo define e
# executa todas as ferramentas práticas disponíveis, como executar
# código, manipular arquivos ou fazer buscas na web. Ele traduz
# a intenção em uma ação concreta.
# ===================================================================

ToolboxSkillsRules:
  - rule_id: "TOOLBOX-01-RouteAndExecuteTool"
    description: "Roteador principal que recebe uma tarefa do workflow, seleciona a ferramenta correta e a executa."

    # --- GATILHO ---
    # Ativado por um sinal explícito do workflow na fase de EXECUÇÃO.
    trigger: OnSignal:ExecuteTask

    # --- AÇÃO ---
    # A função backend 'RouteAndExecute' age como uma central, direcionando
    # a chamada para a função da ferramenta específica.
    action: Toolbox.RouteAndExecute
    params:
      # O payload do sinal contém a tarefa a ser executada.
      # A tarefa DEVE especificar qual 'tool_id' usar e seus parâmetros.
      task: "{{signal.payload.task}}"
      # Exemplo da estrutura de 'task':
      # {
      #   "id": "task-003",
      #   "description": "Escrever o código 'print' no arquivo 'main.py'",
      #   "tool_id": "file_system",
      #   "params": {
      #     "operation": "write",
      #     "path": "./main.py",
      #     "content": "print('Hello, World!')"
      #   }
      # }

    # --- SAÍDA ESPERADA ---
    # Salva o resultado da execução em uma variável padrão para a fase de reflexão.
    output: workflow.last_action_result
    # A saída DEVE ter um formato padronizado para facilitar a análise de sucesso/falha.
    # Exemplo da estrutura de 'last_action_result':
    # {
    #   "status": "success" | "failure",
    #   "data": "Arquivo 'main.py' escrito com sucesso." | null,
    #   "error_message": null | "Permissão negada.",
    #   "raw_output": "..."
    # }

# --- CATÁLOGO CONCEITUAL DE FERRAMENTAS ---
# As ferramentas abaixo não são regras individuais, mas sim as habilidades
# que a função Python 'Toolbox.RouteAndExecute' saberia chamar.

# tool_id: "code_executor"
#   - Descrição: Executa blocos de código (Python, Shell, etc.) em um ambiente seguro.
#   - IMPORTANTE: A implementação DEVE ser "sandboxed" (em um contêiner Docker,
#     por exemplo) para prevenir que o agente danifique o sistema hospedeiro.
#   - Params: { "language": "python", "code": "..." }

# tool_id: "file_system"
#   - Descrição: Realiza operações de CRUD (Criar, Ler, Atualizar, Deletar) em arquivos.
#   - Params: { "operation": "read" | "write" | "delete", "path": "..." }

# tool_id: "web_search"
#   - Descrição: Realiza uma busca na web usando uma API de busca.
#   - Params: { "query": "..." }

# tool_id: "api_caller"
#   - Descrição: Ferramenta genérica para fazer chamadas HTTP a APIs externas.
#   - Params: { "method": "GET" | "POST", "url": "...", "headers": {...}, "body": {...} }