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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { HelpCircle } from 'lucide-react'
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
  disabled?: boolean
  className?: string
}

export function LLMAgentForm({
  disabled = false,
  className = '',
}: LLMAgentFormProps) {
  const { control, watch, setValue } = useFormContext<LLMAgent>()

  const modelValue = watch('model')
  // Alinhado com a nova estrutura aninhada do ADK
  const temperatureValue = watch('generateContentConfig.temperature', 0.7)
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
                <FormLabel>Modelo Base</FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value)
                    handleModelChange(value)
                  }}
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
            name="generateContentConfig.maxOutputTokens"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Max Tokens: {maxTokensValue}</FormLabel>
                <FormControl>
                  <Slider
                    min={1}
                    max={selectedModel?.maxTokens || 8192}
                    step={1}
                    value={[field.value || 2048]} // Default value if undefined
                    onValueChange={(value) => field.onChange(value[0])}
                    disabled={disabled}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={control}
              name="generateContentConfig.topP"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Top P: {field.value?.toFixed(1)}</FormLabel>
                  <FormControl>
                    <Slider
                      min={0}
                      max={1}
                      step={0.1}
                      value={[field.value || 1]} // Default value if undefined
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
                  <FormLabel>Top K: {field.value}</FormLabel>
                  <FormControl>
                    <Slider
                      min={1}
                      max={100}
                      step={1}
                      value={[field.value || 40]} // Default value if undefined
                      onValueChange={(value) => field.onChange(value[0])}
                      disabled={disabled}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

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
                        onClick={() => {
                          const newSequences = [...stopSequencesValue]
                          newSequences.splice(index, 1)
                          field.onChange(newSequences)
                        }}
                      >
                        {seq} &times;
                      </ToggleGroupItem>
                    </ToggleGroup>
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Campos de Frequency e Presence Penalty removidos para alinhar com o Google ADK */}
        </CardContent>
      </Card>
    </div>
  )
}
