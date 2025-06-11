import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AgentActivityData {
  date: string;
  activeAgents: number;
  interactions: number;
}

interface AgentActivityCardProps {
  data: AgentActivityData[];
  period: string;
  onPeriodChange: (period: string) => void;
  onRefresh: () => void;
  isLoading?: boolean;
  className?: string;
}

export function AgentActivityCard({
  data,
  period,
  onPeriodChange,
  onRefresh,
  isLoading = false,
  className = ''
}: AgentActivityCardProps) {
  // TODO: Implementar gráfico de atividade quando a biblioteca de gráficos estiver configurada
  
  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Atividade dos Agentes</CardTitle>
          <div className="flex items-center space-x-2">
            <Select value={period} onValueChange={onPeriodChange}>
              <SelectTrigger className="w-[120px] h-8 text-xs">
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1d">Hoje</SelectItem>
                <SelectItem value="7d">Últimos 7 dias</SelectItem>
                <SelectItem value="1m">Último mês</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              variant="outline" 
              size="icon" 
              className="h-8 w-8"
              onClick={onRefresh}
              disabled={isLoading}
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] flex items-center justify-center bg-muted/30 rounded-lg">
          {isLoading ? (
            <div className="text-muted-foreground text-sm">Carregando dados...</div>
          ) : data.length > 0 ? (
            <div className="text-center p-4">
              <p className="text-muted-foreground text-sm">Gráfico de atividade dos agentes</p>
              <p className="text-xs text-muted-foreground/70 mt-2">
                {data.length} registros no período selecionado
              </p>
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">Nenhum dado disponível</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
