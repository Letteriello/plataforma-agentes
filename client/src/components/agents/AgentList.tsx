// client/src/components/agents/AgentList.tsx
import React from 'react';
import { AgentCard } from './AgentCard'; 
import { AgentCardData } from './types';

interface AgentListProps {
  agents: AgentCardData[]; // Array de dados dos agentes
  selectedAgentId: string | null;
  onAgentSelect: (agentId: string) => void; // Callback para quando um agente é selecionado
  className?: string;
}

export function AgentList({ agents, selectedAgentId, onAgentSelect, className }: AgentListProps) {
  if (!agents || agents.length === 0) {
    return (
      <div className={className}>
        <p className="text-muted-foreground">Nenhum agente para exibir.</p>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 ${className || ''}`}>
      {agents.map((agent) => (
        <AgentCard
          key={agent.id}
          agent={agent}
          onClick={onAgentSelect} // Passa a função de seleção para o card
          isSelected={agent.id === selectedAgentId} // Determina se este card está selecionado
        />
      ))}
    </div>
  );
}
