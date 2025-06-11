import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export type TrendType = 'up' | 'down' | 'neutral';

export interface StatsCardProps {
  /** Título do card */
  title: string;
  /** Valor principal a ser exibido */
  value: string | number;
  /** Descrição adicional (opcional) */
  description?: string;
  /** Ícone a ser exibido no canto superior direito */
  icon: React.ReactNode;
  /** Tendência (seta para cima/baixo/neutro) */
  trend?: TrendType;
  /** Valor da tendência (ex: "12%" ou "+5") */
  trendValue?: string;
  /** Valor total para exibição de fração (opcional) */
  total?: number | string;
  /** Classe CSS adicional */
  className?: string;
  /** Cor de destaque para a tendência */
  trendColor?: {
    up?: string;
    down?: string;
    neutral?: string;
  };
}

/**
 * Componente de card de estatísticas reutilizável
 * 
 * @component
 * @example
 * ```tsx
 * <StatsCard
 *   title="Total de Agentes"
 *   value="5"
 *   description="Ativos dos 7"
 *   icon={<Users className="h-4 w-4" />}
 *   trend="up"
 *   trendValue="12%"
 * />
 * ```
 */
const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  description,
  icon,
  trend = 'neutral',
  trendValue,
  total,
  className = '',
  trendColor = {
    up: 'text-green-500',
    down: 'text-red-500',
    neutral: 'text-muted-foreground',
  },
}) => {
  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return '↑';
      case 'down':
        return '↓';
      default:
        return '';
    }
  };

  const trendClass = trendColor[trend] || '';

  return (
    <Card className={cn('h-full transition-all hover:shadow-md', className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="h-4 w-4 text-muted-foreground">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {value}
          {total !== undefined && (
            <span className="ml-2 text-sm text-muted-foreground">/ {total}</span>
          )}
        </div>
        
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
        
        {trend !== 'neutral' && trendValue && (
          <div 
            className={cn(
              'mt-2 flex items-center text-xs',
              trendClass
            )}
          >
            {getTrendIcon()} {trendValue}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export { StatsCard };

export default StatsCard;
