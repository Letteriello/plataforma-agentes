import React from 'react'

export type AutonomyLevel =
  | 'Manual'
  | 'Assistido'
  | 'Semi-Autônomo'
  | 'Autônomo com Revisão'
  | 'Totalmente Autônomo'

interface AutonomySpectrumSelectorProps {
  value: AutonomyLevel
  onChange: (level: AutonomyLevel) => void
}

const LEVELS: { label: AutonomyLevel; description: string }[] = [
  { label: 'Manual', description: 'Todas as ações requerem aprovação humana.' },
  {
    label: 'Assistido',
    description: 'Ações sugeridas pelo agente, mas dependem de confirmação.',
  },
  {
    label: 'Semi-Autônomo',
    description:
      'Agente executa algumas ações automaticamente, outras requerem aprovação.',
  },
  {
    label: 'Autônomo com Revisão',
    description: 'Ações automáticas, mas passíveis de revisão posterior.',
  },
  {
    label: 'Totalmente Autônomo',
    description: 'Agente opera sem intervenção humana.',
  },
]

export const AutonomySpectrumSelector: React.FC<
  AutonomySpectrumSelectorProps
> = ({ value, onChange }) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row justify-between items-stretch gap-4">
        {LEVELS.map((level) => (
          <button
            key={level.label}
            className={`flex-1 flex flex-col items-center text-center p-4 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${value === level.label ? 'bg-primary text-primary-foreground border-primary shadow-md' : 'bg-card hover:bg-muted/50'}`}
            onClick={() => onChange(level.label)}
            type="button"
            aria-pressed={value === level.label}
          >
            <span className="font-semibold text-sm md:text-base">{level.label}</span>
            <span className="text-xs text-muted-foreground mt-2 hidden md:block">
              {level.description}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
