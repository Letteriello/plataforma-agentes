# Mapeamento: UI (AgentEditor) para Google ADK Configs

**Documento:** `09_mapeamento_ui_adk.md`
**Status:** Em andamento

Este documento detalha o mapeamento entre os campos da interface do usuário no componente `AgentEditor` e os modelos de dados `LlmAgentConfig` e `WorkflowAgentConfig` do Google Agent Development Kit (ADK). Ele também identifica lacunas e desalinhamentos que precisam ser abordados.

## Mapeamento de `LlmAgentConfig`

A UI do `AgentEditor` está bem alinhada com a criação de um `LlmAgent`. O mapeamento é o seguinte:

| Aba da UI        | Campo da UI (React Hook Form) | Propriedade ADK (`LlmAgentConfig`)          | Status/Notas                                                                                                                              |
| ---------------- | ----------------------------- | ------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| **Identidade**   | `name`                        | `name`                                      | Mapeamento direto.                                                                                                                        |
|                  | `description`                 | `description`                               | Mapeamento direto.                                                                                                                        |
| **Instruções**   | `instruction`                 | `instruction`                               | Mapeamento direto.                                                                                                                        |
| **Modelo & Geração** | `model`                       | `model`                                     | Mapeamento direto.                                                                                                                        |
|                  | `temperature`                 | `generateContentConfig.temperature`         | **Lacuna de Estrutura:** Requer aninhamento no objeto `generateContentConfig` durante a submissão do formulário.                        |
|                  | `maxTokens`                   | `generateContentConfig.maxOutputTokens`     | **Lacuna de Estrutura e Nomenclatura:** Requer aninhamento e renomeação (`maxTokens` -> `maxOutputTokens`).                                 |
|                  | `topP`                        | `generateContentConfig.topP`                | **Lacuna de Estrutura:** Requer aninhamento.                                                                                              |
|                  | `topK`                        | `generateContentConfig.topK`                | **Lacuna de Estrutura:** Requer aninhamento.                                                                                              |
| **Ferramentas**  | `tools` (array de IDs)        | `tools` (array de `ToolDefinition`)         | **Lacuna de Lógica:** A UI gerencia IDs. É necessário um passo para converter os IDs selecionados nas definições completas das ferramentas. |
| **Memória**      | (Nenhum)                      | `includeContents`                           | **Lacuna de Funcionalidade:** A UI para esta configuração ainda não foi implementada.                                                     |
| **Avançado**     | (Nenhum)                      | `inputSchema`, `outputSchema`, `planner`, etc. | **Lacuna de Funcionalidade:** Campos avançados do ADK não estão presentes na UI atual.                                                    |

---

## Análise de Lacunas e Próximos Passos

### 1. **Estrutura de `generateContentConfig`**
- **Problema:** Os parâmetros de geração (`temperature`, `maxTokens`, etc.) estão em uma estrutura plana no formulário, enquanto o ADK espera um objeto aninhado `generateContentConfig`.
- **Solução:** A função `handleSubmit` no `AgentEditor` deve ser modificada para transformar os dados do formulário, agrupando os campos de geração no formato esperado pelo ADK antes de enviar para a API.

### 2. **Definição de Ferramentas (`tools`)**
- **Problema:** A UI seleciona ferramentas por seus IDs, mas o ADK precisa da definição completa da ferramenta (`ToolDefinition`).
- **Solução:** A lógica de submissão precisa buscar as definições completas das ferramentas selecionadas (provavelmente de um estado ou cache preenchido pela API) e montar o array `tools` com os objetos `ToolDefinition` correspondentes.

### 3. **Suporte a `WorkflowAgentConfig`**
- **Problema:** A UI atual foi projetada exclusivamente para `LlmAgent`. Não há como selecionar o tipo de agente (ex: `SequentialAgent`) ou gerenciar uma lista de `sub_agents`.
- **Solução (Proposta de Arquitetura):**
    - **Passo 1:** Modificar o `AgentEditor` para incluir um seletor de tipo de agente no primeiro passo do wizard ('Identidade').
    - **Passo 2:** Com base no tipo de agente selecionado, renderizar condicionalmente a UI apropriada. Se 'SequentialAgent' for escolhido, a aba 'Ferramentas' seria substituída por uma nova aba 'Orquestração'.
    - **Passo 3:** Criar um novo componente, `AgentOrchestrationTab`, que permitiria ao usuário adicionar, remover e reordenar agentes (os `sub_agents`) em uma lista.

### 4. **Campos Faltantes**
- **Problema:** As abas de 'Memória' e configurações avançadas (`inputSchema`, `outputSchema`) estão ausentes ou são placeholders.
- **Solução:** Implementar gradualmente as seções da UI para essas funcionalidades, alinhando-as com as capacidades do ADK. A aba 'Memória' seria o próximo alvo lógico após o mapeamento inicial.

Com este documento, temos um roteiro claro para refatorar nossa UI e garantir a compatibilidade total com a arquitetura do Google ADK.