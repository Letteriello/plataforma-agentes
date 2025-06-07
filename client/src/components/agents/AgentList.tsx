import React from 'react';
import { AnyAgentConfig } from '@/types/agent'; // Ajuste o caminho
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AgentListProps {
  agents: AnyAgentConfig[];
  selectedAgentIds?: string[]; // IDs dos agentes já selecionados/marcados
  onAgentToggle?: (agentId: string) => void; // Função para marcar/desmarcar
  title?: string; // Título opcional para o card
  selectable?: boolean; // Indica se os checkboxes devem ser mostrados
}

const AgentList: React.FC<AgentListProps> = ({
  agents,
  selectedAgentIds = [],
  onAgentToggle,
  title = "Agentes Disponíveis",
  selectable = false,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {agents.length === 0 && <p className="text-sm text-muted-foreground">Nenhum agente encontrado.</p>}
        <div className="space-y-3">
          {agents.map((agent) => (
            <div
              key={agent.id}
              className={`flex items-center p-3 rounded-md border ${
                selectable && onAgentToggle ? 'cursor-pointer hover:bg-accent' : ''
              } ${selectedAgentIds.includes(agent.id) ? 'bg-accent' : ''}`}
              onClick={() => selectable && onAgentToggle && onAgentToggle(agent.id)}
            >
              {selectable && onAgentToggle && (
                <Checkbox
                  id={`agent-select-${agent.id}`}
                  checked={selectedAgentIds.includes(agent.id)}
                  onCheckedChange={() => onAgentToggle(agent.id)} // onCheckedChange espera um boolean ou 'indeterminate'
                  className="mr-3"
                  aria-labelledby={`agent-label-${agent.id}`}
                />
              )}
              <div className="flex-1">
                <Label htmlFor={selectable && onAgentToggle ? `agent-select-${agent.id}` : undefined} id={`agent-label-${agent.id}`} className="font-medium">
                  {agent.name || `Agente ${agent.id.substring(0, 6)}`}
                </Label>
                <p className="text-xs text-muted-foreground">{agent.type}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AgentList;
