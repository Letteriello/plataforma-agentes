import { z } from 'zod'
import { AgentType } from '@/types/core/agent'

// Common form schemas
export const nameSchema = z
  .string()
  .min(1, 'Name is required')
  .max(100, 'Name must be less than 100 characters')

export const descriptionSchema = z
  .string()
  .max(500, 'Description must be less than 500 characters')
  .optional()

export const tagsSchema = z
  .array(z.string().max(50, 'Tag must be less than 50 characters'))
  .max(10, 'Maximum 10 tags allowed')
  .optional()
  .default([])

// Agent type specific schemas
export const llmAgentSchema = z.object({
  model: z.string().min(1, 'Model is required'),
  temperature: z.number().min(0).max(2).default(0.7),
  maxTokens: z.number().min(1).max(8192).default(2048),
  topP: z.number().min(0).max(1).default(1),
  topK: z.number().min(1).max(100).default(40),
  instruction: z.string().min(1, 'Instructions are required'),
  systemPrompt: z.string().optional(),
  tools: z.array(z.string()).default([]),
  stopSequences: z.array(z.string()).default([]),
  frequencyPenalty: z.number().min(-2).max(2).default(0),
  presencePenalty: z.number().min(-2).max(2).default(0),
})

export const sequentialAgentSchema = z.object({
  agents: z.array(z.string()).min(1, 'At least one agent is required'),
  maxSteps: z.number().min(1).default(10),
  stopOnError: z.boolean().default(true),
})

export const parallelAgentSchema = z.object({
  agents: z.array(z.string()).min(1, 'At least one agent is required'),
  maxConcurrent: z.number().min(1).default(3),
  timeoutMs: z.number().min(0).default(30000),
})

export const a2aAgentSchema = z.object({
  endpoint: z.string().url('Must be a valid URL'),
  method: z.enum(['GET', 'POST', 'PUT', 'DELETE']).default('POST'),
  headers: z.record(z.string()).default({}),
  requestSchema: z.record(z.any()).optional(),
  responseSchema: z.record(z.any()).optional(),
  authType: z.enum(['none', 'api_key', 'oauth2']).default('none'),
})

// Base agent schema with common fields
export const baseAgentSchema = z.object({
  id: z.string().optional(),
  name: nameSchema,
  description: descriptionSchema,
  // type: z.nativeEnum(AgentType), // Discriminated union handles type
  isPublic: z.boolean().default(false),
  tags: tagsSchema,
})

// Union of all agent schemas
export const agentSchema = z.discriminatedUnion('type', [
  z
    .object({ type: z.literal(AgentType.LLM) })
    .merge(baseAgentSchema)
    .merge(llmAgentSchema),
  z
    .object({ type: z.literal(AgentType.Sequential) })
    .merge(baseAgentSchema)
    .merge(sequentialAgentSchema),
  z
    .object({ type: z.literal(AgentType.Parallel) })
    .merge(baseAgentSchema)
    .merge(parallelAgentSchema),
  z
    .object({ type: z.literal(AgentType.A2A) })
    .merge(baseAgentSchema)
    .merge(a2aAgentSchema),
])

// Type inference
export type BaseAgentFormValues = z.infer<typeof baseAgentSchema>
export type LLMAgentFormValues = z.infer<typeof llmAgentSchema>
export type SequentialAgentFormValues = z.infer<typeof sequentialAgentSchema>
export type ParallelAgentFormValues = z.infer<typeof parallelAgentSchema>
export type A2AAgentFormValues = z.infer<typeof a2aAgentSchema>
export type AgentFormValues = z.infer<typeof agentSchema>

// Helper functions
export function getDefaultValues(type: AgentType): AgentFormValues {
  const base = {
    name: '',
    description: '',
    type,
    isPublic: false,
    tags: [],
  }

  switch (type) {
    case AgentType.LLM:
      return {
        ...base,
        ...llmAgentSchema.parse({}),
      }
    case AgentType.Sequential:
      return {
        ...base,
        ...sequentialAgentSchema.parse({}),
      }
    case AgentType.Parallel:
      return {
        ...base,
        ...parallelAgentSchema.parse({}),
      }
    case AgentType.A2A:
      return {
        ...base,
        ...a2aAgentSchema.parse({}),
      }
    default:
      throw new Error(`Unknown agent type: ${type}`)
  }
}

// Validation helpers
export function validateForm<T extends z.ZodType>(
  schema: T,
  values: unknown,
): { isValid: boolean; errors: Record<string, string> } {
  try {
    schema.parse(values)
    return { isValid: true, errors: {} }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {}
      error.errors.forEach((err) => {
        const path = err.path.join('.')
        errors[path] = err.message
      })
      return { isValid: false, errors }
    }
    throw error
  }
}

// Field transformers
export const numberTransformer = {
  input: (value: number) => (isNaN(value) ? '' : value.toString()),
  output: (value: string) => {
    const parsed = parseFloat(value)
    return isNaN(parsed) ? 0 : parsed
  },
}

export const booleanTransformer = {
  input: (value: boolean) => (value ? 'true' : 'false'),
  output: (value: string) => value === 'true',
}

// Format form values for API
export function formatAgentForApi(agent: AgentFormValues): any {
  // Remove undefined values
  const formatted = JSON.parse(JSON.stringify(agent))

  // Add any additional formatting needed for the API
  return formatted
}

// Parse API response to form values
export function parseApiResponseToFormValues(
  apiResponse: any,
): AgentFormValues {
  // Transform the API response to match our form schema
  const base = {
    id: apiResponse.id,
    name: apiResponse.name || '',
    description: apiResponse.description || '',
    type: apiResponse.type,
    isPublic: apiResponse.isPublic || false,
    tags: apiResponse.tags || [],
  }

  // Add type-specific fields
  switch (apiResponse.type) {
    case AgentType.LLM:
      return {
        ...base,
        ...llmAgentSchema.parse(apiResponse),
      }
    case AgentType.Sequential:
      return {
        ...base,
        ...sequentialAgentSchema.parse(apiResponse),
      }
    case AgentType.Parallel:
      return {
        ...base,
        ...parallelAgentSchema.parse(apiResponse),
      }
    case AgentType.A2A:
      return {
        ...base,
        ...a2aAgentSchema.parse(apiResponse),
      }
    default:
      throw new Error(`Unknown agent type: ${apiResponse.type}`)
  }
}
