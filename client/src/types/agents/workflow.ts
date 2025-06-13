import { z } from 'zod'

import { BaseAgentSchema } from './base'

// Esquema para um Agente de Workflow Sequencial.
export const SequentialAgentSchema = BaseAgentSchema.extend({
  type: z.literal('sequential'),
  // Renomeado de `agents` para `sub_agents` para alinhar com a terminologia do ADK.
  sub_agents: z.array(z.string()),
  maxSteps: z.number().default(10),
  stopOnError: z.boolean().default(true),
})

export type SequentialAgent = z.infer<typeof SequentialAgentSchema>

// Esquema para um Agente de Workflow Paralelo.
export const ParallelAgentSchema = BaseAgentSchema.extend({
  type: z.literal('parallel'),
  // Renomeado de `agents` para `sub_agents`.
  sub_agents: z.array(z.string()),
  maxConcurrent: z.number().default(3),
  timeoutMs: z.number().default(30000),
})

export type ParallelAgent = z.infer<typeof ParallelAgentSchema>
