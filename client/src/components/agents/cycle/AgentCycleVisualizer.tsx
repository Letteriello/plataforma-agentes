import React, { useState, useEffect } from 'react';
import { 
  AgentCycleStage, 
  CycleExecutionStatus, 
  AgentCycleSession, 
  CycleStep 
} from '@/types/agent-cycle';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertCircle, 
  Pause, 
  Play, 
  RotateCw,
  ChevronRight,
  ChevronDown,
  Eye
} from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

// Mapeamento de ícones para status
const StatusIcon = ({ status }: { status: CycleExecutionStatus }) => {
  switch (status) {
    case CycleExecutionStatus.COMPLETED:
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case CycleExecutionStatus.FAILED:
      return <XCircle className="h-4 w-4 text-red-500" />;
    case CycleExecutionStatus.RUNNING:
      return <Clock className="h-4 w-4 text-blue-500 animate-pulse" />;
    case CycleExecutionStatus.PENDING:
      return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    case CycleExecutionStatus.PAUSED:
      return <Pause className="h-4 w-4 text-gray-500" />;
    default:
      return null;
  }
};

// Mapeamento de cores para status
const getStatusColor = (status: CycleExecutionStatus): string => {
  switch (status) {
    case CycleExecutionStatus.COMPLETED:
      return 'bg-green-100 text-green-800 border-green-300';
    case CycleExecutionStatus.FAILED:
      return 'bg-red-100 text-red-800 border-red-300';
    case CycleExecutionStatus.RUNNING:
      return 'bg-blue-100 text-blue-800 border-blue-300';
    case CycleExecutionStatus.PENDING:
      return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    case CycleExecutionStatus.PAUSED:
      return 'bg-gray-100 text-gray-800 border-gray-300';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-300';
  }
};

