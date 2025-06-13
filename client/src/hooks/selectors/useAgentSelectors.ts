import { AgentDTO } from '@/api/agentService'
import { useAgentStore } from '@/store/agentStore'

export const useAgentsList = (): AgentDTO[] =>
  useAgentStore((state) => state.agents as unknown as AgentDTO[])

export const useActiveAgent = (): AgentDTO | null =>
  useAgentStore((state) => state.activeAgent as unknown as AgentDTO | null)
