import { X } from 'lucide-react';
import { useCallback, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
// Tooltip components are not currently used
import { cn } from '@/lib/utils';
import { LLMAgent } from '@/types/agents';

// Modelos disponíveis com seus detalhes
const AVAILABLE_MODELS = [
  { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', maxTokens: 8192 },
  { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash', maxTokens: 8192 },
  { id: 'gemini-1.0-pro', name: 'Gemini 1.0 Pro', maxTokens: 2048 },
  {
    id: 'gemini-1.5-pro-latest',
    name: 'Gemini 1.5 Pro (Latest)',
    maxTokens: 1048576,
  },
];

type LLMAgentFormProps = {
  isWizardMode?: boolean;
  disabled?: boolean;
  className?: string;
};

export function LLMAgentForm({
  isWizardMode = false,
  disabled = false,
  className = '',
}: LLMAgentFormProps) {
  const { control, watch, setValue } = useFormContext<LLMAgent>();

  const modelValue = watch('model');
  const temperatureValue = watch('generateContentConfig.temperature', 0.7);
  const maxTokensValue = watch('generateContentConfig.maxOutputTokens');
  const stopSequencesValue = watch('stopSequences', [] as string[]);

  const temperatureOptions = [
    { label: 'Mais Preciso', value: 0.2 },
    { label: 'Balanceado', value: 0.7 },
    { label: 'Mais Criativo', value: 1.0 },
  ];

  const selectedModel = useMemo(
    () => AVAILABLE_MODELS.find((m) => m.id === modelValue),
    [modelValue]
  );

  const handleTemperatureChange = useCallback(
    (value: number) => {
      setValue('generateContentConfig.temperature', value, { shouldValidate: true });
    },
    [setValue]
  );

  // Helper to get the label for a given temperature value
  const getTemperatureLabel = (value: number | undefined) => {
    if (value === undefined) return 'Balanceado';
    const closest = temperatureOptions.reduce((prev, curr) =>
      Math.abs(curr.value - value) < Math.abs(prev.value - value) ? curr : prev
    );
    return closest.label;
  };

  // Helper to get the value for a given temperature label
  const getTemperatureValue = (label: string) => {
    const option = temperatureOptions.find((opt) => opt.label === label);
    return option ? option.value : 0.7;
  };

  const renderJsonTextarea = useCallback(
    (
      name: 'security_config' | 'planner_config' | 'code_executor_config',
      label: string,
      placeholder: string
    ) => (
      <FormField
        control={control}
        name={name}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{label}</FormLabel>
            <FormControl>
              <Textarea
                placeholder={placeholder}
                className="font-mono h-32 min-h-[8rem]"
                {...field}
                value={
                  field.value
                    ? typeof field.value === 'string'
                      ? field.value
                      : JSON.stringify(field.value, null, 2)
                    : ''
                }
                onChange={(e) => {
                  field.onChange(e.target.value);
                }}
                disabled={disabled}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    ),
    [control, disabled]
  );

  return (
    <div className={cn('space-y-6', className)}>
      <Card>
        <CardHeader>
          <CardTitle>Configurações Gerais</CardTitle>
          <CardDescription>
            Defina o nome e a instrução principal para o seu agente.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            control={control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome do Agente</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ex: Agente de Vendas"
                    {...field}
                    disabled={disabled}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="instruction"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Instrução</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Você é um assistente de IA prestativo..."
                    className="min-h-[100px]"
                    {...field}
                    disabled={disabled}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Modelo de Linguagem</CardTitle>
          <CardDescription>
            Escolha o modelo de linguagem que seu agente usará.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FormField
            control={control}
            name="model"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Modelo Base</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={disabled}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um modelo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {AVAILABLE_MODELS.map((model) => (
                      <SelectItem key={model.id} value={model.id}>
                        {model.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      {isWizardMode ? (
        <Card>
          <CardHeader>
            <CardTitle>Estilo de Resposta</CardTitle>
            <CardDescription>
              Escolha o quão criativo ou preciso o agente deve ser.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ToggleGroup
              type="single"
              variant="outline"
              value={getTemperatureLabel(temperatureValue)}
              onValueChange={(label) => {
                if (label) handleTemperatureChange(getTemperatureValue(label));
              }}
              className="grid grid-cols-3"
              disabled={disabled}
            >
              {temperatureOptions.map((option) => (
                <ToggleGroupItem
                  key={option.value}
                  value={option.label}
                  className="flex flex-col h-auto"
                >
                  <span className="font-semibold">{option.label}</span>
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Parâmetros de Geração (Modo Avançado)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <FormField
                control={control}
                name="generateContentConfig.temperature"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Temperatura: {temperatureValue.toFixed(1)}</FormLabel>
                    <FormControl>
                      <Slider
                        min={0}
                        max={2}
                        step={0.1}
                        value={[field.value || 0.7]}
                        onValueChange={(value) => field.onChange(value[0])}
                        disabled={disabled}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="generateContentConfig.topP"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Top P: {(field.value || 0.95).toFixed(2)}</FormLabel>
                    <FormControl>
                      <Slider
                        min={0}
                        max={1}
                        step={0.01}
                        value={[field.value || 0.95]}
                        onValueChange={(value) => field.onChange(value[0])}
                        disabled={disabled}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="generateContentConfig.topK"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Top K: {field.value || 1}</FormLabel>
                    <FormControl>
                      <Slider
                        min={1}
                        max={100}
                        step={1}
                        value={[field.value || 1]}
                        onValueChange={(value) => field.onChange(value[0])}
                        disabled={disabled}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
          <Accordion type="multiple" className="w-full">
            <AccordionItem value="generation-settings">
              <AccordionTrigger className="text-base">
                Configurações de Geração Adicionais
              </AccordionTrigger>
              <AccordionContent className="space-y-6 pt-4">
                <FormField
                  control={control}
                  name="generateContentConfig.maxOutputTokens"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Max. Tokens de Saída: {maxTokensValue}
                      </FormLabel>
                      <FormControl>
                        <Slider
                          min={1}
                          max={selectedModel?.maxTokens || 8192}
                          step={1}
                          value={[field.value || 2048]}
                          onValueChange={(value) => field.onChange(value[0])}
                          disabled={disabled}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="stopSequences"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sequências de Parada</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Digite uma sequência e pressione Enter"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              const newValue = e.currentTarget.value.trim();
                              if (newValue && !field.value?.includes(newValue)) {
                                field.onChange([
                                  ...(field.value || []),
                                  newValue,
                                ]);
                                e.currentTarget.value = '';
                              }
                            }
                          }}
                          disabled={disabled}
                        />
                      </FormControl>
                      <FormDescription>
                        Adicione sequências de texto que farão o modelo parar de
                        gerar.
                      </FormDescription>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {stopSequencesValue.map((seq: string, index: number) => (
                          <ToggleGroup
                            type="single"
                            key={index}
                            variant="outline"
                            className="p-1 bg-gray-100 rounded-md"
                          >
                            <ToggleGroupItem
                              value={seq}
                              className="flex items-center gap-1.5"
                              onClick={() => {
                                const newSequences = [...stopSequencesValue];
                                newSequences.splice(index, 1);
                                field.onChange(newSequences);
                              }}
                            >
                              {seq} <X className="h-3 w-3" />
                            </ToggleGroupItem>
                          </ToggleGroup>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="advanced-settings">
              <AccordionTrigger className="text-base">
                Configurações Avançadas
              </AccordionTrigger>
              <AccordionContent className="space-y-6 pt-4">
                <FormField
                  control={control}
                  name="autonomy_level"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nível de Autonomia</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={disabled}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o nível de autonomia" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="ask">
                            Manual (Requer aprovação)
                          </SelectItem>
                          <SelectItem value="auto">Automático</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Define se o agente executa ações automaticamente ou pede
                        confirmação.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {renderJsonTextarea(
                    'security_config',
                    'Config. de Segurança (JSON)',
                    '{\n  "tool_approval_required": true\n}'
                  )}
                  {renderJsonTextarea(
                    'planner_config',
                    'Config. do Planejador (JSON)',
                    '{\n  "strategy": "hierarchical"\n}'
                  )}
                </div>
                {renderJsonTextarea(
                  'code_executor_config',
                  'Config. do Executor de Código (JSON)',
                  '{\n  "timeout_seconds": 60\n}'
                )}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      )}
    </div>
  );
}
