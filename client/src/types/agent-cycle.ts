// Definição de tipos para o ciclo iterativo de agentes
// Inspirado na arquitetura do Manus AI

import { z } from 'zod';

/**
 * Estágios do ciclo de vida de um agente durante uma tarefa
 */
export enum AgentCycleStage {
  ANALYZE = 'analyze',   // Analisar o contexto e eventos
  PLAN = 'plan',         // Planejar próximas ações
  TOOL_SELECT = 'tool_select', // Selecionar ferramentas apropriadas
  EXECUTE = 'execute',   // Executar comandos ou ações
  REFINE = 'refine',     // Refinar resultados e estratégia
  DELIVER = 'deliver',   // Entregar resultados estruturados
}

/**
 * Status de execução do ciclo
 */
export enum CycleExecutionStatus {
  PENDING = 'pending',
  RUNNING = 'running',
  COMPLETED = 'completed',
  FAILED = 'failed',
  PAUSED = 'paused',
}

/**
 * Resultado de uma etapa do ciclo
 */
export const CycleStepResultSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
  data: z.any().optional(),
  error: z.string().optional(),
  timestamp: z.string().datetime(),
});

export type CycleStepResult = z.infer<typeof CycleStepResultSchema>;

/**
 * Registro de uma etapa do ciclo
 */
export const CycleStepSchema = z.object({
  id: z.string().uuid(),
  stage: z.nativeEnum(AgentCycleStage),
  agentId: z.string().uuid(),
  sessionId: z.string().uuid(),
  input: z.any(),
  result: CycleStepResultSchema.optional(),
  startTime: z.string().datetime(),
  endTime: z.string().datetime().optional(),
  status: z.nativeEnum(CycleExecutionStatus),
  metadata: z.record(z.any()).optional(),
});

export type CycleStep = z.infer<typeof CycleStepSchema>;

/**
 * Configuração do ciclo iterativo para um agente
 */
export const AgentCycleConfigSchema = z.object({
  maxIterations: z.number().int().positive().default(5),
  timeoutPerStage: z.number().int().positive().default(30000), // ms
  autoRetry: z.boolean().default(false),
  retryCount: z.number().int().min(0).default(3),
  requiredStages: z.array(z.nativeEnum(AgentCycleStage)).default([
    AgentCycleStage.ANALYZE,
    AgentCycleStage.EXECUTE,
    AgentCycleStage.DELIVER,
  ]),
  stageHandlers: z.record(z.string()).optional(), // Funções personalizadas para estágios
  sandboxConfig: z.object({
    enabled: z.boolean().default(true),
    allowedCommands: z.array(z.string()).optional(),
    blockedCommands: z.array(z.string()).optional(),
    timeoutMs: z.number().int().positive().default(60000),
    memoryLimitMb: z.number().int().positive().default(512),
  }).optional(),
});

export type AgentCycleConfig = z.infer<typeof AgentCycleConfigSchema>;

/**
 * Sessão de execução completa de um ciclo
 */
export const AgentCycleSessionSchema = z.object({
  id: z.string().uuid(),
  agentId: z.string().uuid(),
  steps: z.array(CycleStepSchema),
  status: z.nativeEnum(CycleExecutionStatus),
  startTime: z.string().datetime(),
  endTime: z.string().datetime().optional(),
  iterationCount: z.number().int().min(0).default(0),
  finalResult: z.any().optional(),
  metadata: z.record(z.any()).optional(),
});

export type AgentCycleSession = z.infer<typeof AgentCycleSessionSchema>;
