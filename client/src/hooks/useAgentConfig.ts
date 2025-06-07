import { useEffect, useState } from 'react';
import { AnyAgentConfig } from '@/types/agent';
import { deepClone } from '@/lib/utils';

/**
 * Props for useAgentConfig hook.
 */
export interface UseAgentConfigProps {
  /** Initial configuration used to hydrate the local state */
  initialConfig: AnyAgentConfig;
}

/**
 * Hook responsável por gerenciar o estado de uma configuração de agente.
 * Centraliza toda a lógica de atualização para manter os componentes de UI simples.
 */
export const useAgentConfig = ({ initialConfig }: UseAgentConfigProps) => {
  const [config, setConfig] = useState<AnyAgentConfig>(deepClone(initialConfig));

  // Atualiza o estado quando a configuração inicial mudar
  useEffect(() => {
    setConfig(deepClone(initialConfig));
  }, [initialConfig]);

  /**
   * Substitui completamente a configuração atual.
   */
  const updateConfig = (newConfig: AnyAgentConfig) => {
    setConfig(deepClone(newConfig));
  };

  /**
   * Atualiza um campo simples dentro da configuração.
   */
  const updateField = (fieldName: string, value: unknown) => {
    setConfig((prev) => ({ ...(prev as any), [fieldName]: value } as AnyAgentConfig));
  };

  /**
   * Adiciona uma ferramenta ao array de ferramentas de um LlmAgentConfig.
   */
  const addTool = (toolId: string) => {
    setConfig((prev) => {
      if ((prev as any).tools) {
        const tools = Array.from(new Set([...(prev as any).tools, toolId]));
        return { ...(prev as any), tools } as AnyAgentConfig;
      }
      return prev;
    });
  };

  /**
   * Remove uma ferramenta do array de ferramentas.
   */
  const removeTool = (toolId: string) => {
    setConfig((prev) => {
      if ((prev as any).tools) {
        const tools = (prev as any).tools.filter((t: string) => t !== toolId);
        return { ...(prev as any), tools } as AnyAgentConfig;
      }
      return prev;
    });
  };

  /**
   * Atualiza uma configuração de segurança pelo índice.
   */
  const updateSafetySetting = (index: number, newSetting: unknown) => {
    setConfig((prev) => {
      const safetySettings = (prev as any).safetySettings || [];
      const updated = [...safetySettings];
      updated[index] = newSetting;
      return { ...(prev as any), safetySettings: updated } as AnyAgentConfig;
    });
  };

  /**
   * Restaura a configuração para o valor inicial.
   */
  const reset = () => {
    setConfig(deepClone(initialConfig));
  };

  return { config, updateConfig, updateField, addTool, removeTool, updateSafetySetting, reset };
};
