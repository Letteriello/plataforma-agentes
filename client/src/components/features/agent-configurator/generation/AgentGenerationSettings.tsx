/**
 * @file AgentGenerationSettings.tsx
 * @description Componente para configurar os parâmetros de geração do LLM.
 */
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { LlmAgentConfig } from '@/types/agent';

interface AgentGenerationSettingsProps {
  config: Pick<LlmAgentConfig, 'temperature' | 'maxOutputTokens' | 'topP' | 'topK'>;
  onNumberInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const AgentGenerationSettings: React.FC<AgentGenerationSettingsProps> = ({
  config,
  onNumberInputChange,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Configurações de Geração</CardTitle>
        <CardDescription>Ajuste fino dos parâmetros de geração de resposta do LLM.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="temperature">Temperatura</Label>
            <Input
              id="temperature"
              name="temperature"
              type="number"
              value={config.temperature}
              onChange={onNumberInputChange}
              placeholder="Ex: 0.7"
              step="0.1"
            />
            <p className="text-sm text-muted-foreground mt-1">Controla a aleatoriedade. Menor = mais determinístico.</p>
          </div>
          <div>
            <Label htmlFor="maxOutputTokens">Máximo de Tokens de Saída</Label>
            <Input
              id="maxOutputTokens"
              name="maxOutputTokens"
              type="number"
              value={config.maxOutputTokens}
              onChange={onNumberInputChange}
              placeholder="Ex: 2048"
            />
            <p className="text-sm text-muted-foreground mt-1">Comprimento máximo da resposta gerada.</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="topP">Top P</Label>
            <Input
              id="topP"
              name="topP"
              type="number"
              value={config.topP}
              onChange={onNumberInputChange}
              placeholder="Ex: 1"
              step="0.1"
            />
            <p className="text-sm text-muted-foreground mt-1">Controla a diversidade via amostragem nucleus.</p>
          </div>
          <div>
            <Label htmlFor="topK">Top K</Label>
            <Input
              id="topK"
              name="topK"
              type="number"
              value={config.topK}
              onChange={onNumberInputChange}
              placeholder="Ex: 40"
            />
            <p className="text-sm text-muted-foreground mt-1">Filtra os tokens menos prováveis.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
