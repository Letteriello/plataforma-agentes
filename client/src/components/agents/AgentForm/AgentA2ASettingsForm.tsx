import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface AgentA2ASettingsFormProps {
  timeoutMs: number | undefined;
  maxConcurrent: number | undefined;
  onTimeoutMsChange: (value: number) => void;
  onMaxConcurrentChange: (value: number) => void;
}

const AgentA2ASettingsForm: React.FC<AgentA2ASettingsFormProps> = ({
  timeoutMs,
  maxConcurrent,
  onTimeoutMsChange,
  onMaxConcurrentChange,
}) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Configurações A2A</h2>
      <div className="space-y-4">
        <div>
          <Label htmlFor="a2a-timeout">Tempo Limite (ms)</Label>
          <Input
            id="a2a-timeout"
            type="number"
            min={0}
            value={timeoutMs || 0} // Default to 0 if undefined
            onChange={(e) => {
              const value = parseInt(e.target.value);
              onTimeoutMsChange(Math.max(0, value || 0));
            }}
            className="mt-1 w-32"
          />
          <p className="mt-1 text-xs text-gray-500">
            Tempo máximo de espera para respostas (0 para sem limite).
          </p>
        </div>

        <div>
          <Label htmlFor="a2a-max-concurrent">Máximo de Requisições Paralelas</Label>
          <Input
            id="a2a-max-concurrent"
            type="number"
            min={1}
            value={maxConcurrent || 1} // Default to 1 if undefined
            onChange={(e) => {
              const value = parseInt(e.target.value);
              onMaxConcurrentChange(Math.max(1, value || 1));
            }}
            className="mt-1 w-24"
          />
        </div>
      </div>
    </div>
  );
};

export default AgentA2ASettingsForm;
