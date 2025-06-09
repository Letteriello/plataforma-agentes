import { useState, useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query'; // Using @tanstack/react-query
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { Agent, AgentType, createDefaultAgent } from '@/types/agents'; // Assuming Agent is compatible with AnyAgentConfig
import { AnyAgentConfig } from '@/types'; // For service return types
import { validateAgent } from '@/lib/agent-utils';
import agentService from '@/api/agentService'; // Import actual agent service

export function useAgentForm(initialAgent?: Agent) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  // const [isSubmitting, setIsSubmitting] = useState(false); // Will be replaced by mutation isLoading
  const [errors, setErrors] = useState<string[]>([]);
  
  // Create or update agent mutation
  const saveAgentMutation = useMutation<AnyAgentConfig, Error, Agent>(
    async (agentData: Agent): Promise<AnyAgentConfig> => {
      // Ensure agentData conforms to what createAgent/updateAgent expect.
      // The agentService.createAgent expects Omit<AnyAgentConfig, 'id'>
      // The agentService.updateAgent expects (agentId: string, config: Partial<AnyAgentConfig>)

      const { id, ...agentConfigData } = agentData; // Separate id for clarity

      if (id) {
        // For updateAgent, ensure we only pass Partial<AnyAgentConfig>
        // If Agent and AnyAgentConfig are mostly compatible, this should be okay.
        // We might need to be more specific about which fields can be updated.
        return await agentService.updateAgent(id, agentConfigData as Partial<AnyAgentConfig>);
      } else {
        // For createAgent, agentConfigData should be Omit<AnyAgentConfig, 'id'>
        return await agentService.createAgent(agentConfigData as Omit<AnyAgentConfig, 'id'>);
      }
    },
    {
      onSuccess: (savedAgent) => {
        // Invalidate and refetch agents list
        queryClient.invalidateQueries({ queryKey: ['agents'] });
        queryClient.invalidateQueries({ queryKey: ['agent', savedAgent.id] }); // Also invalidate specific agent if applicable
        
        toast({
          title: 'Success',
          description: `Agent "${savedAgent.name}" has been ${initialAgent?.id && savedAgent.id === initialAgent.id ? 'updated' : 'created'} successfully.`,
        });
        
        // Navigate to the agent's edit page after creation or if ID changed (unlikely for update)
        if (!initialAgent?.id || initialAgent.id !== savedAgent.id) {
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
    const validation = validateAgent(agent); // Assuming validateAgent works with Agent type
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
  }, [saveAgentMutation, toast]); // Added toast to dependency array, though mutateAsync handles its own toasts
  
  // Handle agent type change
  const handleTypeChange = useCallback((type: AgentType, currentAgent: Agent): Agent => {
    // Only reset the agent if the type actually changed
    if (type === currentAgent.type) return currentAgent;
    
    // Keep common fields but reset type-specific fields
    const baseAgent: Agent = {
      ...createDefaultAgent(type), // This creates a base structure for the new type
      id: currentAgent.id, // Retain ID if it exists
      name: currentAgent.name || `New ${type.charAt(0).toUpperCase() + type.slice(1)} Agent`,
      description: currentAgent.description || '',
      tags: [...(currentAgent.tags || [])],
      isPublic: currentAgent.isPublic || false,
      // Ensure other common fields from 'Agent' are preserved if not in createDefaultAgent
      // Example: currentAgent.workspaceConfig, currentAgent.tools, etc.
      // This part needs careful handling to ensure all relevant fields are carried over or correctly reset.
      // For simplicity, assuming createDefaultAgent + manual override is okay for now.
      // A more robust solution might involve a mapping function based on type.
    };
    
    return baseAgent;
  }, []);

  return {
    initialAgent: initialAgent || createDefaultAgent('llm'),
    isSubmitting: saveAgentMutation.isLoading, // Use isLoading from mutation
    errors,
    handleSubmit,
    handleTypeChange,
    resetErrors: () => setErrors([]),
  };
}
