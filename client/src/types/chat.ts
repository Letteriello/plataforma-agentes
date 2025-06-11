export interface Artifact {
  type: 'code' | 'table' | 'chart' | string
  language?: string
  content?: string
  data?: any
}

export interface ChatMessage {
  id: string
  text: string
  sender: 'user' | 'agent' | 'system'
  timestamp: string
  senderName?: string
  avatarSeed?: string
  type?: 'text' | 'agent_thought' | 'artifact' | string
  artifact?: Artifact
}

export interface Session {
  id: string
  agentId: string
  createdAt: string
}
