import { Node, Edge } from 'reactflow'

// Represents an agent available to be added to a team
export interface AvailableAgent {
  id: string
  name: string
  description: string
}

// Represents a team of collaborating agents
export interface AgentTeam {
  id: string
  name: string
  description: string
  nodes: Node[]
  edges: Edge[]
}
