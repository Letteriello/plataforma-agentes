

/**
 * @file Gráfico de linhas para visualizar a análise de Custo vs. Benefício.
 */

import React from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { RoiDataPoint } from '@/types/roi'

interface RoiChartProps {
  data: RoiDataPoint[]
}

export const RoiChart: React.FC<RoiChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis tickFormatter={(value) => `R$${value}`} />
        <Tooltip formatter={(value: number) => `R$${value.toFixed(2)}`} />
        <Legend />
        <Line
          type="monotone"
          dataKey="benefit"
          stroke="#22c55e" // green-500
          strokeWidth={2}
          name="Benefício"
        />
        <Line
          type="monotone"
          dataKey="cost"
          stroke="#ef4444" // red-500
          strokeWidth={2}
          name="Custo"
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
