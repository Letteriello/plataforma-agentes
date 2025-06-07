import React, { useState } from 'react';
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
  searchTerm?: string; // Nova prop para busca
}

const AgentList: React.FC<AgentListProps> = ({
  agents: agentsFromProps,
  selectedAgentIds = [],
  onAgentToggle,
  onAgentClick,
  title,
  selectable = false,
  activeAgentId,
  searchTerm = '', // Valor padrão para searchTerm
}) => {
  const agentsFromStore = useAgentStore((state: any) => state.agents);
  let displayAgents = agentsFromProps !== undefined ? agentsFromProps : agentsFromStore;

  // Filtra os agentes com base no searchTerm
  if (searchTerm && displayAgents) {
    displayAgents = displayAgents.filter((agent: AnyAgentConfig) =>
      agent.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
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
          {displayAgents.map((agent: AnyAgentConfig) => (
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
            >
              <Label className="flex-1 cursor-pointer select-none">
                {agent.name || `Agente ${agent.id}`}
              </Label>
              {selectable && (
                <Checkbox
                  checked={selectedAgentIds.includes(agent.id)}
                  onCheckedChange={() => onAgentToggle && onAgentToggle(agent.id)}
                  className="ml-2"
                />
              )}
              {!selectable && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-2 text-destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteAgent(agent.id);
                  }}
                  disabled={deletingAgentId === agent.id}
                >
                  <Trash2Icon className="w-4 h-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AgentList;
