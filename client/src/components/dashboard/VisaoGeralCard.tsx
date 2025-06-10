import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LucideUsers, LucideCpu, LucideZap } from 'lucide-react'
import { ComponentSkeleton } from '@/components/ui'

interface StatCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  description?: string
}

const StatCard = ({ title, value, icon, description }: StatCardProps) => (
  <div className="flex items-center justify-between p-4">
    <div>
      <p className="text-sm font-medium text-muted-foreground">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
    </div>
    <div className="rounded-lg bg-primary/10 p-3 text-primary">{icon}</div>
  </div>
)

interface VisaoGeralCardProps {
  activeAgents: number
  activeSessions: number
  totalSessions24h: number
  isLoading?: boolean
  error?: string | null
}

export function VisaoGeralCard({
  activeAgents,
  activeSessions,
  totalSessions24h,
  isLoading,
  error,
}: VisaoGeralCardProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg">Visão Geral</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error ? (
          <p className="text-sm text-destructive">{error}</p>
        ) : isLoading ? (
          <ComponentSkeleton lines={3} />
        ) : (
          <>
            <StatCard
              title="Agentes Ativos"
              value={activeAgents}
              icon={<LucideCpu className="h-5 w-5" />}
            />
            <div className="h-px bg-border" />
            <StatCard
              title="Sessões Ativas"
              value={activeSessions}
              icon={<LucideUsers className="h-5 w-5" />}
            />
            <div className="h-px bg-border" />
            <StatCard
              title="Sessões (24h)"
              value={totalSessions24h}
              icon={<LucideZap className="h-5 w-5" />}
            />
          </>
        )}
      </CardContent>
    </Card>
  )
}
