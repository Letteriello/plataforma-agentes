import { Plus } from 'lucide-react'

import { ComponentSkeleton, Skeleton } from '@/components/ui'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import type { Agent } from '@/store/dashboardStore'

interface MeusAgentesCardProps {
  agents: Agent[]
  onCreateAgent: () => void
  onAgentClick: (agent: Agent) => void
  className?: string
  createButton?: React.ReactNode
  isLoading?: boolean
  error?: string | null
}

const statusVariantMap = {
  online: 'success',
  busy: 'warning',
  offline: 'outline',
  error: 'destructive',
} as const

const typeIconMap = {
  llm: '🤖',
  workflow: '⚙️',
  tool: '🛠️',
} as const

export function MeusAgentesCard({
  agents,
  onCreateAgent,
  onAgentClick,
  className = '',
  createButton,
  isLoading,
  error,
}: MeusAgentesCardProps) {
  if (isLoading) {
    return <MeusAgentesCardSkeleton />
  }

  return (
    <Card className={`h-full flex flex-col ${className || ''}`.trim()}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg">Meus Agentes</CardTitle>
        {createButton || (
          <Button size="sm" className="h-8 gap-1" onClick={onCreateAgent}>
            <Plus className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Criar Agente
            </span>
          </Button>
        )}
      </CardHeader>
      <CardContent className="flex-1">
        {error ? (
          <p className="text-sm text-destructive text-center py-4">{error}</p>
        ) : agents.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-6">
            <p className="text-sm text-muted-foreground mb-4">
              Nenhum agente encontrado
            </p>
            {createButton || (
              <Button size="sm" variant="outline" onClick={onCreateAgent}>
                <Plus className="h-4 w-4 mr-2" />
                Criar seu primeiro agente
              </Button>
            )}
          </div>
        ) : (
          <ScrollArea className="h-72 pr-4">
            <div className="space-y-3">
              {agents.map((agent) => (
                <div
                  key={agent.id}
                  className="flex items-center p-3 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
                  onClick={() => onAgentClick(agent)}
                >
                  <Avatar className="h-9 w-9 mr-3">
                    <AvatarFallback>{typeIconMap[agent.type]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium truncate">
                        {agent.name}
                      </p>
                      <Badge
                        variant={statusVariantMap[agent.status] as any}
                        className="text-xs"
                      >
                        {agent.status === 'online'
                          ? 'Online'
                          : agent.status === 'busy'
                            ? 'Ocupado'
                            : agent.status === 'error'
                              ? 'Erro'
                              : 'Offline'}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      Última atividade:{' '}
                      {new Date(agent.lastActive).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  )
}

export const MeusAgentesCardSkeleton = () => {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <Skeleton className="h-6 w-[150px]" /> {/* Title Skeleton */}
        <Skeleton className="h-8 w-[120px]" /> {/* Button Skeleton */}
      </CardHeader>
      <CardContent className="flex-1">
        <ScrollArea className="h-72 pr-4">
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="flex items-center p-3 rounded-lg">
                <Skeleton className="h-9 w-9 rounded-full mr-3" />{' '}
                {/* Avatar Skeleton */}
                <div className="flex-1 min-w-0 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-[100px]" /> {/* Name Skeleton */}
                    <Skeleton className="h-4 w-[60px]" /> {/* Badge Skeleton */}
                  </div>
                  <Skeleton className="h-3 w-[150px]" />{' '}
                  {/* Description/Last Active Skeleton */}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
