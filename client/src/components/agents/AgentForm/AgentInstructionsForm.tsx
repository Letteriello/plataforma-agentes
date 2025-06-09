import React from 'react';
import { Button } from '@/components/ui/button';

interface AgentInstructionsFormProps {
  instructions: string;
  onEditInstructions: () => void;
}

const AgentInstructionsForm: React.FC<AgentInstructionsFormProps> = ({
  instructions,
  onEditInstructions,
}) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-gray-900">Instruções</h2>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onEditInstructions}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          Editar
        </Button>
      </div>
      <div
        onClick={onEditInstructions}
        className="p-4 bg-gray-50 rounded-md border border-gray-200 min-h-[120px] cursor-text hover:bg-gray-100 transition-colors whitespace-pre-wrap"
      >
        {instructions || (
          <p className="text-gray-400 italic">Clique para adicionar instruções para o agente</p>
        )}
      </div>
    </div>
  );
};

export default AgentInstructionsForm;
