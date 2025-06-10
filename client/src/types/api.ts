export interface AgentDTO {
  id: string
  name: string
  description?: string
  type: string
}

export interface CreateAgentDTO {
  name: string
  description?: string
  type: string
}

export interface SecretDTO {
  name: string
  value: string
}
