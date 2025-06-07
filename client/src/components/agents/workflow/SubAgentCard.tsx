import React from 'react';
import { AnyAgentConfig, AgentType } from '@/types/agent'; // Ajuste o caminho se necessário
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'; // Shadcn card
import { Button } from '@/components/ui/button';
import { GripVerticalIcon, Trash2Icon } from 'lucide-react'; // Para D&D e remoção

interface SubAgentCardProps {
  agent: AnyAgentConfig;
  index: number; // Para futuras implementações de D&D e key
  // onMove?: (dragIndex: number, hoverIndex: number) => void; // Para D&D
  onRemove?: (agentId: string) => void; // Para remover o sub-agente
  // readOnly?: boolean;
}

const SubAgentCard: React.FC<SubAgentCardProps> = ({
  agent,
  index,
  onRemove,
}) => {
  const handleRemove = () => {
    if (onRemove) {
      onRemove(agent.id);
    } else {
      console.log("Remover (não implementado):", agent.id);
    }
  };

  // Simples mapeamento de tipo para um ícone ou cor (pode ser expandido)
  const getAgentTypeDetails = (type: AgentType) => {
    switch (type) {
      case AgentType.LLM:
        return { icon: '🤖', color: 'bg-blue-100', label: 'LLM Agent' };
      case AgentType.Sequential:
        return { icon: '→', color: 'bg-green-100', label: 'Sequential' }; // Ícone de seta
      case AgentType.Parallel:
        return { icon: '||', color: 'bg-yellow-100', label: 'Parallel' }; // Ícone de paralelo
      default:
        return { icon: '⚙️', color: 'bg-gray-100', label: type };
    }
  };

  const typeDetails = getAgentTypeDetails(agent.type);

  return (
    <Card className={`mb-3 shadow-md hover:shadow-lg transition-shadow duration-200 ${typeDetails.color}`}>
      <CardHeader className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <GripVerticalIcon className="h-5 w-5 text-gray-400 cursor-grab" /> {/* Handle para D&D */}
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
