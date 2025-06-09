import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/components/ui/use-toast';

// Import types
import { 
  AgentType,
  createDefaultAgentConfig,
  type AnyAgentConfig,
  type LlmAgentConfig,
  type WorkflowAgentConfig,
  type SequentialAgentConfig,
  type A2AAgentConfig
} from '@/types/agent';

// Agent form types
interface FormToolParameter {
  id: string;
  name: string;
  type: string;
  description: string;
  required: boolean;
  defaultValue?: string;
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

// Type for safety settings in the form
interface FormSafetySetting {
  id: string;
  category: string;
  threshold: string;
  enabled: boolean;
  condition: string;
}

// Type for agent state
interface AgentState {
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
  instruction: string;
  systemPrompt: string;
  agents: string[];
  agent: string | null;
  condition: string;
  maxIterations: number;
  endpoint: string;
  method: string;
  headers: Record<string, string>;
  requestSchema: Record<string, unknown>;
  responseSchema: Record<string, unknown>;
  maxSteps: number;
  stopOnError: boolean;
  maxConcurrent: number;
  timeoutMs: number;
  maxDurationMs: number;
  authType: string;
  supportedFormats: string[];
  [key: string]: unknown;
}

// UI Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Form } from '@/components/ui/form';
import { Fieldset } from '@/components/ui/fieldset';
import { Legend } from '@/components/ui/legend';

// Icons
import { Plus, Pencil, Trash2, Save, X, Info, ArrowLeft, Copy, Share2, Play, Code, Settings, Shield, Wrench } from 'lucide-react';

// Services
import { agentService } from '@/services/agentService';

// Utils
import { cn } from '@/lib/utils';

// ...

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

const DEFAULT_SEQUENTIAL_AGENT: Omit<SequentialAgentConfig, 'type'> & { type: AgentType.SEQUENTIAL } = {
  id: `agent-${uuidv4()}`,
  name: 'Novo Fluxo Sequencial',
  description: 'Executa agentes em sequência',
  type: AgentType.SEQUENTIAL,
  version: '1.0.0',
  workflowType: 'sequential',
  agents: [],
  maxIterations: 3,
  stopCondition: '',
  continueOnError: false,
  tools: [],
  safetySettings: []
};

const DEFAULT_PARALLEL_AGENT: ParallelAgentConfig = {
  id: `agent-${uuidv4()}`,
  name: 'Novo Fluxo Paralelo',
  description: 'Executa agentes em paralelo',
  version: '1.0.0',
  type: AgentType.PARALLEL,
  workflowType: 'parallel',
  agents: [],
  maxConcurrent: 3,
};

const DEFAULT_LOOP_AGENT: Omit<AgentState, 'agent' | 'type'> & { agent: string | null; type: AgentType } & { version: string; tools: FormTool[]; safetySettings: FormSafetySetting[] } = {
  id: `agent-${uuidv4()}`,
  name: 'Novo Loop',
  description: 'Executa um agente em loop até que uma condição seja atendida',
  type: AgentType.LOOP,
  version: '1.0.0',
  workflowType: 'loop',
  agent: null,
  condition: '',
  maxIterations: 10,
  continueOnError: false,
  tools: [],
  safetySettings: []
};

// Default A2A agent configuration
const DEFAULT_A2A_AGENT: Partial<A2AAgentConfig> = {
  type: AgentType.A2A,
  name: 'Novo Agente A2A',
  description: 'Um agente que se comunica via A2A Protocol',
  version: '1.0.0',
  endpoint: 'https://api.example.com/a2a',
  authType: 'none',
  supportedFormats: ['application/json'],
  supportsPush: false,
  tools: [],
  safetySettings: []
};

const DEFAULT_AGENT: AgentState = {
  id: `agent-${uuidv4()}`,
  name: 'Novo Agente',
  description: '',
  type: AgentType.LLM,
  instructions: '',
  tools: [],
  safetySettings: [],
  model: 'gemini-2.0-flash',
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
};

// Stub components for missing imports
const ToolCard = ({ tool, onEdit, onDelete }: { tool: FormTool; onEdit: () => void; onDelete: () => void }) => (
  <div className="border p-4 rounded-lg">
    <div className="flex justify-between items-start">
      <div>
        <h4 className="font-medium">{tool.name}</h4>
        <p className="text-sm text-muted-foreground">{tool.description}</p>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={onEdit}>
          <Pencil className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={onDelete}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  </div>
);

const ToolDialog = ({ 
  open, 
  onOpenChange, 
  tool, 
  onSave 
}: { 
  open: boolean; 
  onOpenChange: (open: boolean) => void; 
  tool: FormTool; 
  onSave: (tool: FormTool) => void 
}) => {
  const [formData, setFormData] = useState<FormTool>(tool);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{tool.id ? 'Editar Ferramenta' : 'Nova Ferramenta'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tool-name">Nome</Label>
            <Input
              id="tool-name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tool-description">Descrição</Label>
            <Textarea
              id="tool-description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button onClick={() => onSave(formData)}>Salvar</Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Agent form components
interface LLMAgentFormProps {
  agent: AgentState;
  onChange: (field: keyof AgentState, value: unknown) => void;
  onNestedChange: (field: string, value: any) => void;
  onAddTool: () => void;
  onEditTool: (index: number) => void;
  onDeleteTool: (index: number) => void;
}

const LLMAgentForm = React.memo(({ agent, onChange, onNestedChange, onAddTool, onEditTool, onDeleteTool }: LLMAgentFormProps) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="model">Modelo</Label>
          <Input
            id="model"
            value={agent.model}
            onChange={(e) => onChange('model', e.target.value)}
            placeholder="gpt-4"
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="temperature">Temperatura: {agent.temperature}</Label>
            <span className="text-sm text-muted-foreground">
              {getTemperatureDescription(agent.temperature)}
            </span>
          </div>
          <Slider
            id="temperature"
            min={0}
            max={2}
            step={0.1}
            value={[agent.temperature]}
            onValueChange={(value) => onChange('temperature', value[0])}
          />
        </div>
      </div>
      {/* Add more LLM-specific fields as needed */}
    </div>
  );
});

// ...

interface A2AAgentConfig {
  id: string;
  name: string;
  description: string;
  endpoint: string;
  method: string;
  condition: string;
  maxIterations: number;
  timeoutMs: number;
  maxConcurrent: number;
  headers?: Record<string, string>;
  requestSchema?: Record<string, unknown>;
  responseSchema?: Record<string, unknown>;
}

interface A2AAgentFormProps {
  agent: A2AAgentConfig;
  onChange: (field: keyof A2AAgentConfig, value: unknown) => void;
  onNestedChange: (field: string, value: unknown) => void;
}

const A2AAgentForm = React.memo<A2AAgentFormProps>(({ agent, onChange, onNestedChange }) => {
  const handleChange = useCallback((field: keyof A2AAgentConfig, value: unknown) => {
    onChange(field, value);
  }, [onChange]);

  const handleNestedChange = useCallback((field: string, value: unknown) => {
    onNestedChange(field, value);
  }, [onNestedChange]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Configurações do Agente A2A</CardTitle>
          <CardDescription>Configure as opções do agente A2A</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="endpoint">Endpoint</Label>
              <Input
                id="endpoint"
                value={agent.endpoint || ''}
                onChange={(e) => handleChange('endpoint', e.target.value)}
                placeholder="https://api.example.com/endpoint"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="method">Método HTTP</Label>
              <Select
                value={agent.method || 'GET'}
                onValueChange={(value) => handleChange('method', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o método" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GET">GET</SelectItem>
                  <SelectItem value="POST">POST</SelectItem>
                  <SelectItem value="PUT">PUT</SelectItem>
                  <SelectItem value="PATCH">PATCH</SelectItem>
                  <SelectItem value="DELETE">DELETE</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="condition">Condição de Parada</Label>
              <Input
                id="condition"
                value={agent.condition || ''}
                onChange={(e) => handleChange('condition', e.target.value)}
                placeholder="Ex: response.status === 'completed'"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxIterations">Máx. Iterações</Label>
              <Input
                type="number"
                id="maxIterations"
                value={agent.maxIterations || 10}
                onChange={(e) => handleChange('maxIterations', Number(e.target.value))}
                min={1}
                max={100}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="timeoutMs">Timeout (ms)</Label>
              <Input
                type="number"
                id="timeoutMs"
                value={agent.timeoutMs || 30000}
                onChange={(e) => handleChange('timeoutMs', Number(e.target.value))}
                min={1000}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxConcurrent">Máx. Concorrente</Label>
              <Input
                type="number"
                id="maxConcurrent"
                value={agent.maxConcurrent || 5}
                onChange={(e) => handleChange('maxConcurrent', Number(e.target.value))}
                min={1}
                max={20}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="headers">Cabeçalhos (JSON)</Label>
            <Textarea
              id="headers"
              value={JSON.stringify(agent.headers || {}, null, 2)}
              onChange={(e) => {
                try {
                  const value = JSON.parse(e.target.value);
                  handleChange('headers', value);
                } catch (error) {
                  // Ignorar JSON inválido
                }
              }}
              className="font-mono text-sm h-32"
              placeholder={`{
  "Content-Type": "application/json",
  "Authorization": "Bearer ..."
}`}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
});

const Agentes: React.FC = () => {
  // Router and navigation
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // State management
  const [agentState, setAgentState] = useState<AgentState>(() => ({
    ...getDefaultAgentConfig(AgentType.LLM),
    id: id || `agent-${uuidv4()}`,
    name: `Novo Agente ${AgentType.LLM}`,
  }));

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isDescriptionDialogOpen, setIsDescriptionDialogOpen] = useState<boolean>(false);
  const [isInstructionDialogOpen, setIsInstructionDialogOpen] = useState<boolean>(false);
  const [isToolDialogOpen, setIsToolDialogOpen] = useState<boolean>(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState<boolean>(false);
  const [currentEditingTool, setCurrentEditingTool] = useState<FormTool>({
    id: `tool-${Date.now()}`,
    name: '',
    description: '',
    parameters: [],
    enabled: true,
    required: false
  } as FormTool);
  const [editingToolIndex, setEditingToolIndex] = useState<number>(-1);
  const [toolToDeleteIndex, setToolToDeleteIndex] = useState<number>(-1);
  const [currentEditingInstruction, setCurrentEditingInstruction] = useState('');

  // Load agent data when component mounts or id changes
  useEffect(() => {
    const loadAgentData = async () => {
      if (!id) return;

      try {
        setIsLoading(true);
        // TODO: Implement agent data loading
        // const agent = await agentService.getAgent(id);
        // setAgentState(agent);
      } catch (error) {
        console.error('Error loading agent:', error);
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar o agente.',
          variant: 'destructive',
        });
        navigate('/agentes');
      } finally {
        setIsLoading(false);
      }
    };

    loadAgentData();
  }, [id, navigate, toast]);

  // Handle saving agent
  const handleSaveAgent = useCallback(async (): Promise<void> => {
    try {
      setIsSaving(true);
      // TODO: Replace with actual API call
      // const method = id ? 'PUT' : 'POST';
      // const url = id ? `/api/agents/${id}` : '/api/agents';
      // const response = await fetch(url, {
      //   method,
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(agentState)
      // });
      // if (!response.ok) throw new Error('Failed to save agent');
      
      // Show success message
      toast({
        title: 'Sucesso',
        description: id ? 'Agente atualizado com sucesso!' : 'Agente criado com sucesso!',
      });

      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ['agents'] });
      
      // Navigate to agent list if this was a new agent
      if (!id) {
        navigate('/agentes');
      }
    } catch (error) {
      console.error('Error saving agent:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível salvar o agente. Por favor, tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  }, [agentState, id, navigate, queryClient, toast]);
    try {
      setIsSaving(true);
      
      // Basic validation
      if (!agentState.name.trim()) {
        throw new Error('O nome do agente é obrigatório');
      }
      
      if (!agentState.model) {
        throw new Error('O modelo é obrigatório');
      }
      
      // Prepare the payload
      const payload = {
        ...agentState,
        // Ensure required fields are properly typed
        tools: agentState.tools.map(tool => ({
          ...tool,
          parameters: tool.parameters.map(param => ({
            ...param,
            required: param.required || false,
            defaultValue: param.defaultValue || ''
          }))
        }))
      };
      
      // TODO: Replace with actual API call
      // const method = id ? 'PUT' : 'POST';
      // const url = id ? `/api/agents/${id}` : '/api/agents';
      // const response = await fetch(url, {
      //   method,
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(payload)
      // });
      
      // if (!response.ok) {
      //   const error = await response.json();
      //   throw new Error(error.message || 'Falha ao salvar o agente');
      // }
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: 'Sucesso',
        description: `Agente ${id ? 'atualizado' : 'criado'} com sucesso`,
      });

      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ['agents'] });

      // Navigate to agent list if this was a new agent
      if (!id) {
        navigate('/agentes');
      }
    } catch (error) {
      console.error('Error saving agent:', error);
      toast({
        title: 'Erro',
        description: error instanceof Error ? error.message : 'Falha ao salvar o agente',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  }, [agentState, id, navigate, queryClient, toast]);

  const handleToolChange = useCallback((index: number, field: keyof FormTool, value: any) => {
    setAgentState((prev: AgentState) => {
      const newTools = [...prev.tools];
      newTools[index] = { ...newTools[index], [field]: value };
      return { ...prev, tools: newTools };
    });
  }, []);

  const handleCurrentToolChange = useCallback((field: keyof FormTool, value: any) => {
    if (!currentEditingTool) return;
    setCurrentEditingTool({ ...currentEditingTool, [field]: value });
  }, [currentEditingTool]);

  const addParameter = useCallback(() => {
    if (!currentEditingTool) return;

    const newParameter: FormToolParameter = {
      id: `param-${Date.now()}`,
      name: '',
      type: 'string',
      description: '',
      required: false,
    };

    setCurrentEditingTool({
      ...currentEditingTool,
      parameters: [...currentEditingTool.parameters, newParameter],
    });
  }, [currentEditingTool]);

  const removeParameter = useCallback((paramIndex: number) => {
    if (!currentEditingTool) return;

    setCurrentEditingTool({
      ...currentEditingTool,
      parameters: currentEditingTool.parameters.filter((_, i) => i !== paramIndex),
    });
  }, [currentEditingTool]);

  const updateParameter = useCallback((paramIndex: number, field: keyof FormToolParameter, value: any) => {
    if (!currentEditingTool) return;

    const newParameters = [...currentEditingTool.parameters];
    newParameters[paramIndex] = { ...newParameters[paramIndex], [field]: value };

    setCurrentEditingTool({
      ...currentEditingTool,
      parameters: newParameters,
    });
  }, [currentEditingTool]);

  const closeDescriptionDialog = useCallback((): void => {
    setIsDescriptionDialogOpen(false);
  }, []);

  const openInstructionDialog = useCallback((): void => {
    setCurrentEditingInstruction(agentState.instruction || '');
    setIsInstructionDialogOpen(true);
  }, [agentState.instruction]);

  const openToolDialog = useCallback((index: number = -1): void => {
    if (index >= 0) {
}, [editingToolIndex, closeToolDialog, toast]);

const handleDeleteTool = useCallback((index: number): void => {
  setAgentState(prev => ({
    ...prev,
    tools: prev.tools.filter((_, i) => i !== index)
  }));
  toast.success('Ferramenta removida com sucesso!');
}, [toast]);

// Tool management callbacks
const handleAddTool = useCallback((): void => {
  openToolDialog(-1);
}, [openToolDialog]);

const handleEditTool = useCallback((index: number): void => {
  openToolDialog(index);
}, [openToolDialog]);

// ...

// Load agent data if editing
useEffect(() => {
  const loadAgentData = async () => {
    if (!id) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const data = await agentService.getAgent(id);
      
      if (!data) {
        toast.error('Agente não encontrado');
        navigate('/agentes');
        return;
      }

      setAgentState(prev => {
        const defaultConfig = getDefaultAgentConfig(data.type as AgentType);
        return {
          ...defaultConfig,
          ...data,
          tools: Array.isArray(data.tools) 
            ? data.tools.map((t: any) => ({
                ...t,
                enabled: true,
                parameters: t.parameters?.map((p: any) => ({
                  ...p,
                  required: p.required ?? false,
                  defaultValue: p.defaultValue ?? ''
                })) || []
              })) 
            : [],
          // Ensure required fields are set
          id: data.id || prev.id,
          type: data.type || prev.type,
          name: data.name || prev.name,
          description: data.description || prev.description,
          version: data.version || prev.version || '1.0.0'
        };
      });
    } catch (error) {
      console.error('Failed to load agent:', error);
      toast.error('Falha ao carregar o agente');
      navigate('/agentes');

        setAgentState(prev => {
          const defaultConfig = getDefaultAgentConfig(data.type as AgentType);
          return {
            ...defaultConfig,
            ...data,
            tools: Array.isArray(data.tools) 
              ? data.tools.map((t: any) => ({
                  ...t,
                  enabled: true,
                  parameters: t.parameters?.map((p: any) => ({
                    ...p,
                    required: p.required ?? false,
                    defaultValue: p.defaultValue ?? ''
                  })) || []
                })) 
              : []
          };
        });
      } catch (error) {
        console.error('Failed to load agent:', error);
        toast.error('Falha ao carregar o agente');
        navigate('/agentes');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadAgentData();
  }, [id, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    // Handle save operation
    // ...
    setIsSaving(false);
  };

  const openToolDialog = useCallback((index: number = -1) => {
    if (index >= 0 && index < agentState.tools.length) {
      setCurrentEditingTool(agentState.tools[index]);
      setEditingToolIndex(index);
    } else {
      setCurrentEditingTool({
        id: uuidv4(),
        name: '',
        description: '',
        parameters: [],
        enabled: true
      });
      setEditingToolIndex(null);
    }
    setIsToolDialogOpen(true);
  }, [agentState.tools]);

  const handleSaveTool = useCallback((tool: FormTool) => {
    setAgentState(prev => ({
      ...prev,
      tools: editingToolIndex !== null && editingToolIndex >= 0
        ? prev.tools.map((t, i) => i === editingToolIndex ? tool : t)
        : [...prev.tools, tool]
    }));
    setIsToolDialogOpen(false);
  }, [editingToolIndex]);

  const handleDeleteTool = useCallback(() => {
    if (toolToDeleteIndex >= 0) {
      setAgentState(prev => ({
        ...prev,
        tools: prev.tools.filter((_, i) => i !== toolToDeleteIndex)
      }));
      setToolToDeleteIndex(-1);
      setIsConfirmDeleteOpen(false);
    }
  }, [toolToDeleteIndex]);

// ...

<CardFooter className="flex justify-end">
  <Button onClick={handleSubmit} size="lg">Salvar Configuração do Agente</Button>
</CardFooter>
</Card>

{/* Dialog for Editing Agent Description */}
<Dialog open={isDescriptionDialogOpen} onOpenChange={setIsDescriptionDialogOpen}>
  <DialogContent className="sm:max-w-[625px]">
    <DialogHeader>
      <DialogTitle>Editar Descrição do Agente</DialogTitle>
      <DialogDescription>
        Adicione ou edite a descrição do agente para melhor identificação
      </DialogDescription>
    </DialogHeader>
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="description" className="text-right">
          Descrição
        </Label>
        <Textarea
          id="description"
          value={currentEditingDescription}
          onChange={(e) => setCurrentEditingDescription(e.target.value)}
          className="col-span-3"
          rows={4}
          placeholder="Descreva o propósito e funcionalidade deste agente"
        />
      </div>
    </div>
    <DialogFooter>
      <Button 
        variant="outline" 
        onClick={() => setIsDescriptionDialogOpen(false)}
      >
        Cancelar
      </Button>
      <Button 
        onClick={handleSaveDescription}
        disabled={!currentEditingDescription.trim()}
      >
        Salvar
      </Button>
    </DialogFooter>
        Forneça uma descrição clara e concisa sobre o que seu agente faz, seus objetivos e suas capacidades.
      </DialogDescription>
    </DialogHeader>
    <div className="grid gap-4 py-4">
      <Textarea
        id="currentEditingDescription"
        value={currentEditingDescription}
        onChange={(e) => setCurrentEditingDescription(e.target.value)}
        placeholder="Ex: Um assistente especializado em ajudar desenvolvedores a resolver problemas de programação..."
        rows={8}
        className="min-h-[200px]"
      />
    </div>
    <DialogFooter>
      <Button variant="outline" onClick={() => setIsDescriptionDialogOpen(false)}>
        Cancelar
      </Button>
      <Button 
        onClick={handleSaveDescription} 
        disabled={!currentEditingDescription.trim()}
      >
        Salvar Descrição
      </Button>
    </DialogFooter>
      {isToolDialogOpen && (
        <Dialog open={isToolDialogOpen} onOpenChange={setIsToolDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar/Editar Ferramenta</DialogTitle>
              <DialogDescription>
                Configure os detalhes da ferramenta que o agente poderá utilizar.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="tool-name">Nome da Ferramenta</Label>
                <Input 
                  id="tool-name" 
                  name="name" 
                  value={currentEditingTool?.name || ''} 
                  onChange={(e) => setCurrentEditingTool(prev => prev ? ({ ...prev, name: e.target.value }) : null)} 
                  placeholder="Ex: get_current_weather"
                />
              </div>
              <div>
                <Label htmlFor="tool-description">Descrição da Ferramenta</Label>
                <Textarea 
                  id="tool-description" 
                  name="description" 
                  value={currentEditingTool?.description || ''} 
                  onChange={(e) => setCurrentEditingTool(prev => prev ? ({ ...prev, description: e.target.value }) : null)} 
                  placeholder="Ex: Obtém o clima atual para uma localidade específica."
                />
              </div>
              <div>
                <Label htmlFor="tool-returnType">Tipo de Retorno da Ferramenta</Label>
                <Input 
                  id="tool-returnType" 
                  name="returnType" 
                  value={currentEditingTool?.returnType || ''} 
                  onChange={(e) => setCurrentEditingTool(prev => prev ? ({ ...prev, returnType: e.target.value }) : null)} 
                  placeholder='Ex: string ou JSON schema {"type": "object", ...}'
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsToolDialogOpen(false)}>Cancelar</Button>
              <Button onClick={() => onSave(formData)}>Salvar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Agentes;
