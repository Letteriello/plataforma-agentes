import { z } from 'zod';

// Importa os schemas modulares
import { BaseAgentSchema } from './base';
import { LLMAgentSchema } from './llm';
import { SequentialAgentSchema, ParallelAgentSchema } from './workflow';

// Re-exporta os tipos individuais para fácil acesso em outras partes da aplicação.
export * from './base';
export * from './llm';
export * from './workflow';
export * from './misc';

// Define um schema de união discriminada para validar qualquer tipo de agente.
// Isso permite que o Zod determine qual schema de agente usar com base no campo 'type'.
export const AgentSchema = z.discriminatedUnion('type', [
  LLMAgentSchema,
  SequentialAgentSchema,
  ParallelAgentSchema,
  // Outros agentes como A2AAgent seriam adicionados aqui no futuro.
]);

// O tipo `Agent` é uma união de todos os tipos de agentes possíveis.
export type Agent = z.infer<typeof AgentSchema>;


// Helper function to create a new agent with defaults, updated for the new structure
export function createDefaultAgent<T extends Agent['type']>(type: T):
  T extends 'llm' ? LLMAgent :
  T extends 'sequential' ? SequentialAgent :
  T extends 'parallel' ? ParallelAgent :
  never {
  const base = {
    id: crypto.randomUUID(),
    name: `Novo Agente ${type.charAt(0).toUpperCase() + type.slice(1)}`,
    description: '',
    type,
    version: '1.0.0',
    isPublic: false,
    tags: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  switch (type) {
    case 'llm':
      return {
        ...base,
        type: 'llm',
        model: 'gemini-1.5-pro',
        instruction: '',
        // Aderindo à nova estrutura aninhada do ADK
        generateContentConfig: {
          temperature: 0.7,
          maxOutputTokens: 2048,
          topP: 1,
          topK: 40,
          stopSequences: [],
        },
        tools: [],
      } as LLMAgent;

    case 'sequential':
      return {
        ...base,
        type: 'sequential',
        sub_agents: [], // Aderindo à nova nomenclatura do ADK
        maxSteps: 10,
        stopOnError: true,
      } as SequentialAgent;

    case 'parallel':
      return {
        ...base,
        type: 'parallel',
        sub_agents: [], // Aderindo à nova nomenclatura do ADK
        maxConcurrent: 3,
        timeoutMs: 30000,
      } as ParallelAgent;

    default:
      // Força um erro em tempo de compilação se um tipo de agente não for tratado
      const exhaustiveCheck: never = type;
      throw new Error(`Tipo de agente desconhecido: ${exhaustiveCheck}`);
  }
}
