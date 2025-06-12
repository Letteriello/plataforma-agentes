import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  LoadingSpinner,
} from '@/components/ui'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js'
import type { TokenUsageData as TokenUsage } from '@/services/dashboardService';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
)

interface TokenUsageCardProps {
  data: TokenUsage[]
  isLoading?: boolean
  error?: string | null
}

export function TokenUsageCard({
  data,
  isLoading,
  error,
}: TokenUsageCardProps) {
  const chartData = {
    labels: data.map((d) => new Date(d.day).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })),
    datasets: [
      {
        label: 'Tokens',
        data: data.map((d) => d.total_tokens),
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
