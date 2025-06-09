import React, { useState } // Added React for ChangeEvent
from 'react'; // Ensuring React is imported for potential JSX use if any part is copied directly, and for ChangeEvent
import { useAgentConfig } from '@/hooks/useAgentConfig';
import {
  AgentType,
  AnyAgentConfig,
  LlmAgentConfig,
  SequentialAgentConfig,
  ParallelAgentConfig,
  LoopAgentConfig,
  // Tool // Tool type is not directly used in the moved logic, but MOCK_AVAILABLE_TOOLS is.
} from '@/types';
import { createNewAgentConfig } from '@/lib/agent-utils';

// Assuming localMockExistingAgents might be needed for sub-agent logic.
// This should ideally be passed as a prop or fetched if it's dynamic and not mock data.
import { mockInitialAgents as importedMockExistingAgents } from '@/data/mocks/mock-initial-agents';
// If MOCK_AVAILABLE_TOOLS is needed by any handler (e.g. handleRemoveTool displays name), it should be passed or imported.
// For now, assuming it's not directly needed in the hook's logic beyond what config.tools provides.

const localMockExistingAgents: AnyAgentConfig[] = importedMockExistingAgents;

interface UseAgentConfiguratorLogicProps {
  initialAgentConfig: AnyAgentConfig;
  onSave?: (configToSave: AnyAgentConfig) => Promise<void>; // if handleSavePress is moved
  isSavingGlobal?: boolean; // Renamed to avoid conflict with internal isSaving if any, and to represent external state
}

