import { useFormContext } from 'react-hook-form'
import { LLMAgent } from '@/types/agents'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useCallback, useMemo } from 'react'
// import { useAgentForm } from '../AgentForm'; // Replaced with useFormContext
import { useFormContext } from 'react-hook-form'
import { LLMAgent } from '@/types/agents' // Added LLMAgent type
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

// Available models with their details
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
  const maxTokensValue = watch('maxTokens')
  const stopSequencesValue = watch('stopSequences', [])
  const temperatureValue = watch('temperature', 0.7)
  // const maxTokensForDisplay = watch('maxTokens', 2048); // Already have maxTokensValue

  const selectedModel = useMemo(
    () =>
      AVAILABLE_MODELS.find((m) => m.id === modelValue) || AVAILABLE_MODELS[0],
    [modelValue],
  )

  const handleModelChange = useCallback(
    (value: string) => {
      setValue('model', value, { shouldValidate: true })
      const model = AVAILABLE_MODELS.find((m) => m.id === value)
      if (model && maxTokensValue > model.maxTokens) {
        setValue('maxTokens', model.maxTokens, { shouldValidate: true })
      }
    },
    [setValue, maxTokensValue],
  )

  const handleTemperatureChange = useCallback(
    (value: number[]) => {
      setValue('temperature', value[0], { shouldValidate: true })
    },
    [setValue],
  )

  const handleMaxTokensChange = useCallback(
    (value: number[]) => {
      const val = value[0]
      if (val > 0 && val <= selectedModel.maxTokens) {
        setValue('maxTokens', val, { shouldValidate: true })
      } else if (val > selectedModel.maxTokens) {
        setValue('maxTokens', selectedModel.maxTokens, { shouldValidate: true })
      }
    },
    [selectedModel.maxTokens, setValue],
  )

  const handleTopPChange = useCallback(
    (value: number[]) => {
      setValue('topP', value[0], { shouldValidate: true })
    },
    [setValue],
  )

  const handleTopKChange = useCallback(
    (value: number[]) => {
      setValue('topK', value[0], { shouldValidate: true })
    },
    [setValue],
  )

  const handleStopSequenceAdd = useCallback(() => {
    const newSequence = prompt('Enter a stop sequence:')
    if (newSequence) {
      const currentSequences = stopSequencesValue || []
      if (!currentSequences.includes(newSequence)) {
        setValue('stopSequences', [...currentSequences, newSequence], {
          shouldValidate: true,
        })
      }
    }
  }, [setValue, stopSequencesValue])

  const handleStopSequenceRemove = useCallback(
    (index: number) => {
      const newSequences = [...(stopSequencesValue || [])]
      newSequences.splice(index, 1)
      setValue('stopSequences', newSequences, { shouldValidate: true })
    },
    [setValue, stopSequencesValue],
  )

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Name and Description FormFields removed */}
      <Card>
        <CardHeader>
          <CardTitle>Model Configuration</CardTitle>
          <CardDescription>
            Select the base LLM model and its core parameters.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            control={control}
            name="model"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Model</FormLabel>
                <Select
                  onValueChange={handleModelChange}
                  value={field.value}
                  disabled={disabled}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a model" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {AVAILABLE_MODELS.map((m) => (
                      <SelectItem key={m.id} value={m.id}>
                        {m.name} (Max Tokens: {m.maxTokens})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Model Settings are now part of this card's content */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            <div className="space-y-4">
              <FormField
                control={control}
                name="temperature"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-between items-center">
                      <FormLabel>
                        Temperature: {field.value?.toFixed(1)}
                      </FormLabel>
                      <span className="text-sm text-muted-foreground">
                        {field.value < 0.3
                          ? 'Deterministic'
                          : field.value < 0.7
                            ? 'Balanced'
                            : 'Creative'}
                      </span>
                    </div>
                    <FormControl>
                      <Slider
                        min={0}
                        max={2}
                        step={0.1}
                        value={[field.value]}
                        onValueChange={handleTemperatureChange}
                        disabled={disabled}
                      />
                    </FormControl>
                    <FormDescription>
                      Lower values make the output more focused and
                      deterministic.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="maxTokens"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max Tokens: {field.value}</FormLabel>
                    <FormControl>
                      <Slider
                        min={1}
                        max={selectedModel.maxTokens}
                        step={1}
                        value={[field.value]}
                        onValueChange={handleMaxTokensChange}
                        disabled={disabled}
                      />
                    </FormControl>
                    <FormDescription>
                      Max for {selectedModel.name}: {selectedModel.maxTokens}.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <FormField
                control={control}
                name="topP"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Top-P: {field.value?.toFixed(1)}</FormLabel>
                    <FormControl>
                      <Slider
                        min={0.1}
                        max={1}
                        step={0.1}
                        value={[field.value]}
                        onValueChange={handleTopPChange}
                        disabled={disabled}
                      />
                    </FormControl>
                    <FormDescription>
                      Controls diversity via nucleus sampling.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="topK"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Top-K: {field.value}</FormLabel>
                    <FormControl>
                      <Slider
                        min={1}
                        max={100}
                        step={1}
                        value={[field.value]}
                        onValueChange={handleTopKChange}
                        disabled={disabled}
                      />
                    </FormControl>
                    <FormDescription>
                      Limits selection to top K likely tokens.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Instructions section removed */}

      {/* Advanced Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Advanced Settings</CardTitle>
          <CardDescription>Fine-tune other model behaviors.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            control={control}
            name="stopSequences"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stop Sequences</FormLabel>
                <div className="flex items-center gap-2">
                  <FormControl>
                    <Input
                      placeholder="e.g., ###, ---"
                      value={field.value?.join(', ') || ''}
                      onChange={(e) => {
                        const newSequences = e.target.value
                          .split(',')
                          .map((s) => s.trim())
                          .filter(Boolean)
                        field.onChange(newSequences)
                      }}
                      disabled={disabled}
                    />
                  </FormControl>
                </div>
                {field.value && field.value.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {field.value.map((seq, index) => (
                      <span
                        key={index}
                        className="flex items-center gap-1 px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded-md text-sm"
                      >
                        {seq}
                        <button
                          type="button"
                          onClick={() => handleStopSequenceRemove(index)}
                          className="text-red-500 hover:text-red-700"
                          disabled={disabled}
                        >
                          &times;
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                <FormDescription>
                  Sequences where the model will stop generating. Separate by
                  comma.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={control}
              name="frequencyPenalty"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Frequency Penalty: {field.value?.toFixed(1)}
                  </FormLabel>
                  <FormControl>
                    <Slider
                      min={-2}
                      max={2}
                      step={0.1}
                      value={[field.value]}
                      onValueChange={(value) => field.onChange(value[0])}
                      disabled={disabled}
                    />
                  </FormControl>
                  <FormDescription>
                    Positive values penalize new tokens based on their existing
                    frequency.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="presencePenalty"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Presence Penalty: {field.value?.toFixed(1)}
                  </FormLabel>
                  <FormControl>
                    <Slider
                      min={-2}
                      max={2}
                      step={0.1}
                      value={[field.value]}
                      onValueChange={(value) => field.onChange(value[0])}
                      disabled={disabled}
                    />
                  </FormControl>
                  <FormDescription>
                    Positive values penalize new tokens if they appear in the
                    text so far.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
