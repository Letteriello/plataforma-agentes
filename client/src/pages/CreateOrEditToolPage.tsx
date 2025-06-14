import React, { useEffect, useState } from 'react';
import { useNavigate,useParams } from 'react-router-dom';

import { createTool, getToolById, type ToolDTO as Tool, updateTool } from '@/features/tools/services/toolService';
import { ToolForm, ToolFormValues } from '@/features/tools/components/ToolForm';
import type { CreateToolDTO, UpdateToolDTO, ReturnTypeSchema, ToolParameterCreateDTO } from '@/features/tools/types';
import { LoadingSpinner } from '@/components/ui';
import { useToast } from '@/components/ui/use-toast';

const CreateOrEditToolPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [tool, setTool] = useState<Tool | null>(null); // Tool aqui é ToolDTO por causa do alias na importação

  const isEditing = !!id;

  useEffect(() => {
    if (isEditing) {
      setIsLoading(true);
      getToolById(id)
        .then(data => {
          setTool(data);
        })
        .catch(() => {
          toast({ title: 'Erro', description: 'Ferramenta não encontrada.', variant: 'destructive' });
          navigate('/tools');
        })
        .finally(() => setIsLoading(false));
    }
  }, [id, isEditing, navigate, toast]);

  const handleSubmit = async (values: ToolFormValues) => {
    setIsLoading(true);
    try {
      if (isEditing && tool) {
        let parsedSchema: ReturnTypeSchema | null = null;
        if (values.return_type_schema_json) {
          try {
            parsedSchema = JSON.parse(values.return_type_schema_json);
          } catch (error) {
            console.error('Erro ao parsear return_type_schema_json:', error);
            toast({ title: 'Erro de Formato', description: 'O JSON do esquema de retorno é inválido.', variant: 'destructive' });
            setIsLoading(false);
            return;
          }
        }
        const payload: UpdateToolDTO = {
          name: values.name,
          description: values.description,
          tool_type: values.tool_type,
          api_endpoint: values.api_endpoint,
          return_type_schema: parsedSchema,
          parameters: values.parameters.map(p => ({
            name: p.name,
            type: p.type,
            description: p.description,
            default_value: p.default_value,
            is_required: p.is_required,
          } as ToolParameterCreateDTO)),
        };
        await updateTool(tool.id, payload);
        toast({ title: 'Sucesso', description: 'Ferramenta atualizada.' });
      } else {
        let parsedSchema: ReturnTypeSchema | null = null;
        if (values.return_type_schema_json) {
          try {
            parsedSchema = JSON.parse(values.return_type_schema_json);
          } catch (error) {
            console.error('Erro ao parsear return_type_schema_json:', error);
            toast({ title: 'Erro de Formato', description: 'O JSON do esquema de retorno é inválido.', variant: 'destructive' });
            setIsLoading(false);
            return;
          }
        }
        const payload: CreateToolDTO = {
          name: values.name,
          description: values.description,
          tool_type: values.tool_type,
          api_endpoint: values.api_endpoint,
          return_type_schema: parsedSchema,
          parameters: values.parameters.map(p => ({
            name: p.name,
            type: p.type,
            description: p.description,
            default_value: p.default_value,
            is_required: p.is_required,
          } as ToolParameterCreateDTO)),
        };
        await createTool(payload);
        toast({ title: 'Sucesso', description: 'Ferramenta criada.' });
      }
      navigate('/tools');
    } catch (error) {
      console.error('Falha ao salvar a ferramenta:', error);
      toast({ title: 'Erro', description: 'Falha ao salvar a ferramenta.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner className="mt-24" />;
  }

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold tracking-tight mb-4">
        {isEditing ? 'Editar Ferramenta' : 'Criar Nova Ferramenta'}
      </h2>
      <ToolForm 
        onSubmit={handleSubmit} 
        initialData={tool} 
        isSubmitting={isLoading} 
      />
    </div>
  );
};

export default CreateOrEditToolPage;
