import React from 'react'

import type { AutonomyLevel } from './AutonomySpectrumSelector'

const descriptions: Record<AutonomyLevel, string> = {
  Manual: 'Todas as ações requerem aprovação humana.',
  Assistido: 'Ações sugeridas pelo agente, mas dependem de confirmação.',
  'Semi-Autônomo':
    'Agente executa algumas ações automaticamente, outras requerem aprovação.',
  'Autônomo com Revisão':
    'Ações automáticas, mas passíveis de revisão posterior.',
  'Totalmente Autônomo': 'Agente opera sem intervenção humana.',
}

interface AutonomyLevelInfoProps {
  level: AutonomyLevel
}

export const AutonomyLevelInfo: React.FC<AutonomyLevelInfoProps> = ({
  level,
}) => (
  <div className="p-2 bg-muted rounded">
    <strong>{level}</strong>: {descriptions[level]}
  </div>
)
