import React from 'react';
import { Button } from "@/components/ui/button";
import { Plus, Wrench } from "lucide-react";
import { FormTool } from "@/types";
import ToolCard from "./ToolCard";

interface ToolListProps {
  tools: FormTool[];
  onAddTool: () => void;
  onEditTool: (index: number) => void;
  onDeleteTool: (index: number) => void;
}

/**
 * ToolList component displays a list of tools with options to add, edit, and delete.
 * It also shows an empty state when no tools are present.
 */
export const ToolList: React.FC<ToolListProps> = ({
  tools,
  onAddTool,
  onEditTool,
  onDeleteTool,
}) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-medium text-gray-900">Ferramentas do Agente</h2>
          <p className="mt-1 text-sm text-gray-500">
            Adicione ferramentas que este agente pode usar para realizar tarefas
          </p>
        </div>
      </div>
      
      {tools.length > 0 ? (
        <div className="divide-y divide-gray-200">
          {tools.map((tool, index) => (
            <ToolCard
              key={tool.id}
              tool={tool}
              onEdit={() => onEditTool(index)}
              onDelete={() => onDeleteTool(index)}
            />
          ))}
        </div>
      ) : (
        <div className="p-8 text-center">
          <Wrench className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhuma ferramenta adicionada</h3>
          <p className="mt-1 text-sm text-gray-500">Comece adicionando uma ferramenta ao seu agente.</p>
          <div className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onAddTool}
            >
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Ferramenta
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ToolList;
