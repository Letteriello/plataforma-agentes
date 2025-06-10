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
import { BaseAgentForm } from './forms/BaseAgentForm'; // This should provide useForm methods
import { LLMAgent, createDefaultAgent, LLMAgentSchema } from '@/types/agents';
import AgentDeployTab from './AgentDeployTab';

const WIZARD_STEPS = ['identidade', 'instrucoes', 'ferramentas', 'revisao', 'deploy'];
const STEP_LABELS: { [key: string]: string } = {
  identidade: 'Identidade',
  instrucoes: 'Instruções',
  ferramentas: 'Ferramentas',
  revisao: 'Revisão',
  deploy: 'Deploy',
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
      
      toast({
        title: 'Success',
        description: `Agent ${mode === 'create' ? 'created' : 'updated'} successfully`,
      });
      
      // Navigate back to agents list or to the new agent's edit page
      navigate('/agents');
    } catch (error) {
      console.error('Error saving agent:', error);
      toast({
        title: 'Error',
        description: `Failed to ${mode} agent. Please try again.`,
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

  // Component to display review, needs access to form context
  const ReviewStep = () => {
    const { watch } = useFormContext<LLMAgent>();
    const watchedAgentData = watch(); // Watch all fields

    return (
      <Card>
        <CardHeader>
          <CardTitle>Review Your Agent</CardTitle>
          <CardDescription>Please review the agent's configuration before proceeding.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <h4 className="font-semibold">Name:</h4>
            <p>{watchedAgentData.name || 'Not set'}</p>
          </div>
          <div>
            <h4 className="font-semibold">Description:</h4>
            <p>{watchedAgentData.description || 'Not set'}</p>
          </div>
          <div>
            <h4 className="font-semibold">Avatar URL:</h4>
            <p>{watchedAgentData.avatarUrl || 'Not set'}</p>
          </div>
          <div>
            <h4 className="font-semibold">Instructions:</h4>
            <pre className="whitespace-pre-wrap p-2 bg-gray-100 dark:bg-gray-900 rounded-md">
              {watchedAgentData.instruction || 'Not set'}
            </pre>
          </div>
          {watchedAgentData.systemPrompt && (
            <div>
              <h4 className="font-semibold">System Prompt:</h4>
              <pre className="whitespace-pre-wrap p-2 bg-gray-100 dark:bg-gray-900 rounded-md">
                {watchedAgentData.systemPrompt}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          {mode === 'create' ? 'Create New Agent' : `Edit Agent: ${agent?.name}`}
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
                      <FormLabel>Agent Name</FormLabel>
                      <FormControl>
                        <Input placeholder="My Awesome Agent" {...field} />
                      </FormControl>
                      <FormMessage>{formState.errors.name?.message?.toString()}</FormMessage>
                    </FormItem>
                  )}
                />
                <FormField
                  name="description"
                  render={({ field, formState }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Describe what your agent does." {...field} rows={3} />
                      </FormControl>
                      <FormMessage>{formState.errors.description?.message?.toString()}</FormMessage>
                    </FormItem>
                  )}
                />
                <FormField
                  name="avatarUrl"
                  render={({ field, formState }) => (
                    <FormItem>
                      <FormLabel>Avatar URL (Optional)</FormLabel>
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
                      <FormLabel>Instructions</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="You are a helpful assistant that..."
                          {...field}
                          rows={6}
                          className="font-mono text-sm"
                        />
                      </FormControl>
                      <FormDescription>System instructions that guide the agent's behavior.</FormDescription>
                      <FormMessage>{formState.errors.instruction?.message?.toString()}</FormMessage>
                    </FormItem>
                  )}
                />
                <FormField
                  name="systemPrompt"
                  render={({ field, formState }) => (
                    <FormItem>
                      <FormLabel>System Prompt (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="## Context\n- ...\n## Rules\n- ..."
                          {...field}
                          rows={6}
                          className="font-mono text-sm"
                        />
                      </FormControl>
                      <FormDescription>Additional system-level instructions, e.g., in Markdown.</FormDescription>
                      <FormMessage>{formState.errors.systemPrompt?.message?.toString()}</FormMessage>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ferramentas">
            <Card>
              <CardHeader><CardTitle>Ferramentas</CardTitle></CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Coming soon: Configure tools and capabilities for your agent.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="revisao">
            <ReviewStep />
          </TabsContent>

          <TabsContent value="deploy">
            <AgentDeployTab />
          </TabsContent>
        </Tabs>

        {/* LLMAgentForm for model settings, hidden from wizard steps but part of the form */}
        {/* This ensures these fields are submitted. We might move them into a wizard step later. */}
        {/* For now, they are not directly part of the wizard UI but are part of the form */}
        <div className={activeTab === 'identidade' || activeTab === 'instrucoes' ? 'block mt-6' : 'hidden'}>
           {/* Show Model config only on first two steps or a dedicated step later */}
          <LLMAgentForm />
        </div>

        {/* Navigation buttons are now OUTSIDE Tabs but INSIDE BaseAgentForm */}
        <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div>
            <Button
              variant="outline"
              onClick={handlePreviousStep}
              disabled={currentStepIndex === 0 || isLoading}
              className={currentStepIndex === 0 ? 'invisible' : ''}
            >
              Previous
            </Button>
          </div>
          <div className="space-x-3">
            <Button variant="outline" onClick={handleCancel} disabled={isLoading}>
              Cancel
            </Button>
            {currentStepIndex === WIZARD_STEPS.length - 1 ? (
              <Button form="agent-form" type="submit" disabled={isLoading}>
                {isLoading ? (mode === 'create' ? 'Creating...' : 'Saving...') : (mode === 'create' ? 'Create Agent' : 'Save Changes')}
              </Button>
            ) : (
              <Button type="button" onClick={handleNextStep} disabled={currentStepIndex === WIZARD_STEPS.length - 1 || isLoading}>
                Next
              </Button>
            )}
          </div>
        </div>
      </BaseAgentForm>
    </div>
  );
}
