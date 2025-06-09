import { z } from 'zod';

// Base agent type
export const BaseAgentSchema = z.object({
  id: z.string().default(() => crypto.randomUUID()),
  name: z.string().min(1, 'Name is required'),
  description: z.string().default(''),
  type: z.enum(['llm', 'sequential', 'parallel', 'a2a']),
  version: z.string().default('1.0.0'),
  isPublic: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
  createdAt: z.string().default(() => new Date().toISO()),
  updatedAt: z.string().default(() => new Date().toISO()),
});

export type BaseAgent = z.infer<typeof BaseAgentSchema>;

// LLM Agent specific fields
export const LLMAgentSchema = BaseAgentSchema.extend({
  type: z.literal('llm'),
  model: z.string().default('gemini-1.5-pro'),
  temperature: z.number().min(0).max(2).default(0.7),
  maxTokens: z.number().default(2048),
  topP: z.number().min(0).max(1).default(1),
  topK: z.number().default(40),
  stopSequences: z.array(z.string()).default([]),
  frequencyPenalty: z.number().min(-2).max(2).default(0),
  presencePenalty: z.number().min(-2).max(2).default(0),
  instruction: z.string().default(''),
  systemPrompt: z.string().default(''),
});

export type LLMAgent = z.infer<typeof LLMAgentSchema>;

// Sequential Workflow Agent
export const SequentialAgentSchema = BaseAgentSchema.extend({
  type: z.literal('sequential'),
  agents: z.array(z.string()),
  maxSteps: z.number().default(10),
  stopOnError: z.boolean().default(true),
});

export type SequentialAgent = z.infer<typeof SequentialAgentSchema>;

// Parallel Workflow Agent
export const ParallelAgentSchema = BaseAgentSchema.extend({
  type: z.literal('parallel'),
  agents: z.array(z.string()),
  maxConcurrent: z.number().default(3),
  timeoutMs: z.number().default(30000),
});

export type ParallelAgent = z.infer<typeof ParallelAgentSchema>;

// A2A (Agent-to-Agent) Agent
export const A2AAgentSchema = BaseAgentSchema.extend({
  type: z.literal('a2a'),
  endpoint: z.string().url('Must be a valid URL'),
  method: z.enum(['GET', 'POST', 'PUT', 'DELETE']).default('POST'),
  headers: z.record(z.string()).default({}),
  requestSchema: z.record(z.any()).optional(),
  responseSchema: z.record(z.any()).optional(),
  authType: z.enum(['none', 'api_key', 'oauth2']).default('none'),
});

export type A2AAgent = z.infer<typeof A2AAgentSchema>;

// Union type for all agent types
export type Agent = LLMAgent | SequentialAgent | ParallelAgent | A2AAgent;

// Form Tool
export const FormToolParameterSchema = z.object({
  name: z.string().min(1, 'Parameter name is required'),
  type: z.enum(['string', 'number', 'boolean', 'object', 'array']),
  description: z.string().default(''),
  required: z.boolean().default(true),
  default: z.any().optional(),
});

export type FormToolParameter = z.infer<typeof FormToolParameterSchema>;

export const FormToolSchema = z.object({
  id: z.string().default(() => crypto.randomUUID()),
  name: z.string().min(1, 'Tool name is required'),
  description: z.string().default(''),
  parameters: z.array(FormToolParameterSchema).default([]),
  enabled: z.boolean().default(true),
  required: z.boolean().default(false),
  condition: z.string().optional(),
  returnType: z.string().optional(),
});

export type FormTool = z.infer<typeof FormToolSchema>;

// Safety Settings
export const SafetySettingSchema = z.object({
  category: z.enum(['HARM_CATEGORY_HARASSMENT', 'HARM_CATEGORY_HATE_SPEECH', 'HARM_CATEGORY_SEXUALLY_EXPLICIT', 'HARM_CATEGORY_DANGEROUS_CONTENT']),
  threshold: z.enum(['BLOCK_NONE', 'BLOCK_ONLY_HIGH', 'BLOCK_MEDIUM_AND_ABOVE', 'BLOCK_LOW_AND_ABOVE']),
});

export type SafetySetting = z.infer<typeof SafetySettingSchema>;

// Helper function to create a new agent with defaults
export function createDefaultAgent<T extends Agent['type']>(
  type: T
): T extends 'llm' ? LLMAgent :
  T extends 'sequential' ? SequentialAgent :
  T extends 'parallel' ? ParallelAgent :
  T extends 'a2a' ? A2AAgent : never {
  
  const base = {
    id: crypto.randomUUID(),
    name: `New ${type.charAt(0).toUpperCase() + type.slice(1)} Agent`,
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
        model: 'gemini-1.5-pro',
        temperature: 0.7,
        maxTokens: 2048,
        topP: 1,
        topK: 40,
        stopSequences: [],
        frequencyPenalty: 0,
        presencePenalty: 0,
        instruction: '',
        systemPrompt: '',
      } as any;
      
    case 'sequential':
      return {
        ...base,
        agents: [],
        maxSteps: 10,
        stopOnError: true,
      } as any;
      
    case 'parallel':
      return {
        ...base,
        agents: [],
        maxConcurrent: 3,
        timeoutMs: 30000,
      } as any;
      
    case 'a2a':
      return {
        ...base,
        endpoint: 'https://api.example.com/endpoint',
        method: 'POST',
        headers: {},
        authType: 'none',
      } as any;
      
    default:
      throw new Error(`Unknown agent type: ${type}`);
  }
}
