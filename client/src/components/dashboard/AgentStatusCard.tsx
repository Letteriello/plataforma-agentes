import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export interface Agent {
  id: string;
  name: string;
  status: 'online' | 'offline' | 'busy' | 'idle';
  type: string;
  usage?: 'high' | 'medium' | 'low';
  description?: string;
  lastActive?: string;
}

interface AgentStatusCardProps {
  agents: Agent[];
  onAgentClick?: (agent: Agent) => void;
  className?: string;
}

export function AgentStatusCard({ agents, onAgentClick, className = '' }: AgentStatusCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-500';
      case 'busy':
        return 'bg-amber-500';
      case 'idle':
        return 'bg-blue-500';
      case 'offline':
      default:
        return 'bg-muted-foreground/30';
    }
  };

  const getUsageVariant = (usage?: 'high' | 'medium' | 'low') => {
    switch (usage) {
      case 'high':
        return 'default';
      case 'medium':
        return 'secondary';
      case 'low':
      default:
        return 'outline';
    }
  };

  const getUsageText = (usage?: 'high' | 'medium' | 'low') => {
    switch (usage) {
      case 'high':
        return 'Alto uso';
      case 'medium':
        return 'Médio uso';
      case 'low':
      default:
        return 'Baixo uso';
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Status dos Agentes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {agents.map((agent) => (
            <div 
              key={agent.id} 
              className="flex items-center justify-between p-3 hover:bg-muted/50 rounded-lg transition-colors cursor-pointer" 
              onClick={() => onAgentClick?.(agent)}
            >
              <div className="flex items-center space-x-3">
                <div 
                  className={`h-2.5 w-2.5 rounded-full ${getStatusColor(agent.status)}`} 
                  title={agent.status === 'busy' ? 'Ocupado' : agent.status === 'online' ? 'Online' : 'Offline'}
                />
                <span className="font-medium">{agent.name}</span>
              </div>
              {agent.usage && (
                <Badge 
                  variant={getUsageVariant(agent.usage)}
                  className="text-xs"
                >
                  {getUsageText(agent.usage)}
                </Badge>
              )}
            </div>
          ))}
          {agents.length === 0 && (
            <div className="text-center py-4 text-muted-foreground text-sm">
              Nenhum agente encontrado
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
