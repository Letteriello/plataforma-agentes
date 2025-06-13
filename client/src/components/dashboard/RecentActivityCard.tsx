import { ChevronRight } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export interface Activity {
  id: string
  type: string
  message: string
  timestamp: string
  user: string
}

interface RecentActivityCardProps {
  activities: Activity[]
  onViewAll?: () => void
  className?: string
}

export function RecentActivityCard({
  activities,
  onViewAll,
  className = '',
}: RecentActivityCardProps) {
  const formatTimeAgo = (timestamp: string) => {
    const now = new Date()
    const date = new Date(timestamp)
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return 'Agora mesmo'
    if (diffInSeconds < 3600)
      return `Há ${Math.floor(diffInSeconds / 60)} minutos`
    if (diffInSeconds < 86400)
      return `Há ${Math.floor(diffInSeconds / 3600)} horas`
    if (diffInSeconds < 604800)
      return `Há ${Math.floor(diffInSeconds / 86400)} dias`
    return date.toLocaleDateString('pt-BR')
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'agent_created':
        return '🆕'
      case 'agent_updated':
        return '✏️'
      case 'agent_deleted':
        return '🗑️'
      default:
        return 'ℹ️'
    }
  }

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Atividade Recente</CardTitle>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 text-muted-foreground"
          onClick={onViewAll}
        >
          Ver tudo <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {activities.slice(0, 5).map((activity) => (
            <div key={activity.id} className="flex items-start">
              <div className="mr-3 mt-1 text-lg">
                {getActivityIcon(activity.type)}
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">{activity.message}</p>
                <p className="text-xs text-muted-foreground">
                  {activity.user} • {formatTimeAgo(activity.timestamp)}
                </p>
              </div>
            </div>
          ))}
          {activities.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              Nenhuma atividade recente
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
