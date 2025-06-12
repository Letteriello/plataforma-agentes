// client/src/types/agents.ts

// UI-specific Schema Definition (simplified for forms, can be expanded)
export interface UiSchemaDefinition {
  type: 'STRING' | 'NUMBER' | 'BOOLEAN' | 'OBJECT' | 'ARRAY';
  description?: string;
  default?: any; // Can be string, number, boolean for primitive types
  enum?: any[]; // Array of allowed values of the specified type
  // For OBJECT type
  properties?: { [key: string]: UiSchemaDefinition }; // Recursive definition for nested objects
  // For ARRAY type
  items?: UiSchemaDefinition; // Definition for items if type is ARRAY
  // required?: string[]; // For object properties, if needed at this level
}

// UI-specific Tool Definition (for forms)
export interface UiToolDefinition {
  name: string;
  description?: string;
  parameters?: {
    [key: string]: UiSchemaDefinition; // Key is parameter name
  };
  required?: string[]; // List of required parameter names
  // outputSchema?: UiSchemaDefinition; // Future: For defining the tool's output structure
}

// Potentially other agent-related types can be added here later,
// e.g., LlmAgentConfig, AgentIdentity, GenerationSettings, SafetySettings, etc.
// consistent with Google ADK.

export enum AgentType {
  LLM = 'LLM',
  SEQUENTIAL = 'SEQUENTIAL',
  PARALLEL = 'PARALLEL',
  LOOP = 'LOOP',
  A2A = 'A2A',
}

export interface AgentConfig {
  isPublic: boolean;
  isPublic: boolean
  id: string
  name: string
  description: string
  version: string
  type: AgentType
}

export interface LlmAgentConfig extends AgentConfig {
  type: AgentType.LLM
  model: string
  instruction: string
  temperature: number
  tools: UiToolDefinition[]
}

export interface SequentialAgentConfig extends AgentConfig {
  type: AgentType.SEQUENTIAL
  workflowType: 'sequential'
  agents: AnyAgentConfig[]
}

export interface ParallelAgentConfig extends AgentConfig {
  type: AgentType.PARALLEL
  workflowType: 'parallel'
  agents: AnyAgentConfig[]
  maxConcurrent: number
}

export interface LoopAgentConfig extends AgentConfig {
  type: AgentType.LOOP
  workflowType: 'loop'
  agents: AnyAgentConfig[]
  maxIterations: number
}

export interface A2AAgentConfig extends AgentConfig {
  type: AgentType.A2A
  endpoint: string
  authType: 'none' | 'apiKey' | 'oauth'
  apiKey?: string
}

import { z } from 'zod'

export type AnyAgentConfig = LlmAgentConfig | SequentialAgentConfig | ParallelAgentConfig | LoopAgentConfig | A2AAgentConfig

export type Agent = AnyAgentConfig

export const LlmAgentConfigSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'O nome é obrigatório'),
  description: z.string(),
  version: z.string(),
  type: z.literal(AgentType.LLM),
  model: z.string(),
  instruction: z.string(),
  temperature: z.number(),
  tools: z.array(z.any()), // Simplified for now
})

export function createDefaultAgent(type: AgentType): AnyAgentConfig {
  const baseConfig: Partial<AgentConfig> = {
    id: `agent-${Date.now()}`,
    name: 'Novo Agente',
    description: 'Descrição do agente',
    version: '1.0.0',
    type,
  }

  switch (type) {
    case AgentType.LLM:
      return {
        ...baseConfig,
        type: AgentType.LLM,
        model: 'gemini-1.5-pro',
        instruction: 'Você é um assistente útil.',
        temperature: 0.7,
        tools: [],
      } as LlmAgentConfig
    // Add other agent types here later
    default:
      throw new Error(`Unsupported agent type: ${type}`)
  }
}


