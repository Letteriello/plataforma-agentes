import { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Agent, AgentType } from '@/types/agents';
import { agentSchema, AgentFormValues } from '@/lib/form-utils';
import { useAgentFormState, UseAgentFormReturn } from '@/hooks/useAgentFormState';
import { LLMAgentForm } from './forms/LLMAgentForm';
import { PlusIcon, Save, X } from 'lucide-react';
import { AgentTypeSelector } from './AgentTypeSelector';
import { toast } from '@/components/ui/use-toast';
import { AgentBaseForm } from './AgentBaseForm';

interface AgentFormProps {
  agent?: Partial<Agent>;
  onSubmit: (values: AgentFormValues) => Promise<void>;
  isLoading?: boolean;
  isEditing?: boolean;
  onCancel?: () => void;
}

export function AgentForm({
  agent,
  onSubmit,
  isLoading = false,
  isEditing = false,
  onCancel,
}: AgentFormProps) {
  const navigate = useNavigate();
  
  const form = useAgentFormState({
    initialValues: agent,
    onSubmit: async (values) => {
      try {
        await onSubmit(values);
        toast({
          title: isEditing ? 'Agent updated' : 'Agent created',
          description: `Agent "${values.name}" has been ${isEditing ? 'updated' : 'created'} successfully.`,
        });
      } catch (error) {
        console.error('Error saving agent:', error);
        throw error;
      }
    },
  });

  const handleCancel = useCallback(() => {
    if (onCancel) {
      onCancel();
    } else {
      navigate('/agents');
    }
  }, [navigate, onCancel]);

  // Render the appropriate form based on agent type
  const renderFormByType = () => {
    switch (form.currentType) {
      case AgentType.LLM:
        return <LLMAgentForm />;
      case AgentType.Sequential:
      case AgentType.Parallel:
      case AgentType.A2A:
      default:
        return (
          <div className="p-6 text-center">
            <p className="text-muted-foreground">
              {form.currentType} agent configuration coming soon.
            </p>
          </div>
        );
    }
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit} className="space-y-6">
        <div className="flex flex-col space-y-6">
          {/* Agent Type Selector */}
          {!isEditing && (
            <Card>
              <CardHeader>
                <CardTitle>Agent Type</CardTitle>
                <CardDescription>
                  Select the type of agent you want to create.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AgentTypeSelector
                  value={form.currentType}
                  onChange={form.handleTypeChange}
                  disabled={isEditing}
                />
              </CardContent>
            </Card>
          )}

          {/* Base Agent Information */}
          <AgentBaseForm />

          {/* Type-Specific Configuration */}
          <Card>
            <CardHeader>
              <CardTitle>Configuration</CardTitle>
              <CardDescription>
                Configure your agent's specific settings.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="settings" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-6">
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                  <TabsTrigger value="tools" disabled={form.currentType !== AgentType.LLM}>
                    Tools
                  </TabsTrigger>
                  <TabsTrigger value="advanced">Advanced</TabsTrigger>
                </TabsList>
                
                <TabsContent value="settings" className="space-y-6">
                  {renderFormByType()}
                </TabsContent>
                
                <TabsContent value="tools">
                  <div className="p-4 text-center rounded-lg border border-dashed">
                    <p className="text-muted-foreground">
                      Agent tools configuration coming soon.
                    </p>
                  </div>
                </TabsContent>
                
                <TabsContent value="advanced">
                  <div className="p-4 text-center rounded-lg border border-dashed">
                    <p className="text-muted-foreground">
                      Advanced configuration options coming soon.
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end space-x-4 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={form.isSubmitting}
          >
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
          <Button type="submit" disabled={form.isSubmitting || isLoading}>
            {form.isSubmitting ? (
              <>
                <span className="mr-2">
                  <span className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                </span>
                {isEditing ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                {isEditing ? 'Update Agent' : 'Create Agent'}
              </>
            )}
          </Button>
        </div>

        {/* Form submission error */}
        {form.submitError && (
          <div className="mt-4 p-4 text-sm text-red-600 bg-red-50 rounded-md">
            {form.submitError}
          </div>
        )}
      </form>
    </FormProvider>
  );
}

// Helper hook to use the form context
export const useAgentForm = (): UseAgentFormReturn => {
  const context = useFormContext<AgentFormValues>();
  if (!context) {
    throw new Error('useAgentForm must be used within an AgentForm');
  }
  return context as unknown as UseAgentFormReturn;
};

// Re-export types for convenience
export type { AgentFormValues };
