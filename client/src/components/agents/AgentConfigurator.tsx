import React from 'react'; // useState removed
// import { useAgentConfig } from '@/hooks/useAgentConfig'; // No longer used directly
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { useAgentConfiguratorLogic } from '@/hooks/useAgentConfiguratorLogic'; // Import the new hook
import {
  AgentType,
  AnyAgentConfig,
  LlmAgentConfig,
  SequentialAgentConfig,
  ParallelAgentConfig,
  LoopAgentConfig,
  Tool
} from '@/types';

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
import { Slider } from '@/components/ui/slider';
import { XIcon, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

import mockToolsDataJson from '@/data/mocks/mock-tools.json'; // Corrected import
import { mockInitialAgents as importedMockExistingAgents } from '@/data/mocks/mock-initial-agents'; // Corrected import

import { ToolSelector } from './tools/ToolSelector'; // Named import
import AgentList from './AgentList';
import AgentDropzone from './workflow/AgentDropzone';
import { createNewAgentConfig } from '@/lib/agent-utils';

// Cast the imported JSON to the Tool array type
const MOCK_AVAILABLE_TOOLS: Tool[] = mockToolsDataJson as Tool[];
// Use the imported agents directly as they should conform to AnyAgentConfig[]
const localMockExistingAgents: AnyAgentConfig[] = importedMockExistingAgents;

interface AgentConfiguratorProps {
  agentConfig: AnyAgentConfig; // Configuração inicial
  onSave?: (configToSave: AnyAgentConfig) => Promise<void>;
  isSaving?: boolean;
  isCreatingNew?: boolean;
}

/**
 * Componente de formulário para edição de agentes.
 * A lógica de estado é delegada ao hook `useAgentConfig`, mantendo a UI simples.
 */
const AgentConfigurator: React.FC<AgentConfiguratorProps> = ({
  agentConfig: initialAgentConfig,
  onSave,
  isSaving: बाहेरून_येणारे_isSaving = false, // Renamed to avoid conflict with any potential future internal isSaving
  isCreatingNew = false,
}) => {
  const {
    config,
    // updateConfig, // No longer directly used, type changes via handleTypeChange from hook
    // updateField, // No longer directly used, input changes via handleInputChange from hook
    llmConfig,
    sequentialConfig,
    parallelConfig,
    loopConfig,
    isToolSelectorOpen,
    setIsToolSelectorOpen,
    isAddSubAgentModalOpen,
    setIsAddSubAgentModalOpen,
    selectedAgentIdsForModal,
    // setSelectedAgentIdsForModal, // Used by handleAgentSelectionForModal from hook
    handleAgentSelectionForModal,
    handleInputChange,
    handleLlmInputChange,
    handleSliderChange,
    handleTypeChange,
    handleSwitchChange,
    handleToolsSelectionChange,
    handleRemoveSelectedTool, // Renamed in hook
    handleAddSubAgentToWorkflowByIds,
    handleRemoveSubAgentFromWorkflow,
    handleSubAgentsOrderChange,
    handleLoopAgentChange,
    handleSavePress,
    isSaveDisabled,
    localMockExistingAgents: hookLocalMockExistingAgents, // Use the one from the hook if needed, or keep component's
  } = useAgentConfiguratorLogic({
    initialAgentConfig,
    onSave, // Pass onSave to the hook
    isSavingGlobal: बाहेरून_येणारे_isSaving, // Pass isSaving to the hook
  });
  // MOCK_AVAILABLE_TOOLS is still needed for ToolSelector and rendering tool names.
  // localMockExistingAgents from the component scope is used for AgentList filters.
  // The hook also returns localMockExistingAgents, decide which one to use or if they should be synced.
  // For now, assuming component's localMockExistingAgents for AgentList filters is fine.

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
          value={config.name}
          onChange={handleInputChange}
          placeholder="Ex: Agente de Pesquisa"
          style={{ marginTop: '5px' }}
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <Label htmlFor="agentType">Tipo de Agente</Label>
        <Select value={config.type} onValueChange={(value: AgentType) => handleTypeChange(value)}>
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
            
            {/* Generation Parameters Section */}
            <div style={{ marginTop: '24px', marginBottom: '20px' }}>
              <h3 className="text-lg font-medium mb-4">Configurações de Geração</h3>
              
              {/* Temperature */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center">
                  <Label htmlFor="temperature" className="mr-2">Temperatura: {llmConfig.temperature?.toFixed(1) || '0.7'}</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Controla a aleatoriedade. Valores mais baixos (0.1-0.3) tornam a saída mais focada, enquanto valores mais altos (0.7-1.0) a tornam mais criativa.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Slider
                  id="temperature"
                  min={0}
                  max={2}
                  step={0.1}
                  value={[llmConfig.temperature ?? 0.7]}
                  onValueChange={([value]) => handleSliderChange(value, 'temperature')}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Preciso</span>
                  <span>Equilibrado</span>
                  <span>Criativo</span>
                </div>
              </div>

              {/* Max Output Tokens */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center">
                  <Label htmlFor="maxTokens" className="mr-2">Máx. Tokens de Saída: {llmConfig.maxOutputTokens || 1000}</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Limita o número de tokens na resposta. Valores mais altos permitem respostas mais longas, mas consomem mais recursos.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Slider
                  id="maxTokens"
                  min={100}
                  max={4000}
                  step={100}
                  value={[llmConfig.maxOutputTokens ?? 1000]}
                  onValueChange={([value]) => handleSliderChange(value, 'maxOutputTokens')}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>100</span>
                  <span>1000</span>
                  <span>4000</span>
                </div>
              </div>

              {/* Top P */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center">
                  <Label htmlFor="topP" className="mr-2">Top P: {llmConfig.topP?.toFixed(1) || '0.9'}</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Controla a diversidade via amostragem de núcleo. Valores mais baixos (0.5-0.8) tornam a saída mais focada, enquanto valores mais altos (0.9-1.0) permitem mais diversidade.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Slider
                  id="topP"
                  min={0.1}
                  max={1}
                  step={0.1}
                  value={[llmConfig.topP ?? 0.9]}
                  onValueChange={([value]) => handleSliderChange(Number(value.toFixed(1)), 'topP')}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Focado</span>
                  <span>Equilibrado</span>
                  <span>Diverso</span>
                </div>
              </div>

              {/* Top K */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center">
                  <Label htmlFor="topK" className="mr-2">Top K: {llmConfig.topK || 40}</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Limita a geração aos K tokens mais prováveis a cada etapa. Valores mais baixos tornam a saída mais previsível, enquanto valores mais altos permitem mais criatividade.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Slider
                  id="topK"
                  min={1}
                  max={100}
                  step={1}
                  value={[llmConfig.topK ?? 40]}
                  onValueChange={([value]) => handleSliderChange(value, 'topK')}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Previsível</span>
                  <span>Equilibrado</span>
                  <span>Criativo</span>
                </div>
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
                      <Button variant="ghost" size="sm" className="ml-2 h-4 w-4 p-0" onClick={() => handleRemoveSelectedTool(toolId)}>
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
                agents={localMockExistingAgents.filter((agent: AnyAgentConfig) => agent.id !== config.id && !(sequentialConfig.agents || []).find((sa: AnyAgentConfig) => sa.id === agent.id))}
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
                agents={localMockExistingAgents.filter((agent: AnyAgentConfig) => agent.id !== config.id && !(parallelConfig.agents || []).find((sa: AnyAgentConfig) => sa.id === agent.id))}
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
                .filter((agent: AnyAgentConfig) => agent.id !== config.id)
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
          disabled={isSaveDisabled} {/* isSaveDisabled from hook already considers isSavingGlobal */}
          style={{ minWidth: '120px' }}
        >
          {बाहेरून_येणारे_isSaving ? 'Salvando...' : (isCreatingNew ? 'Criar Agente' : 'Salvar Alterações')}
        </Button>
      </div>
    </div>
  );
};

export default AgentConfigurator;
