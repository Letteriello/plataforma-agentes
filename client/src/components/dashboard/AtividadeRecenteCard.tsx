import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Info, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react'
import type { Activity } from '@/store/dashboardStore'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ComponentSkeleton } from '@/components/ui'

const activityIcons: Record<Activity['type'], React.ReactElement> = {
  info: <Info className="h-4 w-4" />,
  success: <CheckCircle2 className="h-4 w-4" />,
  warning: <AlertTriangle className="h-4 w-4" />,
  error: <XCircle className="h-4 w-4" />,
}

const activityColors = {
  info: 'text-blue-500 bg-blue-500/10',
  success: 'text-emerald-500 bg-emerald-500/10',
  warning: 'text-amber-500 bg-amber-500/10',
  error: 'text-red-500 bg-red-500/10',
}

interface AtividadeRecenteCardProps {
  activities: Activity[]
  isLoading?: boolean
  error?: string | null
}

export function AtividadeRecenteCard({
  activities,
  isLoading,
  error,
}: AtividadeRecenteCardProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg">Atividade Recente</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {error ? (
            <p className="text-sm text-destructive text-center py-4">{error}</p>
          ) : isLoading ? (
            <ComponentSkeleton lines={4} />
          ) : activities.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              Nenhuma atividade recente
            </p>
          ) : (
            <ScrollArea className="h-72 pr-4">
              <div className="relative">
                {/* Linha do tempo */}
                <div className="absolute left-4 top-0 h-full w-0.5 bg-border -translate-x-1/2" />

                <div className="space-y-6">
                  {activities.map((activity) => (
                    <div key={activity.id} className="relative pl-8">
                      {/* Ponto da linha do tempo */}
                      <div
                        className={`absolute left-0 top-1 flex h-4 w-4 items-center justify-center rounded-full ${activityColors[activity.type]}`}
                      >
                        {activityIcons[activity.type]}
                      </div>

                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {activity.message}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(activity.timestamp), {
                            addSuffix: true,
                            locale: ptBR,
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollArea>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
