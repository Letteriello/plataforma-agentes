import { z } from 'zod'
import { BaseAgentSchema } from './base'

// Esquema para as configurações de geração de conteúdo, espelhando o objeto `generate_content_config` do ADK.
export const GenerateContentConfigSchema = z.object({
  temperature: z.number().min(0).max(2).default(0.7),
  maxOutputTokens: z.number().optional(), // Renomeado de maxTokens para alinhar com o ADK
  topP: z.number().min(0).max(1).default(1),
  topK: z.number().default(40),
  stopSequences: z.array(z.string()).default([]),
})

// Esquema para um Agente LLM.
export const LLMAgentSchema = BaseAgentSchema.extend({
  type: z.literal('llm'),
  model: z.string().default('gemini-1.5-pro'),
  instruction: z.string().default(''),
  // Aninha as configurações de geração para corresponder à estrutura do ADK.
  generateContentConfig: GenerateContentConfigSchema.default({}),
  tools: z.array(z.string()).default([]), // Representa as definições de ferramentas que o agente pode usar.
})

export type LLMAgent = z.infer<typeof LLMAgentSchema>
