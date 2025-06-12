import { useFormContext } from 'react-hook-form';
import { useFormContext } from 'react-hook-form';
import { LlmAgentConfig, UiToolDefinition } from '@/types/agents';
import { getTools, PaginatedToolsDTO, ToolDTO } from '@/api/toolService';
import { useQuery } from '@tanstack/react-query';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { ToolDefinitionForm } from './ToolDefinitionForm';
import { Settings } from 'lucide-react';

// Helper to transform backend DTO to UI definition
const transformToUiDefinition = (toolDto: ToolDTO): UiToolDefinition => {
  const parameters: UiToolDefinition['parameters'] = {};
  const required: string[] = [];

  if (Array.isArray(toolDto.parameters)) {
    toolDto.parameters.forEach(param => {
      parameters[param.name] = {
        type: param.type.toUpperCase() as 'STRING' | 'NUMBER' | 'BOOLEAN',
        description: param.description || undefined,
        default: param.default_value || undefined,
        enum: undefined, // Note: enum is not in ToolParameterDTO, handle if needed
      };
      if (param.is_required) {
        required.push(param.name);
      }
    });
  }

  return {
    id: toolDto.id,
    name: toolDto.name,
    description: toolDto.description || '',
    parameters: parameters,
    required: required,
  };
};

interface AgentToolsTabProps {
  agentId?: string;
}

export function AgentToolsTab({ agentId }: AgentToolsTabProps) {
  const form = useFormContext<LlmAgentConfig>();
  const [searchTerm, setSearchTerm] = useState('');
  const [configuredToolsDetails, setConfiguredToolsDetails] = useState<Record<string, UiToolDefinition>>({});
  const [selectedToolForConfiguration, setSelectedToolForConfiguration] = useState<UiToolDefinition | null>(null);

  const { data: paginatedResult, isLoading, error } = useQuery<PaginatedToolsDTO, Error>({
    queryKey: ['tools', searchTerm],
    queryFn: () => getTools({ query: searchTerm, page: 1, size: 50 }),
    enabled: true,
  });

  const handleSelectTool = (toolId: string, checked: boolean | 'indeterminate') => {
    if (typeof checked !== 'boolean') return;

    const currentToolIds = form.getValues('tool_ids') || [];
    const newToolIds = checked
      ? [...currentToolIds, toolId]
      : currentToolIds.filter((id) => id !== toolId);
    form.setValue('tool_ids', newToolIds, { shouldDirty: true, shouldValidate: true });
  };

  const handleConfigureTool = (toolDto: ToolDTO) => {
    const uiDef = transformToUiDefinition(toolDto);
    const existingConfig = configuredToolsDetails[toolDto.id];
    setSelectedToolForConfiguration(existingConfig || uiDef);
  };

  const handleSaveToolDefinition = (savedToolDef: UiToolDefinition) => {
    if (savedToolDef.id) {
      setConfiguredToolsDetails((prev) => ({ ...prev, [savedToolDef.id!]: savedToolDef }));
    }
    setSelectedToolForConfiguration(null);
  };

  const allTools = paginatedResult?.items || [];

  if (isLoading) return <p>Carregando ferramentas...</p>;
  if (error) return <p>Erro ao carregar ferramentas: {error.message}</p>;

  if (selectedToolForConfiguration) {
    return (
      <ToolDefinitionForm
        key={selectedToolForConfiguration.id}
        initialToolDefinition={selectedToolForConfiguration}
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ferramentas do Agente</CardTitle>
        <CardDescription>
          Selecione e configure as ferramentas que este agente poderá utilizar.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Input
          placeholder="Buscar ferramentas por nome..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <FormField
          control={form.control}
          name="tool_ids"
          render={({ field }) => (
            <FormItem>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {allTools.map((tool) => (
                  <FormItem key={tool.id} className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
                    <FormControl>
                      <Checkbox
                        checked={field.value?.includes(tool.id)}
                        onCheckedChange={(checked) => {
                          handleSelectTool(tool.id, checked);
                        }}
                      />
                    </FormControl>
                    <div className="space-y-1.5 leading-none flex-grow">
                      <FormLabel className="font-semibold">{tool.name}</FormLabel>
                      <FormDescription>{tool.description}</FormDescription>
                            }
                            field.onChange(newSelectedIds);
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
            const existingConfig = configuredToolsDetails[selectedToolForConfiguration.id];
            if (existingConfig) {
              return existingConfig;
            }
            const toolDto = selectedToolForConfiguration;
            return {
              id: toolDto.id, // Ensure UiToolDefinition includes id
              name: toolDto.name,
              description: toolDto.description,
              parameters: toolDto.parameters?.properties || {},
              required: toolDto.parameters?.required || [],
            };
          })()}
          onClose={() => setSelectedToolForConfiguration(null)}
          onSave={(savedToolDef: UiToolDefinition) => {
            if (!selectedToolForConfiguration || !savedToolDef.id) return;
            setConfiguredToolsDetails(prevDetails => ({
              ...prevDetails,
              [savedToolDef.id]: savedToolDef,
            }));
            toast({ title: 'Ferramenta configurada', description: `A ferramenta "${savedToolDef.name}" foi atualizada.` });
            setSelectedToolForConfiguration(null);
          }}
        />
      )}
    </Card>
  );
};

export default AgentToolsTab;
