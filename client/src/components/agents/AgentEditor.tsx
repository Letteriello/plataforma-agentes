import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useFormContext, FormProvider } from 'react-hook-form'; // Added FormProvider
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

import { LLMAgentForm } from './forms/LLMAgentForm';
import { AgentToolsTab } from './forms/AgentToolsTab';
import { BaseAgentForm } from './forms/BaseAgentForm'; // This should provide useForm methods
import { LLMAgent, createDefaultAgent, LLMAgentSchema } from '@/types/agents';
// import AgentDeployTab from './AgentDeployTab'; // AgentDeployTab removed as per new tab structure

const WIZARD_STEPS = ['identidade', 'instrucoes', 'modelo_geracao', 'ferramentas', 'memoria'];
const STEP_LABELS: { [key: string]: string } = {
  identidade: 'Identidade',
  instrucoes: 'Instruções',
  modelo_geracao: 'Modelo & Geração',
  ferramentas: 'Ferramentas',
  memoria: 'Memória',
};

// Mock data - replace with actual API calls
const mockAgents: LLMAgent[] = [
  {
    id: '1',
    name: 'Customer Support Bot',
    description: 'Handles customer inquiries and support tickets',
    type: 'llm',
    model: 'gemini-1.5-pro',
    temperature: 0.7,
    maxTokens: 1024,
    topP: 1,
    topK: 40,
    stopSequences: [],
    frequencyPenalty: 0,
    presencePenalty: 0,
    instruction: 'You are a helpful customer support assistant. Be polite and professional.',
    systemPrompt: '## Guidelines\n- Always verify customer information\n- Escalate complex issues to a human agent\n- Provide clear next steps',
    version: '1.0.0',
    isPublic: false,
    tags: ['support', 'customer-service'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
];

type AgentEditorProps = {
  mode?: 'create' | 'edit';
};

export function AgentEditor({ mode = 'create' }: AgentEditorProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [agent, setAgent] = useState<LLMAgent | null>(null);
  const [activeTab, setActiveTab] = useState(WIZARD_STEPS[0]);

  // Load agent data in edit mode
  useEffect(() => {
    if (mode === 'edit' && id) {
      // In a real app, this would be an API call
      const foundAgent = mockAgents.find(a => a.id === id) || null;
      setAgent(foundAgent);
      setIsLoading(false);
    } else if (mode === 'create') {
      setAgent(createDefaultAgent('llm'));
      setIsLoading(false);
    }
  }, [id, mode]);

  const currentStepIndex = WIZARD_STEPS.indexOf(activeTab);

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

  const handleSubmit = async (values: LLMAgent) => {
    try {
      setIsLoading(true);
      // In a real app, this would be an API call
      console.log('Saving agent:', values);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (mode === 'create') {
        toast({
          title: "Agente Criado!",
          description: "Novo agente configurado com sucesso."
        });
      } else {
        toast({
          title: "Agente Atualizado!",
          description: "Configurações do agente atualizadas com sucesso."
        });
      }
      
      // Navigate back to agents list or to the new agent's edit page
      navigate('/agents');
    } catch (error) {
      console.error('Error saving agent:', error);
      toast({
        title: 'Erro',
        description: `Falha ao ${mode === 'create' ? 'criar' : 'atualizar'} o agente. Por favor, tente novamente.`,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/agents');
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!agent && mode === 'edit') {
    return <div>Agent not found</div>;
  }

  // ReviewStep component is removed as "Modelo & Geração" is now a dedicated settings tab.
  // The data previously shown in ReviewStep is editable in other tabs.

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          {mode === 'create' ? 'Criar Novo Agente' : `Editar Agente: ${agent?.name}`}
        </h1>
      </div>

      <BaseAgentForm
        id="agent-form"
        defaultValues={agent}
        onSubmit={handleSubmit}
        schema={LLMAgentSchema}
        className="space-y-6"
      >
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          // className="space-y-6" // Moved to BaseAgentForm or manage spacing internally
        >
          <TabsList>
            {WIZARD_STEPS.map(step => (
              <TabsTrigger key={step} value={step}>
                {STEP_LABELS[step]}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="identidade">
            <Card>
              <CardHeader>
                <CardTitle>Identidade do Agente</CardTitle>
                <CardDescription>Defina o nome, a descrição e o avatar do seu agente.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  name="name"
                  render={({ field, formState }) => ( // control is implicitly from BaseAgentForm's FormProvider
                    <FormItem>
                      <FormLabel>Nome do Agente</FormLabel>
                      <FormControl>
                        <Input placeholder="Meu Agente Incrível" {...field} />
                      </FormControl>
                      <FormMessage>{formState.errors.name?.message?.toString()}</FormMessage>
                    </FormItem>
                  )}
                />
                <FormField
                  name="description"
                  render={({ field, formState }) => (
                    <FormItem>
                      <FormLabel>Descrição</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Descreva o que seu agente faz." {...field} rows={3} />
                      </FormControl>
                      <FormMessage>{formState.errors.description?.message?.toString()}</FormMessage>
                    </FormItem>
                  )}
                />
                <FormField
                  name="avatarUrl"
                  render={({ field, formState }) => (
                    <FormItem>
                      <FormLabel>URL do Avatar (Opcional)</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com/avatar.png" {...field} value={field.value ?? ''} />
                      </FormControl>
                      <FormMessage>{formState.errors.avatarUrl?.message?.toString()}</FormMessage>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="instrucoes">
            <Card>
              <CardHeader>
                <CardTitle>Instruções do Agente</CardTitle>
                <CardDescription>Forneça as instruções e o prompt do sistema para guiar o comportamento do agente.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  name="instruction"
                  render={({ field, formState }) => (
                    <FormItem>
                      <FormLabel>Instruções</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Você é um assistente útil que..."
                          {...field}
                          rows={6}
                          className="font-mono text-sm"
                        />
                      </FormControl>
                      <FormDescription>Instruções de sistema que guiam o comportamento do agente.</FormDescription>
                      <FormMessage>{formState.errors.instruction?.message?.toString()}</FormMessage>
                    </FormItem>
                  )}
                />
                <FormField
                  name="systemPrompt"
                  render={({ field, formState }) => (
                    <FormItem>
                      <FormLabel>Prompt de Sistema (Opcional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="## Contexto\n- ...\n## Regras\n- ..."
                          {...field}
                          rows={6}
                          className="font-mono text-sm"
                        />
                      </FormControl>
                      <FormDescription>Instruções adicionais de nível de sistema, ex: em Markdown.</FormDescription>
                      <FormMessage>{formState.errors.systemPrompt?.message?.toString()}</FormMessage>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="modelo_geracao">
            {/* LLMAgentForm is now part of this tab */}
            <LLMAgentForm />
          </TabsContent>

          <TabsContent value="ferramentas">
            <Card>
              <CardHeader>
                <CardTitle>Ferramentas</CardTitle>
                <CardDescription>Configure as ferramentas e capacidades do seu agente.</CardDescription>
              </CardHeader>
              <CardContent>
                <AgentToolsTab />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="memoria">
            <Card>
              <CardHeader>
                <CardTitle>Memória</CardTitle>
                <CardDescription>Defina as configurações de memória do seu agente.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Em breve: Funcionalidade de configuração de memória.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* LLMAgentForm was moved into the 'modelo_geracao' tab. The conditional div wrapper is removed. */}

        {/* Navigation buttons are OUTSIDE Tabs but INSIDE BaseAgentForm */}
        <div className="flex justify-between items-center mt-8 pt-6 border-t">
          <div>
            <Button
              variant="outline"
              onClick={handlePreviousStep}
              disabled={currentStepIndex === 0 || isLoading}
              className={currentStepIndex === 0 ? 'invisible' : ''}
            >
              Anterior
            </Button>
          </div>
          <div className="space-x-3">
            <Button variant="outline" onClick={handleCancel} disabled={isLoading}>
              Cancelar
            </Button>
            {currentStepIndex === WIZARD_STEPS.length - 1 ? (
              <Button form="agent-form" type="submit" disabled={isLoading}>
                {isLoading ? (mode === 'create' ? 'Criando...' : 'Salvando...') : (mode === 'create' ? 'Criar Agente' : 'Salvar Alterações')}
              </Button>
            ) : (
              <Button type="button" onClick={handleNextStep} disabled={currentStepIndex === WIZARD_STEPS.length - 1 || isLoading}>
                Próximo
              </Button>
            )}
          </div>
        </div>
      </BaseAgentForm>
    </div>
  );
}
