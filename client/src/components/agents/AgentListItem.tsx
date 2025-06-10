import { Agent, AgentType } from '@/types/agents'; // Or the correct path to Agent type
import { Badge } from '@/components/ui/badge'; // and other UI components
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Play, Pencil, Trash2, Loader2 } from 'lucide-react';
import React from 'react'; // Import React

// Define agentTypeLabels or import from AgentsDashboard if it's not too complex
const agentTypeLabels: Record<AgentType, string> = { // Assuming AgentType is available
  llm: 'LLM',
  sequential: 'Sequential',
  parallel: 'Parallel',
  a2a: 'A2A',
};

// Define getAgentTypeColor or import from AgentsDashboard
 const getAgentTypeColor = (type: AgentType) => { // Assuming AgentType is available
   const colors = {
     llm: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
     sequential: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100',
     parallel: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
     a2a: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100',
   };
   return colors[type] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100';
 };

interface AgentListItemProps {
  agent: Agent;
  onEdit: (id: string) => void;
  onRun: (id: string) => void;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

const AgentListItemComponent: React.FC<AgentListItemProps> = ({ agent, onEdit, onRun, onDelete, isDeleting }) => {
  return (
    <div
      className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
    >
      <div className="flex items-center space-x-4">
        <div className="flex-shrink-0">
          <div className={`h-10 w-10 rounded-full flex items-center justify-center ${getAgentTypeColor(agent.type)}`}>
            {agent.name.charAt(0).toUpperCase()}
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center space-x-2">
            <h3 className="text-sm font-medium truncate">
              {agent.name}
            </h3>
            <Badge variant="outline" className={getAgentTypeColor(agent.type)}>
              {agentTypeLabels[agent.type]}
            </Badge>
            {!agent.isPublic && (
              <Badge variant="outline" className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200">
                Private
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground truncate">
            {agent.description || 'No description provided'}
          </p>
        </div>
      </div>
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
                onClick={() => onDelete(agent.id)}
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
