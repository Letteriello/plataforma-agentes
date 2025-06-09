import React, { useState, useEffect, useCallback } from 'react'; // Removed useMemo
import { useParams, useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { toast as sonnerToast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/components/ui/use-toast';
// Removed: Info, ArrowLeft, Copy, Share2, Play, Code, Settings, Shield, Wrench, ChevronDown, ChevronUp, GripVertical
// Kept: Plus, Trash2, Save, X, Loader2 (Pencil is now in AgentBasicInfoForm)
import { Loader2, Plus, Trash2, Save, X } from 'lucide-react';

// Import UI components
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Fieldset } from '@/components/ui/fieldset';
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
// import { ScrollArea } from '@/components/ui/scroll-area'; // Removed
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Separator } from '@/components/ui/separator'; // Removed
// import { Switch } from '@/components/ui/switch'; // Removed
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'; // Removed
// Textarea, Tooltip related components are now in AgentBasicInfoForm
import { Textarea } from '@/components/ui/textarea';
// import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
// import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'; // Removed
import DescriptionEditorDialog from "./Agentes/components/DescriptionEditorDialog";
import InstructionEditorDialog from "./Agentes/components/InstructionEditorDialog";
import ToolDialog from "./Agentes/components/ToolDialog";
import { ToolList } from "./Agentes/components/ToolList";
import AgentBasicInfoForm from '@/components/agents/AgentForm/AgentBasicInfoForm';
import AgentInstructionsForm from '@/components/agents/AgentForm/AgentInstructionsForm';
import AgentLLMSettingsForm from '@/components/agents/AgentForm/AgentLLMSettingsForm';
import AgentSequentialSettingsForm from '@/components/agents/AgentForm/AgentSequentialSettingsForm';
import AgentA2ASettingsForm from '@/components/agents/AgentForm/AgentA2ASettingsForm';

// Import types
import { 
  AgentType
  // type LlmAgentConfig, // Removed
  // type WorkflowAgentConfig, // Removed
  // type SequentialAgentConfig, // Removed
  // type A2AAgentConfig, // Removed
  // type SafetySetting // Removed
} from '@/types/agent';

// Import tool types
// import { Tool, ToolParameter } from '@/types/tool'; // Removed

// Services
import { agentService } from '@/api/agentService';

// Utils
import { cn } from '@/lib/utils';

// Agent form types
interface FormToolParameter {
  id: string;
  name: string;
  type: 'string' | 'number' | 'boolean' | 'array' | 'object';
  description: string;
  required: boolean;
  defaultValue?: string;
  default?: unknown;
  enum?: string[];
}

// Type for tool in the form
interface FormTool {
  id: string;
  name: string;
  description: string;
  parameters: FormToolParameter[];
  enabled: boolean;
  required?: boolean;
  condition?: string;
  returnType?: string;
}

// Type for tool dialog props
type ToolDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tool: FormTool | null;
  onSave: (tool: FormTool) => void;
  isEditing: boolean;
};

// Type for LLM Agent Form props
interface LLMAgentFormProps {
  agent: AgentState;
  onChange: (field: keyof AgentState, value: unknown) => void;
  onNestedChange: (field: string, value: any) => void;
  onAddTool: (tool: FormTool) => void;
  onEditTool: (index: number, tool: FormTool) => void;
  onDeleteTool: (index: number) => void;
}

// Type for safety settings in the form
interface FormSafetySetting {
  id: string;
  category: 'HARM_CATEGORY_HARASSMENT' | 
            'HARM_CATEGORY_HATE_SPEECH' | 
            'HARM_CATEGORY_SEXUALLY_EXPLICIT' | 
            'HARM_CATEGORY_DANGEROUS_CONTENT';
  threshold: 'BLOCK_NONE' | 'BLOCK_ONLY_HIGH' | 'BLOCK_MEDIUM_AND_ABOVE' | 'BLOCK_LOW_AND_ABOVE';
  enabled: boolean;
  condition: string;
}

// Type for agent state
interface AgentState {
  // Common fields
  id: string;
  name: string;
  description: string;
  type: AgentType;
  instructions: string;
  tools: FormTool[];
  safetySettings: FormSafetySetting[];
  model: string;
  temperature: number;
  maxTokens: number;
  topP: number;
  topK: number;
  stopSequences: string[];
  frequencyPenalty: number;
  presencePenalty: number;
  logitBias: Record<string, number>;
  version: string;
  isPublic: boolean;
  tags: string[];
  workflowType?: string;
  streaming?: boolean;
  
