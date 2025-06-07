import { useState } from 'react';
import { AnyAgentConfig } from '@/types';
import { useAgentStore } from '@/store/agentStore';
import agentService from '@/services/agentService';

export interface UseAgentConfiguratorReturn {
  config: AnyAgentConfig;
  isSaving: boolean;
  isDirty: boolean;
  error: Error | null;
  updateConfig: (newConfig: Partial<AnyAgentConfig>) => void;
  saveConfig: () => Promise<void>;
  resetConfig: () => void;
}

export const useAgentConfigurator = (initial: AnyAgentConfig): UseAgentConfiguratorReturn => {
  const [config, setConfig] = useState<AnyAgentConfig>(initial);
  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { updateAgent } = useAgentStore();

  const updateConfig = (newConfig: Partial<AnyAgentConfig>) => {
    setConfig(prev => ({ ...prev, ...newConfig }));
    setIsDirty(true);
  };

  const saveConfig = async () => {
    setIsSaving(true);
    try {
      const saved = await agentService.saveAgent(config);
      updateAgent(saved);
      setIsDirty(false);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsSaving(false);
    }
  };

  const resetConfig = () => {
    setConfig(initial);
    setIsDirty(false);
  };

  return { config, isSaving, isDirty, error, updateConfig, saveConfig, resetConfig };
};

export default useAgentConfigurator;
