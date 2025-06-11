// client/src/constants/agentStatus.ts

export const AGENT_STATUS_ACTIVE = 'active' as const
export const AGENT_STATUS_PENDING = 'pending' as const
export const AGENT_STATUS_ERROR = 'error' as const
export const AGENT_STATUS_UNKNOWN = 'unknown' as const
export const AGENT_STATUS_DEPLOYING = 'deploying' as const
export const AGENT_STATUS_IDLE = 'idle' as const
export const AGENT_STATUS_DEFAULT = 'default' as const // Para o fallback em statusConfigMap

// Um objeto agrupando todos os status pode ser útil para iteração ou referência
export const AgentStatusConstants = {
  ACTIVE: AGENT_STATUS_ACTIVE,
  PENDING: AGENT_STATUS_PENDING,
  ERROR: AGENT_STATUS_ERROR,
  UNKNOWN: AGENT_STATUS_UNKNOWN,
  DEPLOYING: AGENT_STATUS_DEPLOYING,
  IDLE: AGENT_STATUS_IDLE,
  DEFAULT: AGENT_STATUS_DEFAULT,
}

// Poderíamos também exportar um array com os valores se for útil
export const AGENT_STATUS_VALUES = [
  AGENT_STATUS_ACTIVE,
  AGENT_STATUS_PENDING,
  AGENT_STATUS_ERROR,
  AGENT_STATUS_UNKNOWN,
  AGENT_STATUS_DEPLOYING,
  AGENT_STATUS_IDLE,
  AGENT_STATUS_DEFAULT,
] as const
