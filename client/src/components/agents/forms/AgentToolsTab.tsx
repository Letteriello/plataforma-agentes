import React, { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { getTools } from '@/api/toolService'; // Changed from fetchTools
import type { ToolDTO } from '@/api/toolService'; // Ensured ToolDTO is imported as type
import agentService from '@/api/agentService'; // Added agentService import
import { useToast } from '@/components/ui/use-toast'; // Added useToast import
import { Checkbox } from '@/components/ui/checkbox'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ToolDefinitionForm } from './ToolDefinitionForm';
import type { UiToolDefinition } from '@/types/agents';

interface AgentToolsTabProps {
  agentId?: string; // Agent ID for direct API calls in edit mode
}

const AgentToolsTab: React.FC<AgentToolsTabProps> = ({ agentId }) => {
  const [selectedToolForConfiguration, setSelectedToolForConfiguration] = useState<ToolDTO | null>(null);
  const [configuredToolsDetails, setConfiguredToolsDetails] = useState<Record<string, UiToolDefinition>>({});
  const { control, setValue, getValues } = useFormContext(); // Added getValues
  const { toast } = useToast(); // Initialize useToast
  const [availableTools, setAvailableTools] = useState<ToolDTO[]>([]); // Renamed tools to availableTools
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadTools = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Assuming getTools returns PaginatedToolsDTO, adjust if it returns ToolDTO[] directly
        // Pass params if your getTools function expects them, e.g., for pagination or filtering
        const paginatedResult = await getTools({ includeSystemTools: true }); 
        setAvailableTools(paginatedResult.tools);
      } catch (err: any) {
        const errorMessage = err.message || 'Failed to load tools';
        setError(errorMessage);
        toast({ title: "Error", description: `Failed to load available tools: ${errorMessage}`, variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    };
    loadTools();
  }, [toast]);

  const handleToolSelectionChange = async (toolId: string, isChecked: boolean) => {
    const currentSelectedToolIds = getValues("tools") || [];
    let newSelectedToolIds: string[];

    if (isChecked) {
      newSelectedToolIds = [...currentSelectedToolIds, toolId];
    } else {
      newSelectedToolIds = currentSelectedToolIds.filter((id: string) => id !== toolId);
    }

    // Optimistically update the form state first
    setValue("tools", newSelectedToolIds, { shouldDirty: true, shouldValidate: true });

    if (agentId) { // Only make API calls if agentId exists (editing mode)
      // For a single operation, we can set a specific loading state if needed
      // or rely on a global loading indicator if AgentEditor handles it.
      // For simplicity here, we won't add another setIsLoading just for this operation
      // but in a real app, you might want more granular loading states.
      try {
        if (isChecked) {
          await agentService.associateToolWithAgent(agentId, toolId);
          toast({ title: "Success", description: `Tool associated successfully.` });
        } else {
          await agentService.disassociateToolFromAgent(agentId, toolId);
          toast({ title: "Success", description: `Tool disassociated successfully.` });
        }
      } catch (apiError: any) {
        toast({
          title: "API Error",
          description: `Failed to update tool association: ${apiError.message || 'Unknown error'}`, 
          variant: "destructive",
        });
        // Revert UI change on API error by setting form value back
        setValue("tools", currentSelectedToolIds, { shouldDirty: true, shouldValidate: true });
      }
    }
  };

  if (isLoading) {
    return <p>Loading tools...</p>
  }

  if (error) {
    return <p className="text-destructive">{error}</p>
  }

  return (
  <>
    <FormField
      control={control}
      name="tools"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="sr-only">Ferramentas</FormLabel>
          <FormControl>
            <div className="space-y-3">
              {availableTools.map((tool) => {
                const checked = field.value?.includes(tool.id)
                const localCheckboxChangeHandler = (checkedStatus: boolean | 'indeterminate') => {
                  // Assuming 'indeterminate' should not trigger a change or be treated as false
                  const isActuallyChecked = typeof checkedStatus === 'boolean' ? checkedStatus : false;
                  handleToolSelectionChange(tool.id, isActuallyChecked);
                };
                return (
                  <div key={tool.id} className="flex items-start gap-3">
                    <Checkbox
                      id={`tool-${tool.id}`}
                      checked={checked}
                      onCheckedChange={localCheckboxChangeHandler}
                    />
                    <Label htmlFor={`tool-${tool.id}`} className="font-medium flex-1">
                      {tool.name}
                    </Label>
                    <span className="text-sm text-muted-foreground flex-2 mr-2">
                      {tool.description}
                    </span>
                    <Button type="button" variant="outline" size="sm" onClick={() => setSelectedToolForConfiguration(tool)}>
                      Configurar
                    </Button>
                  </div>
                )
              })}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />

    {selectedToolForConfiguration && (
      <ToolDefinitionForm 
        initialData={(() => {
          if (!selectedToolForConfiguration) return {}; // Should not happen if form is visible
          const existingDetail = configuredToolsDetails[selectedToolForConfiguration.id];
          if (existingDetail) {
            return existingDetail; // Already UiToolDefinition
          }
          // Create a new UiToolDefinition from ToolDTO for initial form display
          const toolDto = selectedToolForConfiguration;
          return {
            name: toolDto.name,
            description: toolDto.description,
            // Transform from ToolDTO's parameter structure to UiToolDefinition's structure
            parameters: toolDto.parameters?.properties || {},
            required: toolDto.parameters?.required || [],
          };
        })()}
        onClose={() => setSelectedToolForConfiguration(null)}
        onSave={(savedToolDefinition) => {
          if (!selectedToolForConfiguration) return;

          const toolId = selectedToolForConfiguration.id;
          // savedToolDefinition is now AdkToolDefinition
          const newConfiguredDetails: Record<string, UiToolDefinition> = {
            ...configuredToolsDetails,
            [toolId]: savedToolDefinition, 
          };
          setConfiguredToolsDetails(newConfiguredDetails);
          
          // Update the parent form's field (e.g., 'formToolsDefinitions')
          // The actual field name in the parent form (AgentEditor) needs to be consistent.
          // For now, let's assume it's 'detailedToolDefinitions'
          setValue('detailedToolDefinitions', Object.values(newConfiguredDetails), { shouldValidate: true, shouldDirty: true });
          
          console.log(`Updated configuredToolsDetails for tool ID ${toolId}:`, savedToolDefinition);
          console.log("All configured tool details:", newConfiguredDetails);
          console.log("Parent form field 'detailedToolDefinitions' updated with:", Object.values(newConfiguredDetails));

          setSelectedToolForConfiguration(null); // Close the form
        }}
      />
    )}
  </>
  );
};

// Add React.Fragment shorthand <> to wrap multiple root elements

export default AgentToolsTab