  // LLM specific
  instruction?: string;
  systemPrompt?: string;
  
  // Sequential/Parallel specific
  agents?: string[];
  maxSteps?: number;
  stopOnError?: boolean;
  continueOnError?: boolean;
  stopCondition?: string;
  
  // A2A specific
  agent?: string | null;
  condition?: string;
  maxIterations?: number;
  endpoint?: string;
  method?: string;
  headers?: Record<string, string>;
  requestSchema?: Record<string, unknown>;
  responseSchema?: Record<string, unknown>;
  supportsPush?: boolean;
  
  // Parallel specific
  maxConcurrent?: number;
  timeoutMs?: number;
  
  // Additional fields
  maxDurationMs?: number;
  authType?: string;
  supportedFormats?: string[];
}

// Extended A2A Agent Config for form
interface A2AAgentConfig {
  type: AgentType.A2A;
  tools: FormTool[];
  safetySettings: FormSafetySetting[];
}

// Parallel Agent Config
interface ParallelAgentConfig {
  id: string;
  name: string;
  description: string;
  type: AgentType.PARALLEL;
  agents: string[];
  maxConcurrent: number;
  timeoutMs: number;
  condition?: string;
  enabled?: boolean;
  version: string;
  tools: FormTool[];
  safetySettings: FormSafetySetting[];
  workflowType?: string;
}

