import React from 'react'

import { Scenario } from '@/types/simulation'

interface ScenarioSelectorProps {
  scenarios: Scenario[]
  onSelectScenario: (scenarioId: string) => void
}

export const ScenarioSelector: React.FC<ScenarioSelectorProps> = ({
  scenarios,
  onSelectScenario,
}) => {
  return (
    <div className="border rounded-lg p-4">
      <label
        htmlFor="scenario-select"
        className="block text-sm font-medium text-muted-foreground mb-2"
      >
        Selecione um Cenário de Teste
      </label>
      <select
        id="scenario-select"
        className="select w-full"
        onChange={(e) => onSelectScenario(e.target.value)}
        defaultValue=""
      >
        <option value="" disabled>
          Escolha um cenário...
        </option>
        {scenarios.map((scenario) => (
          <option key={scenario.id} value={scenario.id}>
            {scenario.name}
          </option>
        ))}
      </select>
    </div>
  )
}
