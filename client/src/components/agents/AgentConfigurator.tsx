import React, { useState, useEffect, Dispatch, SetStateAction } from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import {
  AgentType,
  AnyAgentConfig,
  LlmAgentConfig,
  SequentialAgentConfig,
  ParallelAgentConfig,
  LoopAgentConfig,
  Tool
} from '@/types/agent'; // Import shared types

import {
  Input,
  Textarea,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Button,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  Badge,
  // Accordion,
  // AccordionItem,
  // AccordionTrigger,
  // AccordionContent,
} from '@/components/ui';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { XIcon } from 'lucide-react';

import mockToolsDataJson from '@/data/mock-tools.json'; // Corrected import
import { mockInitialAgents as importedMockExistingAgents } from '@/data/mock-initial-agents'; // Corrected import

import { ToolSelector } from './tools/ToolSelector'; // Named import
import AgentList from './AgentList';
import AgentDropzone from './workflow/AgentDropzone';
import { deepClone } from '@/lib/utils';

// Cast the imported JSON to the Tool array type
const MOCK_AVAILABLE_TOOLS: Tool[] = mockToolsDataJson as Tool[];
// Use the imported agents directly as they should conform to AnyAgentConfig[]
const localMockExistingAgents: AnyAgentConfig[] = importedMockExistingAgents;

interface AgentConfiguratorProps {
  agentConfig: AnyAgentConfig; // Use shared AnyAgentConfig
  onConfigChange: (newConfig: AnyAgentConfig) => void;
  onSave?: (configToSave: AnyAgentConfig) => Promise<void>;
  isSaving?: boolean;
  isCreatingNew?: boolean;
}

const createNewAgentConfig = (type: AgentType, existingId?: string, existingName?: string): AnyAgentConfig => {
  const baseConfig = {
    id: existingId || crypto.randomUUID(),
    name: existingName || '',
  };

  switch (type) {
    case AgentType.LLM:
      return {
        ...baseConfig,
        type: AgentType.LLM,
        instruction: '',
        model: '', // Add model as per shared LlmAgentConfig
        code_execution: false,
        planning_enabled: false,
        tools: [],
      } as LlmAgentConfig;
    case AgentType.Sequential:
      return {
        ...baseConfig,
        type: AgentType.Sequential,
        agents: [], // Will store AnyAgentConfig[]
      } as SequentialAgentConfig;
    case AgentType.Parallel:
      return {
        ...baseConfig,
        type: AgentType.Parallel,
        agents: [], // Will store AnyAgentConfig[] (prop name in type is 'agents')
      } as ParallelAgentConfig;
    case AgentType.Loop:
      // LoopAgentConfig expects an 'agent' property of type AnyAgentConfig.
      // For creation, it might be null or a placeholder initially.
      // Or, we find a default agent if applicable, otherwise it's an invalid state until one is selected.
      return {
        ...baseConfig,
        type: AgentType.Loop,
        // agent: undefined, // Or a default/placeholder if that makes sense
        // For now, let's assume it can be temporarily invalid until selected
      } as unknown as LoopAgentConfig; // Cast needed if agent is not set initially
    default:
      const _exhaustiveCheck: never = type;
      throw new Error(`Unknown agent type: ${_exhaustiveCheck}`);
  }
};

