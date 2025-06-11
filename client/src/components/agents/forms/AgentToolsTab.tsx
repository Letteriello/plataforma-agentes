import React, { useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { fetchTools, ToolDTO } from '@/api/toolService'
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
import ToolDefinitionForm from './ToolDefinitionForm';
import type { UiToolDefinition } from '../../types/agents';

const AgentToolsTab: React.FC = () => {
  const [selectedToolForConfiguration, setSelectedToolForConfiguration] = useState<ToolDTO | null>(null);
  const [configuredToolsDetails, setConfiguredToolsDetails] = useState<Record<string, UiToolDefinition>>({});
  const { control, setValue } = useFormContext();
  const [tools, setTools] = useState<ToolDTO[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadTools = async () => {
      try {
        const fetched = await fetchTools()
        setTools(fetched)
      } catch (err) {
        setError('Failed to load tools')
      } finally {
        setIsLoading(false)
      }
    }
    loadTools()
  }, [])

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
              {tools.map((tool) => {
                const checked = field.value?.includes(tool.id)
                const handleChange = (checked: boolean) => {
                  const current = field.value || []
                  if (checked) {
                    field.onChange([...current, tool.id])
                  } else {
                    field.onChange(
                      current.filter((id: string) => id !== tool.id),
                    )
                  }
                }
                return (
                  <div key={tool.id} className="flex items-start gap-3">
                    <Checkbox
                      id={`tool-${tool.id}`}
                      checked={checked}
                      onCheckedChange={handleChange}
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