// Componente para exibir um passo individual do ciclo
const CycleStepCard: React.FC<{ step: CycleStep }> = ({ step }) => {
  const [isOpen, setIsOpen] = useState(false);
  const statusColor = getStatusColor(step.status);
  
  const formatTime = (isoString?: string) => {
    if (!isoString) return '';
    return new Date(isoString).toLocaleTimeString();
  };
  
  const getDuration = () => {
    if (!step.startTime || !step.endTime) return '';
    const start = new Date(step.startTime).getTime();
    const end = new Date(step.endTime).getTime();
    const durationMs = end - start;
    
    if (durationMs < 1000) {
      return `${durationMs}ms`;
    }
    
    return `${(durationMs / 1000).toFixed(2)}s`;
  };
  
  return (
    <Collapsible 
      open={isOpen} 
      onOpenChange={setIsOpen}
      className={`border rounded-md mb-2 ${statusColor}`}
    >
      <div className="flex items-center justify-between p-2">
        <div className="flex items-center gap-2">
          <StatusIcon status={step.status} />
          <span className="font-medium capitalize">{step.stage.toLowerCase()}</span>
        </div>
        
        <div className="flex items-center gap-2">
          {step.endTime && (
            <span className="text-xs">{getDuration()}</span>
          )}
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="p-0 h-8 w-8">
              {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </Button>
          </CollapsibleTrigger>
        </div>
      </div>
      
      <CollapsibleContent className="p-2 pt-0">
        <div className="text-sm space-y-2 mt-2">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <p className="font-semibold">Início:</p>
              <p>{formatTime(step.startTime)}</p>
            </div>
            {step.endTime && (
              <div>
                <p className="font-semibold">Fim:</p>
                <p>{formatTime(step.endTime)}</p>
              </div>
            )}
          </div>
          
          {step.result && (
            <div className="mt-2">
              <p className="font-semibold text-xs">Resultado:</p>
              <div className={`mt-1 p-2 rounded text-xs ${step.result.success ? 'bg-green-50' : 'bg-red-50'}`}>
                {step.result.message && <p>{step.result.message}</p>}
                {step.result.error && <p className="text-red-600">{step.result.error}</p>}
                {step.result.data && (
                  <details>
                    <summary className="cursor-pointer">Ver dados</summary>
                    <pre className="mt-1 p-2 bg-gray-100 rounded overflow-auto text-xs">
                      {JSON.stringify(step.result.data, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            </div>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

// Componente principal para visualizar o ciclo do agente
interface AgentCycleVisualizerProps {
  session: AgentCycleSession;
  onPause?: () => void;
  onResume?: () => void;
  onRetry?: () => void;
}

export const AgentCycleVisualizer: React.FC<AgentCycleVisualizerProps> = ({
  session,
  onPause,
  onResume,
  onRetry
}) => {
  const [activeTab, setActiveTab] = useState<string>('progress');
  
  // Calcula o progresso geral
  const calculateProgress = (): number => {
    const totalSteps = 6; // Total de estágios no ciclo
    const completedSteps = session.steps.filter(
      step => step.status === CycleExecutionStatus.COMPLETED
    ).length;
    
    return Math.min(100, Math.round((completedSteps / totalSteps) * 100));
  };
  
  // Agrupa os passos por iteração
  const getStepsByIteration = (): Record<number, CycleStep[]> => {
    const result: Record<number, CycleStep[]> = {};
    let currentIteration = 0;
    
    session.steps.forEach(step => {
      // Incrementa a iteração quando encontra um passo DELIVER completado
      if (step.stage === AgentCycleStage.DELIVER && 
          step.status === CycleExecutionStatus.COMPLETED && 
          session.steps.indexOf(step) > 0) {
        currentIteration++;
      }
      
      if (!result[currentIteration]) {
        result[currentIteration] = [];
      }
      
      result[currentIteration].push(step);
    });
    
    return result;
  };
  
  const stepsByIteration = getStepsByIteration();
  const progress = calculateProgress();
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Ciclo do Agente</span>
          <Badge className={getStatusColor(session.status)}>
            <StatusIcon status={session.status} />
            <span className="ml-1 capitalize">{session.status.toLowerCase()}</span>
          </Badge>
        </CardTitle>
        <CardDescription>
          Visualização do ciclo iterativo de execução do agente
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Progresso</span>
            <span className="text-sm">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="progress" className="flex-1">Progresso</TabsTrigger>
            <TabsTrigger value="iterations" className="flex-1">Iterações</TabsTrigger>
            <TabsTrigger value="details" className="flex-1">Detalhes</TabsTrigger>
          </TabsList>
          
          <TabsContent value="progress" className="mt-4">
            <div className="space-y-4">
              {Object.entries(AgentCycleStage).map(([key, stage]) => {
                const stepsForStage = session.steps.filter(step => step.stage === stage);
                const latestStep = stepsForStage.length > 0 
                  ? stepsForStage[stepsForStage.length - 1] 
                  : null;
                
                return (
                  <div key={key} className="flex items-center gap-2">
                    {latestStep ? (
                      <StatusIcon status={latestStep.status} />
                    ) : (
                      <div className="h-4 w-4 rounded-full border border-gray-300" />
                    )}
                    <span className="capitalize">{stage.toLowerCase()}</span>
                    {latestStep && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="ml-auto h-6 p-0 px-2"
                        onClick={() => {
                          setActiveTab('details');
                        }}
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        <span className="text-xs">Ver</span>
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          </TabsContent>
          
          <TabsContent value="iterations" className="mt-4">
            <ScrollArea className="h-[300px]">
              {Object.entries(stepsByIteration).map(([iteration, steps]) => (
                <div key={iteration} className="mb-4">
                  <h4 className="font-medium mb-2">Iteração {parseInt(iteration) + 1}</h4>
                  <div className="space-y-2">
                    {steps.map(step => (
                      <CycleStepCard key={step.id} step={step} />
                    ))}
                  </div>
                </div>
              ))}
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="details" className="mt-4">
            <ScrollArea className="h-[300px]">
              <div className="space-y-2">
                {session.steps.map(step => (
                  <CycleStepCard key={step.id} step={step} />
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex justify-end gap-2">
        {session.status === CycleExecutionStatus.RUNNING && onPause && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onPause}
          >
            <Pause className="h-4 w-4 mr-2" />
            Pausar
          </Button>
        )}
        
        {session.status === CycleExecutionStatus.PAUSED && onResume && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onResume}
          >
            <Play className="h-4 w-4 mr-2" />
            Continuar
          </Button>
        )}
        
        {session.status === CycleExecutionStatus.FAILED && onRetry && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onRetry}
          >
            <RotateCw className="h-4 w-4 mr-2" />
            Tentar Novamente
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default AgentCycleVisualizer;
