import React from 'react';
import { ToolDTO, ToolType, ReturnTypeSchema, ToolParameterDTO } from '@/features/tools/types';

export interface ToolFormParameter {
  name: string;
  type: string;
  description?: string | null;
  default_value?: string | null;
  is_required: boolean;
}

export interface ToolFormValues {
  name: string;
  description?: string | null;
  tool_type: ToolType;
  api_endpoint?: string | null;
  return_type_schema_json?: string | null; // Store schema as JSON string for simplicity in placeholder
  parameters: ToolFormParameter[];
}

interface ToolFormProps {
  onSubmit: (values: ToolFormValues) => void | Promise<void>;
  initialData?: ToolDTO | null;
  isSubmitting?: boolean;
}

export const ToolForm: React.FC<ToolFormProps> = ({ onSubmit, initialData, isSubmitting }) => {
  // This is a placeholder. A real form would use react-hook-form or similar.
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission with initial or default data
    const placeholderValues: ToolFormValues = {
      name: initialData?.name || 'Nome Ferramenta Placeholder',
      description: initialData?.description || 'Descrição placeholder',
      tool_type: initialData?.tool_type || 'API', // Default to API or ensure initialData provides it
      api_endpoint: initialData?.api_endpoint || '',
      return_type_schema_json: initialData?.return_type_schema ? JSON.stringify(initialData.return_type_schema) : '',
      parameters: initialData?.parameters.map((p: ToolParameterDTO) => ({
        name: p.name,
        type: p.type,
        description: p.description,
        default_value: p.default_value,
        is_required: p.is_required,
      })) || [],
    };
    onSubmit(placeholderValues);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome da Ferramenta (Placeholder)</label>
        <input type="text" id="name" defaultValue={initialData?.name || ''} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
      </div>
      <p className="text-center text-gray-500">Este é um formulário placeholder.</p>
      <button 
        type="submit" 
        disabled={isSubmitting}
        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        {isSubmitting ? 'Salvando...' : (initialData ? 'Atualizar Ferramenta' : 'Criar Ferramenta')}
      </button>
    </form>
  );
};
