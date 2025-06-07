import React from 'react';
import { AnyAgentConfig } from '@/types/agent'; // Ajuste o caminho se necessário
import SubAgentCard from './SubAgentCard';

interface AgentDropzoneProps {
  subAgents: AnyAgentConfig[];
  onRemoveSubAgent?: (agentId: string) => void; // Adicionando prop para remover
  // onSubAgentsChange: (newSubAgents: AnyAgentConfig[]) => void; // Será usado depois
  // readOnly?: boolean; // Para visualização vs edição
  // parentAgentType?: AgentType.Sequential | AgentType.Parallel; // Para lógica condicional D&D
}

const AgentDropzone: React.FC<AgentDropzoneProps> = ({
  subAgents,
  onRemoveSubAgent,
  // onSubAgentsChange,
}) => {
  return (
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
            key={agentConfig.id || idx}
            agent={agentConfig}
            index={idx}
            onRemove={onRemoveSubAgent ? () => onRemoveSubAgent(agentConfig.id) : undefined}
            // onMove={() => {}} // Passar um handler real depois
          />
        ))}
      </div>
    </div>
  );
};

export default AgentDropzone;
