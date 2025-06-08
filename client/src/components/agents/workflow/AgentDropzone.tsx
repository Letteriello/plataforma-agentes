import React from 'react';
import { AnyAgentConfig } from '@/types/agent'; // Ajuste o caminho se necessário
import SubAgentCard from './SubAgentCard';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
// CSS import não é necessário aqui se já estiver global ou no SubAgentCard

interface AgentDropzoneProps {
  subAgents: AnyAgentConfig[];
  onRemoveSubAgent?: (agentId: string) => void;
  onSubAgentsOrderChange?: (orderedAgents: AnyAgentConfig[]) => void;
  isOrderable?: boolean;
  // readOnly?: boolean;
  // parentAgentType?: AgentType.Sequential | AgentType.Parallel;
}

const AgentDropzone: React.FC<AgentDropzoneProps> = ({
  subAgents,
  onRemoveSubAgent,
  onSubAgentsOrderChange,
  isOrderable = false, // Default to false, meaning not orderable unless specified
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id && onSubAgentsOrderChange && isOrderable) {
      const oldIndex = subAgents.findIndex((agent) => agent.id === active.id);
      const newIndex = subAgents.findIndex((agent) => agent.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const newOrderedAgents = arrayMove(subAgents, oldIndex, newIndex);
        onSubAgentsOrderChange(newOrderedAgents);
      }
    }
  };

  const agentItems = subAgents.map(agent => agent.id);

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={agentItems} strategy={verticalListSortingStrategy} disabled={!isOrderable}>
        <div className="mt-4 p-4 border-2 border-dashed border-gray-300 rounded-lg min-h-[200px] bg-gray-50">
          <h4 className="text-lg font-semibold text-gray-700 mb-3">
            Sub-Agentes do Workflow
          </h4>
          {subAgents.length === 0 && (
            <div className="text-center text-gray-500">
              <p>Arraste e solte agentes aqui ou adicione usando o botão abaixo.</p>
              <p>(Funcionalidade de Drag & Drop e botão "Adicionar" serão implementados em breve)</p>
            </div>
          )}
          <div className="space-y-2 mt-4">
            {subAgents.map((agentConfig, idx) => (
              <SubAgentCard
                key={agentConfig.id} // Ensure unique key, agent.id is best
                agent={agentConfig}
                index={idx}
                onRemove={onRemoveSubAgent ? () => onRemoveSubAgent(agentConfig.id) : undefined}
                isDraggable={isOrderable}
              />
            ))}
          </div>
        </div>
      </SortableContext>
    </DndContext>
  );
};

export default AgentDropzone;
