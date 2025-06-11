import { z } from 'zod'

// Esquema base que todos os agentes compartilham.
export const BaseAgentSchema = z.object({
  id: z.string().default(() => crypto.randomUUID()),
  name: z.string().min(1, 'O nome é obrigatório'),
  description: z.string().default(''),
  // O tipo de agente, essencial para a renderização condicional da UI e lógica de backend.
  type: z.enum(['llm', 'sequential', 'parallel', 'a2a']),
  version: z.string().default('1.0.0'),
  isPublic: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
  createdAt: z.string().default(() => new Date().toISOString()),
  updatedAt: z.string().default(() => new Date().toISOString()),
})

export type BaseAgent = z.infer<typeof BaseAgentSchema>
