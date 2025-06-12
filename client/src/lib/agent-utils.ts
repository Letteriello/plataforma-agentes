import {
  Agent,
  AgentType,
  LLMAgent,
  SequentialAgent,
  ParallelAgent,
  A2AAgent,
} from '@/types/agents'
import {
  AnyAgentConfig,
  LlmAgentConfig,
  SequentialAgentConfig,
  ParallelAgentConfig,
  LoopAgentConfig,
} from '@/types'

/**
 * Get the display name for an agent type
 */
export function getAgentTypeDisplayName(type: AgentType): string {
  const typeMap: Record<AgentType, string> = {
    llm: 'LLM Agent',
    sequential: 'Sequential Workflow',
    parallel: 'Parallel Workflow',
    a2a: 'A2A (Agent-to-Agent)',
  }
  return typeMap[type] || 'Unknown Agent Type'
}

/**
 * Get the description for an agent type
 */
export function getAgentTypeDescription(type: AgentType): string {
  const descriptionMap: Record<AgentType, string> = {
    llm: 'A single LLM agent that can be configured with instructions and tools',
    sequential:
      'A workflow that runs agents in sequence, passing the output of one agent as input to the next',
    parallel:
      'A workflow that runs multiple agents in parallel and combines their outputs',
    a2a: 'An agent that communicates with external services via HTTP requests',
  }
  return descriptionMap[type] || 'An agent with custom functionality'
}

/**
 * Get the icon for an agent type
 */
export function getAgentTypeIcon(type: AgentType): string {
  const iconMap: Record<AgentType, string> = {
    llm: '🤖',
    sequential: '⏩',
    parallel: '🔄',
    a2a: '🔌',
  }
  return iconMap[type] || '❓'
}

/**
 * Validate an agent configuration
 */
