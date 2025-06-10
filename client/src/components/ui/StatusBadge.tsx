// client/src/components/ui/StatusBadge.tsx
import { Badge, type BadgeProps } from '@/components/ui/badge';
import { Power, Loader2, AlertTriangle, HelpCircle, Rocket, Coffee } from 'lucide-react';
import { cn } from '@/lib/utils'; // Para combinar classes
import type { LucideIcon } from 'lucide-react';
import type { AgentStatus } from '../../../types/statusTypes'; // Importando o novo tipo
import {
  AGENT_STATUS_ACTIVE,
  AGENT_STATUS_PENDING,
  AGENT_STATUS_ERROR,
  AGENT_STATUS_UNKNOWN,
  AGENT_STATUS_DEPLOYING,
  AGENT_STATUS_IDLE,
  AGENT_STATUS_DEFAULT,
} from '../../../constants/agentStatus';

// Removida a definição local de AgentStatusType

interface StatusConfig {
  variant: BadgeProps['variant']; // Usar o tipo de variant do Badge original
  icon?: typeof LucideIcon;
  iconClassName?: string;
  className?: string; // Classes específicas para o Badge
}

// Mapeamento de status para configuração do badge
const statusConfigMap: Record<AgentStatus, StatusConfig> = {
  [AGENT_STATUS_ACTIVE]: { variant: 'default', icon: Power, className: 'bg-cyan-500 hover:bg-cyan-600 text-cyan-50 border-cyan-600' },
  [AGENT_STATUS_PENDING]: { variant: 'default', icon: Loader2, iconClassName: 'animate-spin', className: 'bg-amber-500 hover:bg-amber-600 text-amber-950 border-amber-600' },
  [AGENT_STATUS_ERROR]: { variant: 'destructive', icon: AlertTriangle }, // Usa a variante destructive existente
  [AGENT_STATUS_UNKNOWN]: { variant: 'secondary', icon: HelpCircle, className: 'bg-zinc-700 hover:bg-zinc-600 text-zinc-300 border-zinc-600' }, // Modificando a secondary
  [AGENT_STATUS_DEPLOYING]: { variant: 'default', icon: Rocket }, // Usa a variante default (azul)
  [AGENT_STATUS_IDLE]: { variant: 'default', icon: Coffee, className: 'bg-slate-500 hover:bg-slate-600 text-slate-50 border-slate-600' },
  [AGENT_STATUS_DEFAULT]: { variant: 'outline', icon: HelpCircle },
};

interface StatusBadgeProps {
  status: AgentStatus; // Usando o tipo AgentStatus importado
  label?: string; // Opcional, para o texto dentro do badge
  className?: string; // Classes adicionais para o wrapper do badge (não para o Badge em si, mas para um possível div em volta se necessário)
}

export function StatusBadge({ status, label, className: wrapperClassName }: StatusBadgeProps) {
  // Tenta encontrar a configuração para o status fornecido; se não encontrar, usa a configuração 'default'
  const config = statusConfigMap[status] || statusConfigMap[AGENT_STATUS_DEFAULT];
  const IconComponent = config.icon;

  // Se não houver label, usar o próprio status como label (capitalizado)
  const badgeLabel = label || status.charAt(0).toUpperCase() + status.slice(1);

  return (
    <Badge variant={config.variant} className={cn(config.className, wrapperClassName)}>
      {IconComponent && <IconComponent className={cn('mr-1.5 h-3.5 w-3.5', config.iconClassName)} />}
      {badgeLabel}
    </Badge>
  );
}
