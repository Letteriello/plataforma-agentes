import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { deleteAgent, fetchAgents } from '@/api/agentService'
import { AgentSummaryDTO } from '@/api/agentService'
import type { AnyAgentConfig } from '@/types/agents'
import { useAgentStore } from '@/store/agentStore'

export interface UseAgentsReturn {
  agents: AgentSummaryDTO[] | undefined
  isLoading: boolean
  error: Error | null
  remove: (id: string) => Promise<void>
}

export const useAgents = (): UseAgentsReturn => {
  const { agents, loadAgents } = useAgentStore()
  const queryClient = useQueryClient()

  const { isLoading, error } = useQuery<AgentSummaryDTO[], Error>({
    queryKey: ['agents'],
    queryFn: async () => {
      const data = await fetchAgents()
      loadAgents(data as unknown as AnyAgentConfig[])
      return data
    },
  })

  const { mutateAsync: remove, isLoading: removing } = useMutation({
    mutationFn: deleteAgent,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['agents'] }),
  })

  return {
    agents: agents as unknown as AgentSummaryDTO[],
    isLoading: isLoading || removing,
    error: error || null,
    remove,
  }
}

export default useAgents
