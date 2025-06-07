import React, { useState } from 'react';
import { AgentType } from '@/types/agent';
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
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  DialogClose
} from '@/components/ui';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { XIcon } from 'lucide-react';
import { mockToolsData, mockExistingAgents } from '@/data/mockData';
import { ToolSelector } from './tools/ToolSelector';
import { AgentList } from './AgentList';
import { AgentDropzone } from './workflow/AgentDropzone';
import { deepClone } from '@/lib/utils';

// Type definitions for agent configurations
interface BaseAgentConfig {
  id: string;
  name: string;
  type: AgentType;
  tools?: string[];
}

interface LlmAgentConfig extends BaseAgentConfig {
  instruction: string;
  code_execution: boolean;
  planning_enabled: boolean;
}

interface SequentialAgentConfig extends BaseAgentConfig {
  agents: string[];
}

interface ParallelAgentConfig extends BaseAgentConfig {
  parallel_agents: string[];
}

interface LoopAgentConfig extends BaseAgentConfig {
  loop_agent: string;
}

// Union type for all agent configs
export type AgentConfig = LlmAgentConfig | SequentialAgentConfig | ParallelAgentConfig | LoopAgentConfig;

interface AgentConfiguratorProps {
  agentConfig: AgentConfig;
  onConfigChange: (newConfig: AgentConfig) => void;
  onSave?: () => Promise<void>;
  isSaving?: boolean;
  isCreatingNew?: boolean;
}

interface AgentConfiguratorState {
  isToolSelectorOpen: boolean;
  isAddSubAgentModalOpen: boolean;
  selectedAgentIdsForModal: string[];
}

// Helper function to create new agent config
const createNewAgentConfig = (type: AgentType): AgentConfig => {
  const baseConfig: BaseAgentConfig = {
    id: crypto.randomUUID(),
    name: '',
    type,
    tools: []
  };

  switch (type) {
    case AgentType.LLM:
      return {
        ...baseConfig,
        instruction: '',
        code_execution: false,
        planning_enabled: false
      } as LlmAgentConfig;
    case AgentType.Sequential:
      return {
        ...baseConfig,
        agents: []
      } as SequentialAgentConfig;
    case AgentType.Parallel:
      return {
        ...baseConfig,
        parallel_agents: []
      } as ParallelAgentConfig;
    case AgentType.Loop:
      return {
        ...baseConfig,
        loop_agent: ''
      } as LoopAgentConfig;
    default:
      throw new Error(`Unknown agent type: ${type}`);
  }
};

