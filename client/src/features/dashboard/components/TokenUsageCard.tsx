import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from 'chart.js'
import { Line } from 'react-chartjs-2'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  LoadingSpinner,
} from '@/components/ui'
import type { TokenUsageCardProps, TokenUsageData } from '@/features/dashboard/types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
)



export function TokenUsageCard({
  data,
  isLoading,
  error,
}: TokenUsageCardProps) {
  const chartData = {
    labels: data.map((d: TokenUsageData) => new Date(d.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })),
    datasets: [
      {
        label: 'Tokens',
        data: data.map((d: TokenUsageData) => d.tokens),
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59,130,246,0.3)',
        fill: true,
      },
    ],
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg">Uso de Tokens</CardTitle>
      </CardHeader>
      <CardContent>
        {error ? (
          <p className="text-sm text-destructive text-center py-4">{error}</p>
        ) : isLoading ? (
          <div className="flex justify-center py-4">
            <LoadingSpinner />
          </div>
        ) : (
          <Line data={chartData} />
        )}
      </CardContent>
    </Card>
  )
}

export default TokenUsageCard
