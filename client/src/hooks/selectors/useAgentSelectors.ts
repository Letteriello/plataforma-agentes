import { useAgentStore } from '@/store/agentStore'
import { AgentDTO } from '@/api/agentService'

export const useAgentsList = (): AgentDTO[] =>
  useAgentStore((state) => state.agents as unknown as AgentDTO[])

export const useActiveAgent = (): AgentDTO | null =>
  useAgentStore((state) => state.activeAgent as unknown as AgentDTO | null)
