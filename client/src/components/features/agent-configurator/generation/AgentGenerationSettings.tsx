/**
 * @file AgentGenerationSettings.tsx
 * @description Componente para configurar os parâmetros de geração do LLM.
 */
import React from 'react'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { LlmAgentConfig } from '@/types/agent'
import { Info } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

interface AgentGenerationSettingsProps {
  config: Pick<
    LlmAgentConfig,
    'temperature' | 'maxOutputTokens' | 'topP' | 'topK'
  >
  onNumberInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onSliderChange: (name: string, value: number) => void
}

export const AgentGenerationSettings: React.FC<
  AgentGenerationSettingsProps
> = ({ config, onNumberInputChange, onSliderChange }) => {
  return (
    <div className="space-y-5 p-1">
      {' '}
      {/* Reduced overall padding and adjusted inter-section spacing */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
        {' '}
        {/* Adjusted gaps */}
        {/* Temperature */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label
              htmlFor="temperature"
              className="text-xs font-medium text-muted-foreground flex items-center"
            >
              Temperatura
              <TooltipProvider delayDuration={200}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-3 w-3 ml-1.5 text-muted-foreground/70 hover:text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent
                    side="top"
                    className="max-w-[240px] text-xs p-2"
                  >
                    <p>
                      Controla a aleatoriedade da saída. Valores mais baixos
                      tornam o resultado mais focado e determinístico, enquanto
                      valores mais altos geram respostas mais criativas e
                      diversas.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Label>
            <span className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded-sm select-none">
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
            className="w-full [&>span:first-child]:h-1.5 [&>span:first-child_>span]:h-1.5" // Compact slider track
          />
        </div>
        {/* Max Output Tokens */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label
              htmlFor="maxOutputTokens"
              className="text-xs font-medium text-muted-foreground flex items-center"
            >
              Máx. Tokens de Saída
              <TooltipProvider delayDuration={200}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-3 w-3 ml-1.5 text-muted-foreground/70 hover:text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent
                    side="top"
                    className="max-w-[240px] text-xs p-2"
                  >
                    <p>
                      Define o número máximo de tokens que o modelo pode gerar
                      na resposta. Controla o comprimento da saída.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Label>
            <span className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded-sm select-none">
              {config.maxOutputTokens || 1000}
            </span>
          </div>
          <Slider
            id="maxOutputTokens"
            min={100}
            max={4000}
            step={100}
            value={[config.maxOutputTokens ?? 1000]}
            onValueChange={([value]) =>
              onSliderChange('maxOutputTokens', value)
            }
            className="w-full [&>span:first-child]:h-1.5 [&>span:first-child_>span]:h-1.5" // Compact slider track
          />
        </div>
        {/* Top P */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label
              htmlFor="topP"
              className="text-xs font-medium text-muted-foreground flex items-center"
            >
              Top P
              <TooltipProvider delayDuration={200}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-3 w-3 ml-1.5 text-muted-foreground/70 hover:text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent
                    side="top"
                    className="max-w-[240px] text-xs p-2"
                  >
                    <p>
                      Controla a diversidade da seleção de tokens. O modelo
                      considera apenas os tokens cuja probabilidade acumulada
                      excede o valor de Top P. Valores próximos a 1.0 consideram
                      mais tokens (mais diversidade), enquanto valores menores
                      focam nos tokens mais prováveis.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Label>
            <span className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded-sm select-none">
              {config.topP?.toFixed(1) || '0.9'}
            </span>
          </div>
          <Slider
            id="topP"
            min={0.1}
            max={1}
            step={0.1}
            value={[config.topP ?? 0.9]}
            onValueChange={([value]) =>
              onSliderChange('topP', Number(value.toFixed(1)))
            }
            className="w-full [&>span:first-child]:h-1.5 [&>span:first-child_>span]:h-1.5" // Compact slider track
          />
        </div>
        {/* Top K */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label
              htmlFor="topK"
              className="text-xs font-medium text-muted-foreground flex items-center"
            >
              Top K
              <TooltipProvider delayDuration={200}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-3 w-3 ml-1.5 text-muted-foreground/70 hover:text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent
                    side="top"
                    className="max-w-[240px] text-xs p-2"
                  >
                    <p>
                      Filtra o vocabulário de saída para incluir apenas os K
                      tokens mais prováveis. Reduz a chance de tokens
                      improváveis serem selecionados, tornando a saída mais
                      coerente e previsível.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Label>
            <span className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded-sm select-none">
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
            className="w-full [&>span:first-child]:h-1.5 [&>span:first-child_>span]:h-1.5" // Compact slider track
          />
        </div>
      </div>
    </div>
  )
}
