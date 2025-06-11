import React from 'react'
import { Kpi } from '@/types/roi'

const getChangeColor = (changeType: 'increase' | 'decrease') => {
  return changeType === 'increase' ? 'text-green-500' : 'text-red-500'
}

const getChangeIcon = (changeType: 'increase' | 'decrease') => {
  return changeType === 'increase' ? '▲' : '▼'
}

export const KpiCard: React.FC<{ kpi: Kpi }> = ({ kpi }) => {
  return (
    <div className="bg-card p-4 rounded-lg border">
      <p className="text-sm font-medium text-muted-foreground">{kpi.title}</p>
      <div className="flex items-baseline gap-2 mt-1">
        <p className="text-2xl font-bold">{kpi.value}</p>
        <span
          className={`flex items-center text-sm font-semibold ${getChangeColor(kpi.changeType)}`}
        >
          {getChangeIcon(kpi.changeType)} {kpi.change}
        </span>
      </div>
      <p className="text-xs text-muted-foreground mt-1">{kpi.description}</p>
    </div>
  )
}
