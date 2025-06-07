import React, { useState } from 'react';
import { LlmAgentConfig, AgentType, AnyAgentConfig, SequentialAgentConfig, ParallelAgentConfig } from '@/types/agent';
import { LlmAgentConfig, AgentType } from '@/types/agent';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { ToolSelector } from '@/components/agents/tools';
import { Badge } from "@/components/ui/badge";
import { XIcon } from 'lucide-react'; // Ou use um 'x' textual se lucide-react não estiver disponível
import mockToolsData from '../../../data/mock-tools.json'; // Ajuste o caminho se necessário
import { AgentDropzone } from '@/components/agents/workflow';
import AgentList from '@/components/agents/AgentList';
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ToolSelector } from '@/components/agents/tools';

// Assuming shadcn/ui components are available.
// For now, let's use a placeholder div if Card is not found by the linter.
// import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'; // Example import

interface AgentConfiguratorProps {
  agentConfig: AnyAgentConfig;
  onConfigChange: (newConfig: AnyAgentConfig) => void;
  onSave?: () => Promise<void>; // Nova prop
  isSaving?: boolean; // Nova prop
  isCreatingNew?: boolean; // Nova prop
}

const AgentConfigurator: React.FC<AgentConfiguratorProps> = ({
  agentConfig,
  onConfigChange,
  onSave,
  isSaving,
  isCreatingNew,
}) => {
  agentConfig: AnyAgentConfig; // Changed to AnyAgentConfig
  onConfigChange: (newConfig: AnyAgentConfig) => void; // Changed to AnyAgentConfig
  agentConfig: LlmAgentConfig;
  onConfigChange: (newConfig: LlmAgentConfig) => void;
}

const AgentConfigurator: React.FC<AgentConfiguratorProps> = ({ agentConfig, onConfigChange }) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    onConfigChange({
      ...agentConfig,
      [name]: value,
    });
  };

  // Renamed from handleSelectChange to handleTypeChange for clarity
  const handleTypeChange = (newTypeString: string) => {
    const newType = newTypeString as AgentType;
    const baseConfig = {
      id: agentConfig.id, // Preserve ID
      name: agentConfig.name, // Preserve Name
      type: newType,
    };

    if (newType === AgentType.LLM) {
      onConfigChange({
        ...baseConfig,
        instruction: (agentConfig as LlmAgentConfig).instruction || '', // Retain if possible, else default
        model: (agentConfig as LlmAgentConfig).model || 'gpt-3.5-turbo', // Retain if possible, else default
        code_execution: (agentConfig as LlmAgentConfig).code_execution || false,
        planning_enabled: (agentConfig as LlmAgentConfig).planning_enabled || false,
        tools: (agentConfig as LlmAgentConfig).tools || [],
      } as LlmAgentConfig);
    } else if (newType === AgentType.Sequential || newType === AgentType.Parallel) {
      let newSpecificConfig: SequentialAgentConfig | ParallelAgentConfig;
      if (newType === AgentType.Sequential) {
        newSpecificConfig = {
          ...baseConfig,
          type: AgentType.Sequential,
          agents: (agentConfig as SequentialAgentConfig).agents || [], // Retain if possible, else default
        };
      } else { // AgentType.Parallel
        newSpecificConfig = {
          ...baseConfig,
          type: AgentType.Parallel,
          agents: (agentConfig as ParallelAgentConfig).agents || [], // Retain if possible, else default
        };
      }
      onConfigChange(newSpecificConfig);
    } else {
      // For other types or if no specific fields are needed initially beyond base
      onConfigChange(baseConfig);
    }
  };

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

  const handleSwitchChange = (checked: boolean, name: keyof LlmAgentConfig) => {
    onConfigChange({
      ...agentConfig,
      [name]: checked,
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

  const isSaveDisabled = !agentConfig || !agentConfig.name || agentConfig.name.trim() === '' ||
                         (agentConfig.type === AgentType.LLM && !(agentConfig as LlmAgentConfig).instruction?.trim());
  const [isToolSelectorOpen, setIsToolSelectorOpen] = useState(false);
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
    // Replace div with <Card className="h-full">
    <div>
      {/* Replace div with <CardHeader> */}
      <div>
        {/* Replace div with <CardTitle> */}
        <div style={{ fontWeight: 'bold', fontSize: '1.25rem', marginBottom: '1rem' }}>Agent Configuration</div>
      </div>
      {/* Replace div with <CardContent> */}
      <div>
        {/* Campos Comuns */}
        <div style={{ marginBottom: '1rem' }}>
          <Label htmlFor="agentName">Nome do Agente</Label>
          <Input
            id="agentName"
            name="name"
            value={agentConfig.name || ''}
            onChange={handleInputChange}
            placeholder="Ex: Agente de Pesquisa"
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <Label htmlFor="agentType">Tipo de Agente</Label>
          <Select
            value={agentConfig.type}
            onValueChange={handleTypeChange} // Changed to handleTypeChange
          >
            <SelectTrigger id="agentType">
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={AgentType.LLM}>LLM Agent</SelectItem>
              <SelectItem value={AgentType.Sequential}>Sequential Agent</SelectItem>
              <SelectItem value={AgentType.Parallel}>Parallel Agent</SelectItem>
              {/* Adicione AgentType.Loop aqui se necessário */}
            </SelectContent>
          </Select>
        </div>

        {/* Campos Específicos do Tipo de Agente */}
        {agentConfig.type === AgentType.LLM && llmConfig && (
          <>
            <Accordion type="multiple" defaultValue={["item-1", "item-2"]} className="w-full mt-4">
              <AccordionItem value="item-1">
                <AccordionTrigger>Configuração Principal</AccordionTrigger>
                <AccordionContent>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', paddingTop: '1rem' }}>
                    <div style={{ marginBottom: '1rem' }}>
                      <Label htmlFor="instruction">Instrução</Label>
                      <Textarea
                        id="instruction"
                        name="instruction"
                        value={llmConfig.instruction || ''}
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
                        value={llmConfig.model || ''}
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
