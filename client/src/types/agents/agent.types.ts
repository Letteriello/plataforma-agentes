// Arquivo: client/src/types/agents/agent.types.ts

import type { UiToolDefinition, ToolDTO } from '@/types/tools';

/**
 * Configuração de um agente LLM.
 */
export interface LlmAgentConfig {
  id: string;
  name: string;
  description: string | null;
  system_prompt?: string;
  llm_model?: string; // ex: 'gpt-3.5-turbo', 'claude-2'
  temperature?: number;
  max_tokens?: number;
  user_id?: string; // ID do usuário proprietário
  tool_ids?: string[]; // IDs das ferramentas associadas
  tools?: ToolDTO[]; // Opcionalmente, as definições completas das ferramentas (para criação/atualização)
  is_public: boolean;
  version: string;
  created_at: string;
  updated_at: string;
}

/**
 * DTO resumido para um agente, usado em listagens.
 */
export interface AgentSummaryDTO {
  id: string;
  name: string;
  description: string | null;
  avatar_url?: string;
  is_public: boolean;
  version: string;
  created_at: string;
  updated_at: string;
  // Poderia incluir contagem de ferramentas, última atividade, etc.
}

/**
 * Representa um agente com suas ferramentas para exibição na UI.
 * Similar ao LlmAgentConfig, mas pode ter as UiToolDefinition completas.
 */
export interface UiAgent extends Omit<LlmAgentConfig, 'tools' | 'tool_ids'> {
  tools: UiToolDefinition[];
}