export const useAgentConfiguratorLogic = ({
  initialAgentConfig,
  onSave,
  isSavingGlobal = false, // Default value
}: UseAgentConfiguratorLogicProps) => {
  const {
    config,
    updateConfig,
    updateField,
    // addTool as addToolToConfig, // Not directly used by moved handlers, they use updateField('tools', ...)
    // removeTool as removeToolFromConfig, // Not directly used by moved handlers
  } = useAgentConfig({ initialConfig: initialAgentConfig });

  const [isToolSelectorOpen, setIsToolSelectorOpen] = useState(false);
  const [isAddSubAgentModalOpen, setIsAddSubAgentModalOpen] = useState(false);
  const [selectedAgentIdsForModal, setSelectedAgentIdsForModal] = useState<string[]>([]);

  const handleAgentSelectionForModal = (agentId: string) => {
    setSelectedAgentIdsForModal(prevSelectedIds => {
      if (prevSelectedIds.includes(agentId)) {
        return prevSelectedIds.filter(id => id !== agentId);
      } else {
        return [...prevSelectedIds, agentId];
      }
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    updateField(name, value);
  };

  const handleLlmInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (config.type === AgentType.LLM) {
      const { name, value } = e.target;
      updateField(name, value);
    }
  };

  const handleSliderChange = (value: number, field: keyof LlmAgentConfig) => {
    if (config.type === AgentType.LLM) {
      updateField(field, value);
    }
  };

  const handleTypeChange = (newType: AgentType) => {
    const newConfig = createNewAgentConfig(newType, config.id, config.name);
    updateConfig(newConfig);
  };

  const handleSwitchChange = (checked: boolean, name: keyof LlmAgentConfig) => {
    if (config.type === AgentType.LLM) {
      updateField(name, checked);
    }
  };

  const handleToolsSelectionChange = (selectedToolIds: string[]) => {
    if (config.type === AgentType.LLM) {
      updateField('tools', selectedToolIds);
    }
  };

  // Renamed from AgentConfigurator's handleRemoveTool to avoid confusion if we also expose useAgentConfig's removeTool
  const handleRemoveSelectedTool = (toolIdToRemove: string) => {
    if (config.type === AgentType.LLM && (config as LlmAgentConfig).tools) {
      const updatedTools = (config as LlmAgentConfig).tools.filter((toolId: string) => toolId !== toolIdToRemove);
      updateField('tools', updatedTools);
    }
  };

  const handleAddSubAgentToWorkflowByIds = (agentIdsToAdd: string[]) => {
    const agentsToAdd: AnyAgentConfig[] = agentIdsToAdd
      .map(id => localMockExistingAgents.find(agent => agent.id === id))
      .filter(Boolean) as AnyAgentConfig[];

    if (config.type === AgentType.Sequential) {
      const currentAgents = (config as SequentialAgentConfig).agents || [];
      const currentAgentIds = new Set(currentAgents.map(a => a.id));
      const uniqueNewAgents = agentsToAdd.filter(agent => !currentAgentIds.has(agent.id));
      updateField('agents', [...currentAgents, ...uniqueNewAgents]);
    } else if (config.type === AgentType.Parallel) {
      const currentAgents = (config as ParallelAgentConfig).agents || [];
      const currentAgentIds = new Set(currentAgents.map(a => a.id));
      const uniqueNewAgents = agentsToAdd.filter(agent => !currentAgentIds.has(agent.id));
      updateField('agents', [...currentAgents, ...uniqueNewAgents]);
    }
    setIsAddSubAgentModalOpen(false);
    setSelectedAgentIdsForModal([]);
  };

  const handleRemoveSubAgentFromWorkflow = (agentIdToRemove: string) => {
    if (config.type === AgentType.Sequential) {
      const currentAgents = (config as SequentialAgentConfig).agents || [];
      const updatedAgents = currentAgents.filter(agent => agent.id !== agentIdToRemove);
      updateField('agents', updatedAgents);
    } else if (config.type === AgentType.Parallel) {
      const currentAgents = (config as ParallelAgentConfig).agents || [];
      const updatedAgents = currentAgents.filter(agent => agent.id !== agentIdToRemove);
      updateField('agents', updatedAgents);
    }
  };

  const handleSubAgentsOrderChange = (orderedSubAgents: AnyAgentConfig[]) => {
    if (config.type === AgentType.Sequential || config.type === AgentType.Parallel) {
      updateField('agents', orderedSubAgents);
    }
  };

  const handleLoopAgentChange = (selectedAgentId: string) => {
    if (config.type === AgentType.Loop) {
      const selectedAgent = localMockExistingAgents.find(agent => agent.id === selectedAgentId);
      if (selectedAgent) {
        updateField('agent', selectedAgent);
      }
    }
  };

  const handleSavePress = async () => {
    if (onSave) {
      await onSave(config);
    }
  };

  const llmConfig = config.type === AgentType.LLM ? config as LlmAgentConfig : null;
  const sequentialConfig = config.type === AgentType.Sequential ? config as SequentialAgentConfig : null;
  const parallelConfig = config.type === AgentType.Parallel ? config as ParallelAgentConfig : null;
  const loopConfig = config.type === AgentType.Loop ? config as LoopAgentConfig : null;

  const isSaveDisabled =
    !config.name ||
    isSavingGlobal || // Use the prop here
    (llmConfig && !llmConfig.instruction) ||
    (sequentialConfig && (sequentialConfig.agents?.length || 0) < 1) ||
    (parallelConfig && (parallelConfig.agents?.length || 0) < 1) ||
    (loopConfig && !loopConfig.agent);

  return {
    config,
    llmConfig, // expose derived configs too
    sequentialConfig,
    parallelConfig,
    loopConfig,
    updateField,
    updateConfig,

    isToolSelectorOpen,
    setIsToolSelectorOpen,
    isAddSubAgentModalOpen,
    setIsAddSubAgentModalOpen,
    selectedAgentIdsForModal,
    setSelectedAgentIdsForModal, // Exposing setter, could be more granular open/close/toggle pattern

    handleAgentSelectionForModal,
    handleInputChange,
    handleLlmInputChange,
    handleSliderChange,
    handleTypeChange,
    handleSwitchChange,
    handleToolsSelectionChange,
    handleRemoveSelectedTool, // Renamed handler
    handleAddSubAgentToWorkflowByIds,
    handleRemoveSubAgentFromWorkflow,
    handleSubAgentsOrderChange,
    handleLoopAgentChange,
    handleSavePress, // Moved handler
    isSaveDisabled, // Moved logic
    localMockExistingAgents, // Still needed for sub-agent selection logic
  };
};
