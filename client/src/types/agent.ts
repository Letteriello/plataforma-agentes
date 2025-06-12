// A re-exportação de core/agent foi removida para evitar conflitos de tipo.
// Os tipos devem ser importados diretamente de sua fonte (ex: adk.ts)
// ou de arquivos de tipo específicos da UI.

// client/src/components/agents/types.ts
import type { AgentStatus } from './statusTypes'

/**
 * Interface para os dados resumidos de um agente a serem exibidos no AgentCard.
 */
export interface AgentCardData {
  /** Identificador único do agente. Essencial para seleção e como 'key' em listas React. */
  id: string

  /** Título ou nome principal do agente. */
  title: string

  /** URL para a imagem/avatar do agente. Opcional, mas recomendado para identificação visual. */
  imageUrl?: string

  /** Informações de status do agente. */
  status: {
    /**
     * Texto curto representando o estado do agente (ex: 'active', 'pending', 'error').
     * Usado para lógica de estilização (cores do badge, ícones).
     */
    text: AgentStatus

    /** Rótulo descritivo do status (ex: "Status Operacional", "Pendente de Configuração"). */
    label: string
  }

  // Campos opcionais para futuras melhorias:
  // /** Uma breve descrição ou tipo do agente, para exibição no card. */
  // shortDescription?: string;

  // /** Uma métrica chave ou informação adicional relevante para exibição rápida. */
  // keyMetric?: {
  //   label: string;
  //   value: string | number;
  // };
}
