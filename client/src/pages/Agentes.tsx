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
  name: string;
  type: 'string' | 'number' | 'boolean' | 'array' | 'object';
  description: string;
  required: boolean;
  defaultValue?: string;
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

// Componente principal Agentes
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
  const [editingToolIndex, setEditingToolIndex] = useState<number>(-1);
  const [toolToDeleteIndex, setToolToDeleteIndex] = useState<number | null>(null);

// Handlers para dialogs
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
      returnType: 'string',
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

const handleSaveDescription = useCallback(() => {
  setAgentState(prev => ({
    ...prev,
    description: currentEditingDescription || ''
  }));
  setIsDescriptionDialogOpen(false);
}, [currentEditingDescription, setAgentState, setIsDescriptionDialogOpen]);

const handleSaveInstruction = useCallback(() => {
  setAgentState(prev => ({
    ...prev,
    instructions: currentEditingInstruction || ''
  }));
  setIsInstructionDialogOpen(false);
}, [currentEditingInstruction, setAgentState, setIsInstructionDialogOpen]);

const handleSaveTool = useCallback((tool: FormTool) => {
  setAgentState(prev => {
    const tools = [...prev.tools];
    if (editingToolIndex >= 0) {
      tools[editingToolIndex] = tool;
    } else {
      tools.push(tool);
    }
    return { ...prev, tools };
  });
  setIsToolDialogOpen(false);
  setCurrentEditingTool(null);
  setEditingToolIndex(-1);
}, [editingToolIndex, setAgentState, setIsToolDialogOpen, setCurrentEditingTool, setEditingToolIndex]);

const handleDeleteTool = useCallback((index: number) => {
  setAgentState(prev => {
    const tools = [...prev.tools];
    tools.splice(index, 1);
    return { ...prev, tools };
  });
  setIsConfirmDeleteOpen(false);
  setToolToDeleteIndex(null);
}, [setAgentState, setIsConfirmDeleteOpen, setToolToDeleteIndex]);

  // Carregar dados do agente se existir um ID
  useEffect(() => {
    const loadAgent = async () => {
      if (id) {
        try {
          setIsLoading(true);
          const agent = await agentService.fetchAgentById(id);
          setAgentState(prev => ({
            ...prev,
            id: agent.id ?? prev.id,
            name: agent.name ?? prev.name,
            description: agent.description ?? "",
            type: agent.type ?? prev.type,
            instructions: 'instructions' in agent ? agent.instructions ?? "" : "",
            tools: 'tools' in agent && Array.isArray(agent.tools)
  ? agent.tools.map((tool: any) => ({
      id: tool.id ?? uuidv4(),
      name: tool.name ?? "",
      description: tool.description ?? "",
      parameters: Array.isArray(tool.parameters) ? tool.parameters : [],
      enabled: typeof tool.enabled === "boolean" ? tool.enabled : true,
      required: typeof tool.required === "boolean" ? tool.required : false,
      returnType: tool.returnType ?? "string",
    }))
  : [],
            safetySettings: 'safetySettings' in agent && Array.isArray(agent.safetySettings)
  ? agent.safetySettings.map((setting: any, idx: number) => ({
      id: setting.id ?? `safety-${idx}`,
      category: setting.category,
      threshold: setting.threshold,
      enabled: typeof setting.enabled === "boolean" ? setting.enabled : true,
      condition: typeof setting.condition === "string" ? setting.condition : "",
    }))
  : [],
            stopSequences: 'stopSequences' in agent && Array.isArray(agent.stopSequences) ? agent.stopSequences : [],
            tags: 'tags' in agent && Array.isArray(agent.tags) ? agent.tags : [],
            model: 'model' in agent ? agent.model ?? "gpt-4" : "gpt-4",
            temperature: 'temperature' in agent ? agent.temperature ?? 0.7 : 0.7,
            maxTokens: 'maxTokens' in agent ? agent.maxTokens ?? 2048 : 2048,
            topP: 'topP' in agent ? agent.topP ?? 1 : 1,
            topK: 'topK' in agent ? agent.topK ?? 0 : 0,
            frequencyPenalty: 'frequencyPenalty' in agent ? agent.frequencyPenalty ?? 0 : 0,
            presencePenalty: 'presencePenalty' in agent ? agent.presencePenalty ?? 0 : 0,
            logitBias: 'logitBias' in agent ? agent.logitBias ?? {} : {},
            version: agent.version ?? "1.0.0",
            isPublic: 'isPublic' in agent ? agent.isPublic ?? false : false,
            streaming: 'streaming' in agent ? agent.streaming ?? false : false,
            // ... outros campos obrigatórios de AgentState
          }) as AgentState);
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
        // await agentService.updateAgent(id, payload); // REMOVER ou substituir conforme interface real
      } else {
        // await agentService.createAgent(payload); // REMOVER ou substituir conforme interface real
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
  

  // Renderização do componente principal
  return (
    <>
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
          </div>
        </div>

        {/* Conteúdo principal */}
        <div className="flex-1 overflow-auto p-6">
          {/* ...restante do conteúdo... */}
          {/* Ferramentas, configurações, etc. */}
          {/* ... */}
          {agentState.type === AgentType.LLM && (
            <AgentLLMSettingsForm
              model={agentState.model}
              temperature={agentState.temperature}
              streaming={agentState.streaming || false}
              onModelChange={(model) => setAgentState((prev: AgentState) => ({ ...prev, model }))}
              onTemperatureChange={(temperature) => setAgentState((prev: AgentState) => ({ ...prev, temperature }))}
              onStreamingChange={(streaming) => setAgentState((prev: AgentState) => ({ ...prev, streaming }))}
            />
          )}
          {agentState.type === AgentType.SEQUENTIAL && (
            <AgentSequentialSettingsForm
              maxSteps={agentState.maxSteps}
              stopOnError={agentState.stopOnError}
              onMaxStepsChange={(maxSteps) => setAgentState((prev: AgentState) => ({ ...prev, maxSteps }))}
              onStopOnErrorChange={(stopOnError) => setAgentState((prev: AgentState) => ({ ...prev, stopOnError }))}
            />
          )}
          {agentState.type === AgentType.A2A && (
            <AgentA2ASettingsForm
              timeoutMs={agentState.timeoutMs}
              maxConcurrent={agentState.maxConcurrent}
              onTimeoutMsChange={(timeoutMs) => setAgentState((prev: AgentState) => ({ ...prev, timeoutMs }))}
              onMaxConcurrentChange={(maxConcurrent) => setAgentState((prev: AgentState) => ({ ...prev, maxConcurrent }))}
            />
          )}
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
    </>
  );
}
