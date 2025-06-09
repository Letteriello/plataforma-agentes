import { useState, useCallback } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { Agent, AgentType, createDefaultAgent } from '@/types/agents';
import { validateAgent } from '@/lib/agent-utils';

// Mock API service - replace with actual API calls
const agentService = {
  createAgent: async (agent: Agent) => {
    console.log('Creating agent:', agent);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    return { ...agent, id: `agent-${Date.now()}` };
  },
  
  updateAgent: async (agent: Agent) => {
    console.log('Updating agent:', agent);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    return agent;
  },
};

export function useAgentForm(initialAgent?: Agent) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  
  // Create or update agent mutation
  const saveAgentMutation = useMutation(
    async (agent: Agent) => {
      setIsSubmitting(true);
      try {
        if (agent.id) {
          return await agentService.updateAgent(agent);
        } else {
          return await agentService.createAgent(agent);
        }
      } finally {
        setIsSubmitting(false);
      }
    },
    {
      onSuccess: (savedAgent) => {
        // Invalidate and refetch agents list
        queryClient.invalidateQueries('agents');
        
        toast({
          title: 'Success',
          description: `Agent "${savedAgent.name}" has been ${savedAgent.id === initialAgent?.id ? 'updated' : 'created'} successfully.`,
        });
        
        // Navigate to the agent's edit page after creation
        if (savedAgent.id !== initialAgent?.id) {
          navigate(`/agents/edit/${savedAgent.id}`, { replace: true });
        }
      },
      onError: (error: Error) => {
        console.error('Error saving agent:', error);
        toast({
          title: 'Error',
          description: error.message || 'Failed to save agent. Please try again.',
          variant: 'destructive',
        });
      },
    }
  );

  // Handle form submission
  const handleSubmit = useCallback(async (agent: Agent) => {
    // Validate the agent
    const validation = validateAgent(agent);
    setErrors(validation.errors);
    
    if (!validation.isValid) {
      toast({
        title: 'Validation Error',
        description: 'Please fix the errors in the form before submitting.',
        variant: 'destructive',
      });
      return;
    }
    
    // Save the agent
    await saveAgentMutation.mutateAsync(agent);
  }, [saveAgentMutation, toast]);
  
  // Handle agent type change
  const handleTypeChange = useCallback((type: AgentType, currentAgent: Agent) => {
    // Only reset the agent if the type actually changed
    if (type === currentAgent.type) return currentAgent;
    
    // Keep common fields but reset type-specific fields
    const baseAgent = {
      ...createDefaultAgent(type),
      id: currentAgent.id || crypto.randomUUID(),
      name: currentAgent.name || `New ${type.charAt(0).toUpperCase() + type.slice(1)} Agent`,
      description: currentAgent.description || '',
      tags: [...(currentAgent.tags || [])],
      isPublic: currentAgent.isPublic || false,
    };
    
    return baseAgent;
  }, []);

  return {
    initialAgent: initialAgent || createDefaultAgent('llm'),
    isSubmitting,
    errors,
    handleSubmit,
    handleTypeChange,
    resetErrors: () => setErrors([]),
  };
}
