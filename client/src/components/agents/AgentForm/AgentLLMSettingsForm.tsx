import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';

interface AgentLLMSettingsFormProps {
  model: string;
  temperature: number;
  streaming: boolean;
  onModelChange: (value: string) => void;
  onTemperatureChange: (value: number) => void;
  onStreamingChange: (value: boolean) => void;
}

const AgentLLMSettingsForm: React.FC<AgentLLMSettingsFormProps> = ({
  model,
  temperature,
  streaming,
  onModelChange,
  onTemperatureChange,
  onStreamingChange,
}) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Configurações Avançadas</h2>
      <div className="space-y-4">
        <div>
          <Label htmlFor="agent-model">Modelo</Label>
          <Input
            id="agent-model"
            value={model}
            onChange={(e) => onModelChange(e.target.value)}
            placeholder="Ex: gpt-4, claude-2, etc."
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="agent-temperature">Temperatura: {temperature}</Label>
          <div className="flex items-center space-x-4 mt-2">
            <span className="text-sm text-gray-500">0.0</span>
            <Slider
              id="agent-temperature"
              min={0}
              max={2}
              step={0.1}
              value={[temperature]}
              onValueChange={([value]) => onTemperatureChange(value)}
              className="flex-1"
            />
            <span className="text-sm text-gray-500">2.0</span>
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Valores mais baixos tornam as saídas mais focadas e determinísticas.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="agent-streaming"
            checked={streaming}
            onCheckedChange={(checked) => onStreamingChange(checked as boolean)}
          />
          <Label htmlFor="agent-streaming" className="font-normal">
            Habilitar streaming de respostas
          </Label>
        </div>
      </div>
    </div>
  );
};

export default AgentLLMSettingsForm;
