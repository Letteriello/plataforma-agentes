import { useFormContext } from 'react-hook-form'
import { LLMAgent } from '@/types/agents'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useCallback, useMemo } from 'react'
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { HelpCircle, X } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

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
]

type LLMAgentFormProps = {
  isWizardMode?: boolean;
  disabled?: boolean
  className?: string
}

export function LLMAgentForm({
  isWizardMode = false, // Default to false (full form) if not specified
  disabled = false,
  className = '',
}: LLMAgentFormProps) {
  const { control, watch, setValue } = useFormContext<LLMAgent>()

  const modelValue = watch('model')
  // Alinhado com a nova estrutura aninhada do ADK
  const temperatureValue = watch('generateContentConfig.temperature', 0.7);

  const temperatureOptions = [
    { label: 'Mais Preciso', value: 0.2 },
    { label: 'Balanceado', value: 0.7 },
    { label: 'Mais Criativo', value: 1.0 },
  ];
  const maxTokensValue = watch('generateContentConfig.maxOutputTokens')
  const stopSequencesValue = watch('generateContentConfig.stopSequences', [])

  const selectedModel = useMemo(
    () => AVAILABLE_MODELS.find((m) => m.id === modelValue),
    [modelValue],
  )

  const handleModelChange = useCallback(
    (newModelId: string) => {
      const model = AVAILABLE_MODELS.find((m) => m.id === newModelId)
      if (model) {
        setValue('model', newModelId)
        // Alinhado com a nova estrutura aninhada do ADK
        setValue('generateContentConfig.maxOutputTokens', model.maxTokens)
      }
    },
    [setValue],
  )

  return (
    <div className={`space-y-6 ${className}`}>
      <Card>
        <CardHeader>
          <CardTitle>Modelo</CardTitle>
          <CardDescription>
            Selecione o modelo de linguagem e configure seus parâmetros de
            geração.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <FormField
            control={control}
            name="model"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Modelo LLM</FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value)
                    handleModelChange(value) // Chama o handler para atualizar maxTokens
                  }}
                  defaultValue={field.value}
                  disabled={disabled}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um modelo LLM" />
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
              </FormItem>
            )}
          />
        </CardContent>
      </Card>
      {!isWizardMode && (
        <Accordion type="single" collapsible className="w-full mt-6">
        <AccordionItem value="generation-settings">
          <AccordionTrigger className="text-lg font-semibold hover:no-underline">
            Parâmetros Avançados de Geração
          </AccordionTrigger>
          <AccordionContent className="pt-4 space-y-6">
            <p className="text-sm text-muted-foreground pb-2">
              Ajuste fino dos parâmetros que controlam como o modelo gera as respostas.
            </p>
            {isWizardMode ? (
            <FormField
              control={control}
              name="generateContentConfig.temperature"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Criatividade da Resposta</FormLabel>
                  <Select
                    onValueChange={(valueString) => field.onChange(parseFloat(valueString))}
                    value={field.value?.toString() ?? '0.7'} // Default to 'Balanceado'
                    disabled={disabled}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o nível de criatividade" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {temperatureOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value.toString()}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Controla o quão criativa ou factual será a resposta do agente.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          ) : (
            <FormField
            control={control}
            name="generateContentConfig.temperature"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Temperatura: {temperatureValue.toFixed(1)}</FormLabel>
                  <FormControl>
                    <Slider
                      min={0}
                      max={2} // ADK for Gemini supports up to 2.0 for temperature
                      step={0.1}
                      value={[field.value || 0.7]} // Default value if undefined
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
                      step={0.01} // Finer control for Top P
                      value={[field.value || 0.95]} // Default value if undefined
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
                      max={100} // Example range, adjust as needed for Gemini
                      step={1}
                      value={[field.value || 1]} // Default value if undefined
                      onValueChange={(value) => field.onChange(value[0])}
                      disabled={disabled}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            )}
            {!isWizardMode && (
            <FormField
              control={control}
              name="generateContentConfig.maxOutputTokens"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center">
                    Max Output Tokens
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="w-4 h-4 ml-1.5 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            Máximo de tokens na resposta. O modelo{' '}
                            {selectedModel?.name || 'selecionado'} suporta até{' '}
                            {selectedModel?.maxTokens || 'N/A'} tokens.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      value={field.value || selectedModel?.maxTokens || 2048}
                      onChange={(e) => {
                        const numValue = parseInt(e.target.value, 10)
                        if (selectedModel && numValue > selectedModel.maxTokens) {
                          field.onChange(selectedModel.maxTokens)
                        } else if (numValue < 1) {
                          field.onChange(1)
                        } else {
                          field.onChange(numValue)
                        }
                      }}
                      max={selectedModel?.maxTokens}
                      min={1}
                      disabled={disabled}
                    />
                  </FormControl>
                  <FormDescription>
                    Define o limite máximo de tokens para a resposta gerada.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="generateContentConfig.stopSequences"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sequências de Parada</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Digite uma sequência e pressione Enter"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          const newValue = e.currentTarget.value.trim()
                          if (newValue && !field.value?.includes(newValue)) {
                            field.onChange([...(field.value || []), newValue])
                            e.currentTarget.value = ''
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
                    {stopSequencesValue.map((seq, index) => (
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
                            const newSequences = [...stopSequencesValue]
                            newSequences.splice(index, 1)
                            field.onChange(newSequences)
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
        </Accordion>
      )}
    </div>
  )
}
