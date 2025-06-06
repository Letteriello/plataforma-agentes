// client/src/components/ui/StatusBadge.tsx
import { Badge, type BadgeProps } from '@/components/ui/badge';
import { Power, Loader2, AlertTriangle, HelpCircle, Rocket, Coffee } from 'lucide-react';
import { cn } from '@/lib/utils'; // Para combinar classes
import type { LucideIcon } from 'lucide-react';

// Definindo os tipos de status que esperamos
export type AgentStatusType = 'active' | 'pending' | 'error' | 'unknown' | 'deploying' | 'idle' | string;

interface StatusConfig {
  variant: BadgeProps['variant']; // Usar o tipo de variant do Badge original
  icon?: typeof LucideIcon;
  iconClassName?: string;
  className?: string; // Classes específicas para o Badge
}

// Mapeamento de status para configuração do badge
const statusConfigMap: Record<AgentStatusType, StatusConfig> = {
  active: { variant: 'default', icon: Power, className: 'bg-cyan-500 hover:bg-cyan-600 text-cyan-50 border-cyan-600' },
  pending: { variant: 'default', icon: Loader2, iconClassName: 'animate-spin', className: 'bg-amber-500 hover:bg-amber-600 text-amber-950 border-amber-600' },
  error: { variant: 'destructive', icon: AlertTriangle }, // Usa a variante destructive existente
  unknown: { variant: 'secondary', icon: HelpCircle, className: 'bg-zinc-700 hover:bg-zinc-600 text-zinc-300 border-zinc-600' }, // Modificando a secondary
  deploying: { variant: 'default', icon: Rocket }, // Usa a variante default (azul)
  idle: { variant: 'default', icon: Coffee, className: 'bg-slate-500 hover:bg-slate-600 text-slate-50 border-slate-600' },
  // Fallback para qualquer outro status não mapeado explicitamente
  default: { variant: 'outline', icon: HelpCircle },
};

interface StatusBadgeProps {
  status: AgentStatusType;
  label?: string; // Opcional, para o texto dentro do badge
  className?: string; // Classes adicionais para o wrapper do badge (não para o Badge em si, mas para um possível div em volta se necessário)
}

export function StatusBadge({ status, label, className: wrapperClassName }: StatusBadgeProps) {
  // Tenta encontrar a configuração para o status fornecido; se não encontrar, usa a configuração 'default'
  const config = statusConfigMap[status.toLowerCase() as AgentStatusType] || statusConfigMap.default;
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
