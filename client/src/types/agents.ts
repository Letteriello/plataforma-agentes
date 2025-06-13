// Arquivo: client/src/types/agents.ts
// FONTE ÚNICA DA VERDADE PARA TIPOS DE AGENTE

import { z } from 'zod';
import { ToolSchema, ToolDTOSchema } from '@/types/tools';

// ----------------------------------------------------------------------
// ENUMS E TIPOS FUNDAMENTAIS
// ----------------------------------------------------------------------

export enum AgentType {
  LLM = 'llm',
  SEQUENTIAL = 'sequential',
  PARALLEL = 'parallel',
  A2A = 'a2a', // Agent-to-Agent
}

// ----------------------------------------------------------------------
// ESQUEMAS DE CONFIGURAÇÃO ZOD (Lógica Interna da UI)
// ----------------------------------------------------------------------

export const BaseAgentConfigSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, 'O nome é obrigatório.'),
  description: z.string().optional(),
  type: z.nativeEnum(AgentType),
  isPublic: z.boolean().default(false),
  version: z.string().default('1.0.0'),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
  userId: z.string().uuid().optional(),
});

export const LlmAgentConfigSchema = BaseAgentConfigSchema.extend({
  type: z.literal(AgentType.LLM),
  model: z.string().min(1, 'O modelo é obrigatório.'),
  instruction: z.string().min(1, 'A instrução é obrigatória.'),
  generateContentConfig: z.object({
    temperature: z.number().min(0).max(2).default(0.7),
    maxOutputTokens: z.number().int().positive().default(2048),
    topP: z.number().min(0).max(1).default(1.0),
    topK: z.number().int().positive().default(40),
  }),
  tools: z.array(ToolSchema).optional(),
  knowledgeBaseIds: z.array(z.string().uuid()).optional(),
  autonomy_level: z.enum(['auto', 'ask']).default('ask'),
  security_config: z.record(z.any()).optional(),
  planner_config: z.record(z.any()).optional(),
  code_executor_config: z.record(z.any()).optional(),
});

export const SequentialAgentConfigSchema = BaseAgentConfigSchema.extend({
  type: z.literal(AgentType.SEQUENTIAL),
  agents: z.array(z.string().uuid()),
});

export const ParallelAgentConfigSchema = BaseAgentConfigSchema.extend({
  type: z.literal(AgentType.PARALLEL),
  agents: z.array(z.string().uuid()),
});

export const AnyAgentConfigSchema = z.union([
  LlmAgentConfigSchema,
  SequentialAgentConfigSchema,
  ParallelAgentConfigSchema,
]);

// Tipos TypeScript inferidos dos esquemas Zod
export type BaseAgentConfig = z.infer<typeof BaseAgentConfigSchema>;
export type LlmAgentConfig = z.infer<typeof LlmAgentConfigSchema>;
export type SequentialAgentConfig = z.infer<typeof SequentialAgentConfigSchema>;
export type ParallelAgentConfig = z.infer<typeof ParallelAgentConfigSchema>;
export type AnyAgentConfig = z.infer<typeof AnyAgentConfigSchema>;

// ----------------------------------------------------------------------
// DTOS (Data Transfer Objects) - Contrato com a API Backend
// ----------------------------------------------------------------------

/**
 * DTO para a lista de agentes (visão resumida).
 */
export const AgentSummaryDTOSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string().nullable(),
  type: z.nativeEnum(AgentType),
  version: z.string(),
  is_public: z.boolean(),
  avatar_url: z.string().url().nullable().optional(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export type AgentSummaryDTO = z.infer<typeof AgentSummaryDTOSchema>;

/**
 * DTO para os detalhes completos de um agente LLM.
 */
export const AgentDetailDTOSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    description: z.string().nullable(),
    model: z.string(),
    instruction: z.string(),
    temperature: z.number(),
    max_output_tokens: z.number().int(),
    top_p: z.number(),
    top_k: z.number().int(),
    autonomy_level: z.enum(['auto', 'ask']),
    is_public: z.boolean(),
    version: z.string(),
    created_at: z.string().datetime(),
    updated_at: z.string().datetime(),
    user_id: z.string().uuid(),
    tools: z.array(ToolDTOSchema).optional(),
    // Adicionar outros campos como security_config, etc., se a API os retornar
});

export type AgentDetailDTO = z.infer<typeof AgentDetailDTOSchema>;

/**
 * DTO para criar um novo agente.
 */
export const AgentCreateDTOSchema = AgentDetailDTOSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
  user_id: true,
  tools: true, // Os IDs das ferramentas são enviados separadamente
}).extend({
  tool_ids: z.array(z.string().uuid()).optional(),
});

export type AgentCreateDTO = z.infer<typeof AgentCreateDTOSchema>;

/**
 * DTO para atualizar um agente existente.
 */
export const AgentUpdateDTOSchema = AgentCreateDTOSchema.partial();

export type AgentUpdateDTO = z.infer<typeof AgentUpdateDTOSchema>;

// ----------------------------------------------------------------------
// TIPOS ESPECÍFICOS DA UI (que não são DTOs)
// ----------------------------------------------------------------------

/**
 * Interface para os dados resumidos de um agente a serem exibidos no AgentCard.
 */
export interface AgentCardData extends AgentSummaryDTO {
  // Adicionar quaisquer propriedades específicas da UI aqui, se necessário
}
