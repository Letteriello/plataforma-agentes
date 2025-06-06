// client/src/components/agents/AgentCard.tsx
import React from 'react';
import { AgentCardData } from './types'; // Importa a interface que acabamos de criar
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils'; // Para classes condicionais/dinâmicas

// Props para o AgentCard, incluindo a possibilidade de um callback onClick
export interface AgentCardProps {
  agent: AgentCardData;
  onClick?: (agentId: string) => void; // Para quando o card for clicável
  className?: string;
  isSelected?: boolean; // Para indicar visualmente se o card está selecionado
}

// Função para determinar a variante do Badge com base no status
const getStatusBadgeVariant = (statusText: string): 'default' | 'destructive' | 'outline' | 'secondary' | null | undefined => {
  switch (statusText.toLowerCase()) {
    case 'active':
      return 'default'; // Verde (se 'default' for configurado como verde no tema) ou um azul padrão
    case 'pending':
      return 'secondary'; // Amarelo/Laranja ou Cinza
    case 'error':
      return 'destructive'; // Vermelho
    default:
      return 'outline'; // Um status desconhecido ou neutro
  }
};

export function AgentCard({ agent, onClick, className, isSelected }: AgentCardProps) {
  const { id, title, imageUrl, status } = agent;

  const handleCardClick = () => {
    if (onClick) {
      onClick(id);
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
      onKeyDown={(e) => {
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
          <Badge variant={getStatusBadgeVariant(status.text)} className="capitalize">
            {status.text}
          </Badge>
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