export function validateAgent(agent: Agent): {
  isValid: boolean
  errors: string[]
} {
  const errors: string[] = []

  // Common validations
  if (!agent.name?.trim()) {
    errors.push('Agent name is required')
  }

  // Type-specific validations
  switch (agent.type) {
    case 'llm':
      const llmAgent = agent as LLMAgent
      if (!llmAgent.instruction?.trim()) {
        errors.push('Instructions are required for LLM agents')
      }
      break

    case 'sequential':
    case 'parallel':
      const workflowAgent = agent as SequentialAgent | ParallelAgent
      if (!workflowAgent.agents?.length) {
        errors.push('Workflow must contain at least one agent')
      }
      break

    case 'a2a':
      const a2aAgent = agent as A2AAgent
      try {
        new URL(a2aAgent.endpoint)
      } catch {
        errors.push('A valid endpoint URL is required for A2A agents')
      }
      break
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

/**
 * Get the default configuration for a tool based on its schema
 */
export function getDefaultToolConfig(parameters: any[]): Record<string, any> {
  const config: Record<string, any> = {}

  parameters.forEach((param) => {
    if (param.default !== undefined) {
      config[param.name] = param.default
    } else if (param.required) {
      // Set sensible defaults based on type
      switch (param.type) {
        case 'string':
          config[param.name] = ''
          break
        case 'number':
          config[param.name] = 0
          break
        case 'boolean':
          config[param.name] = false
          break
        case 'array':
          config[param.name] = []
          break
        case 'object':
          config[param.name] = {}
          break
      }
    }
  })

  return config
}

/**
 * Format an agent's configuration for display
 */
export function formatAgentConfig(agent: Agent): string {
  const config: Record<string, any> = { ...agent }

  // Remove internal fields
  const internalFields = ['id', 'createdAt', 'updatedAt', 'version']
  internalFields.forEach((field) => delete config[field])

  // Format the config as a readable string
  return Object.entries(config)
    .map(([key, value]) => {
      if (value === undefined || value === null) return ''
      if (Array.isArray(value) && value.length === 0) return ''
      if (typeof value === 'object' && Object.keys(value).length === 0)
        return ''

      let displayValue = value
      if (Array.isArray(value)) {
        displayValue = `[${value.join(', ')}]`
      } else if (typeof value === 'object') {
        displayValue = JSON.stringify(value, null, 2)
      }

      return `${key}: ${displayValue}`
    })
    .filter(Boolean)
    .join('\n')
}

/**
 * Get the estimated token count for an agent's configuration
 */
export function estimateTokenCount(agent: Agent): number {
  // This is a very rough estimate - in a real app, you'd want to use a proper tokenizer
  const configString = JSON.stringify(agent)
  return Math.ceil(configString.length / 4) // Roughly 4 chars per token
}

/**
 * Check if an agent is using a specific model
 */
export function isUsingModel(agent: Agent, modelId: string): boolean {
  return agent.type === 'llm' && (agent as LLMAgent).model === modelId
}

/**
 * Get the list of agent IDs referenced in a workflow
 */
export function getReferencedAgentIds(agent: Agent): string[] {
  if (agent.type === 'sequential' || agent.type === 'parallel') {
    return (agent as SequentialAgent | ParallelAgent).agents || []
  }
  return []
}

/**
 * Check if an agent is referenced by any workflows
 */
export function isAgentReferenced(
  agentId: string,
  allAgents: Agent[],
): boolean {
  return allAgents.some((agent) => {
    if (agent.type === 'sequential' || agent.type === 'parallel') {
      return (agent as SequentialAgent | ParallelAgent).agents.includes(agentId)
    }
    return false
  })
}

export const createNewAgentConfig = (
  type: AgentType,
  existingId?: string,
  existingName?: string,
): AnyAgentConfig => {
  const baseConfig = {
    id: existingId || crypto.randomUUID(),
    name: existingName || '',
  }

  switch (type) {
    case AgentType.LLM:
      return {
        ...baseConfig,
        type: AgentType.LLM,
        instruction: '',
        model: '', // Add model as per shared LlmAgentConfig
        code_execution: false,
        planning_enabled: false,
        tools: [],
      } as LlmAgentConfig
    case AgentType.Sequential:
      return {
        ...baseConfig,
        type: AgentType.Sequential,
        agents: [], // Will store AnyAgentConfig[]
      } as SequentialAgentConfig
    case AgentType.Parallel:
      return {
        ...baseConfig,
        type: AgentType.Parallel,
        agents: [], // Will store AnyAgentConfig[] (prop name in type is 'agents')
      } as ParallelAgentConfig
    case AgentType.Loop:
      // LoopAgentConfig expects an 'agent' property of type AnyAgentConfig.
      // For creation, it might be null or a placeholder initially.
      // Or, we find a default agent if applicable, otherwise it's an invalid state until one is selected.
      return {
        ...baseConfig,
        type: AgentType.Loop,
        // agent: undefined, // Or a default/placeholder if that makes sense
        // For now, let's assume it can be temporarily invalid until selected
      } as unknown as LoopAgentConfig // Cast needed if agent is not set initially
    default:
      // Adding a check to satisfy linters or type checkers that expect all paths to return a value,
      // even if logically unreachable due to AgentType enum constraints.
      // Or, if AgentType can be extended elsewhere, this provides a fallback.
      console.error(`Unhandled agent type: ${type}`)
      throw new Error(`Unknown agent type: ${type}`)
  }
}

// Moved from AgentListItem.tsx
import { AgentSummaryDTO } from '@/api/agentService'; // Importar AgentSummaryDTO

// Usar uma união de AgentType (do enum) e os tipos de string de AgentSummaryDTO.type
export type DisplayAgentType = AgentType | AgentSummaryDTO['type'];

export const agentTypeLabels: Record<DisplayAgentType, string> = {
  [AgentType.LLM]: 'LLM',
  [AgentType.SEQUENTIAL]: 'Sequential',
  [AgentType.PARALLEL]: 'Parallel',
  [AgentType.A2A]: 'A2A',
  [AgentType.LOOP]: 'Loop', // Adicionando Loop que estava no enum e pode ser usado internamente
  // Adicionar os novos tipos de AgentSummaryDTO que vêm do backend
  Workflow: 'Workflow',
  Custom: 'Custom',
};

// Moved from AgentListItem.tsx
export const getAgentTypeColor = (type: DisplayAgentType): string => {
  const colors: Record<DisplayAgentType, string> = {
    [AgentType.LLM]: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
    [AgentType.SEQUENTIAL]: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100',
    [AgentType.PARALLEL]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
    [AgentType.A2A]: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100',
    [AgentType.LOOP]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
    // Adicionar cores para os novos tipos de AgentSummaryDTO
    Workflow: 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-100',
    Custom: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-100',
  };
  return (
    colors[type] ||
    'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100'
  );
}
