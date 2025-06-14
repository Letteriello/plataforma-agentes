// client/src/components/chat/types.ts

export interface Artifact {
  type: 'code' | 'table' | 'chart' | string
  language?: string
  content?: string
  data?: unknown
}

export interface ChatMessage {
  id: string
  text: string
  sender: 'user' | 'agent' | 'system'
  timestamp: string // Usaremos string por simplicidade inicial, pode ser Date para manipulações mais complexas
  senderName?: string // Para mensagens de agentes ou outros usuários (e.g., nome do agente)
  avatarSeed?: string // Para gerar avatares consistentes (e.g., seed para DiceBear)
  type?: 'text' | 'agent_thought' | 'artifact' | string
  artifact?: Artifact
}
