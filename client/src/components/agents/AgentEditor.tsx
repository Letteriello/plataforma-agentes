import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LLMAgentForm } from './forms/LLMAgentForm';
import { BaseAgentForm } from './forms/BaseAgentForm';
import { LLMAgent, createDefaultAgent, LLMAgentSchema } from '@/types/agents';

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
  const [activeTab, setActiveTab] = useState('settings');

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

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          {mode === 'create' ? 'Create New Agent' : `Edit Agent: ${agent?.name}`}
        </h1>
        <div className="space-x-2">
          <Button variant="outline" onClick={handleCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button form="agent-form" type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="tools" disabled>Tools</TabsTrigger>
          <TabsTrigger value="safety" disabled>Safety Settings</TabsTrigger>
          <TabsTrigger value="testing" disabled>Testing</TabsTrigger>
        </TabsList>

        <TabsContent value="settings" className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <BaseAgentForm
              defaultValues={agent}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              schema={LLMAgentSchema}
              submitLabel={mode === 'create' ? 'Create Agent' : 'Save Changes'}
              cancelLabel="Cancel"
            >
              <LLMAgentForm />
            </BaseAgentForm>
          </div>
        </TabsContent>

        <TabsContent value="tools">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Agent Tools</h2>
            <p className="text-muted-foreground">Coming soon: Configure tools and capabilities for your agent.</p>
          </div>
        </TabsContent>

        <TabsContent value="safety">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Safety Settings</h2>
            <p className="text-muted-foreground">Configure safety settings and content filters for your agent.</p>
          </div>
        </TabsContent>

        <TabsContent value="testing">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Test Your Agent</h2>
            <p className="text-muted-foreground">Test your agent's responses and behavior in real-time.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