const getDefaultAgentConfig = (type: AgentType): AgentState => {
  const base: AgentState = {
    id: `agent-${uuidv4()}`,
    name: `Novo Agente ${type}`,
    description: '',
    type,
    instructions: '',
    tools: [],
    safetySettings: [],
    model: 'gpt-4',
    temperature: 0.7,
    maxTokens: 2048,
    topP: 1,
    topK: 0,
    stopSequences: [],
    frequencyPenalty: 0,
    presencePenalty: 0,
    logitBias: {},
    version: '1.0.0',
    isPublic: false,
    tags: [],
    streaming: false,
    // Additional fields for backward compatibility
    instruction: '',
    systemPrompt: '',
    // Sequential/Parallel specific
    agents: [],
    // A2A specific
    agent: null,
    condition: '',
    maxIterations: 10,
    endpoint: '',
    method: 'POST',
    headers: {},
    requestSchema: {},
    responseSchema: {},
    // Additional agent type specific fields
    maxSteps: 10,
    stopOnError: true,
    maxConcurrent: 5,
    timeoutMs: 30000,
    maxDurationMs: 60000,
    authType: 'none',
    supportedFormats: ['json']
  };

  switch (type) {
    case AgentType.LLM:
      return base;
    case AgentType.SEQUENTIAL:
      return {
        ...base,
        agents: [],
        maxSteps: 10,
        stopOnError: true
      };
    case AgentType.PARALLEL:
      return {
        ...base,
        agents: [],
        maxConcurrent: 3,
        timeoutMs: 30000
      };
    case AgentType.LOOP:
      return {
        ...base,
        agent: null,
        maxIterations: 5,
        condition: '',
        maxDurationMs: 60000
      };
    case AgentType.A2A:
      return {
        ...base,
        endpoint: '',
        method: 'POST',
        headers: {},
        requestSchema: {},
        responseSchema: {},
        authType: 'none',
        supportedFormats: ['application/json']
      };
    default:
      return base;
  }
};

    {/* Conteúdo Principal */}
    <div className="flex-1 overflow-auto p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Seção de Informações Básicas - Refatorada */}
        <AgentBasicInfoForm
          name={agentState.name}
          description={agentState.description}
          type={agentState.type}
          onNameChange={(name) => setAgentState(prev => ({ ...prev, name }))}
          onEditDescription={() => {
            setCurrentEditingDescription(agentState.description || '');
            setIsDescriptionDialogOpen(true);
          }}
          onTypeChange={(newType) => {
            setAgentState(prev => ({
              ...prev,
              ...getDefaultAgentConfig(newType),
              type: newType,
              id: prev.id, // Preserve existing ID
              name: prev.name || `Novo Agente ${newType}` // Preserve name or set default
            }));
          }}
        />

        {/* Seção de Instruções - Refatorada */}
        <AgentInstructionsForm
          instructions={agentState.instructions}
          onEditInstructions={() => {
            setCurrentEditingInstruction(agentState.instructions || '');
            setIsInstructionDialogOpen(true);
          }}
        />

        {/* Seção de Ferramentas */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6 border-b">
            <ToolList
              tools={agentState.tools}
              onAddTool={() => openToolDialog(null)}
              onEditTool={(index) => openToolDialog(index)}
              onDeleteTool={(index) => confirmDeleteTool(index)}
            />
          </div>
        </div>

        {/* Configurações Avançadas */}
        {agentState.type === AgentType.LLM && (
          <AgentLLMSettingsForm
            model={agentState.model}
            temperature={agentState.temperature}
            streaming={agentState.streaming || false} // Ensure streaming has a default boolean value
            onModelChange={(model) => setAgentState(prev => ({ ...prev, model }))}
            onTemperatureChange={(temperature) => setAgentState(prev => ({ ...prev, temperature }))}
            onStreamingChange={(streaming) => setAgentState(prev => ({ ...prev, streaming }))}
          />
        )}
        
        {/* Configurações Específicas para Agentes Sequenciais */}
        {agentState.type === AgentType.SEQUENTIAL && (
          <AgentSequentialSettingsForm
            maxSteps={agentState.maxSteps}
            stopOnError={agentState.stopOnError}
            onMaxStepsChange={(maxSteps) => setAgentState(prev => ({ ...prev, maxSteps }))}
            onStopOnErrorChange={(stopOnError) => setAgentState(prev => ({ ...prev, stopOnError }))}
          />
        )}
        
        {/* Configurações Específicas para Agentes A2A */}
        {agentState.type === AgentType.A2A && (
          <AgentA2ASettingsForm
            timeoutMs={agentState.timeoutMs}
            maxConcurrent={agentState.maxConcurrent}
            onTimeoutMsChange={(timeoutMs) => setAgentState(prev => ({ ...prev, timeoutMs }))}
            onMaxConcurrentChange={(maxConcurrent) => setAgentState(prev => ({ ...prev, maxConcurrent }))}
          />
        )}
      </div>
    </div>

    {/* Diálogos */}
    <DescriptionEditorDialog
      isOpen={isDescriptionDialogOpen}
      onOpenChange={setIsDescriptionDialogOpen}
      description={currentEditingDescription}
      onDescriptionChange={setCurrentEditingDescription}
      onSave={handleSaveDescription}
    />

    <InstructionEditorDialog
      isOpen={isInstructionDialogOpen}
      onOpenChange={setIsInstructionDialogOpen}
      instruction={currentEditingInstruction}
      onInstructionChange={setCurrentEditingInstruction}
      onSave={handleSaveInstruction}
    />

    <ToolDialog
      isOpen={isToolDialogOpen}
      onOpenChange={closeToolDialog}
      tool={currentEditingTool}
      onSave={handleSaveTool}
      isEditing={editingToolIndex >= 0}
    />

    <Dialog open={isConfirmDeleteOpen} onOpenChange={setIsConfirmDeleteOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmar exclusão</DialogTitle>
          <DialogDescription>
            Tem certeza que deseja excluir esta ferramenta? Esta ação não pode ser desfeita.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsConfirmDeleteOpen(false)}>Cancelar</Button>
          <Button 
            variant="destructive" 
            onClick={() => toolToDeleteIndex !== null && handleDeleteTool(toolToDeleteIndex)}
          >
            Excluir
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
);

// Agent form components
interface LLMAgentFormProps {
  agent: AgentState;
  onChange: (field: keyof AgentState, value: unknown) => void;
  onNestedChange: (field: string, value: any) => void;
  onAddTool: (tool: FormTool) => void;
  onEditTool: (index: number, tool: FormTool) => void;
  onDeleteTool: (index: number) => void;
}

const LLMAgentForm = React.memo(({ 
  agent, 
  onChange, 
  onNestedChange, 
  onAddTool, 
  onEditTool, 
  onDeleteTool 
}: LLMAgentFormProps) => {
  return (
    <div className="space-y-4">
      {/* Content of LLMAgentForm - removing the component definition */}
    </div>
  );
});

