import React from 'react';
import { AnyAgentConfig, AgentType } from '@/types/agent'; // Ajuste o caminho se necessário
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'; // Shadcn card
import { Button } from '@/components/ui/button';
import { GripVerticalIcon, Trash2Icon } from 'lucide-react'; // Para D&D e remoção
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface SubAgentCardProps {
  agent: AnyAgentConfig;
  index: number; // Para futuras implementações de D&D e key
  onRemove?: (agentId: string) => void; // Para remover o sub-agente
  isDraggable?: boolean;
}

const SubAgentCard: React.FC<SubAgentCardProps> = ({
  agent,
  index,
  onRemove,
  isDraggable = true, // Default to true, can be controlled by parent
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: agent.id, disabled: !isDraggable });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.7 : 1,
    zIndex: isDragging ? 100 : 'auto',
  };

  const handleRemove = () => {
    if (onRemove) {
      onRemove(agent.id);
    } else {
      console.log("Remover (não implementado):", agent.id);
    }
  };

  const getAgentTypeDetails = (type: AgentType) => {
    switch (type) {
      case AgentType.LLM:
        return { icon: '🤖', color: 'bg-blue-100', label: 'LLM Agent' };
      case AgentType.Sequential:
        return { icon: '→', color: 'bg-green-100', label: 'Sequential' };
      case AgentType.Parallel:
        return { icon: '||', color: 'bg-yellow-100', label: 'Parallel' };
      default:
        return { icon: '⚙️', color: 'bg-gray-100', label: type };
    }
  };

  const typeDetails = getAgentTypeDetails(agent.type);

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`mb-3 shadow-md hover:shadow-lg transition-shadow duration-200 ${typeDetails.color} ${isDragging ? 'ring-2 ring-primary' : ''}`}
    >
      <CardHeader className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              {...attributes}
              {...listeners}
              className={`cursor-grab p-1 ${!isDraggable ? 'cursor-not-allowed' : ''}`}
              disabled={!isDraggable}
              aria-label="Mover sub-agente"
            >
              <GripVerticalIcon className="h-5 w-5 text-gray-400" />
            </button>
            <div>
              <CardTitle className="text-base font-semibold">{agent.name || `Sub-Agente ${index + 1}`}</CardTitle>
              <CardDescription className="text-xs">{typeDetails.label}</CardDescription>
            </div>
          </div>
          {onRemove && (
            <Button variant="ghost" size="icon" onClick={handleRemove} aria-label="Remover sub-agente">
              <Trash2Icon className="h-4 w-4 text-red-500 hover:text-red-700" />
            </Button>
          )}
        </div>
      </CardHeader>
      {/* Poderíamos adicionar CardContent ou CardFooter se precisarmos de mais detalhes no futuro */}
    </Card>
  );
};

export default SubAgentCard;
