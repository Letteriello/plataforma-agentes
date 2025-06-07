import { create } from 'zustand';
import { AnyAgentConfig } from '@/types/agent';

/** Estado para edição de configurações de agente */
interface AgentConfigState {
  currentConfig: AnyAgentConfig | null;
  isDirty: boolean;
  isLoading: boolean;
}

/** Ações disponíveis no store de configuração de agente */
interface AgentConfigActions {
  /** Define uma nova configuração como ativa */
  setConfig: (config: AnyAgentConfig | null) => void;
  /** Atualiza um campo específico da configuração atual */
  updateField: (field: string, value: unknown) => void;
  /** Define manualmente o status de edição */
  setIsDirty: (status: boolean) => void;
  /** Limpa a configuração em edição */
  reset: () => void;
}

/**
 * Store dedicado à configuração de agente atualmente em edição.
 */
/**
 * Hook Zustand que mantém a configuração de agente em edição.
 */
export const useAgentConfigStore = create<AgentConfigState & AgentConfigActions>(
  (set, get) => ({
    currentConfig: null,
    isDirty: false,
    isLoading: false,

    setConfig: (config) => set({ currentConfig: config, isDirty: false }),

    updateField: (field, value) =>
      set((state) =>
        state.currentConfig
          ? {
              currentConfig: {
                ...(state.currentConfig as any),
                [field]: value,
              } as AnyAgentConfig,
              isDirty: true,
            }
          : {}
      ),

    setIsDirty: (status) => set({ isDirty: status }),

    reset: () => set({ currentConfig: null, isDirty: false }),
  })
);
