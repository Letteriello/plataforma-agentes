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
  isWizardMode?: boolean;
}

const AgentToolsTab: React.FC<AgentToolsTabProps> = ({ agentId, isWizardMode = false }) => {
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

  if (isWizardMode) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Ferramentas</CardTitle>
          <CardDescription>
            Selecione as ferramentas que seu agente poderá utilizar.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FormField
            control={control}
            name="tools" // Este será um array de IDs de ferramentas selecionadas
            render={() => (
              <FormItem>
                <div className="mb-4">
                  <FormLabel className="text-base">Ferramentas Disponíveis</FormLabel>
                  <FormDescription>
                    Marque as ferramentas que o agente deve ter acesso.
                  </FormDescription>
                </div>
                {availableTools.map((tool) => (
                  <FormField
                    key={tool.id}
                    control={control}
                    name="tools"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={tool.id}
                          className="flex flex-row items-start space-x-3 space-y-0 mb-4"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.some((t: UiToolDefinition) => t.name === tool.name)}
                              onCheckedChange={(checked) => {
                                const currentTools = getValues().tools || [];
                                if (checked) {
                                  // Adiciona a ferramenta inteira, não apenas o ID
                                  const newToolDef: UiToolDefinition = {
                                    name: tool.name,
                                    description: tool.description,
                                    parameters: tool.parameters?.properties || {},
                                    required: tool.parameters?.required || [],
                                  };
                                  field.onChange([...currentTools, newToolDef]);
                                } else {
                                  field.onChange(
                                    currentTools.filter((t: UiToolDefinition) => t.name !== tool.name)
                                  );
                                }
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {tool.name}
                            <p className="text-sm text-muted-foreground">
                              {tool.description}
                            </p>
                          </FormLabel>
                        </FormItem>
                      )
                    }}
                  />
                ))}
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>
    );
  }

  // Renderização para o modo avançado (não-wizard)
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ferramentas</CardTitle>
        <CardDescription>
          Selecione e configure as ferramentas que seu agente poderá utilizar.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FormField
          control={control}
          name="tools"
          render={({ field }) => (
            <FormItem>
              <div className="space-y-4 pt-2">
                {availableTools.map((tool) => {
                  const isChecked = field.value?.some((t: UiToolDefinition) => t.name === tool.name);
                  
                  return (
                    <div key={tool.id} className="flex items-center justify-between p-3 border rounded-md hover:bg-muted/50">
                      <div className="flex items-center space-x-4">
                        <Checkbox
                          id={`tool-${tool.id}`}
                          checked={isChecked}
                          onCheckedChange={(checked) => {
                            const currentTools = getValues().tools || [];
                            if (checked) {
                              const newToolDef: UiToolDefinition = {
                                name: tool.name,
                                description: tool.description,
                                parameters: tool.parameters?.properties || {},
                                required: tool.parameters?.required || [],
                              };
                              field.onChange([...currentTools, newToolDef]);
                            } else {
                              field.onChange(
                                currentTools.filter((t: UiToolDefinition) => t.name !== tool.name)
                              );
                            }
                          }}
                        />
                        <Label htmlFor={`tool-${tool.id}`} className="font-medium">
                          {tool.name}
                          <p className="text-sm text-muted-foreground font-normal mt-1">{tool.description}</p>
                        </Label>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedToolForConfiguration(tool)}
                        disabled={!isChecked}
                      >
                        Configurar
                      </Button>
                    </div>
                  );
                })}
              </div>
              <FormMessage className="pt-2" />
            </FormItem>
          )}
        />
      </CardContent>
      {selectedToolForConfiguration && (
        <ToolDefinitionForm
          isOpen={!!selectedToolForConfiguration}
          initialToolDefinition={(() => {
            if (!selectedToolForConfiguration) return undefined;
            const currentTools = getValues().tools || [];
            const existingDetail = currentTools.find((t: UiToolDefinition) => t.name === selectedToolForConfiguration.name);
            if (existingDetail) {
              return existingDetail;
            }
            // Fallback para criar a partir do DTO se não estiver na lista (não deveria acontecer se o botão estiver desabilitado)
            const toolDto = selectedToolForConfiguration;
            return {
              name: toolDto.name,
              description: toolDto.description,
              parameters: toolDto.parameters?.properties || {},
              required: toolDto.parameters?.required || [],
            };
          })()}
          onClose={() => setSelectedToolForConfiguration(null)}
          onSave={(savedToolDefinition) => {
            if (!selectedToolForConfiguration) return;
            const currentTools = getValues().tools || [];
            const toolIndex = currentTools.findIndex((t: UiToolDefinition) => t.name === savedToolDefinition.name);
            
            if (toolIndex > -1) {
              const updatedTools = [...currentTools];
              updatedTools[toolIndex] = savedToolDefinition;
              setValue('tools', updatedTools, { shouldValidate: true, shouldDirty: true });
              toast({ title: 'Ferramenta configurada', description: `A ferramenta "${savedToolDefinition.name}" foi atualizada.` });
            }
            
            setSelectedToolForConfiguration(null);
          }}
        />
      )}
    </Card>
  );
};

export default AgentToolsTab;
