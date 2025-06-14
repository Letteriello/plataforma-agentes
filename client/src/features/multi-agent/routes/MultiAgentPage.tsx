import React from 'react'
import { useEffect,useState } from 'react'
import { Edge,Node } from 'reactflow'

import { AgentPalette } from '@/features/multi-agent/components/AgentPalette'
import { OrchestrationCanvas } from '@/features/orchestration/components/OrchestrationCanvas'
import { AvailableAgent } from '@/types/multi-agent'

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'input',
    data: { label: 'Início' },
    position: { x: 250, y: 5 },
  },
]

const initialEdges: Edge[] = []

export const MultiAgentPage: React.FC = () => {
  const [availableAgents, setAvailableAgents] = useState<AvailableAgent[]>([])

  // TODO: Fetch available agents from API
  useEffect(() => {
    // setAvailableAgents(fetchedAgents);
  }, [])
  return (
    <div className="p-6 h-full flex flex-col space-y-4">
      <div>
        <h2 className="text-2xl font-bold mb-2">Orquestração Multiagente</h2>
        <p className="text-muted-foreground">
          Crie e gerencie equipes de agentes que colaboram em fluxos de trabalho
          complexos.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 flex-grow">
        <div className="md:col-span-1">
          <AgentPalette availableAgents={availableAgents} />
        </div>
        <div className="md:col-span-3">
          <OrchestrationCanvas
            initialNodes={initialNodes}
            initialEdges={initialEdges}
          />
        </div>
      </div>
    </div>
  )
}

export default MultiAgentPage
