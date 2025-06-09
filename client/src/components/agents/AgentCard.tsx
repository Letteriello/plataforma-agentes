// client/src/components/agents/AgentCard.tsx
import type { AgentCardData } from './types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { cn } from '@/lib/utils';
import logger from '@/lib/logger';

// Props para o AgentCard, incluindo a possibilidade de um callback onClick
export interface AgentCardProps {
  agent: AgentCardData;
  onClick?: (agentId: string) => void; // Para quando o card for clicável
  className?: string;
  isSelected?: boolean; // Para indicar visualmente se o card está selecionado
}

export function AgentCard({ agent, onClick, className, isSelected }: AgentCardProps) {
  const { id, title, imageUrl, status } = agent;

  const handleCardClick = () => {
    if (onClick) {
      onClick(id);
      logger.debug('Agente selecionado', agent);
    }
  };

  return (
    <Card
      className={cn(
        'w-full max-w-sm transform transition-all duration-200 ease-in-out',
        onClick ? 'cursor-pointer hover:shadow-lg hover:-translate-y-1' : '',
        isSelected ? 'ring-2 ring-primary shadow-xl border-primary' : 'border-border',
        className
      )}
      onClick={handleCardClick}
      tabIndex={onClick ? 0 : -1} // Torna o card focável se for clicável
      onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          handleCardClick();
        }
      }}
    >
      <CardHeader className="flex flex-row items-center gap-4 p-4">
        <Avatar className="h-12 w-12">
          <AvatarImage src={imageUrl} alt={title} />
          <AvatarFallback>{title?.substring(0, 2).toUpperCase() || 'AG'}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <CardTitle className="text-lg font-semibold leading-tight">{title}</CardTitle>
          {/* Poderíamos adicionar uma sub-descrição aqui se tivéssemos shortDescription */}
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        {/* Seção de Status */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">{status.label || 'Status'}</span>
          <StatusBadge status={status.text} label={status.label} />
        </div>
        
        {/* Outras informações resumidas poderiam ir aqui no futuro */}
        {/* Ex: 
        <div className="mt-3 text-sm text-muted-foreground">
          <p>Última Atividade: {agent.lastActivity || 'N/A'}</p>
        </div> 
        */}
      </CardContent>
    </Card>
  );
}
