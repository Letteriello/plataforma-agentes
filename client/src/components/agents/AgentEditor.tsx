import { useState, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';

import { LLMAgentForm } from './forms/LLMAgentForm';
import AgentToolsTab from './forms/AgentToolsTab';
import { BaseAgentForm } from './forms/BaseAgentForm';
import agentService from '@/api/agentService';
import type { LlmAgentConfig } from '@/types/agents';
import { LlmAgentConfigSchema, createDefaultAgent } from '@/types/agents';
import { ComponentSkeleton } from '@/components/ui/component-skeleton';
import AgentMemoryTab from './forms/AgentMemoryTab';

interface AgentEditorProps {
  isWizardMode?: boolean;
}

export function AgentEditor({
  isWizardMode = false,
}: AgentEditorProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const formMethods = useFormContext<LlmAgentConfig>();

  const [agentData, setAgentData] = useState<LlmAgentConfig>(createDefaultAgent());
  const [isLoading, setIsLoading] = useState(true);
  const [mode, setMode] = useState<'create' | 'edit'>('create');
  const [activeTab, setActiveTab] = useState('identidade');

  const WIZARD_STEPS = [
    'identidade',
    'instrucoes',
    'modelo_geracao',
    'ferramentas',
    'memoria',
  ];
  const STEP_LABELS: { [key: string]: string } = {
    identidade: 'Identidade',
    instrucoes: 'Instruções',
    modelo_geracao: 'Modelo & Geração',
    ferramentas: 'Ferramentas',
    memoria: 'Memória',
  };

  const currentStepIndex = WIZARD_STEPS.indexOf(activeTab);

  useEffect(() => {
    if (id) {
      setMode('edit');
      setIsLoading(true);
      agentService
        .fetchAgentById(id)
        .then((data) => {
          setAgentData(data);
        })
        .catch((error) => {
          console.error('Failed to fetch agent:', error);
          toast({
            title: 'Erro ao carregar agente',
            description: 'Não foi possível encontrar o agente solicitado.',
            variant: 'destructive',
          });
          navigate('/agents');
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setMode('create');
      setAgentData(createDefaultAgent());
      setIsLoading(false);
    }
  }, [id, navigate, toast]);

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

  const handleCancel = () => {
    navigate('/agents');
  };

  const onSubmit = async (formData: LlmAgentConfig) => {
    setIsLoading(true);

    const payload: LlmAgentConfig = {
      ...formData,
      tools: formData.tools || [],
      knowledgeBaseIds: formData.knowledgeBaseIds || [],
    };

    try {
      if (mode === 'create') {
        const newAgent = await agentService.createAgent(payload);
        toast({
          title: 'Agente criado com sucesso!',
          description: `O agente "${newAgent.name}" foi criado.`,
        });
        navigate(`/agents/edit/${newAgent.id}`);
      } else if (id) {
        const updatedAgent = await agentService.updateAgent(id, payload);
        toast({
          title: 'Agente atualizado com sucesso!',
          description: `As alterações em "${updatedAgent.name}" foram salvas.`,
        });
      }
    } catch (error) {
      console.error('Failed to save agent:', error);
      toast({
        title: 'Erro ao salvar agente',
        description: 'Ocorreu um erro ao tentar salvar o agente. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <ComponentSkeleton />; // Show a loading skeleton
  }

  return (
    <div className="flex flex-col h-full">
      <header className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">
          {mode === 'create' ? 'Criar Novo Agente' : 'Editar Agente'}
        </h1>
        <p className="text-muted-foreground">
          {isWizardMode
            ? `Passo ${currentStepIndex + 1} de ${WIZARD_STEPS.length}: ${STEP_LABELS[activeTab]}`
            : 'Configure os detalhes do seu agente.'}
        </p>
      </header>

      <BaseAgentForm
        schema={LlmAgentConfigSchema}
        onSubmit={onSubmit}
        onCancel={handleCancel}
        defaultValues={agentData}
      >
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-grow">
          {!isWizardMode && (
            <TabsList>
              <TabsTrigger value="identidade">Identidade</TabsTrigger>
              <TabsTrigger value="instrucoes">Instruções</TabsTrigger>
              <TabsTrigger value="modelo_geracao">Modelo & Geração</TabsTrigger>
              <TabsTrigger value="ferramentas">Ferramentas</TabsTrigger>
              <TabsTrigger value="memoria">Memória</TabsTrigger>
            </TabsList>
          )}

          <TabsContent value="identidade" forceMount>
            <Card>
              <CardHeader>
                <CardTitle>Identidade do Agente</CardTitle>
                <CardDescription>
                  Defina o nome, a descrição e o modelo base para o seu agente.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FormField
                  control={formMethods.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Agente de Vendas" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={formMethods.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Ex: Um agente inteligente para automatizar o processo de vendas."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="instrucoes" forceMount>
            <Card>
              <CardHeader>
                <CardTitle>Instruções do Sistema</CardTitle>
                <CardDescription>
                  Forneça as diretrizes e o comportamento esperado para o agente.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FormField
                  control={formMethods.control}
                  name="system_prompt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prompt do Sistema</FormLabel>
                      <FormControl>
                        <Textarea
                          rows={10}
                          {...field}
                          placeholder="Você é um assistente prestativo..."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="modelo_geracao" forceMount>
            <LLMAgentForm disabled={isLoading} isWizardMode={isWizardMode} />
          </TabsContent>

          <TabsContent value="ferramentas" forceMount>
            <AgentToolsTab agentId={id} isWizardMode={isWizardMode} />
          </TabsContent>

          <TabsContent value="memoria" forceMount>
            <AgentMemoryTab />
          </TabsContent>
        </Tabs>

        <div className="flex justify-between items-center mt-8 pt-6 border-t">
          <div>
            {isWizardMode && (
               <Button
                 variant="outline"
                 onClick={handlePreviousStep}
                 disabled={currentStepIndex === 0 || isLoading}
                 className={currentStepIndex === 0 ? 'invisible' : ''}
               >
                 Anterior
               </Button>
            )}
          </div>
          <div className="space-x-3">
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            {isWizardMode ? (
              currentStepIndex === WIZARD_STEPS.length - 1 ? (
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Criando...' : 'Criar Agente'}
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleNextStep}
                  disabled={isLoading}
                >
                  Próximo
                </Button>
              )
            ) : (
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Salvando...' : 'Salvar Alterações'}
              </Button>
            )}
          </div>
        </div>
      </BaseAgentForm>
    </div>
  );
}
