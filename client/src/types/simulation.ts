export interface ChatMessage {
  id: string
  text: string
  sender: 'user' | 'agent'
  timestamp: string
}

export interface ReasoningStep {
  id: string
  thought: string
  observation?: string
  timestamp: string
}

export interface Scenario {
  id: string
  name: string
  description: string
  initialPrompt: string
}