// ...
// Removing A2AAgentConfig interface and A2AAgentForm component
// Componente principal Agentes
// Definitions of handleSaveDescription, handleSaveInstruction, etc. are now within this main component.
function Agentes() {
  // Router and navigation
  const { id } = useParams<{ id: string }>(); // Standardizing to 'id' as it's used throughout this component's core logic.
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  // State management
  const [agentState, setAgentState] = useState<AgentState>(() => getDefaultAgentConfig(AgentType.LLM));
  const [isLoading, setIsLoading] = useState<boolean>(!!id);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  
  // Dialog states
  const [isDescriptionDialogOpen, setIsDescriptionDialogOpen] = useState<boolean>(false);
  const [isInstructionDialogOpen, setIsInstructionDialogOpen] = useState<boolean>(false);
  const [isToolDialogOpen, setIsToolDialogOpen] = useState<boolean>(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState<boolean>(false);
  
  // Editing states
  const [currentEditingDescription, setCurrentEditingDescription] = useState<string>('');
  const [currentEditingInstruction, setCurrentEditingInstruction] = useState<string>('');
  const [currentEditingTool, setCurrentEditingTool] = useState<FormTool | null>(null);
  const [editingToolIndex, setEditingToolIndex] = useState<number>(-1); // -1 indicates new tool
  const [toolToDeleteIndex, setToolToDeleteIndex] = useState<number | null>(null);

  // Funções para manipulação de ferramentas
  const openToolDialog = useCallback((index: number | null = null) => {
    if (index !== null && index >= 0 && index < agentState.tools.length) {
      const tool = agentState.tools[index];
      setCurrentEditingTool({ ...tool });
      setEditingToolIndex(index);
    } else {
      setCurrentEditingTool({
        id: `tool-${uuidv4()}`,
        name: '',
        description: '',
        parameters: [],
        enabled: true,
        required: false,
        returnType: 'string'
      });
      setEditingToolIndex(-1);
    }
    setIsToolDialogOpen(true);
  }, [agentState.tools]);

  const closeToolDialog = useCallback(() => {
    setIsToolDialogOpen(false);
    setCurrentEditingTool(null);
    setEditingToolIndex(-1);
  }, []);

  const confirmDeleteTool = useCallback((index: number) => {
    setToolToDeleteIndex(index);
    setIsConfirmDeleteOpen(true);
  }, []);

  const handleDeleteTool = useCallback((index: number) => {
    setAgentState(prev => ({
      ...prev,
      tools: prev.tools.filter((_, i) => i !== index)
    }));
    setIsConfirmDeleteOpen(false);
    toast({
      title: "Ferramenta removida",
      description: "A ferramenta foi removida com sucesso."
    });
  }, [toast]);

  const handleSaveTool = useCallback((tool: FormTool) => {
    if (editingToolIndex >= 0) {
      // Editar ferramenta existente
      setAgentState(prev => {
        const newTools = [...prev.tools];
        newTools[editingToolIndex] = tool;
        return { ...prev, tools: newTools };
      });
    } else {
      // Adicionar nova ferramenta
      setAgentState(prev => ({
        ...prev,
        tools: [...prev.tools, tool]
      }));
    }
    closeToolDialog();
    toast({
      title: "Sucesso",
      description: `Ferramenta ${editingToolIndex >= 0 ? 'atualizada' : 'adicionada'} com sucesso.`
    });
  }, [editingToolIndex, closeToolDialog, toast]);

  // Carregar dados do agente se existir um ID
  useEffect(() => {
    const loadAgent = async () => {
      if (id) {
        try {
          setIsLoading(true);
          const agent = await agentService.getAgentById(id);
          setAgentState({
            ...agent,
            tools: agent.tools || [],
            safetySettings: agent.safetySettings || [],
            stopSequences: agent.stopSequences || [],
            tags: agent.tags || [],
            instructions: agent.instructions || '',
            model: agent.model || 'gpt-4',
            temperature: agent.temperature || 0.7,
            maxTokens: agent.maxTokens || 2048,
            topP: agent.topP || 1,
            topK: agent.topK || 0,
            frequencyPenalty: agent.frequencyPenalty || 0,
            presencePenalty: agent.presencePenalty || 0,
            logitBias: agent.logitBias || {},
            version: agent.version || '1.0.0',
            isPublic: agent.isPublic || false,
            streaming: agent.streaming || false,
          });
        } catch (error) {
          toast({ title: 'Erro', description: 'Não foi possível carregar os dados do agente.', variant: 'destructive' });
          navigate('/agentes');
        } finally {
          setIsLoading(false);
        }
      }
    };
    loadAgent();
  }, [id, navigate, toast]);

  // Função para salvar o agente
  const handleSaveAgent = useCallback(async (e?: React.FormEvent): Promise<void> => {
    e?.preventDefault();
    try {
      setIsSaving(true);
      if (!agentState.name.trim()) throw new Error('O nome do agente é obrigatório');
      if (!agentState.model) throw new Error('O modelo é obrigatório');
      const payload = { ...agentState, tools: agentState.tools.map(tool => ({ ...tool, parameters: tool.parameters.map(param => ({ ...param, required: param.required || false, defaultValue: param.defaultValue || '' })) })) };
      if (id) {
        await agentService.updateAgent(id, payload);
      } else {
        await agentService.createAgent(payload);
      }
      toast({ title: 'Sucesso', description: `Agente ${id ? 'atualizado' : 'criado'} com sucesso` });
      queryClient.invalidateQueries({ queryKey: ['agents'] });
      if (!id) navigate('/agentes');
    } catch (error) {
      toast({ title: 'Erro', description: 'Não foi possível salvar o agente. Tente novamente.', variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  }, [agentState, id, navigate, queryClient, toast]);

  // Função para salvar a descrição
  const handleSaveDescription = useCallback(() => {
    setAgentState(prev => ({
      ...prev,
      description: currentEditingDescription
    }));
    setIsDescriptionDialogOpen(false);
    toast({
      title: 'Sucesso',
      description: 'Descrição do agente atualizada.'
    });
  }, [currentEditingDescription, toast]);

  // Função para salvar as instruções
  const handleSaveInstruction = useCallback(() => {
    setAgentState(prev => ({
      ...prev,
      instructions: currentEditingInstruction
    }));
    setIsInstructionDialogOpen(false);
    toast({
      title: 'Sucesso',
      description: 'Instruções do agente atualizadas.'
    });
  }, [currentEditingInstruction, toast]);

  // Renderização do componente principal
  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Cabeçalho */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {id ? 'Editar Agente' : 'Novo Agente'}
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                {id ? 'Edite as configurações do agente' : 'Preencha as informações para criar um novo agente'}
              </p>
            </div>
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={() => navigate('/agentes')}
                className="px-4 py-2"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSaveAgent}
                disabled={isSaving}
                className="px-6 py-2"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  'Salvar Agente'
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>

    {/* Diálogos */}
    <DescriptionEditorDialog
      isOpen={isDescriptionDialogOpen}
      onOpenChange={setIsDescriptionDialogOpen}
      description={currentEditingDescription}
      onDescriptionChange={setCurrentEditingDescription}
      onSave={handleSaveDescription}
    />

    <InstructionEditorDialog
      isOpen={isInstructionDialogOpen}
      onOpenChange={setIsInstructionDialogOpen}
      instruction={currentEditingInstruction}
      onInstructionChange={setCurrentEditingInstruction}
      onSave={handleSaveInstruction}
    />

    <ToolDialog
      isOpen={isToolDialogOpen}
      onOpenChange={closeToolDialog}
      tool={currentEditingTool}
      onSave={handleSaveTool}
      isEditing={editingToolIndex >= 0}
    />

    <Dialog open={isConfirmDeleteOpen} onOpenChange={setIsConfirmDeleteOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmar exclusão</DialogTitle>
          <DialogDescription>
            Tem certeza que deseja excluir esta ferramenta? Esta ação não pode ser desfeita.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsConfirmDeleteOpen(false)}>Cancelar</Button>
          <Button 
            variant="destructive" 
            onClick={() => toolToDeleteIndex !== null && handleDeleteTool(toolToDeleteIndex)}
          >
            Excluir
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
);



// ...

// Load agent data if editing
// useEffect block is now using 'id' from useParams consistently.

  

// ...




    </div>
  );
};

