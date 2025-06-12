/**
 * @file Contém os schemas Zod e os tipos TypeScript para a orquestração de agentes.
 */

import { z } from 'zod'

// Schema base para identificar um agente a ser executado em um passo.
export const AgentIdentifierSchema = z.object({
  id: z.string().uuid('ID de agente inválido'),
  name: z.string(),
})

// Schema para um orquestrador que executa agentes em sequência.
export const SequentialOrchestratorSchema = z.object({
  type: z.literal('sequential'),
  steps: z.array(AgentIdentifierSchema).min(1, 'Um orquestrador sequencial precisa de pelo menos um passo.'),
})

// Schema para um orquestrador que executa agentes em paralelo.
export const ParallelOrchestratorSchema = z.object({
  type: z.literal('parallel'),
  steps: z.array(AgentIdentifierSchema).min(1, 'Um orquestrador paralelo precisa de pelo menos um passo.'),
})

// Schema para um orquestrador que executa um agente em loop.
export const LoopOrchestratorSchema = z.object({
  type: z.literal('loop'),
  step: AgentIdentifierSchema,
  condition: z.string().min(1, 'A condição de parada do loop é obrigatória.'),
  maxIterations: z.number().int().positive().optional(),
})

// União discriminada para representar qualquer tipo de orquestrador.
export const OrchestratorSchema = z.discriminatedUnion('type', [
  SequentialOrchestratorSchema,
  ParallelOrchestratorSchema,
  LoopOrchestratorSchema,
])

// Tipos inferidos a partir dos schemas Zod para uso no código.
export type AgentIdentifier = z.infer<typeof AgentIdentifierSchema>
export type SequentialOrchestrator = z.infer<typeof SequentialOrchestratorSchema>
export type ParallelOrchestrator = z.infer<typeof ParallelOrchestratorSchema>
export type LoopOrchestrator = z.infer<typeof LoopOrchestratorSchema>
export type Orchestrator = z.infer<typeof OrchestratorSchema>
