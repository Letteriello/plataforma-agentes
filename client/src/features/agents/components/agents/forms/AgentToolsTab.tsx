import { useQuery } from '@tanstack/react-query';
import { Settings } from 'lucide-react';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';

import { getTools, PaginatedToolsDTO, ToolDTO } from '../../../api/toolService';
import { LlmAgentConfig, UiToolDefinition } from '../../../types/agents';
import { Button } from '../../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Checkbox } from '../../ui/checkbox';
import { FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../../ui/form';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { useToast } from '../../ui/use-toast';
import { ToolDefinitionForm } from './ToolDefinitionForm';

const transformToUiDefinition = (toolDto: ToolDTO): UiToolDefinition => {
  const parameters: UiToolDefinition['parameters'] = {};
  const required: string[] = [];

  if (Array.isArray(toolDto.parameters)) {
    toolDto.parameters.forEach(param => {
      parameters[param.name] = {
        type: param.type.toUpperCase() as 'STRING' | 'NUMBER' | 'BOOLEAN',
        description: param.description || undefined,
        default: param.default_value || undefined,
        enum: undefined,
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

export function AgentToolsTab() {
  const form = useFormContext<LlmAgentConfig>();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [configuredToolsDetails, setConfiguredToolsDetails] = useState<Record<string, UiToolDefinition>>({});
  const [selectedToolForConfiguration, setSelectedToolForConfiguration] = useState<UiToolDefinition | null>(null);

  const { data: toolsData, isLoading, error } = useQuery<PaginatedToolsDTO, Error>({
    queryKey: ['tools', { page: 1, per_page: 100 }],
    queryFn: () => getTools({ page: 1, per_page: 100 }),
  });

  if (isLoading) {
    return <div>Carregando ferramentas...</div>;
  }

  if (error) {
    return <div>Erro ao carregar ferramentas: {error.message}</div>;
  }

  const availableTools = toolsData?.data.map(transformToUiDefinition) || [];
  const selectedToolIds = form.watch('tool_ids') || [];

  const filteredTools = availableTools.filter(tool =>
    tool.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ferramentas Disponíveis</CardTitle>
        <CardDescription>
          Selecione as ferramentas que este agente poderá utilizar.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Input
          placeholder="Buscar ferramenta..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4"
        />
        <FormField
          control={form.control}
          name="tool_ids"
          render={({ field }) => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">Ferramentas</FormLabel>
                <FormDescription>
                  Selecione as ferramentas para este agente.
                </FormDescription>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {filteredTools.map(tool => {
                  const isChecked = selectedToolIds.includes(tool.id);
                  return (
                    <div key={tool.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          id={tool.id}
                          checked={isChecked}
                          onCheckedChange={(checked) => {
                            const newSelectedIds = checked
                              ? [...selectedToolIds, tool.id]
                              : selectedToolIds.filter((id: string) => id !== tool.id);
                            field.onChange(newSelectedIds);
                          }}
                        />
                        <Label htmlFor={tool.id} className="font-medium">
                          {tool.name}
                          <p className="text-sm text-muted-foreground">{tool.description}</p>
                        </Label>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedToolForConfiguration(tool)}
                        disabled={!isChecked}
                      >
                        <Settings className="mr-2 h-4 w-4" />
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
          initialToolDefinition={
            configuredToolsDetails[selectedToolForConfiguration.id] || selectedToolForConfiguration
          }
          onClose={() => setSelectedToolForConfiguration(null)}
          onSave={(savedToolDef: UiToolDefinition) => {
            if (!savedToolDef.id) return;
            setConfiguredToolsDetails(prevDetails => ({
              ...prevDetails,
              [savedToolDef.id!]: savedToolDef,
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
