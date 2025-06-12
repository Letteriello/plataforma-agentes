/**
 * @file Card para exibir um único Indicador Chave de Desempenho (KPI).
 */

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react'
import { Kpi } from '@/types/roi'

interface KpiCardProps {
  kpi: Kpi
}

const ICONS = {
  increase: <ArrowUpRight className="h-4 w-4 text-green-500" />,
  decrease: <ArrowDownRight className="h-4 w-4 text-red-500" />,
  neutral: <Minus className="h-4 w-4 text-gray-500" />,
}

const CHANGE_COLORS = {
  increase: 'text-green-500',
  decrease: 'text-red-500',
  neutral: 'text-gray-500',
}

export const KpiCard: React.FC<KpiCardProps> = ({ kpi }) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
        {/* Icon can be placed here if needed */}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{kpi.value}</div>
        <p className="text-xs text-muted-foreground flex items-center">
          <span className={`mr-1 ${CHANGE_COLORS[kpi.changeType]}`}>
            {ICONS[kpi.changeType]}
          </span>
          <span className={`mr-1 ${CHANGE_COLORS[kpi.changeType]}`}>
            {kpi.change}
          </span>
          {kpi.description}
        </p>
      </CardContent>
    </Card>
  )
}
