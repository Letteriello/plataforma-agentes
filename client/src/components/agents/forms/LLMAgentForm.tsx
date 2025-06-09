import { useFormContext } from 'react-hook-form';
import { LLMAgent } from '@/types/agents';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useCallback, useMemo } from 'react';
import { useAgentForm } from '../AgentForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

// Available models with their details
const AVAILABLE_MODELS = [
  { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', maxTokens: 8192 },
  { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash', maxTokens: 8192 },
  { id: 'gemini-1.0-pro', name: 'Gemini 1.0 Pro', maxTokens: 2048 },
  { id: 'gemini-1.5-pro-latest', name: 'Gemini 1.5 Pro (Latest)', maxTokens: 1048576 },
];

type LLMAgentFormProps = {
  disabled?: boolean;
  className?: string;
};

export function LLMAgentForm({ disabled = false, className = '' }: LLMAgentFormProps) {
  const {
    registerField,
    setFieldValue,
    values,
    formState: { errors },
  } = useAgentForm();

  const selectedModel = useMemo(
    () => AVAILABLE_MODELS.find((m) => m.id === values.model) || AVAILABLE_MODELS[0],
    [values.model]
  );

  const handleModelChange = useCallback(
    (value: string) => {
      setFieldValue('model', value, true);
      // Update max tokens to the model's default if current value is higher than the model's max
      const model = AVAILABLE_MODELS.find((m) => m.id === value);
      if (model && values.maxTokens > model.maxTokens) {
        setFieldValue('maxTokens', model.maxTokens, true);
      }
    },
    [setFieldValue, values.maxTokens]
  );

  const handleTemperatureChange = useCallback(
    (value: number[]) => {
      setFieldValue('temperature', value[0], true);
    },
    [setFieldValue]
  );

  const handleMaxTokensChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseInt(e.target.value, 10);
      if (!isNaN(value) && value > 0 && value <= selectedModel.maxTokens) {
        setFieldValue('maxTokens', value, true);
      }
    },
    [selectedModel.maxTokens, setFieldValue]
  );

  const handleTopPChange = useCallback(
    (value: number[]) => {
      setFieldValue('topP', value[0], true);
    },
    [setFieldValue]
  );

  const handleTopKChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseInt(e.target.value, 10);
      if (!isNaN(value) && value >= 1 && value <= 100) {
        setFieldValue('topK', value, true);
      }
    },
    [setFieldValue]
  );

  const handleStopSequenceAdd = useCallback(() => {
    const newSequence = prompt('Enter a stop sequence:');
    if (newSequence) {
      const currentSequences = values.stopSequences || [];
      if (!currentSequences.includes(newSequence)) {
        setFieldValue('stopSequences', [...currentSequences, newSequence], true);
      }
    }
  }, [setFieldValue, values.stopSequences]);

  const handleStopSequenceRemove = useCallback(
    (index: number) => {
      const newSequences = [...(values.stopSequences || [])];
      newSequences.splice(index, 1);
      setFieldValue('stopSequences', newSequences, true);
    },
    [setFieldValue, values.stopSequences]
  );

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Basic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={registerField}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Agent Name</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="My LLM Agent" 
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
            name="model"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Model</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                  disabled={disabled}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a model" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="gemini-1.5-pro">Gemini 1.5 Pro</SelectItem>
                    <SelectItem value="gemini-1.5-flash">Gemini 1.5 Flash</SelectItem>
                    <SelectItem value="gemini-1.5-pro-latest">Gemini 1.5 Pro Latest</SelectItem>
                    <SelectItem value="gemini-1.5-flash-latest">Gemini 1.5 Flash Latest</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="What does this agent do?" 
                  {...field} 
                  disabled={disabled}
                  rows={2}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Model Settings */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Model Settings</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <FormField
              control={control}
              name="temperature"
              render={({ field }) => (
                <FormItem>
                  <div className="flex justify-between items-center">
                    <FormLabel>Temperature: {temperature.toFixed(1)}</FormLabel>
                    <span className="text-sm text-muted-foreground">
                      {temperature < 0.3 ? 'Deterministic' : 
                       temperature < 0.7 ? 'Balanced' : 'Creative'}
                    </span>
                  </div>
                  <FormControl>
                    <Slider
                      min={0}
                      max={2}
                      step={0.1}
                      value={[field.value]}
                      onValueChange={(value) => field.onChange(value[0])}
                      disabled={disabled}
                    />
                  </FormControl>
                  <FormDescription>
                    Lower values make the output more focused and deterministic.
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
                  <FormLabel>Max Tokens: {maxTokens}</FormLabel>
                  <FormControl>
                    <Slider
                      min={1}
                      max={8192}
                      step={1}
                      value={[field.value]}
                      onValueChange={(value) => field.onChange(value[0])}
                      disabled={disabled}
                    />
                  </FormControl>
                  <FormDescription>
                    Maximum number of tokens to generate in the response.
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
                  <FormLabel>Top-P: {field.value}</FormLabel>
                  <FormControl>
                    <Slider
                      min={0.1}
                      max={1}
                      step={0.1}
                      value={[field.value]}
                      onValueChange={(value) => field.onChange(value[0])}
                      disabled={disabled}
                    />
                  </FormControl>
                  <FormDescription>
                    Controls diversity via nucleus sampling. Lower values make the output more focused.
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
                      onValueChange={(value) => field.onChange(value[0])}
                      disabled={disabled}
                    />
                  </FormControl>
                  <FormDescription>
                    Limits the next token selection to the top K most likely tokens.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Instructions</h3>
        <FormField
          control={control}
          name="instruction"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Instructions</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="You are a helpful assistant that..." 
                  {...field} 
                  disabled={disabled}
                  rows={4}
                  className="font-mono text-sm"
                />
              </FormControl>
              <FormDescription>
                System instructions that guide the agent's behavior and responses.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="systemPrompt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>System Prompt (Optional)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="## System Instructions\n- Be helpful and concise\n- Format responses in markdown" 
                  {...field} 
                  disabled={disabled}
                  rows={4}
                  className="font-mono text-sm"
                />
              </FormControl>
              <FormDescription>
                Additional system-level instructions in markdown format.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Advanced Settings */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Advanced Settings</h3>
        
        <FormField
          control={control}
          name="stopSequences"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Stop Sequences</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter sequences separated by commas" 
                  value={field.value.join(', ')} 
                  onChange={(e) => field.onChange(e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                  disabled={disabled}
                />
              </FormControl>
              <FormDescription>
                Sequences where the model will stop generating further tokens.
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
                <FormLabel>Frequency Penalty</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min="-2" 
                    max="2" 
                    step="0.1"
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
            name="presencePenalty"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Presence Penalty</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min="-2" 
                    max="2" 
                    step="0.1"
                    {...field} 
                    disabled={disabled}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
}
