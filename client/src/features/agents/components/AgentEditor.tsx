import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { ComponentSkeleton } from '@/components/ui/component-skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import agentService from '@/features/agents/services/agentService';
import {
  createDefaultAgent,
  LlmAgentConfigSchema,
  type LlmAgentConfig,
} from '@/types/agents';

import { AdvancedAgentForm } from './forms/AdvancedAgentForm';
import AgentMemoryTab from './forms/AgentMemoryTab';
import AgentToolsTab from './forms/AgentToolsTab';
import { IdentityForm } from './forms/IdentityForm';
import { InstructionsForm } from './forms/InstructionsForm';
import { LLMAgentForm } from './forms/LLMAgentForm';

interface AgentEditorProps {
  isWizardMode?: boolean;
}

export function AgentEditor({ isWizardMode = false }: AgentEditorProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(!!id);
  const [activeTab, setActiveTab] = useState('identidade');

  const formMethods = useForm<LlmAgentConfig>({
    resolver: zodResolver(LlmAgentConfigSchema),
    defaultValues: createDefaultAgent(),
  });

  const { control, handleSubmit, reset } = formMethods;

  const WIZARD_STEPS = [
    'identidade',
    'instrucoes',
    'modelo_geracao',
    'ferramentas',
    'avancado',
    'memoria',
  ];
  const currentStepIndex = WIZARD_STEPS.indexOf(activeTab);

  useEffect(() => {
    if (id) {
      setIsLoading(true);
      agentService
        .getAgentById(id)
        .then((data) => {
          const parsedData = LlmAgentConfigSchema.parse(data);
          reset(parsedData);
        })
        .catch(() =>
          toast({
            variant: 'destructive',
            title: 'Erro ao carregar o agente',
          })
        )
        .finally(() => setIsLoading(false));
    }
  }, [id, reset, toast]);

  const handleTabChange = (newTab: string) => {
    if (!isWizardMode) {
      setActiveTab(newTab);
    }
  };

  const handleNextStep = () => {
    if (currentStepIndex < WIZARD_STEPS.length - 1) {
      setActiveTab(WIZARD_STEPS[currentStepIndex + 1]);
    }
  };

  const handlePreviousStep = () => {
    if (currentStepIndex > 0) {
      setActiveTab(WIZARD_STEPS[currentStepIndex - 1]);
    }
  };

  const handleCancel = () => navigate('/agents');

  const onSubmit = async (data: LlmAgentConfig) => {
    try {
      setIsSubmitting(true);
      if (id) {
        await agentService.updateAgent(id, data);
        toast({ title: 'Agente atualizado com sucesso!' });
      } else {
        await agentService.createAgent(data);
        toast({ title: 'Agente criado com sucesso!' });
      }
      navigate('/agents');
    } catch {

      toast({ variant: 'destructive', title: 'Erro ao salvar o agente' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <ComponentSkeleton />;
  }

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={handleSubmit(onSubmit)} className="p-6">
        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="identidade">Identidade</TabsTrigger>
            <TabsTrigger value="instrucoes">Instruções</TabsTrigger>
            <TabsTrigger value="modelo_geracao">Modelo & Geração</TabsTrigger>
            <TabsTrigger value="ferramentas">Ferramentas</TabsTrigger>
            <TabsTrigger value="avancado">Avançado</TabsTrigger>
            <TabsTrigger value="memoria">Memória</TabsTrigger>
          </TabsList>

          <TabsContent value="identidade" forceMount>
            <IdentityForm control={control} />
          </TabsContent>

          <TabsContent value="instrucoes" forceMount>
            <InstructionsForm control={control} />
          </TabsContent>

          <TabsContent value="modelo_geracao" forceMount>
            <LLMAgentForm disabled={isSubmitting} isWizardMode={isWizardMode} />
          </TabsContent>

          <TabsContent value="ferramentas" forceMount>
            <AgentToolsTab agentId={id} isWizardMode={isWizardMode} />
          </TabsContent>

          <TabsContent value="avancado" forceMount>
            <AdvancedAgentForm />
          </TabsContent>

          <TabsContent value="memoria" forceMount>
            <AgentMemoryTab />
          </TabsContent>
        </Tabs>

        <div className="flex justify-between items-center mt-8 pt-6 border-t">
          <div>
            {isWizardMode && (
              <Button
                type="button"
                variant="outline"
                onClick={handlePreviousStep}
                disabled={currentStepIndex === 0 || isSubmitting}
                className={currentStepIndex === 0 ? 'invisible' : ''}
              >
                Anterior
              </Button>
            )}
          </div>
          <div className="space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            {isWizardMode ? (
              currentStepIndex === WIZARD_STEPS.length - 1 ? (
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Criando...' : 'Criar Agente'}
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleNextStep}
                  disabled={isSubmitting}
                >
                  Próximo
                </Button>
              )
            ) : (
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
              </Button>
            )}
          </div>
        </div>
      </form>
    </FormProvider>
  );
}
