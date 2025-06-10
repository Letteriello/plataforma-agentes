import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

interface ResourceConsumptionCardProps {
  totalTokens: number
  limit: number
  isLoading?: boolean
  error?: string | null
}

export function ResourceConsumptionCard({
  totalTokens,
  limit,
  isLoading,
  error,
}: ResourceConsumptionCardProps) {
  const percentage = Math.min((totalTokens / limit) * 100, 100)
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg">Consumo de Recursos</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error ? (
          <p className="text-sm text-destructive text-center py-4">{error}</p>
        ) : isLoading ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            Carregando...
          </p>
        ) : (
          <>
            <div className="flex justify-between text-sm font-medium">
              <span>{totalTokens} tokens usados</span>
              <span>limite {limit}</span>
            </div>
            <Progress value={percentage} />
          </>
        )}
      </CardContent>
    </Card>
  )
}
