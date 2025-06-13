# Notas Rápidas: Google Agent Development Kit (ADK)

## Sistemas Multi-Agente (MAS)
- **Hierarquia:** Agentes organizados em árvore (pai/filhos) via `sub_agents` na inicialização. `parent_agent` é definido automaticamente. Define escopo e delegação.
- **Tipos de Agentes:**
  - `LlmAgent`: Baseado em LLMs (ex: Gemini).
  - `WorkflowAgent`: Orquestram sub-agentes.
  - `CustomAgent`: Lógica própria, não-LLM.

## Workflow Agents (Orquestradores)
- **`SequentialAgent`**:
  - Executa sub-agentes em sequência.
  - Compartilha `InvocationContext` (estado) entre passos.
  - Ideal para pipelines (saída de um é entrada do próximo).
- **`ParallelAgent`**:
  - Executa sub-agentes em paralelo.
  - `InvocationContext.branch` distinto para cada filho (útil para isolar histórico de memória).
  - `session.state` compartilhado (cuidado com race conditions ao escrever).
- **`LoopAgent`**:
  - Executa sub-agentes iterativamente (loop).
  - Repete por N iterações ou até condição de término.
  - Ideal para refinamento iterativo (ex: revisão de código/documento).

## Referências
- Multi-Agent Systems: [https://google.github.io/adk-docs/agents/multi-agents/](https://google.github.io/adk-docs/agents/multi-agents/)
- Workflow Agents: [https://google.github.io/adk-docs/agents/workflow-agents/](https://google.github.io/adk-docs/agents/workflow-agents/)
- Loop Agents: [https://google.github.io/adk-docs/agents/workflow-agents/loop-agents/](https://google.github.io/adk-docs/agents/workflow-agents/loop-agents/)