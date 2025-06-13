import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AgentEditor } from '@/components/agents/AgentEditor';
import { fetchAgentById, createAgent, updateAgent } from '@/api/agentService';
import { useToast } from '@/components/ui/use-toast';
import { LoadingSpinner } from '@/components/ui';
import { LlmAgentConfig } from '@/types/agents';

const CreateOrEditAgentPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [agent, setAgent] = useState<LlmAgentConfig | null>(null);

  const isEditing = !!id;

  useEffect(() => {
    if (isEditing) {
      setIsLoading(true);
      fetchAgentById(id)
        .then(data => {
          setAgent(data);
        })
        .catch(() => {
          toast({ title: 'Erro', description: 'Agente não encontrado.', variant: 'destructive' });
          navigate('/agents');
        })
        .finally(() => setIsLoading(false));
    }
  }, [id, isEditing, navigate, toast]);

  const handleSubmit = async (values: LlmAgentConfig) => {
    try {
      if (isEditing && agent) {
        await updateAgent(agent.id, values);
        toast({ title: 'Sucesso', description: 'Agente atualizado.' });
      } else {
        await createAgent(values);
        toast({ title: 'Sucesso', description: 'Agente criado.' });
      }
      navigate('/agents');
    } catch (error) {
      toast({ title: 'Erro', description: 'Falha ao salvar o agente.', variant: 'destructive' });
    }
  };

  if (isLoading && isEditing) {
    return <LoadingSpinner className="mt-24" />;
  }

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold tracking-tight mb-4">
        {isEditing ? 'Editar Agente' : 'Criar Novo Agente'}
      </h2>
      <AgentEditor 
        onSubmit={handleSubmit} 
        initialData={agent} 
      />
    </div>
  );
};

export default CreateOrEditAgentPage;
