import { v4 as uuidv4 } from 'uuid';
import { 
  AgentCycleStage, 
  CycleExecutionStatus, 
  CycleStep, 
  AgentCycleSession, 
  AgentCycleConfig 
} from '@/types/agent-cycle';
import { AnyAgentConfig } from '@/types/agents';

/**
 * Serviço responsável por gerenciar o ciclo iterativo de agentes
 * Implementa o padrão de ciclo inspirado no Manus AI:
 * Analisa → Planeja → Seleciona ferramentas → Executa → Refina → Entrega
 */
export class AgentCycleService {
  private sessions: Map<string, AgentCycleSession> = new Map();
  
  /**
   * Inicia uma nova sessão de ciclo para um agente
   */
  public startCycle(
    agentConfig: AnyAgentConfig, 
    cycleConfig: AgentCycleConfig,
    initialInput: any
  ): string {
    const sessionId = uuidv4();
    const now = new Date().toISOString();
    
    const session: AgentCycleSession = {
      id: sessionId,
      agentId: agentConfig.id,
      steps: [],
      status: CycleExecutionStatus.PENDING,
      startTime: now,
      iterationCount: 0,
      metadata: {
        agentName: agentConfig.name,
        agentType: agentConfig.type,
        initialInput
      }
    };
    
    this.sessions.set(sessionId, session);
    return sessionId;
  }
  