const AgentConfigurator: React.FC<AgentConfiguratorProps> = ({
  agentConfig: initialAgentConfig,
  onConfigChange,
  onSave,
  isSaving = false,
  isCreatingNew = false,
}) => {
  const [internalConfig, setInternalConfig] = useState<AnyAgentConfig>(deepClone(initialAgentConfig));
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

  useEffect(() => {
    setInternalConfig(deepClone(initialAgentConfig));
  }, [initialAgentConfig]);

  const commitChange = (newConfig: AnyAgentConfig) => {
    setInternalConfig(newConfig);
    onConfigChange(newConfig);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    commitChange({ ...internalConfig, [name]: value } as AnyAgentConfig); // Cast as AnyAgentConfig for base props
  };

  const handleLlmInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (internalConfig.type === AgentType.LLM) {
      const { name, value } = e.target;
      commitChange({ ...internalConfig, [name]: value } as LlmAgentConfig);
    }
  };

  const handleTypeChange = (newType: AgentType) => {
    const newConfig = createNewAgentConfig(newType, internalConfig.id, internalConfig.name);
    commitChange(newConfig);
  };

  const handleSwitchChange = (checked: boolean, name: keyof LlmAgentConfig) => {
    if (internalConfig.type === AgentType.LLM) {
      commitChange({ ...internalConfig, [name]: checked } as LlmAgentConfig);
    }
  };

  const handleToolsSelectionChange = (selectedToolIds: string[]) => {
    if (internalConfig.type === AgentType.LLM) {
      commitChange({ ...internalConfig, tools: selectedToolIds } as LlmAgentConfig);
    }
  };

  const handleRemoveTool = (toolIdToRemove: string) => {
    if (internalConfig.type === AgentType.LLM && internalConfig.tools) {
      const updatedTools = internalConfig.tools.filter((toolId: string) => toolId !== toolIdToRemove);
      commitChange({ ...internalConfig, tools: updatedTools } as LlmAgentConfig);
    }
  };

  const handleAddSubAgentToWorkflowByIds = (agentIdsToAdd: string[]) => {
    const agentsToAdd: AnyAgentConfig[] = agentIdsToAdd
      .map((id: string) => localMockExistingAgents.find((agent: AnyAgentConfig) => agent.id === id))
      .filter(Boolean) as AnyAgentConfig[];

    if (internalConfig.type === AgentType.Sequential) {
      const currentAgents = internalConfig.agents || [];
      const newAgentIds = new Set(currentAgents.map(a => a.id));
      const uniqueNewAgents = agentsToAdd.filter(agent => !newAgentIds.has(agent.id));
      commitChange({ ...internalConfig, agents: [...currentAgents, ...uniqueNewAgents] } as SequentialAgentConfig);
    } else if (internalConfig.type === AgentType.Parallel) {
      const currentAgents = internalConfig.agents || []; // parallel_agents is named 'agents' in ParallelAgentConfig type
      const newAgentIds = new Set(currentAgents.map(a => a.id));
      const uniqueNewAgents = agentsToAdd.filter(agent => !newAgentIds.has(agent.id));
      commitChange({ ...internalConfig, agents: [...currentAgents, ...uniqueNewAgents] } as ParallelAgentConfig);
    }
    setIsAddSubAgentModalOpen(false);
    setSelectedAgentIdsForModal([]);
  };

  const handleRemoveSubAgentFromWorkflow = (agentIdToRemove: string) => {
    if (internalConfig.type === AgentType.Sequential) {
      const currentAgents = internalConfig.agents || [];
      const updatedAgents = currentAgents.filter((agent: AnyAgentConfig) => agent.id !== agentIdToRemove);
      commitChange({ ...internalConfig, agents: updatedAgents } as SequentialAgentConfig);
    } else if (internalConfig.type === AgentType.Parallel) {
      const currentAgents = internalConfig.agents || []; // parallel_agents is named 'agents' in ParallelAgentConfig type
      const updatedAgents = currentAgents.filter((agent: AnyAgentConfig) => agent.id !== agentIdToRemove);
      commitChange({ ...internalConfig, agents: updatedAgents } as ParallelAgentConfig);
    }
  };

  const handleSubAgentsOrderChange = (orderedSubAgents: AnyAgentConfig[]) => {
    if (internalConfig.type === AgentType.Sequential) {
      commitChange({ ...internalConfig, agents: orderedSubAgents } as SequentialAgentConfig);
    } else if (internalConfig.type === AgentType.Parallel) {
      commitChange({ ...internalConfig, agents: orderedSubAgents } as ParallelAgentConfig);
    }
  };
  
  const handleLoopAgentChange = (selectedAgentId: string) => {
    if (internalConfig.type === AgentType.Loop) {
      const selectedAgent = localMockExistingAgents.find((agent: AnyAgentConfig) => agent.id === selectedAgentId);
      if (selectedAgent) {
        commitChange({ ...internalConfig, agent: selectedAgent } as LoopAgentConfig);
      }
    }
  };

  const handleSavePress = async () => {
    if (onSave) {
      await onSave(internalConfig);
    }
  };

  const llmConfig = internalConfig.type === AgentType.LLM ? internalConfig : null;
  const sequentialConfig = internalConfig.type === AgentType.Sequential ? internalConfig : null;
  const parallelConfig = internalConfig.type === AgentType.Parallel ? internalConfig : null;
  const loopConfig = internalConfig.type === AgentType.Loop ? internalConfig : null;

  const isSaveDisabled = 
    !internalConfig.name || 
    isSaving ||
    (llmConfig && !llmConfig.instruction) ||
    (sequentialConfig && (sequentialConfig.agents?.length || 0) < 1) ||
    (parallelConfig && (parallelConfig.agents?.length || 0) < 1) || // Using 'agents' based on ParallelAgentConfig type
    (loopConfig && !loopConfig.agent); // Check for the agent object itself

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '1.5rem', marginBottom: '20px' }}>
        {isCreatingNew ? 'Criar Novo Agente' : 'Configurar Agente'}
      </h2>

      <div style={{ marginBottom: '20px' }}>
        <Label htmlFor="agentName">Nome do Agente</Label>
        <Input
          id="agentName"
          name="name"
          value={internalConfig.name}
          onChange={handleInputChange}
          placeholder="Ex: Agente de Pesquisa"
          style={{ marginTop: '5px' }}
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <Label htmlFor="agentType">Tipo de Agente</Label>
        <Select value={internalConfig.type} onValueChange={(value: AgentType) => handleTypeChange(value)}>
          <SelectTrigger id="agentType" style={{ marginTop: '5px' }}>
            <SelectValue placeholder="Selecione o tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={AgentType.LLM}>LLM Agent</SelectItem>
            <SelectItem value={AgentType.Sequential}>Sequential Agent</SelectItem>
            <SelectItem value={AgentType.Parallel}>Parallel Agent</SelectItem>
            <SelectItem value={AgentType.Loop}>Loop Agent</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {llmConfig && (
        <React.Fragment>
            <div style={{ marginBottom: '20px' }}>
              <Label htmlFor="instruction">Instrução</Label>
              <Textarea
                id="instruction"
                name="instruction"
                value={llmConfig.instruction}
                onChange={handleLlmInputChange}
                placeholder="Instrução detalhada para o agente LLM"
                style={{ marginTop: '5px', minHeight: '100px' }}
              />
            </div>
            {/* Optional: Input for LLM Model */}
            {/* <div style={{ marginBottom: '20px' }}>
              <Label htmlFor="model">Modelo LLM</Label>
              <Input id="model" name="model" value={llmConfig.model || ''} onChange={handleLlmInputChange} style={{ marginTop: '5px' }} />
            </div> */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Label htmlFor="codeExecutionSwitch" style={{ marginRight: '1rem' }}>Execução de Código</Label>
                <Switch
                  id="codeExecutionSwitch"
                  checked={llmConfig.code_execution || false}
                  onCheckedChange={(checked: boolean) => handleSwitchChange(checked, 'code_execution')}
                />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Label htmlFor="planningEnabledSwitch" style={{ marginRight: '1rem' }}>Planejamento Habilitado</Label>
                <Switch
                  id="planningEnabledSwitch"
                  checked={llmConfig.planning_enabled || false}
                  onCheckedChange={(checked: boolean) => handleSwitchChange(checked, 'planning_enabled')}
                />
              </div>
            </div>
            <div style={{ marginTop: '20px' }}>
              <Label>Ferramentas Selecionadas</Label>
              <div style={{ marginTop: '10px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {llmConfig.tools?.map((toolId: string) => {
                  const tool = MOCK_AVAILABLE_TOOLS.find((t: Tool) => t.id === toolId);
                  return tool ? (
                    <Badge key={toolId} variant="secondary" className="flex items-center">
                      {tool.name}
                      <Button variant="ghost" size="sm" className="ml-2 h-4 w-4 p-0" onClick={() => handleRemoveTool(toolId)}>
                        <XIcon className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ) : null;
                })}
                {(!llmConfig.tools || llmConfig.tools.length === 0) && (
                  <p className="text-sm text-muted-foreground">Nenhuma ferramenta selecionada.</p>
                )}
              </div>
              <Dialog open={isToolSelectorOpen} onOpenChange={setIsToolSelectorOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" style={{ marginTop: '10px' }}>
                    {llmConfig.tools?.length ? 'Modificar Ferramentas' : 'Adicionar Ferramentas'}
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Selecionar Ferramentas</DialogTitle>
                  </DialogHeader>
                  <ToolSelector
                    availableTools={MOCK_AVAILABLE_TOOLS}
                    selectedTools={llmConfig.tools || []}
                    onSelectionChange={handleToolsSelectionChange}
                  />
                  <DialogFooter>
                    <DialogPrimitive.Close asChild>
                      <Button type="button">Confirmar</Button>
                    </DialogPrimitive.Close>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
        </React.Fragment>
      )}

      {sequentialConfig && (
        <div style={{ marginTop: '20px' }}>
          <Label>Agentes Sequenciais</Label>
          <AgentDropzone 
            subAgents={sequentialConfig.agents || []} // Prop corrected to subAgents
            onSubAgentsOrderChange={handleSubAgentsOrderChange} 
            onRemoveSubAgent={handleRemoveSubAgentFromWorkflow}
          />
          <Dialog open={isAddSubAgentModalOpen} onOpenChange={setIsAddSubAgentModalOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" style={{ marginTop: '10px' }} onClick={() => setSelectedAgentIdsForModal(sequentialConfig.agents?.map((a: AnyAgentConfig) => a.id) || [])}>
                Adicionar Agente à Sequência
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
              <DialogHeader>
                <DialogTitle>Adicionar Agentes à Sequência</DialogTitle>
              </DialogHeader>
              <AgentList 
                agents={localMockExistingAgents.filter((agent: AnyAgentConfig) => agent.id !== internalConfig.id && !(sequentialConfig.agents || []).find((sa: AnyAgentConfig) => sa.id === agent.id))}
                selectedAgentIds={selectedAgentIdsForModal}
                onAgentToggle={handleAgentSelectionForModal}
                selectable={true}
              />
              <DialogFooter>
                <DialogPrimitive.Close asChild>
                  <Button variant="outline" type="button">Cancelar</Button>
                </DialogPrimitive.Close>
                <Button onClick={() => handleAddSubAgentToWorkflowByIds(selectedAgentIdsForModal)}>Adicionar Selecionados</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      )}

      {parallelConfig && (
         <div style={{ marginTop: '20px' }}>
          <Label>Agentes Paralelos</Label>
          <AgentDropzone 
            subAgents={parallelConfig.agents || []} // Prop corrected to subAgents
            onSubAgentsOrderChange={handleSubAgentsOrderChange} 
            onRemoveSubAgent={handleRemoveSubAgentFromWorkflow}
          />
          <Dialog open={isAddSubAgentModalOpen} onOpenChange={setIsAddSubAgentModalOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" style={{ marginTop: '10px' }} onClick={() => setSelectedAgentIdsForModal(parallelConfig.agents?.map((a: AnyAgentConfig) => a.id) || [])}>
                Adicionar Agente ao Paralelo
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
              <DialogHeader>
                <DialogTitle>Adicionar Agentes ao Paralelo</DialogTitle>
              </DialogHeader>
              <AgentList 
                agents={localMockExistingAgents.filter((agent: AnyAgentConfig) => agent.id !== internalConfig.id && !(parallelConfig.agents || []).find((sa: AnyAgentConfig) => sa.id === agent.id))}
                selectedAgentIds={selectedAgentIdsForModal}
                onAgentToggle={handleAgentSelectionForModal}
                selectable={true}
              />
              <DialogFooter>
                <DialogPrimitive.Close asChild>
                  <Button variant="outline" type="button">Cancelar</Button>
                </DialogPrimitive.Close>
                <Button onClick={() => handleAddSubAgentToWorkflowByIds(selectedAgentIdsForModal)}>Adicionar Selecionados</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      )}

      {loopConfig && (
        <div style={{ marginTop: '20px' }}>
          <Label htmlFor="loopAgentSelect">Agente do Loop</Label>
          <Select 
            value={loopConfig.agent?.id || ''} // Use agent object's id
            onValueChange={handleLoopAgentChange} // New handler
          >
            <SelectTrigger id="loopAgentSelect" style={{ marginTop: '5px' }}>
              <SelectValue placeholder="Selecione o agente para o loop" />
            </SelectTrigger>
            <SelectContent>
              {localMockExistingAgents
                .filter((agent: AnyAgentConfig) => agent.id !== internalConfig.id)
                .map((agent: AnyAgentConfig) => (
                  <SelectItem key={agent.id} value={agent.id}>{agent.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {loopConfig.agent && (
             <p className="text-sm text-muted-foreground mt-2">
              O agente '{loopConfig.agent.name || 'Desconhecido'}' será executado em loop.
            </p>
          )}
        </div>
      )}

      <div style={{ marginTop: '30px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
        <Button
          onClick={handleSavePress}
          disabled={isSaveDisabled || isSaving}
          style={{ minWidth: '120px' }}
        >
          {isSaving ? 'Salvando...' : (isCreatingNew ? 'Criar Agente' : 'Salvar Alterações')}
        </Button>
      </div>
    </div>
  );
};

export default AgentConfigurator;
