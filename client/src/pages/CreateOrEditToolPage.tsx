import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ToolForm, toolFormSchema, ToolFormValues } from '@/components/tools/ToolForm';
import { getToolById, createTool, updateTool, Tool } from '@/api/toolService';
import { useToast } from '@/components/ui/use-toast';
import { LoadingSpinner } from '@/components/ui';

const CreateOrEditToolPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [tool, setTool] = useState<Tool | null>(null);

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
    try {
      if (isEditing && tool) {
        await updateTool(tool.id, values as any); // Ajustar tipo se necessário
        toast({ title: 'Sucesso', description: 'Ferramenta atualizada.' });
      } else {
        await createTool(values as any); // Ajustar tipo se necessário
        toast({ title: 'Sucesso', description: 'Ferramenta criada.' });
      }
      navigate('/tools');
    } catch (error) {
      toast({ title: 'Erro', description: 'Falha ao salvar a ferramenta.', variant: 'destructive' });
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
