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
      <div className="flex flex-row justify-between items-center">
        {LEVELS.map((level) => (
          <button
            key={level.label}
            className={`flex flex-col items-center px-3 py-2 rounded border transition-colors focus:outline-none ${value === level.label ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted text-muted-foreground border-border'}`}
            onClick={() => onChange(level.label)}
            type="button"
            aria-pressed={value === level.label}
          >
            <span className="font-semibold">{level.label}</span>
            <span className="text-xs text-muted-foreground mt-1">
              {level.description}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
