import { Loader2,Pencil, Play, Trash2 } from 'lucide-react';
import React from 'react';

import { AgentSummaryDTO } from '@/api/agentService'; // Mudar para AgentSummaryDTO
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
// Importar DisplayAgentType e as funções atualizadas
import { agentTypeLabels, DisplayAgentType,getAgentTypeColor } from '@/lib/agent-utils';

interface AgentListItemProps {
  agent: AgentSummaryDTO;
  onEdit: (id: string) => void;
  onRun: (id: string) => void;
  onDelete: (agent: AgentSummaryDTO) => void; // Changed to pass the whole agent object
  isDeleting: boolean;
}

const AgentListItemComponent: React.FC<AgentListItemProps> = ({
  agent,
  onEdit,
  onRun,
  onDelete,
  isDeleting,
}) => {
  // agent.type agora é do tipo AgentSummaryDTO['type'] que é compatível com DisplayAgentType
  const currentAgentType = agent.type as DisplayAgentType;

  return (
    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
      <div className="flex items-center space-x-4">
        <div className="flex-shrink-0">
          <div
            className={`h-10 w-10 rounded-full flex items-center justify-center ${getAgentTypeColor(currentAgentType)}`}
          >
            {agent.name.charAt(0).toUpperCase()}
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center space-x-2">
            <h3 className="text-sm font-medium truncate">{agent.name}</h3>
            <Badge variant="outline" className={getAgentTypeColor(currentAgentType)}>
              {agentTypeLabels[currentAgentType] || 'Unknown Type'} {/* Adicionar fallback */}
            </Badge>
            {/* Removido o badge de 'Private' pois agent.isPublic não está em AgentSummaryDTO */}
            {/* 
            {!agent.isPublic && ( // Este campo não existe em AgentSummaryDTO
              <Badge
                variant="outline"
                className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
              >
                Private
              </Badge>
            )} 
            */}
          </div>
          <p className="text-sm text-muted-foreground truncate">
            {agent.description || 'No description provided'}
          </p>
        </div>
      </div>
      {/* Botões de ação permanecem os mesmos */}
      <div className="flex items-center space-x-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onRun(agent.id)}
              >
                <Play className="h-4 w-4" />
                <span className="sr-only">Run</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Run agent</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEdit(agent.id)}
              >
                <Pencil className="h-4 w-4" />
                <span className="sr-only">Edit</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Edit agent</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-destructive hover:text-destructive/90"
                onClick={() => onDelete(agent)}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
                <span className="sr-only">Delete</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Delete agent</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export const AgentListItem = React.memo(AgentListItemComponent);
// Ensure AgentType is imported from '@/types/agents' in the actual file.
