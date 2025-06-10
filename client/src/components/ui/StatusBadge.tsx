// client/src/components/ui/StatusBadge.tsx
import { Badge, type BadgeProps } from '@/components/ui/badge'
import {
  Power,
  Loader2,
  AlertTriangle,
  HelpCircle,
  Rocket,
  Coffee,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'
import type { LucideIcon } from 'lucide-react'
import type { AgentStatus } from '../../../types/statusTypes' // Importando o novo tipo
import {
  AGENT_STATUS_ACTIVE,
  AGENT_STATUS_PENDING,
  AGENT_STATUS_ERROR,
  AGENT_STATUS_UNKNOWN,
  AGENT_STATUS_DEPLOYING,
  AGENT_STATUS_IDLE,
  AGENT_STATUS_DEFAULT,
} from '../../../constants/agentStatus'

// Removida a definição local de AgentStatusType

interface StatusConfig {
  icon?: typeof LucideIcon
  iconClassName?: string
}

const statusIcons: Record<AgentStatus, StatusConfig> = {
  [AGENT_STATUS_ACTIVE]: { icon: Power },
  [AGENT_STATUS_PENDING]: { icon: Loader2, iconClassName: 'animate-spin' },
  [AGENT_STATUS_ERROR]: { icon: AlertTriangle },
  [AGENT_STATUS_UNKNOWN]: { icon: HelpCircle },
  [AGENT_STATUS_DEPLOYING]: { icon: Rocket },
  [AGENT_STATUS_IDLE]: { icon: Coffee },
  [AGENT_STATUS_DEFAULT]: { icon: HelpCircle },
}

const statusBadgeVariants = cva('', {
  variants: {
    status: {
      [AGENT_STATUS_ACTIVE]:
        'bg-cyan-500 hover:bg-cyan-600 text-cyan-50 border-cyan-600',
      [AGENT_STATUS_PENDING]:
        'bg-amber-500 hover:bg-amber-600 text-amber-950 border-amber-600',
      [AGENT_STATUS_ERROR]: 'bg-destructive text-destructive-foreground',
      [AGENT_STATUS_UNKNOWN]:
        'bg-zinc-700 hover:bg-zinc-600 text-zinc-300 border-zinc-600',
      [AGENT_STATUS_DEPLOYING]:
        'bg-blue-500 hover:bg-blue-600 text-white border-blue-600',
      [AGENT_STATUS_IDLE]:
        'bg-slate-500 hover:bg-slate-600 text-slate-50 border-slate-600',
      [AGENT_STATUS_DEFAULT]: 'border-border text-foreground hover:bg-accent',
    },
  },
  defaultVariants: {
    status: AGENT_STATUS_DEFAULT,
  },
})

interface StatusBadgeProps extends VariantProps<typeof statusBadgeVariants> {
  label?: string
  className?: string
}

export function StatusBadge({
  status = AGENT_STATUS_DEFAULT,
  label,
  className,
}: StatusBadgeProps) {
  const { icon: IconComponent, iconClassName } = statusIcons[status] || {}
  const badgeLabel = label || status.charAt(0).toUpperCase() + status.slice(1)

  return (
    <Badge className={cn(statusBadgeVariants({ status }), className)}>
      {IconComponent && (
        <IconComponent className={cn('mr-1.5 h-3.5 w-3.5', iconClassName)} />
      )}
      {badgeLabel}
    </Badge>
  )
}