const AgentConfigurator: React.FC<AgentConfiguratorProps> = ({
  agentConfig,
  onConfigChange,
  onSave,
  isSaving,
  isCreatingNew,
}) => {
  const [state, setState] = useState<AgentConfiguratorState>({
    isToolSelectorOpen: false,
    isAddSubAgentModalOpen: false,
    selectedAgentIdsForModal: []
  });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    onConfigChange({ ...agentConfig, [name]: value } as AgentConfig);
  };

  const handleTypeChange = (value: AgentType) => {
    const newConfig = createNewAgentConfig(value);
    onConfigChange(newConfig);
  };

  const handleSwitchChange = (checked: boolean, name: keyof LlmAgentConfig) => {
    const newConfig = { ...agentConfig, [name]: checked } as AgentConfig;
    onConfigChange(newConfig);
  };

  const handleToolSelection = (selectedToolIds: string[]) => {
    const newConfig = { ...agentConfig, tools: selectedToolIds } as AgentConfig;
    onConfigChange(newConfig);
    setState(prev => ({ ...prev, isToolSelectorOpen: false }));
  };

  const handleSave = () => {
    console.log('Salvando agente:', agentConfig);
    console.log(JSON.stringify(agentConfig, null, 2));
  };

  const handleRemoveTool = (toolIdToRemove: string) => {
    const updatedTools = agentConfig.tools?.filter(id => id !== toolIdToRemove) || [];
    const newConfig = { ...agentConfig, tools: updatedTools } as AgentConfig;
    onConfigChange(newConfig);
  };

  const isSaveDisabled = !agentConfig.name || agentConfig.name.trim() === '' ||
    (agentConfig.type === AgentType.LLM && !agentConfig.instruction?.trim());

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome do Agente</Label>
        <Input
          id="name"
          name="name"
          value={agentConfig.name}
          onChange={handleInputChange}
          placeholder="Nome do agente"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="type">Tipo de Agente</Label>
        <Select value={agentConfig.type} onValueChange={handleTypeChange}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione o tipo de agente" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={AgentType.LLM}>LLM Agent</SelectItem>
            <SelectItem value={AgentType.Sequential}>Sequential Agent</SelectItem>
            <SelectItem value={AgentType.Parallel}>Parallel Agent</SelectItem>
            <SelectItem value={AgentType.Loop}>Loop Agent</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {agentConfig.type === AgentType.LLM && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="instruction">Instrução</Label>
            <Textarea
              id="instruction"
              name="instruction"
              value={agentConfig.instruction}
              onChange={handleInputChange}
              placeholder="Instruções para o agente"
            />
          </div>

          <div className="space-y-2">
            <Label>Configurações</Label>
            <div className="flex gap-4">
              <div className="flex items-center">
                <Switch
                  id="codeExecutionSwitch"
                  checked={(agentConfig as LlmAgentConfig).code_execution || false}
                  onCheckedChange={(checked) => handleSwitchChange(checked, 'code_execution')}
                />
                <Label htmlFor="codeExecutionSwitch" className="ml-2">Execução de Código</Label>
              </div>
              <div className="flex items-center">
                <Switch
                  id="planningEnabledSwitch"
                  checked={(agentConfig as LlmAgentConfig).planning_enabled || false}
                  onCheckedChange={(checked) => handleSwitchChange(checked, 'planning_enabled')}
                />
                <Label htmlFor="planningEnabledSwitch" className="ml-2">Planejamento Habilitado</Label>
              </div>
            </div>
          </div>

          <Dialog open={state.isToolSelectorOpen} onOpenChange={(open) => setState(prev => ({ ...prev, isToolSelectorOpen: open }))}>
            <DialogTrigger asChild>
              <Button variant="outline" onClick={() => setState(prev => ({ ...prev, isToolSelectorOpen: true }))}>
                Adicionar Ferramentas
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Selecionar Ferramentas</DialogTitle>
              </DialogHeader>
              <ToolSelector
                availableTools={mockToolsData}
                selectedTools={agentConfig.tools || []}
                onSelectionChange={handleToolSelection}
              />
              <DialogFooter>
                <DialogClose asChild>
                  <Button onClick={() => setState(prev => ({ ...prev, isToolSelectorOpen: false }))}>Fechar</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {agentConfig.tools?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4 mb-4">
              {agentConfig.tools?.map((toolId) => {
                const tool = mockToolsData.find(t => t.id === toolId);
                return (
                  <Badge key={toolId} variant="secondary" className="flex items-center gap-1">
                    {tool ? tool.name : toolId}
                    <button
                      onClick={() => handleRemoveTool(toolId)}
                      className="ml-1 rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      aria-label={`Remover ${tool ? tool.name : toolId}`}
                    >
                      <XIcon className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                    </button>
                  </Badge>
                );
              })}
            </div>
          )}
        </div>
      )}

      {agentConfig.type === AgentType.Sequential && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold mb-2">Configuração do Agente Sequencial</h3>
          <AgentDropzone subAgents={(agentConfig as SequentialAgentConfig).agents || []} />
          <div className="mt-4">
            <Dialog open={state.isAddSubAgentModalOpen} onOpenChange={(open) => setState(prev => ({ ...prev, isAddSubAgentModalOpen: open }))}>
              <DialogTrigger asChild>
                <Button variant="outline" onClick={() => {
                  setState(prev => ({ ...prev, selectedAgentIdsForModal: [], isAddSubAgentModalOpen: true }));
                }}>
                  Adicionar Agente
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Adicionar Agente</DialogTitle>
                </DialogHeader>
                <AgentList
                  selectedAgentIds={state.selectedAgentIdsForModal}
                  onSelectionChange={(ids) => setState(prev => ({ ...prev, selectedAgentIdsForModal: ids }))}
                />
                <DialogFooter>
                  <Button
                    onClick={() => {
                      const newConfig = {
                        ...agentConfig,
                        agents: [...(agentConfig as SequentialAgentConfig).agents || [], ...state.selectedAgentIdsForModal]
                      } as SequentialAgentConfig;
                      onConfigChange(newConfig);
                      setState(prev => ({ ...prev, isAddSubAgentModalOpen: false }));
                    }}
                    disabled={state.selectedAgentIdsForModal.length === 0}
                  >
                    Adicionar Selecionados
                  </Button>
                  <DialogClose asChild>
                    <Button
                      variant="outline"
                      onClick={() => setState(prev => ({ ...prev, isAddSubAgentModalOpen: false }))}
                    >
                      Cancelar
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      )}

      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={isSaveDisabled}
        >
          Salvar
        </Button>
      </div>
    </div>
  );
};

