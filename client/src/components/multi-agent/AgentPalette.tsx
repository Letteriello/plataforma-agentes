import React from 'react'

import { AvailableAgent } from '@/types/multi-agent'

interface AgentPaletteProps {
  availableAgents: AvailableAgent[]
}

export const AgentPalette: React.FC<AgentPaletteProps> = ({
  availableAgents,
}) => {
  const onDragStart = (
    event: React.DragEvent,
    nodeType: string,
    agentId: string,
  ) => {
    event.dataTransfer.setData('application/reactflow', nodeType)
    event.dataTransfer.setData('agentId', agentId)
    event.dataTransfer.effectAllowed = 'move'
  }

  return (
    <div className="border rounded-lg p-4 h-full">
      <h3 className="font-semibold mb-4">Agentes Disponíveis</h3>
      <div className="space-y-2">
        {availableAgents.map((agent) => (
          <div
            key={agent.id}
            className="p-2 border rounded cursor-move bg-card hover:bg-muted"
            onDragStart={(event) => onDragStart(event, 'default', agent.id)}
            draggable
          >
            <div className="font-bold">{agent.name}</div>
            <p className="text-xs text-muted-foreground">{agent.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
