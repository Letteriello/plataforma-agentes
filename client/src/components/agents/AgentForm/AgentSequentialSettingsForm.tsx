import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

interface AgentSequentialSettingsFormProps {
  maxSteps: number | undefined; // maxSteps can be undefined initially
  stopOnError: boolean | undefined; // stopOnError can be undefined initially
  onMaxStepsChange: (value: number) => void;
  onStopOnErrorChange: (value: boolean) => void;
}

const AgentSequentialSettingsForm: React.FC<AgentSequentialSettingsFormProps> = ({
  maxSteps,
  stopOnError,
  onMaxStepsChange,
  onStopOnErrorChange,
}) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Configurações de Fluxo Sequencial</h2>
      <div className="space-y-4">
        <div>
          <Label htmlFor="sequential-max-steps">Máximo de Passos</Label>
          <Input
            id="sequential-max-steps"
            type="number"
            min={1}
            max={50}
            value={maxSteps || 1} // Provide a default if undefined
            onChange={(e) => {
              const value = parseInt(e.target.value);
              onMaxStepsChange(Math.min(50, Math.max(1, value || 1)));
            }}
            className="mt-1 w-24"
          />
          <p className="mt-1 text-xs text-gray-500">
            Número máximo de passos que o agente pode executar.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="sequential-stop-on-error"
            checked={stopOnError || false} // Provide a default if undefined
            onCheckedChange={(checked) => onStopOnErrorChange(checked as boolean)}
          />
          <Label htmlFor="sequential-stop-on-error" className="font-normal">
            Parar execução em caso de erro
          </Label>
        </div>
      </div>
    </div>
  );
};

export default AgentSequentialSettingsForm;