  /**
   * Executa o próximo estágio do ciclo
   */
  public async executeNextStage(
    sessionId: string, 
    stageHandlers: Record<AgentCycleStage, (input: any) => Promise<any>>
  ): Promise<CycleStep | null> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error(`Sessão ${sessionId} não encontrada`);
    }
    
    if (session.status === CycleExecutionStatus.COMPLETED || 
        session.status === CycleExecutionStatus.FAILED) {
      return null;
    }
    
    // Determina o próximo estágio
    const nextStage = this.determineNextStage(session);
    if (!nextStage) {
      session.status = CycleExecutionStatus.COMPLETED;
      session.endTime = new Date().toISOString();
      return null;
    }
    
    // Cria o registro do passo
    const stepId = uuidv4();
    const now = new Date().toISOString();
    
    const step: CycleStep = {
      id: stepId,
      stage: nextStage,
      agentId: session.agentId,
      sessionId: session.id,
      input: this.getStageInput(session, nextStage),
      startTime: now,
      status: CycleExecutionStatus.RUNNING
    };
    
    session.steps.push(step);
    session.status = CycleExecutionStatus.RUNNING;
    
    try {
      // Executa o handler para o estágio
      const handler = stageHandlers[nextStage];
      if (!handler) {
        throw new Error(`Handler não encontrado para o estágio ${nextStage}`);
      }
      
      const result = await handler(step.input);
      
      // Atualiza o passo com o resultado
      step.result = {
        success: true,
        data: result,
        timestamp: new Date().toISOString()
      };
      step.endTime = new Date().toISOString();
      step.status = CycleExecutionStatus.COMPLETED;
      
      // Se for o último estágio, incrementa o contador de iterações
      if (nextStage === AgentCycleStage.DELIVER) {
        session.iterationCount += 1;
      }
      
      return step;
    } catch (error) {
      // Registra o erro
      step.result = {
        success: false,
        error: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString()
      };
      step.endTime = new Date().toISOString();
      step.status = CycleExecutionStatus.FAILED;
      
      // Verifica se deve falhar a sessão inteira
      const cycleConfig = this.getCycleConfig(session);
      if (!cycleConfig.autoRetry || 
          this.getFailedAttemptsForStage(session, nextStage) >= cycleConfig.retryCount) {
        session.status = CycleExecutionStatus.FAILED;
        session.endTime = new Date().toISOString();
      }
      
      return step;
    }
  }
  
  /**
   * Determina o próximo estágio do ciclo
   */
  private determineNextStage(session: AgentCycleSession): AgentCycleStage | null {
    const cycleConfig = this.getCycleConfig(session);
    
    // Verifica se atingiu o número máximo de iterações
    if (session.iterationCount >= cycleConfig.maxIterations) {
      return null;
    }
    
    // Se não houver passos, começa pelo ANALYZE
    if (session.steps.length === 0) {
      return AgentCycleStage.ANALYZE;
    }
    
    // Pega o último passo completado
    const lastCompletedStep = [...session.steps]
      .reverse()
      .find(step => step.status === CycleExecutionStatus.COMPLETED);
    
    if (!lastCompletedStep) {
      // Se não houver passos completados, verifica se há algum em falha para retry
      const lastFailedStep = [...session.steps]
        .reverse()
        .find(step => step.status === CycleExecutionStatus.FAILED);
        
      if (lastFailedStep && cycleConfig.autoRetry && 
          this.getFailedAttemptsForStage(session, lastFailedStep.stage) < cycleConfig.retryCount) {
        return lastFailedStep.stage;
      }
      
      return AgentCycleStage.ANALYZE;
    }
    
    // Determina o próximo estágio com base no último completado
    switch (lastCompletedStep.stage) {
      case AgentCycleStage.ANALYZE:
        return AgentCycleStage.PLAN;
      case AgentCycleStage.PLAN:
        return AgentCycleStage.TOOL_SELECT;
      case AgentCycleStage.TOOL_SELECT:
        return AgentCycleStage.EXECUTE;
      case AgentCycleStage.EXECUTE:
        return AgentCycleStage.REFINE;
      case AgentCycleStage.REFINE:
        return AgentCycleStage.DELIVER;
      case AgentCycleStage.DELIVER:
        // Após a entrega, começa um novo ciclo
        return AgentCycleStage.ANALYZE;
      default:
        return AgentCycleStage.ANALYZE;
    }
  }
  
  /**
   * Obtém a entrada para o próximo estágio
   */
  private getStageInput(session: AgentCycleSession, stage: AgentCycleStage): any {
    // Para o primeiro estágio, usa a entrada inicial
    if (session.steps.length === 0 && stage === AgentCycleStage.ANALYZE) {
      return session.metadata?.initialInput || {};
    }
    
    // Para outros estágios, usa o resultado do estágio anterior
    const previousStages = this.getPreviousStagesInOrder(stage);
    if (previousStages.length === 0) {
      return {};
    }
    
    const previousStage = previousStages[0];
    const lastStepOfPreviousStage = [...session.steps]
      .reverse()
      .find(step => 
        step.stage === previousStage && 
        step.status === CycleExecutionStatus.COMPLETED
      );
      
    return lastStepOfPreviousStage?.result?.data || {};
  }
  
  /**
   * Obtém os estágios anteriores na ordem correta
   */
  private getPreviousStagesInOrder(stage: AgentCycleStage): AgentCycleStage[] {
    const stageOrder = [
      AgentCycleStage.ANALYZE,
      AgentCycleStage.PLAN,
      AgentCycleStage.TOOL_SELECT,
      AgentCycleStage.EXECUTE,
      AgentCycleStage.REFINE,
      AgentCycleStage.DELIVER
    ];
    
    const currentIndex = stageOrder.indexOf(stage);
    if (currentIndex <= 0) {
      // Para ANALYZE, o estágio anterior é DELIVER (ciclo completo)
      return currentIndex === 0 ? [AgentCycleStage.DELIVER] : [];
    }
    
    return [stageOrder[currentIndex - 1]];
  }
  
  /**
   * Obtém o número de tentativas falhas para um estágio
   */
  private getFailedAttemptsForStage(session: AgentCycleSession, stage: AgentCycleStage): number {
    return session.steps.filter(
      step => step.stage === stage && step.status === CycleExecutionStatus.FAILED
    ).length;
  }
  
  /**
   * Obtém a configuração do ciclo da sessão
   */
  private getCycleConfig(session: AgentCycleSession): AgentCycleConfig {
    // Por enquanto, retorna uma configuração padrão
    // No futuro, isso pode ser armazenado nos metadados da sessão
    return {
      maxIterations: 5,
      timeoutPerStage: 30000,
      autoRetry: false,
      retryCount: 3,
      requiredStages: [
        AgentCycleStage.ANALYZE,
        AgentCycleStage.EXECUTE,
        AgentCycleStage.DELIVER
      ]
    };
  }
  
  /**
   * Obtém uma sessão pelo ID
   */
  public getSession(sessionId: string): AgentCycleSession | undefined {
    return this.sessions.get(sessionId);
  }
  
  /**
   * Finaliza uma sessão
   */
  public endSession(sessionId: string, finalResult?: any): void {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error(`Sessão ${sessionId} não encontrada`);
    }
    
    session.status = CycleExecutionStatus.COMPLETED;
    session.endTime = new Date().toISOString();
    session.finalResult = finalResult;
  }
}

// Exporta uma instância singleton
export const agentCycleService = new AgentCycleService();