export default AgentConfigurator;
  const handleSwitchChange = (checked: boolean, name: keyof LlmAgentConfig) => {
    // This function is specific to LlmAgentConfig, ensure it's only called when type is LLM
    if (agentConfig.type === AgentType.LLM) {
      onConfigChange({
        ...agentConfig,
        [name]: checked,
      } as LlmAgentConfig); // Cast to LlmAgentConfig
    }
  };

  // const handleSave = () => {
  //   // Esta lógica será movida para o agentService e chamada pelo AgentWorkspace
  //   // ou por um botão "Salvar" global na página.
  //   // O AgentConfigurator apenas chama onConfigChange para atualizar o rascunho.
  //   console.log('Configuração atualizada (rascunho):', agentConfig);
  // };

  // A função handleSave local foi removida, pois a lógica de salvar agora é passada via props.onSave
  const handleSelectChange = (value: string) => {
    onConfigChange({
      ...agentConfig,
      type: value as AgentType, // Cast to AgentType, ensure value is compatible
    });
  };


  const handleSave = () => {
    console.log('Salvando agente:', agentConfig);
    console.log(JSON.stringify(agentConfig, null, 2));
    // Aqui você adicionaria a lógica para realmente salvar o agente,
    // por exemplo, chamando uma API ou uma função passada por props.
  };

  const handleRemoveTool = (toolIdToRemove: string) => {
    const updatedTools = agentConfig.tools?.filter(id => id !== toolIdToRemove);
    onConfigChange({ ...agentConfig, tools: updatedTools });
  };

  const [isAddSubAgentModalOpen, setIsAddSubAgentModalOpen] = useState(false);
  const [selectedAgentIdsForModal, setSelectedAgentIdsForModal] = useState<string[]>([]);


  // Helper to safely access LLM specific props
  const llmConfig = agentConfig.type === AgentType.LLM ? agentConfig as LlmAgentConfig : null;

  const mockExistingAgents: AnyAgentConfig[] = [
    { id: 'agent_1', name: 'Agente de Pesquisa Web', type: AgentType.LLM, instruction: 'Pesquise na web', model: 'gpt-3.5-turbo' },
    { id: 'agent_2', name: 'Agente Escritor de Artigos', type: AgentType.LLM, instruction: 'Escreva um artigo', model: 'gpt-4' },
    { id: 'agent_3', name: 'Agente Tradutor', type: AgentType.LLM, instruction: 'Traduza o texto', model: 'gpt-3.5-turbo', tools: ['calculator'] },
    // Adicionando um agente do tipo Sequential para teste, se necessário
    // { id: 'agent_4', name: 'Workflow de Teste Sequencial', type: AgentType.Sequential, agents: [] },
  ];

  const handleRemoveSubAgentFromWorkflow = (subAgentIdToRemove: string) => {
    if (agentConfig.type === AgentType.Sequential || agentConfig.type === AgentType.Parallel) {
      const currentSubAgents = (agentConfig as SequentialAgentConfig | ParallelAgentConfig).agents || [];
      const updatedSubAgents = currentSubAgents.filter(agent => agent.id !== subAgentIdToRemove);
      onConfigChange({ ...agentConfig, agents: updatedSubAgents });
    }
  };

  const handleSubAgentsOrderChange = (orderedSubAgents: AnyAgentConfig[]) => {
    if (agentConfig.type === AgentType.Sequential || agentConfig.type === AgentType.Parallel) {
      onConfigChange({ ...agentConfig, agents: orderedSubAgents });
    }
  };

  const handleConfirmAddSubAgents = () => {
    if (agentConfig.type === AgentType.Sequential || agentConfig.type === AgentType.Parallel) {
      const agentsToAdd = mockExistingAgents.filter(agent =>
        selectedAgentIdsForModal.includes(agent.id)
      );

      const currentSubAgents = (agentConfig as SequentialAgentConfig | ParallelAgentConfig).agents || [];

      const newUniqueSubAgents = agentsToAdd.filter(
        newAgent => !currentSubAgents.some(existingAgent => existingAgent.id === newAgent.id)
      );

      if (newUniqueSubAgents.length > 0) {
        const updatedAgentsList = [...currentSubAgents, ...newUniqueSubAgents];
        onConfigChange({ ...agentConfig, agents: updatedAgentsList });
      }
    }
    setSelectedAgentIdsForModal([]);
    setIsAddSubAgentModalOpen(false);
  };
  const isSaveDisabled = agentConfig.name.trim() === '' || agentConfig.instruction.trim() === '';
  const [isToolSelectorOpen, setIsToolSelectorOpen] = useState(false);

  // Mock data for available tools - replace with actual data source later
  const MOCK_AVAILABLE_TOOLS = [
    { id: 'tool_1', name: 'Calculadora', description: 'Realiza cálculos matemáticos.' },
    { id: 'tool_2', name: 'Busca na Web', description: 'Busca informações na internet.' },
    { id: 'tool_3', name: 'Leitor de Arquivos', description: 'Lê o conteúdo de arquivos.' },
  ];

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome do Agente</Label>
        <Input
          id="name"
          name="name"
          value={agentConfig.name}
          onChange={handleInputChange}
          placeholder="Nome do agente"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="type">Tipo de Agente</Label>
        <Select value={agentConfig.type} onValueChange={handleTypeChange}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione o tipo de agente" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={AgentType.LLM}>LLM Agent</SelectItem>
            <SelectItem value={AgentType.Sequential}>Sequential Agent</SelectItem>
            <SelectItem value={AgentType.Parallel}>Parallel Agent</SelectItem>
            <SelectItem value={AgentType.Loop}>Loop Agent</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {agentConfig.type === AgentType.LLM && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="instruction">Instrução</Label>
            <Textarea
              id="instruction"
              name="instruction"
              value={agentConfig.instruction}
              onChange={handleInputChange}
              placeholder="Instruções para o agente"
            />
                      <Switch
                        id="codeExecutionSwitch"
                        checked={llmConfig.code_execution || false}
                        onCheckedChange={(checked) => handleSwitchChange(checked, 'code_execution')}
                      />
                    </div>
                    <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Label htmlFor="planningEnabledSwitch" style={{ marginRight: '1rem' }}>Planejamento Habilitado</Label>
                      <Switch
                        id="planningEnabledSwitch"
                        checked={llmConfig.planning_enabled || false}
                        onCheckedChange={(checked) => handleSwitchChange(checked, 'planning_enabled')}
                      />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <Dialog open={isToolSelectorOpen} onOpenChange={setIsToolSelectorOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" style={{ marginTop: '20px', marginRight: '10px' }}>
                  Adicionar Ferramenta
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Selecionar Ferramentas</DialogTitle>
                </DialogHeader>
                <ToolSelector
                  selectedTools={llmConfig.tools || []}
                  onSelectionChange={(selectedIds) => {
                    onConfigChange({ ...llmConfig, tools: selectedIds } as LlmAgentConfig);
                  }}
                />
                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button">Confirmar</Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {llmConfig.tools && llmConfig.tools.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4 mb-4">
                {llmConfig.tools.map((toolId) => {
                  const tool = mockToolsData.find(t => t.id === toolId);
                  return (
                    <Badge key={toolId} variant="secondary" className="flex items-center gap-1">
                      {tool ? tool.name : toolId}
                      <button
                        onClick={() => handleRemoveTool(toolId)}
                        className="ml-1 rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                        aria-label={`Remover ${tool ? tool.name : toolId}`}
                      >
                        <XIcon className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                      </button>
                    </Badge>
                  );
                })}
              </div>
            )}
          </>
        )}

        {agentConfig.type === AgentType.Sequential && (
          <div className="mt-4">
            <h3 className="text-xl font-semibold mb-2">Configuração do Agente Sequencial</h3>
            <AgentDropzone
              subAgents={(agentConfig as SequentialAgentConfig).agents || []}
              onRemoveSubAgent={handleRemoveSubAgentFromWorkflow}
              onSubAgentsOrderChange={handleSubAgentsOrderChange}
              isOrderable={true} // Sequential agents are orderable
            />
            <AgentDropzone subAgents={(agentConfig as SequentialAgentConfig).agents || []} />
            <div className="mt-4">
              <Dialog open={isAddSubAgentModalOpen} onOpenChange={setIsAddSubAgentModalOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" onClick={() => {
                    setSelectedAgentIdsForModal([]);
                    setIsAddSubAgentModalOpen(true);
                  }}>
                    Adicionar Sub-Agente
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Adicionar Sub-Agente ao Workflow</DialogTitle>
                  </DialogHeader>
                  <AgentList
                    agents={mockExistingAgents.filter(agent => agent.id !== agentConfig.id)}
                    selectedAgentIds={selectedAgentIdsForModal}
                    onAgentToggle={(agentId) => {
                      setSelectedAgentIdsForModal(prev =>
                        prev.includes(agentId) ? prev.filter(id => id !== agentId) : [...prev, agentId]
                      );
                    }}
                    selectable={true}
                    title="Selecione os Agentes"
                  />
                  <DialogFooter>
                    <Button type="button" variant="ghost" onClick={() => setIsAddSubAgentModalOpen(false)}>Cancelar</Button>
                    <Button type="button" onClick={handleConfirmAddSubAgents}>
                    <Button type="button" onClick={() => {
                      console.log("IDs dos sub-agentes selecionados:", selectedAgentIdsForModal);
                      setIsAddSubAgentModalOpen(false);
                    }}>
                      Adicionar Selecionados
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        )}

        {agentConfig.type === AgentType.Parallel && (
          <div className="mt-4">
            <h3 className="text-xl font-semibold mb-2">Configuração do Agente Paralelo</h3>
            <AgentDropzone
              subAgents={(agentConfig as ParallelAgentConfig).agents || []}
              onRemoveSubAgent={handleRemoveSubAgentFromWorkflow}
              onSubAgentsOrderChange={handleSubAgentsOrderChange}
              isOrderable={true} // Or false, if parallel agents order doesn't matter and D&D is not desired
            />
            <AgentDropzone subAgents={(agentConfig as ParallelAgentConfig).agents || []} />
            <div className="mt-4">
              <Dialog open={isAddSubAgentModalOpen} onOpenChange={setIsAddSubAgentModalOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" onClick={() => {
                    setSelectedAgentIdsForModal([]);
                    setIsAddSubAgentModalOpen(true);
                  }}>
                    Adicionar Sub-Agente
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Adicionar Sub-Agente ao Workflow</DialogTitle>
                  </DialogHeader>
                  <AgentList
                    agents={mockExistingAgents.filter(agent => agent.id !== agentConfig.id)}
                    selectedAgentIds={selectedAgentIdsForModal}
                    onAgentToggle={(agentId) => {
                      setSelectedAgentIdsForModal(prev =>
                        prev.includes(agentId) ? prev.filter(id => id !== agentId) : [...prev, agentId]
                      );
                    }}
                    selectable={true}
                    title="Selecione os Agentes"
                  />
                  <DialogFooter>
                    <Button type="button" variant="ghost" onClick={() => setIsAddSubAgentModalOpen(false)}>Cancelar</Button>
                    <Button type="button" onClick={handleConfirmAddSubAgents}>
                    <Button type="button" onClick={() => {
                      console.log("IDs dos sub-agentes selecionados:", selectedAgentIdsForModal);
                      setIsAddSubAgentModalOpen(false);
                    }}>
                      Adicionar Selecionados
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        )}

        {/* Fallback para tipos não reconhecidos (opcional) */}
        {![AgentType.LLM, AgentType.Sequential, AgentType.Parallel].includes(agentConfig.type) && (
           <p className="mt-4">Tipo de agente não reconhecido ou configuração não disponível.</p>
        )}

        <Button
          type="button"
          onClick={onSave}
          disabled={isSaveDisabled || isSaving}
          className="mt-6 w-full" // Exemplo de classes, ajuste conforme necessário
        >
          {isSaving ? 'Salvando...' : (isCreatingNew ? 'Criar Agente' : 'Salvar Alterações')}
        <Accordion type="multiple" defaultValue={["item-1", "item-2"]} className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>Configuração Principal</AccordionTrigger>
            <AccordionContent>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', paddingTop: '1rem' }}>
                <div style={{ marginBottom: '1rem' }}>
                  <Label htmlFor="agentName">Nome do Agente</Label>
                  <Input
                    id="agentName"
                    name="name"
                    value={agentConfig.name}
                    onChange={handleInputChange}
                    placeholder="Ex: Agente de Pesquisa"
                  />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <Label htmlFor="agentType">Tipo de Agente</Label>
                  <Select
                    value={agentConfig.type}
                    onValueChange={handleSelectChange}
                    disabled // Disabled as per instruction, forcing LLM Agent for now
                  >
                    <SelectTrigger id="agentType">
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={AgentType.LLM}>LLM Agent</SelectItem>
                      {/* Add other agent types here if/when supported */}
                    </SelectContent>
                  </Select>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <Label htmlFor="instruction">Instrução</Label>
                  <Textarea
                    id="instruction"
                    name="instruction"
                    value={agentConfig.instruction}
                    onChange={handleInputChange}
                    placeholder="Instrução detalhada para o agente..."
                    rows={4}
                  />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <Label htmlFor="model">Modelo</Label>
                  <Input
                    id="model"
                    name="model"
                    value={agentConfig.model}
                    onChange={handleInputChange}
                    placeholder="Ex: gpt-4, gemini-pro"
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Parâmetros Avançados</AccordionTrigger>
            <AccordionContent>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', paddingTop: '1rem' }}>
                <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Label htmlFor="codeExecutionSwitch" style={{ marginRight: '1rem' }}>Execução de Código</Label>
                  <Switch
                    id="codeExecutionSwitch"
                    checked={agentConfig.code_execution}
                    onCheckedChange={(checked) => handleSwitchChange(checked, 'code_execution')}
                  />
                </div>

                <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Label htmlFor="planningEnabledSwitch" style={{ marginRight: '1rem' }}>Planejamento Habilitado</Label>
                  <Switch
                    id="planningEnabledSwitch"
                    checked={agentConfig.planning_enabled}
                    onCheckedChange={(checked) => handleSwitchChange(checked, 'planning_enabled')}
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <Dialog open={isToolSelectorOpen} onOpenChange={setIsToolSelectorOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" style={{ marginTop: '20px', marginRight: '10px' }}>
              Adicionar Ferramenta
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Selecionar Ferramentas</DialogTitle>
            </DialogHeader>
            <ToolSelector
              availableTools={MOCK_AVAILABLE_TOOLS} // Using mock data for now
              selectedTools={agentConfig.tools || []} // Assuming agentConfig might have a tools array
              onSelectionChange={(selectedIds) => {
                onConfigChange({ ...agentConfig, tools: selectedIds });
                console.log("Seleção de ferramentas alterada:", selectedIds);
              }}
            />
            {/* DialogFooter can be added here or inside ToolSelector if needed */}
            {/* Example:
            <DialogFooter>
              <Button onClick={() => setIsToolSelectorOpen(false)}>Confirmar</Button>
            </DialogFooter>
            */}
          </DialogContent>
        </Dialog>

        <Button
          onClick={handleSave}
          disabled={isSaveDisabled}
          style={{ marginTop: '20px' }}
        >
          Salvar Agente
        </Button>
      </div>
    </div>
  );
};

export default AgentConfigurator;
