import React, { useState } from 'react';
import React from 'react';
import { AnyAgentConfig } from '@/types/agent'; // Ajuste o caminho
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAgentStore } from '@/store/agentStore'; // Ajuste o caminho
import { Button } from '@/components/ui/button';
import { Trash2Icon } from 'lucide-react';
import { deleteAgent } from '@/api/agentService';

interface AgentListProps {
  agents?: AnyAgentConfig[]; // Tornar opcional
  selectedAgentIds?: string[];
  onAgentToggle?: (agentId: string) => void;
  onAgentClick?: (agent: AnyAgentConfig) => void; // Nova prop
  title?: string;
  selectable?: boolean;
  activeAgentId?: string | null; // Nova prop
}

const AgentList: React.FC<AgentListProps> = ({
  agents: agentsFromProps,
  selectedAgentIds = [],
  onAgentToggle,
  onAgentClick,
  title,
  selectable = false,
  activeAgentId,
}) => {
  const agentsFromStore = useAgentStore((state) => state.agents);
  const displayAgents = agentsFromProps !== undefined ? agentsFromProps : agentsFromStore;
  const currentTitle = title || (agentsFromProps ? "Selecione os Agentes" : "Meus Agentes");
  const [deletingAgentId, setDeletingAgentId] = useState<string | null>(null);

  const handleDeleteAgent = async (agentId: string) => {
    // Opcional: Adicionar diálogo de confirmação aqui
    // if (!confirm(`Tem certeza que deseja deletar o agente ${agentId}?`)) return;

    setDeletingAgentId(agentId);
    try {
      await deleteAgent(agentId);
      console.log('Agente deletado com sucesso (da UI):', agentId);
      // O store será atualizado, e AgentList re-renderizará
    } catch (error) {
      console.error('Falha ao deletar o agente (da UI):', error);
      // (Futuro: mostrar toast de erro)
    } finally {
      setDeletingAgentId(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{currentTitle}</CardTitle>
      </CardHeader>
      <CardContent>
        {displayAgents.length === 0 && <p className="text-sm text-muted-foreground">Nenhum agente encontrado.</p>}
        <div className="space-y-3">
          {displayAgents.map((agent) => (

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
              } ${!selectable && onAgentClick ? 'cursor-pointer hover:bg-accent' : ''}
              ${selectedAgentIds.includes(agent.id) ? 'bg-accent ring-2 ring-primary' : ''}
              ${activeAgentId === agent.id && !selectable ? 'bg-primary/10 border-primary ring-2 ring-primary' : ''}
              `}
              onClick={() => {
                if (selectable && onAgentToggle) {
                  onAgentToggle(agent.id);
                } else if (!selectable && onAgentClick) {
                  onAgentClick(agent);
                }
              }}
              } ${selectedAgentIds.includes(agent.id) ? 'bg-accent' : ''}`}
              onClick={() => selectable && onAgentToggle && onAgentToggle(agent.id)}
            >
              {selectable && onAgentToggle && (
                <Checkbox
                  id={`agent-select-${agent.id}`}
                  checked={selectedAgentIds.includes(agent.id)}
                  onCheckedChange={() => onAgentToggle(agent.id)}
                  onCheckedChange={() => onAgentToggle(agent.id)} // onCheckedChange espera um boolean ou 'indeterminate'
                  className="mr-3"
                  aria-labelledby={`agent-label-${agent.id}`}
                />
              )}
              <div className="flex-1">
                <Label
                  htmlFor={selectable && onAgentToggle ? `agent-select-${agent.id}` : undefined}
                  id={`agent-label-${agent.id}`}
                  className={`font-medium ${!selectable && onAgentClick ? 'cursor-pointer' : ''}`}
                >
                  {agent.name || `Agente ${agent.id.substring(0, 6)}`}
                </Label>
                <p className={`text-xs text-muted-foreground ${!selectable && onAgentClick ? 'cursor-pointer' : ''}`}>
                  {agent.type}
                </p>
              </div>
              {!selectable && onAgentClick && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteAgent(agent.id);
                  }}
                  disabled={deletingAgentId === agent.id}
                  className="ml-auto"
                  aria-label={`Deletar agente ${agent.name}`}
                >
                  {deletingAgentId === agent.id ? (
                    <span className="animate-spin text-xs">⏳</span>
                  ) : (
                    <Trash2Icon className="h-4 w-4 text-red-500 hover:text-red-700" />
                  )}
                </Button>
              )}
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
