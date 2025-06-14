import { ArrowLeft } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { ToolForm, ToolFormValues } from '@/components/tools/ToolForm';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { createTool } from '@/services/toolService';

export const NewToolPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values: ToolFormValues) => {
    setIsSubmitting(true);
    try {
      const apiHeaders = values.api_headers ? JSON.parse(values.api_headers) : undefined;
      
      const payload = {
        ...values,
        api_headers: apiHeaders,
      };

      await createTool(payload);

      toast({
        title: 'Sucesso!',
        description: 'A nova ferramenta foi criada com sucesso.',
      });
      navigate('/tools');
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível criar a ferramenta. Verifique os dados e tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 space-y-4">
      <div>
        <Button variant="ghost" onClick={() => navigate('/tools')} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para a lista de ferramentas
        </Button>
        <h2 className="text-3xl font-bold tracking-tight">Criar Nova Ferramenta</h2>
        <p className="text-muted-foreground">
          Defina os detalhes da sua nova ferramenta customizada.
        </p>
      </div>
      <div className="border rounded-lg p-6 bg-card">
        <ToolForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      </div>
    </div>
  );
};

export default NewToolPage;
