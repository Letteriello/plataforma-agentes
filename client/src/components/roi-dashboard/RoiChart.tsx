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
    <div className="h-80 w-full bg-card p-4 rounded-lg border">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="cost" stroke="#ef4444" name="Custo" />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#22c55e"
            name="Receita"
          />
          <Line
            type="monotone"
            dataKey="savings"
            stroke="#3b82f6"
            name="Economia"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
