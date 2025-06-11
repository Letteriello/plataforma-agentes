import React from 'react'
import { ReasoningStep } from '@/types/simulation'

interface ReasoningPanelProps {
  steps: ReasoningStep[]
}

export const ReasoningPanel: React.FC<ReasoningPanelProps> = ({ steps }) => {
  return (
    <div className="border rounded-lg flex flex-col h-full">
      <div className="p-4 border-b">
        <h3 className="font-semibold">Painel de Raciocínio</h3>
      </div>
      <div className="flex-grow p-4 space-y-3 overflow-y-auto font-mono text-xs">
        {steps.map((step) => (
          <div key={step.id}>
            <p>
              <span className="text-blue-500 font-bold">[PENSAMENTO]</span>{' '}
              {step.thought}
            </p>
            {step.observation && (
              <p>
                <span className="text-green-500 font-bold">[OBSERVAÇÃO]</span>{' '}
                {step.observation}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
