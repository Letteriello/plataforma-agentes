import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAgentStore } from '@/store/agentStore'
import { fetchAgents, deleteAgent } from '@/api/agentService' // This line was correct
import { agentsSelector, loadAgents } from '@/store/agentSelectors' // This line was correct
import { AgentDTO } from '@/types/api'

export interface UseAgentsReturn {
  agents: AgentDTO[] | undefined
  isLoading: boolean
  error: Error | null
  remove: (id: string) => Promise<void>
}

export const useAgents = (): UseAgentsReturn => {
  const { agents, loadAgents } = useAgentStore()
  const queryClient = useQueryClient()

  const { isLoading, error } = useQuery<AgentDTO[], Error>({
    queryKey: ['agents'],
    queryFn: async () => {
      const data = await fetchAgents()
      loadAgents(data as any)
      return data
    },
  })

  const { mutateAsync: remove, isLoading: removing } = useMutation({
    mutationFn: deleteAgent,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['agents'] }),
  })

  return {
    agents: agents as unknown as AgentDTO[],
    isLoading: isLoading || removing,
    error: error || null,
    remove,
  }
}

export default useAgents
