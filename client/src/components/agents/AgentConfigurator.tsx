import React, { useState } from 'react';
import { LlmAgentConfig, AgentType, AnyAgentConfig, SequentialAgentConfig, ParallelAgentConfig, LoopAgentConfig } from '@/types/agent';
import {
  Input,
  Textarea,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Switch,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  Badge,
  Button,
  Label,
} from '@/components/ui';
import { XIcon } from 'lucide-react';
import { AgentType, AnyAgentConfig, LlmAgentConfig, SequentialAgentConfig, ParallelAgentConfig, LoopAgentConfig } from '@/types/agent';
import { mockToolsData, mockExistingAgents } from '@/data/mockData';
import ToolSelector from './ToolSelector';
import AgentList from './AgentList';
import AgentDropzone from './AgentDropzone';

interface AgentConfiguratorProps {
  agentConfig: AnyAgentConfig;
  onConfigChange: (config: AnyAgentConfig) => void;
}

const AgentConfigurator: React.FC<AgentConfiguratorProps> = ({ agentConfig, onConfigChange }) => {
  const [isToolSelectorOpen, setIsToolSelectorOpen] = useState(false);
  const [isAddSubAgentModalOpen, setIsAddSubAgentModalOpen] = useState(false);
  const [selectedAgentIdsForModal, setSelectedAgentIdsForModal] = useState<string[]>([]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    onConfigChange({ ...agentConfig, [name]: value });
  };

  const handleTypeChange = (value: AgentType) => {
    const newConfig: AnyAgentConfig = {
      id: agentConfig.id || crypto.randomUUID(),
      name: agentConfig.name,
      type: value,
      tools: agentConfig.tools || [],
      instruction: value === AgentType.LLM ? agentConfig.instruction || '' : undefined,
      code_execution: value === AgentType.LLM ? (agentConfig as LlmAgentConfig).code_execution || false : undefined,
      planning_enabled: value === AgentType.LLM ? (agentConfig as LlmAgentConfig).planning_enabled || false : undefined,
      agents: value === AgentType.Sequential ? (agentConfig as SequentialAgentConfig).agents || [] : undefined,
      parallel_agents: value === AgentType.Parallel ? (agentConfig as ParallelAgentConfig).parallel_agents || [] : undefined,
      loop_agent: value === AgentType.Loop ? (agentConfig as LoopAgentConfig).loop_agent || undefined : undefined
    };
    onConfigChange(newConfig);
  };

  const handleSwitchChange = (checked: boolean, field: keyof LlmAgentConfig) => {
    const newConfig = { ...agentConfig, [field]: checked } as LlmAgentConfig;
    onConfigChange(newConfig);
  };

  const handleToolSelection = (selectedToolIds: string[]) => {
    const newConfig = { ...agentConfig, tools: selectedToolIds } as LlmAgentConfig;
    onConfigChange(newConfig);
    setIsToolSelectorOpen(false);
  };

  const handleSave = () => {
    console.log('Salvando agente:', agentConfig);
    console.log(JSON.stringify(agentConfig, null, 2));
  };

  const handleRemoveTool = (toolIdToRemove: string) => {
    const updatedTools = agentConfig.tools?.filter(id => id !== toolIdToRemove) || [];
    const newConfig = { ...agentConfig, tools: updatedTools } as LlmAgentConfig;
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

          <Dialog open={isToolSelectorOpen} onOpenChange={setIsToolSelectorOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" onClick={() => setIsToolSelectorOpen(true)}>
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
                <Button onClick={() => setIsToolSelectorOpen(false)}>Fechar</Button>
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
            <Dialog open={isAddSubAgentModalOpen} onOpenChange={setIsAddSubAgentModalOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" onClick={() => {
                  setSelectedAgentIdsForModal([]);
                  setIsAddSubAgentModalOpen(true);
                }}>
                  Adicionar Agente
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Adicionar Agente</DialogTitle>
                </DialogHeader>
                <AgentList
                  selectedAgentIds={selectedAgentIdsForModal}
                  onSelectionChange={setSelectedAgentIdsForModal}
                />
                <DialogFooter>
                  <Button
                    onClick={() => {
                      const newConfig = {
                        ...agentConfig,
                        agents: [...(agentConfig as SequentialAgentConfig).agents || [], ...selectedAgentIdsForModal]
                      } as SequentialAgentConfig;
                      onConfigChange(newConfig);
                      setIsAddSubAgentModalOpen(false);
                    }}
                    disabled={selectedAgentIdsForModal.length === 0}
                  >
                    Adicionar Selecionados
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsAddSubAgentModalOpen(false)}
                  >
                    Cancelar
                  </Button>
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
      onConfigChange(baseConfig);
    }
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
