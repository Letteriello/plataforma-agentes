import React from 'react';
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { FormTool } from "@/types";

interface ToolCardProps {
  tool: FormTool;
  onEdit: () => void;
  onDelete: () => void;
}

/**
 * ToolCard component displays a single tool with its name, description, parameters,
 * and action buttons for editing and deleting.
 */
export const ToolCard: React.FC<ToolCardProps> = ({ tool, onEdit, onDelete }) => {
  return (
    <div className="p-4 hover:bg-gray-50 flex items-center justify-between">
      <div>
        <div className="font-medium text-gray-900">{tool.name}</div>
        {tool.description && (
          <p className="text-sm text-gray-500 mt-1">{tool.description}</p>
        )}
        <div className="mt-2 flex flex-wrap gap-2">
          {tool.parameters.map(param => (
            <span 
              key={`${tool.id}-${param.name}`}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
            >
              {param.name}: {param.type}
              {param.required && ' *'}
            </span>
          ))}
        </div>
      </div>
      <div className="flex space-x-2">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onEdit}
        >
          <Pencil className="h-4 w-4" />
          <span className="sr-only">Editar</span>
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="text-red-600 hover:text-red-700"
          onClick={onDelete}
        >
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Excluir</span>
        </Button>
      </div>
    </div>
  );
};

export default ToolCard;
