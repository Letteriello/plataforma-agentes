/**
 * @file AgentGenerationSettings.tsx
 * @description Componente para configurar os parâmetros de geração do LLM.
 */
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { LlmAgentConfig } from '@/types/agent';
import { Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface AgentGenerationSettingsProps {
  config: Pick<LlmAgentConfig, 'temperature' | 'maxOutputTokens' | 'topP' | 'topK'>;
  onNumberInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSliderChange: (name: string, value: number) => void;
}

export const AgentGenerationSettings: React.FC<AgentGenerationSettingsProps> = ({
  config,
  onNumberInputChange,
  onSliderChange,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Configurações de Geração</h3>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground transition-colors cursor-help" />
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-[280px] text-xs">
              <p>Ajuste os parâmetros de geração do modelo. Passe o mouse sobre cada opção para mais detalhes.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="temperature" className="text-xs font-medium text-muted-foreground">
                Temperatura
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-3 w-3 inline-block ml-1 mb-0.5" />
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-[240px] text-xs">
                      <p>Controla a aleatoriedade. Baixo = mais previsível, Alto = mais criativo.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
              <span className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded">
                {config.temperature?.toFixed(1) || '0.7'}
              </span>
            </div>
            <Slider
              id="temperature"
              min={0}
              max={2}
              step={0.1}
              value={[config.temperature ?? 0.7]}
              onValueChange={([value]) => onSliderChange('temperature', value)}
              className="w-full"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="maxOutputTokens" className="text-xs font-medium text-muted-foreground">
                Máx. Tokens
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-3 w-3 inline-block ml-1 mb-0.5" />
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-[240px] text-xs">
                      <p>Limite de tokens na resposta. Controla o comprimento da saída.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
              <span className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded">
                {config.maxOutputTokens || 1000}
              </span>
            </div>
            <Slider
              id="maxOutputTokens"
              min={100}
              max={4000}
              step={100}
              value={[config.maxOutputTokens ?? 1000]}
              onValueChange={([value]) => onSliderChange('maxOutputTokens', value)}
              className="w-full"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="topP" className="text-xs font-medium text-muted-foreground">
                Top P
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-3 w-3 inline-block ml-1 mb-0.5" />
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-[240px] text-xs">
                      <p>Controla a diversidade da saída. Baixo = mais focado, Alto = mais diversificado.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
              <span className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded">
                {config.topP?.toFixed(1) || '0.9'}
              </span>
            </div>
            <Slider
              id="topP"
              min={0.1}
              max={1}
              step={0.1}
              value={[config.topP ?? 0.9]}
              onValueChange={([value]) => onSliderChange('topP', Number(value.toFixed(1)))}
              className="w-full"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="topK" className="text-xs font-medium text-muted-foreground">
                Top K
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-3 w-3 inline-block ml-1 mb-0.5" />
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-[240px] text-xs">
                      <p>Limita a escolha aos K tokens mais prováveis. Baixo = mais previsível.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
              <span className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded">
                {config.topK || 40}
              </span>
            </div>
            <Slider
              id="topK"
              min={1}
              max={100}
              step={1}
              value={[config.topK ?? 40]}
              onValueChange={([value]) => onSliderChange('topK', value)}
              className="w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
