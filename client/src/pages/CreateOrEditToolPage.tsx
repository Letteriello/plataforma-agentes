import React, { useEffect, useState } from 'react';
import { useNavigate,useParams } from 'react-router-dom';

import { createTool, getToolById, Tool,updateTool } from '@/api/toolService';
import { ToolForm, ToolFormValues } from '@/components/tools/ToolForm';
import { LoadingSpinner } from '@/components/ui';
import { useToast } from '@/components/ui/use-toast';

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
    } catch {
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
