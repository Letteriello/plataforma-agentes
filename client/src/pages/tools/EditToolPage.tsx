import { ArrowLeft } from 'lucide-react';
import React, { useEffect,useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { ToolForm, ToolFormValues } from '@/components/tools/ToolForm';
import { LoadingSpinner } from '@/components/ui';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { getToolById, Tool,updateTool } from '@/api/toolService';

export const EditToolPage: React.FC = () => {
  const { toolId } = useParams<{ toolId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [initialData, setInitialData] = useState<Tool | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!toolId) {
      navigate('/tools');
      return;
    }

    const fetchTool = async () => {
      try {
        setIsLoading(true);
        const tool = await getToolById(toolId);
        setInitialData(tool);
      } catch (err) {
        setError('Não foi possível carregar a ferramenta para edição.');
        toast({
          title: 'Erro',
          description: 'A ferramenta solicitada não foi encontrada.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchTool();
  }, [toolId, navigate, toast]);

  const handleSubmit = async (values: ToolFormValues) => {
    if (!toolId) return;

    setIsSubmitting(true);
    try {
      const apiHeaders = values.api_headers ? JSON.parse(values.api_headers) : undefined;
      const payload = {
        ...values,
        api_headers: apiHeaders,
      };

      await updateTool(toolId, payload);

      toast({
        title: 'Sucesso!',
        description: 'A ferramenta foi atualizada com sucesso.',
      });
      navigate('/tools');
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar a ferramenta. Verifique os dados e tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-destructive">
        <p>{error}</p>
        <Button variant="outline" onClick={() => navigate('/tools')} className="mt-4">
          Voltar para a lista
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4">
      <div>
        <Button variant="ghost" onClick={() => navigate('/tools')} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para a lista de ferramentas
        </Button>
        <h2 className="text-3xl font-bold tracking-tight">Editar Ferramenta</h2>
        <p className="text-muted-foreground">
          Modifique os detalhes da sua ferramenta customizada.
        </p>
      </div>
      <div className="border rounded-lg p-6 bg-card">
        <ToolForm
          onSubmit={handleSubmit}
          initialData={initialData}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
};

export default EditToolPage;
