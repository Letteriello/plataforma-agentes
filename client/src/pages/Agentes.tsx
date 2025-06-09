import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { toast as sonnerToast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Plus, Pencil, Trash2, Save, X, Info, ArrowLeft, Copy, Share2, Play, Code, Settings, Shield, Wrench, ChevronDown, ChevronUp, GripVertical } from 'lucide-react';

// Import UI components
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Fieldset } from '@/components/ui/fieldset';
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import DescriptionEditorDialog from "./Agentes/components/DescriptionEditorDialog";
import InstructionEditorDialog from "./Agentes/components/InstructionEditorDialog";
import ToolDialog from "./Agentes/components/ToolDialog";
import { ToolList } from "./Agentes/components/ToolList";

// Import types
import { 
  AgentType,
  type LlmAgentConfig,
  type WorkflowAgentConfig,
  type SequentialAgentConfig,
  type A2AAgentConfig as A2AAgentConfigType,
  type SafetySetting
} from '@/types/agent';

// Import tool types
import { Tool, ToolParameter } from '@/types/tool';

// Services
import { useAgentStore } from '@/store/agentStore';

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
interface A2AAgentConfig extends A2AAgentConfigType {
  // Additional properties specific to the form
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

const DEFAULT_SEQUENTIAL_AGENT: Omit<AgentState, 'type'> & { 
  type: AgentType.SEQUENTIAL;
} = {
  id: `agent-${uuidv4()}`,
  name: 'Novo Fluxo Sequencial',
  description: 'Executa agentes em sequência',
  type: AgentType.SEQUENTIAL,
  version: '1.0.0',
  workflowType: 'sequential',
  agents: [],
  maxSteps: 10,
  stopCondition: '',
  continueOnError: false,
  instructions: '',
  tools: [],
  safetySettings: [],
  model: '',
  temperature: 0.7,
  maxTokens: 2048,
  topP: 1,
  topK: 40,
  stopSequences: [],
  frequencyPenalty: 0,
  presencePenalty: 0,
  logitBias: {},
  isPublic: false,
  tags: []
};

const DEFAULT_PARALLEL_AGENT: Omit<AgentState, 'type'> & { 
  type: AgentType.PARALLEL;
} = {
  id: `agent-${uuidv4()}`,
  name: 'Novo Fluxo Paralelo',
  description: 'Executa agentes em paralelo',
  version: '1.0.0',
  type: AgentType.PARALLEL,
  workflowType: 'parallel',
  agents: [],
  maxConcurrent: 3,
  timeoutMs: 30000,
  instructions: '',
  tools: [],
  safetySettings: [],
  model: '',
  temperature: 0.7,
  maxTokens: 2048,
  topP: 1,
  topK: 40,
  stopSequences: [],
  frequencyPenalty: 0,
  presencePenalty: 0,
  logitBias: {},
  isPublic: false,
  tags: []
};

const DEFAULT_LOOP_AGENT: Omit<AgentState, 'type'> & { 
  type: AgentType.LOOP;
} = {
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
  instructions: '',
  tools: [],
  safetySettings: [],
  model: '',
  temperature: 0.7,
  maxTokens: 2048,
  topP: 1,
  topK: 40,
  stopSequences: [],
  frequencyPenalty: 0,
  presencePenalty: 0,
  logitBias: {},
  isPublic: false,
  tags: []
};

// Default A2A agent configuration
const DEFAULT_A2A_AGENT: Omit<AgentState, 'type'> & { 
  type: AgentType.A2A;
} = {
  id: `agent-${uuidv4()}`,
  name: 'Novo Agente A2A',
  description: 'Um agente que se comunica via A2A Protocol',
  type: AgentType.A2A,
  version: '1.0.0',
  endpoint: 'https://api.example.com/a2a',
  authType: 'none',
  supportedFormats: ['application/json'],
  supportsPush: false,
  instructions: '',
  tools: [],
  safetySettings: [],
  model: '',
  temperature: 0.7,
  maxTokens: 2048,
  topP: 1,
  topK: 40,
  stopSequences: [],
  frequencyPenalty: 0,
  presencePenalty: 0,
  logitBias: {},
  isPublic: false,
  tags: []
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
  streaming: false,

// Tool Card component
const ToolCard = ({ tool, onEdit, onDelete }: { tool: FormTool; onEdit: () => void; onDelete: () => void }) => (
  <div className="bg-white border rounded-md shadow-sm p-4 mb-3">
    <div className="flex justify-between items-start">
      <div>
        <h3 className="font-medium text-gray-900">{tool.name}</h3>
        <p className="text-sm text-gray-500 mt-1">{tool.description}</p>
      </div>
      <div className="flex space-x-2">
        <Button variant="ghost" size="sm" onClick={onEdit}>
          <Pencil className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={onDelete}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
    {tool.parameters && tool.parameters.length > 0 && (
      <div className="mt-3">
        <p className="text-xs font-medium text-gray-500 mb-1">Parâmetros:</p>
        <div className="space-y-1">
          {tool.parameters.map((param) => (
            <div key={param.id} className="flex items-center text-xs">
              <span className="font-medium">{param.name}</span>
              <span className="mx-1">:</span>
              <span className="text-gray-600">{param.type}</span>
              {param.required && <Badge variant="outline" className="ml-2 text-xs">Obrigatório</Badge>}
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
);

    {/* Conteúdo Principal */}
    <div className="flex-1 overflow-auto p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Seção de Informações Básicas */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900">Informações Básicas</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="agent-name">Nome do Agente</Label>
              <Input
                id="agent-name"
                value={agentState.name}
                onChange={(e) => setAgentState(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Digite o nome do agente"
                className="mt-1"
              />
            </div>
            
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="agent-description" className="text-sm font-medium">Descrição</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => {
                              setCurrentEditingDescription(agentState.description || '');
                              setIsDescriptionDialogOpen(true);
                            }} 
                            className="h-7 w-7"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Editar Descrição</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Textarea
                    id="agent-description"
                    value={agentState.description} 
                    placeholder="Descreva o que seu agente faz, suas capacidades e quaisquer características notáveis."
                    className="min-h-[80px] mt-1"
                    readOnly
                  />
                </div>
            
            <div>
              <Label htmlFor="agent-type">Tipo de Agente</Label>
              <Select
                value={agentState.type}
                onValueChange={(value) => {
                  const newType = value as AgentType;
                  setAgentState(prev => ({
                    ...prev,
                    ...getDefaultAgentConfig(newType),
                    type: newType,
                    id: prev.id,
                    name: prev.name || `Novo Agente ${newType}`
                  }));
                }}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Selecione o tipo de agente" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={AgentType.LLM}>LLM Agent</SelectItem>
                  <SelectItem value={AgentType.SEQUENTIAL}>Sequential Agent</SelectItem>
                  <SelectItem value={AgentType.A2A}>A2A Agent</SelectItem>
                  <SelectItem value={AgentType.PARALLEL}>Parallel Agent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Seção de Instruções */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900">Instruções</h2>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setCurrentEditingInstruction(agentState.instructions || '');
                setIsInstructionDialogOpen(true);
              }}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Editar
            </Button>
          </div>
          <div 
            onClick={() => {
              setCurrentEditingInstruction(agentState.instructions || '');
              setIsInstructionDialogOpen(true);
            }}
            className="p-4 bg-gray-50 rounded-md border border-gray-200 min-h-[120px] cursor-text hover:bg-gray-100 transition-colors whitespace-pre-wrap"
          >
            {agentState.instructions || (
              <p className="text-gray-400 italic">Clique para adicionar instruções para o agente</p>
            )}
          </div>
        </div>

        {/* Seção de Ferramentas */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6 border-b">
            <ToolList
              tools={agentState.tools}
              onAddTool={() => openToolDialog()}
              onEditTool={(index) => openToolDialog(index)}
              onDeleteTool={(index) => confirmDeleteTool(index)}
            />
          </div>
        </div>

        {/* Configurações Avançadas */}
        {agentState.type === AgentType.LLM && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Configurações Avançadas</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="agent-model">Modelo</Label>
                <Input
                  id="agent-model"
                  value={agentState.model}
                  onChange={(e) => setAgentState(prev => ({ ...prev, model: e.target.value }))}
                  placeholder="Ex: gpt-4, claude-2, etc."
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="agent-temperature">Temperatura: {agentState.temperature}</Label>
                <div className="flex items-center space-x-4 mt-2">
                  <span className="text-sm text-gray-500">0.0</span>
                  <Slider
                    id="agent-temperature"
                    min={0}
                    max={2}
                    step={0.1}
                    value={[agentState.temperature]}
                    onValueChange={([value]) => setAgentState(prev => ({ ...prev, temperature: value }))}
                    className="flex-1"
                  />
                  <span className="text-sm text-gray-500">2.0</span>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Valores mais baixos tornam as saídas mais focadas e determinísticas.
                </p>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="agent-streaming"
                  checked={agentState.streaming}
                  onCheckedChange={(checked) => 
                    setAgentState(prev => ({ ...prev, streaming: checked as boolean }))
                  }
                />
                <Label htmlFor="agent-streaming" className="font-normal">
                  Habilitar streaming de respostas
                </Label>
              </div>
            </div>
          </div>
        )}
        
        {/* Configurações Específicas para Agentes Sequenciais */}
        {agentState.type === AgentType.SEQUENTIAL && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Configurações de Fluxo Sequencial</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="sequential-max-steps">Máximo de Passos</Label>
                <Input
                  id="sequential-max-steps"
                  type="number"
                  min={1}
                  max={50}
                  value={agentState.maxSteps}
                  onChange={(e) => 
                    setAgentState(prev => ({ 
                      ...prev, 
                      maxSteps: Math.min(50, Math.max(1, parseInt(e.target.value) || 1)) 
                    }))
                  }
                  className="mt-1 w-24"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Número máximo de passos que o agente pode executar.
                </p>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="sequential-stop-on-error"
                  checked={agentState.stopOnError}
                  onCheckedChange={(checked) => 
                    setAgentState(prev => ({ ...prev, stopOnError: checked as boolean }))
                  }
                />
                <Label htmlFor="sequential-stop-on-error" className="font-normal">
                  Parar execução em caso de erro
                </Label>
              </div>
            </div>
          </div>
        )}
        
        {/* Configurações Específicas para Agentes A2A */}
        {agentState.type === AgentType.A2A && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Configurações A2A</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="a2a-timeout">Tempo Limite (ms)</Label>
                <Input
                  id="a2a-timeout"
                  type="number"
                  min={0}
                  value={agentState.timeoutMs}
                  onChange={(e) => 
                    setAgentState(prev => ({ 
                      ...prev, 
                      timeoutMs: Math.max(0, parseInt(e.target.value) || 0) 
                    }))
                  }
                  className="mt-1 w-32"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Tempo máximo de espera para respostas (0 para sem limite).
                </p>
              </div>
              
              <div>
                <Label htmlFor="a2a-max-concurrent">Máximo de Requisições Paralelas</Label>
                <Input
                  id="a2a-max-concurrent"
                  type="number"
                  min={1}
                  value={agentState.maxConcurrent}
                  onChange={(e) => 
                    setAgentState(prev => ({ 
                      ...prev, 
                      maxConcurrent: Math.max(1, parseInt(e.target.value) || 1) 
                    }))
                  }
                  className="mt-1 w-24"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
);

type ToolDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tool: FormTool;
  onSave: (tool: FormTool) => void;
};

const ToolDialog = ({
  open,
  onOpenChange,
  tool,
  onSave,
}: ToolDialogProps) => {
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

type A2AAgentFormProps = {
  agent: A2AAgentConfig;
  onChange: (field: string, value: unknown) => void;
  onNestedChange: (field: string, value: unknown) => void;
};

const A2AAgentForm = React.memo(({ agent, onChange, onNestedChange }: A2AAgentFormProps) => {
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
            <div className="space-y-2">
              <Label htmlFor="isActive">Ativo</Label>
              <Checkbox
                id="isActive"
                checked={agent.isActive}
                onCheckedChange={(checked) => handleChange('isActive', checked === true)}
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

const Agentes: React.FC = () => {
  // Router hooks
  const navigate = useNavigate();
  const { id: routeId } = useParams<{ id?: string }>(); // Renamed to avoid conflict if 'id' is used elsewhere
  
  // State management
  const [agentState, setAgentState] = useState<ADKAgentConfig>(() => {
    const newId = routeId || uuidv4();
    return {
      identity: {
        id: newId,
        name: '',
        description: '',
        model: 'gemini-1.5-flash-latest', // Default model
      },
      guidance: {
        instruction: '',
      },
      tools: [],
      generateContentConfig: {
        temperature: 0.7,
        maxOutputTokens: 2048,
        topP: 1,
        topK: 40,
        safetySettings: [],
        // stopSequences: [], // Add if part of GenerateContentConfig type
        // frequencyPenalty: 0, // Add if part of GenerateContentConfig type
        // presencePenalty: 0, // Add if part of GenerateContentConfig type
        // logitBias: {}, // Add if part of GenerateContentConfig type
      },
      version: '1.0.0',
      // These fields might not be part of ADKAgentConfig directly, adjust as needed or add to a wrapper type
      // type: 'llm', // This seems to be a local form type, not ADK
      // isPublic: false,
      // tags: [],
      // inputSchema, outputSchema, outputKey, includeContents, planner, codeExecutor - add if needed
    };
  });
  
  // UI state
  // Dialog states
  const [isDescriptionDialogOpen, setIsDescriptionDialogOpen] = useState(false);
  const [currentEditingDescription, setCurrentEditingDescription] = useState('');
  const [isInstructionDialogOpen, setIsInstructionDialogOpen] = useState(false);
  const [currentEditingInstruction, setCurrentEditingInstruction] = useState('');
  const [isToolDialogOpen, setIsToolDialogOpen] = useState(false);
  const [currentToolForDialog, setCurrentToolForDialog] = useState<FormTool | null>(null);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('identity'); // From checkpoint summary

  // Ensure toast is available from useToast() hook declared earlier in the component
  // const { toast } = useToast(); // Assuming this is already declared above

  // Handlers for Description Dialog
  const handleOpenDescriptionDialog = useCallback(() => {
    setCurrentEditingDescription(agentState.identity.description);
    setIsDescriptionDialogOpen(true);
  }, [agentState.identity.description]);

  const handleSaveDescription = useCallback(() => {
    setAgentState(prev => ({
      ...prev,
      identity: {
        ...prev.identity,
        description: currentEditingDescription,
      },
    }));
    setIsDescriptionDialogOpen(false);
    toast({ title: 'Success', description: 'Agent description updated.' });
  }, [currentEditingDescription, agentState, toast, setAgentState, setIsDescriptionDialogOpen]);

  // Handlers for Instruction Dialog
  const handleOpenInstructionDialog = useCallback(() => {
    setCurrentEditingInstruction(agentState.guidance.instruction);
    setIsInstructionDialogOpen(true);
  }, [agentState.guidance.instruction]);

  const handleSaveInstruction = useCallback(() => {
    setAgentState(prev => ({
      ...prev,
      guidance: {
        ...prev.guidance,
        instruction: currentEditingInstruction,
      },
    }));
    setIsInstructionDialogOpen(false);
    toast({ title: 'Success', description: 'Agent instructions updated.' });
  }, [currentEditingInstruction, agentState, toast, setAgentState, setIsInstructionDialogOpen]);

  // Placeholder for handleSaveTool - needed for ToolDialog
  // Ensure FormTool is imported and ADKAgentConfig includes 'tools' array
  const handleSaveTool = useCallback((toolToSave: FormTool) => {
    const existingToolIndex = agentState.tools.findIndex(t => t.id === toolToSave.id);
    let updatedTools: FormTool[]; // Assuming agentState.tools is FormTool[] or compatible
    
    if (existingToolIndex > -1) {
      updatedTools = agentState.tools.map((t, index) => index === existingToolIndex ? toolToSave : t);
    } else {
      updatedTools = [...agentState.tools, toolToSave];
    }
    
    setAgentState(prev => ({ ...prev, tools: updatedTools as any })); // Using 'as any' if FormTool[] is not directly assignable to ADKAgentConfig['tools'] without mapping
    setIsToolDialogOpen(false);
    toast({ title: 'Success', description: `Tool ${toolToSave.name} saved.`});
  }, [agentState, toast, setAgentState, setIsToolDialogOpen]);
  const [isDescriptionDialogOpen, setIsDescriptionDialogOpen] = useState(false);
  const [currentEditingDescription, setCurrentEditingDescription] = useState('');
  const [isInstructionDialogOpen, setIsInstructionDialogOpen] = useState(false); // Added for instruction dialog
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [currentEditingInstruction, setCurrentEditingInstruction] = useState('');
  const [toolDialogOpen, setToolDialogOpen] = useState(false);
  const [currentTool, setCurrentTool] = useState<FormTool | null>(null);
  const [isEditingTool, setIsEditingTool] = useState(false);
  const [toolToDeleteIndex, setToolToDeleteIndex] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false); // Added isSaving state
  
  // Toast for user feedback
  const { toast } = useToast();
  
  // Query client for data fetching
  const queryClient = useQueryClient();

  // Helper function for temperature description (stub)
  const getTemperatureDescription = (temp: number): string => {
    if (temp < 0.3) return "Muito preciso";
    if (temp < 0.7) return "Preciso e criativo";
    if (temp < 1) return "Criativo";
    return "Muito criativo";
  };

  // Stub for handleSaveAgent
  const handleSaveAgent = async () => {
    setIsSaving(true);
    console.log("Saving agent:", agentState);
    // Replace with actual save logic
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast({
      title: "Agent Saved (Stub)",
      description: "Agent configuration has been logged.",
    });
    setIsSaving(false);
    // navigate('/agents'); // Uncomment when save is real
  };

  // Stubs for dialogs and tool management
  const openToolDialog = (tool: FormTool | null = null, index: number | null = null) => {
    setCurrentTool(tool ? { ...tool } : {
      id: uuidv4(),
      name: '',
      description: '',
      parameters: [],
      returnType: 'string' // Default return type
    });
    setIsEditingTool(tool !== null && index !== null);
    setToolDialogOpen(true);
  };

  const confirmDeleteTool = (index: number) => {
    setToolToDeleteIndex(index);
    // Logic to open a confirmation dialog for deleting a tool can be added here
    // For now, directly delete or use a simple confirm
    if (window.confirm("Tem certeza que deseja remover esta ferramenta?")) {
      handleDeleteTool(index);
    }
    setToolToDeleteIndex(null);
  };

  const handleDeleteTool = (index: number) => {
    if (agentState.tools) {
        setAgentState(prev => ({
            ...prev,
            tools: prev.tools ? prev.tools.filter((_, i) => i !== index) : [],
        }));
    }
  };

// Componente principal Agentes
export default function Agentes() {
  // Router and navigation
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { fetchAgentById, saveAgent } = useAgentStore();
  
  // State management
  const [agentState, setAgentState] = useState<AgentState>(() => ({
    ...getDefaultAgentConfig(AgentType.LLM),
    id: id || `agent-${uuidv4()}`,
    name: id ? 'Carregando...' : `Novo Agente ${AgentType.LLM}`,
  }));

  // UI State
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  
  // Dialog states
  const [isDescriptionDialogOpen, setIsDescriptionDialogOpen] = useState<boolean>(false);
  const [isInstructionDialogOpen, setIsInstructionDialogOpen] = useState<boolean>(false);
  const [isToolDialogOpen, setIsToolDialogOpen] = useState<boolean>(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState<boolean>(false);
  
  // Editing states
  const [currentEditingDescription, setCurrentEditingDescription] = useState<string>('');
  const [currentEditingInstruction, setCurrentEditingInstruction] = useState<string>('');
  const [currentEditingTool, setCurrentEditingTool] = useState<FormTool>({
    id: `tool-${uuidv4()}`,
    name: '',
    description: '',
    parameters: [],
    enabled: true,
    required: false,
    returnType: 'string'
  });
  const [editingToolIndex, setEditingToolIndex] = useState<number>(-1);
  const [toolToDeleteIndex, setToolToDeleteIndex] = useState<number | null>(null);
    id: `tool-${Date.now()}`,
    name: '',
    description: '',
    parameters: [],
    enabled: true,
    required: false
  const [editingToolIndex, setEditingToolIndex] = useState<number>(-1);
  const [toolToDeleteIndex, setToolToDeleteIndex] = useState<number>(-1);
  const [currentEditingInstruction, setCurrentEditingInstruction] = useState<string>('');

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
    const loadAgentData = async () => {
      if (!id) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        await fetchAgentById(id);
        const agentData = useAgentStore.getState().activeAgent;
        
        if (!agentData) {
          throw new Error('Agente não encontrado');
        }
        
        // Atualizar o estado com os dados do agente
        setAgentState(prev => ({
          ...prev,
          ...agentData,
          // Garantir que arrays não sejam nulos
          tools: agentData.tools || [],
          safetySettings: agentData.safetySettings || [],
          stopSequences: agentData.stopSequences || [],
          tags: agentData.tags || [],
          // Preencher campos opcionais com valores padrão se não existirem
          instruction: agentData.instruction || '',
          systemPrompt: agentData.systemPrompt || '',
          agents: agentData.agents || [],
          maxSteps: agentData.maxSteps ?? 10,
          stopOnError: agentData.stopOnError ?? true,
          maxConcurrent: agentData.maxConcurrent ?? 5,
          timeoutMs: agentData.timeoutMs ?? 30000,
        }));
        
        // Atualizar estados de edição
        setCurrentEditingInstruction(agentData.instructions || '');
        setCurrentEditingDescription(agentData.description || '');
        
      } catch (error) {
        console.error('Erro ao carregar agente:', error);
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar os dados do agente',
          variant: 'destructive'
        });
        navigate('/agentes');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadAgentData();
  }, [id, navigate, toast]);

  // Função para salvar o agente
  const handleSaveAgent = useCallback(async (e?: React.FormEvent): Promise<void> => {
    e?.preventDefault();
    
    try {
      setIsSaving(true);
      
      // Validar campos obrigatórios
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
      
      // Salvar o agente via store
      const saved = await saveAgent({ ...payload, id: id || payload.id });
      
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
  const [currentEditingTool, setCurrentEditingTool] = useState<FormTool | null>(null);
  const [editingToolIndex, setEditingToolIndex] = useState<number>(-1);
  const [toolToDeleteIndex, setToolToDeleteIndex] = useState<number>(-1);

  // Estados para controle de diálogos
  const [isDescriptionDialogOpen, setIsDescriptionDialogOpen] = useState<boolean>(false);
  const [isInstructionDialogOpen, setIsInstructionDialogOpen] = useState<boolean>(false);
  const [isToolDialogOpen, setIsToolDialogOpen] = useState<boolean>(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState<boolean>(false);

  // Estados de carregamento
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Estados para edição
  const [currentEditingInstruction, setCurrentEditingInstruction] = useState<string>('');
  const [currentEditingDescription, setCurrentEditingDescription] = useState<string>('');

  // Estado para armazenar o ID do agente atual
  const [currentAgentId, setCurrentAgentId] = useState<string | undefined>(id);

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
    });
    
  } catch (error) {
    console.error('Erro ao salvar agente:', error);
    toast({
      title: 'Erro',
      description: 'Não foi possível salvar o agente. Tente novamente.',
      variant: 'destructive'
    });
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
      </div>
    </div>

    {/* Conteúdo Principal */}
    <div className="flex-1 overflow-auto p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Seção de Informações Básicas */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900">Informações Básicas</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="agent-name">Nome do Agente</Label>
              <Input
                id="agent-name"
                value={agentState.name}
                onChange={(e) => setAgentState(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Digite o nome do agente"
                className="mt-1"
              />
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <Label htmlFor="agent-description" className="text-sm font-medium">Descrição</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => {
                          setCurrentEditingDescription(agentState.description || '');
                          setIsDescriptionDialogOpen(true);
                        }} 
                        className="h-7 w-7"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Editar Descrição</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Textarea
                id="agent-description"
                value={agentState.description} 
                placeholder="Descreva o que seu agente faz, suas capacidades e quaisquer características notáveis."
                className="min-h-[80px] mt-1"
                readOnly
              />
            </div>
            
            <div>
              <Label htmlFor="agent-type">Tipo de Agente</Label>
              <Select
                value={agentState.type}
                onValueChange={(value) => {
                  const newType = value as AgentType;
                  setAgentState(prev => ({
                    ...prev,
                    ...getDefaultAgentConfig(newType),
                    type: newType,
                    id: prev.id,
                    name: prev.name || `Novo Agente ${newType}`
                  }));
                }}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Selecione o tipo de agente" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={AgentType.LLM}>LLM Agent</SelectItem>
                  <SelectItem value={AgentType.SEQUENTIAL}>Sequential Agent</SelectItem>
                  <SelectItem value={AgentType.A2A}>A2A Agent</SelectItem>
                  <SelectItem value={AgentType.PARALLEL}>Parallel Agent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Seção de Instruções */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900">Instruções</h2>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setCurrentEditingInstruction(agentState.instructions || '');
                setIsInstructionDialogOpen(true);
              }}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Editar
            </Button>
          </div>
          <div 
            onClick={() => {
              setCurrentEditingInstruction(agentState.instructions || '');
              setIsInstructionDialogOpen(true);
            }}
            className="p-4 bg-gray-50 rounded-md border border-gray-200 min-h-[120px] cursor-text hover:bg-gray-100 transition-colors whitespace-pre-wrap"
          >
            {agentState.instructions || (
              <p className="text-gray-400 italic">Clique para adicionar instruções para o agente</p>
            )}
          </div>
        </div>

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
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Configurações Avançadas</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="agent-model">Modelo</Label>
                <Input
                  id="agent-model"
                  value={agentState.model}
                  onChange={(e) => setAgentState(prev => ({ ...prev, model: e.target.value }))}
                  placeholder="Ex: gpt-4, claude-2, etc."
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="agent-temperature">Temperatura: {agentState.temperature}</Label>
                <div className="flex items-center space-x-4 mt-2">
                  <span className="text-sm text-gray-500">0.0</span>
                  <Slider
                    id="agent-temperature"
                    min={0}
                    max={2}
                    step={0.1}
                    value={[agentState.temperature]}
                    onValueChange={([value]) => setAgentState(prev => ({ ...prev, temperature: value }))}
                    className="flex-1"
                  />
                  <span className="text-sm text-gray-500">2.0</span>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Valores mais baixos tornam as saídas mais focadas e determinísticas.
                </p>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="agent-streaming"
                  checked={agentState.streaming}
                  onCheckedChange={(checked) => 
                    setAgentState(prev => ({ ...prev, streaming: checked === true }))
                  }
                />
                <Label htmlFor="agent-streaming" className="font-normal">
                  Habilitar streaming de respostas
                </Label>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>

    {/* Diálogos */}
    <DescriptionEditorDialog
      open={isDescriptionDialogOpen}
      onOpenChange={setIsDescriptionDialogOpen}
      description={currentEditingDescription}
      onDescriptionChange={setCurrentEditingDescription}
      onSave={handleSaveDescription}
    />

    <InstructionEditorDialog
      open={isInstructionDialogOpen}
      onOpenChange={setIsInstructionDialogOpen}
      instruction={currentEditingInstruction}
      onInstructionChange={setCurrentEditingInstruction}
      onSave={handleSaveInstruction}
    />

    <ToolDialog
      open={isToolDialogOpen}
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

const confirmDeleteTool = useCallback((index: number) => {
  setToolToDeleteIndex(index);
  setIsConfirmDeleteOpen(true);
}, []);

const handleDeleteTool = useCallback(() => {
  if (toolToDeleteIndex === null || toolToDeleteIndex < 0) {
    setIsConfirmDeleteOpen(false);
    return;
  }
  
  try {
    const toolToDelete = agentState.tools[toolToDeleteIndex];
    
    setAgentState(prev => ({
      ...prev,
      tools: prev.tools.filter((_, i) => i !== toolToDeleteIndex)
    }));
    
    sonnerToast.success('Ferramenta removida', {
      description: 'Clique para desfazer',
      action: {
        label: 'Desfazer',
        onClick: () => {
          setAgentState(prev => ({
            ...prev,
            tools: [
              ...prev.tools.slice(0, toolToDeleteIndex),
              toolToDelete,
              ...prev.tools.slice(toolToDeleteIndex)
            ]
          }));
          
          sonnerToast.success('Operação desfeita', {
            description: 'A ferramenta foi restaurada',
          });
        }
      },
    });
    
  } catch (error) {
    console.error('Erro ao excluir ferramenta:', error);
    sonnerToast.error('Erro', {
      description: 'Não foi possível excluir a ferramenta. Tente novamente.',
    });
  } finally {
    setToolToDeleteIndex(-1);
    setIsConfirmDeleteOpen(false);
  }
}, [toolToDeleteIndex, agentState.tools]);

const handleSaveDescription = useCallback(() => {
  try {
    setAgentState(prev => ({
      ...prev,
      description: currentEditingDescription
    }));
    
    setIsDescriptionDialogOpen(false);
    
    sonnerToast.success('Descrição salva', {
      description: 'A descrição do agente foi atualizada com sucesso!',
    });
    
  } catch (error) {
    console.error('Erro ao salvar descrição:', error);
    sonnerToast.error('Erro', {
      description: 'Não foi possível salvar a descrição. Tente novamente.',
    });
  }
}, [currentEditingDescription]);

const handleSaveInstructions = useCallback(() => {
  try {
    setAgentState(prev => ({
      ...prev,
      instructions: currentEditingInstruction
    }));
    
    setIsInstructionDialogOpen(false);
    
    sonnerToast.success('Instruções salvas', {
      description: 'As instruções do agente foram atualizadas com sucesso!',
    });
    
  } catch (error) {
    console.error('Erro ao salvar instruções:', error);
    sonnerToast.error('Erro', {
      description: 'Não foi possível salvar as instruções. Tente novamente.',
    });
  }
}, [currentEditingInstruction]);

const handleDescriptionChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
  setCurrentEditingDescription(e.target.value);
}, []);

const handleInstructionsChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
  setCurrentEditingInstruction(e.target.value);
}, []);

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
      await fetchAgentById(id);
      const data = useAgentStore.getState().activeAgent;
      
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

  const openToolDialog = useCallback((index = -1) => {
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
      setEditingToolIndex(-1);
    }
    setIsToolDialogOpen(true);
  }, [agentState.tools]);

  const closeToolDialog = useCallback(() => {
    setIsToolDialogOpen(false);
    setCurrentEditingTool(null);
    setEditingToolIndex(-1);
  }, []);

  const handleSaveTool = useCallback((tool: FormTool) => {
    try {
      setAgentState(prev => {
        const updatedTools = [...prev.tools];
        
        if (editingToolIndex >= 0) {
          updatedTools[editingToolIndex] = tool;
        } else {
          updatedTools.push(tool);
        }
        
        return { ...prev, tools: updatedTools };
      });
      
      closeToolDialog();
      
      sonnerToast.success('Sucesso', {
        description: editingToolIndex >= 0 ? 'Ferramenta atualizada com sucesso!' : 'Ferramenta adicionada com sucesso!',
      });
      
    } catch (error) {
      console.error('Erro ao salvar ferramenta:', error);
      sonnerToast.error('Erro', {
        description: 'Não foi possível salvar a ferramenta. Tente novamente.',
      });
    }
  }, [editingToolIndex, closeToolDialog]);

  const confirmDeleteTool = useCallback((index: number) => {
    setToolToDeleteIndex(index);
    setIsConfirmDeleteOpen(true);
  }, []);

  const handleDeleteTool = useCallback(() => {
    if (toolToDeleteIndex === null || toolToDeleteIndex < 0) {
      setIsConfirmDeleteOpen(false);
      return;
    }
    
    try {
      const toolToDelete = agentState.tools[toolToDeleteIndex];
      
      setAgentState(prev => ({
        ...prev,
        tools: prev.tools.filter((_, i) => i !== toolToDeleteIndex)
      }));
      
      sonnerToast.success('Ferramenta removida', {
        description: 'Clique para desfazer',
        action: {
          label: 'Desfazer',
          onClick: () => {
            setAgentState(prev => ({
              ...prev,
              tools: [
                ...prev.tools.slice(0, toolToDeleteIndex),
                toolToDelete,
                ...prev.tools.slice(toolToDeleteIndex)
              ]
            }));
            
            sonnerToast.success('Operação desfeita', {
              description: 'A ferramenta foi restaurada',
            });
          }
        },
      });
      
    } catch (error) {
      console.error('Erro ao excluir ferramenta:', error);
      sonnerToast.error('Erro', {
        description: 'Não foi possível excluir a ferramenta. Tente novamente.',
      });
    } finally {
      setToolToDeleteIndex(-1);
      setIsConfirmDeleteOpen(false);
    }
  }, [toolToDeleteIndex, agentState.tools]);

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


      {/* DIALOGS REFACTORED */}
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
        onOpenChange={setIsToolDialogOpen}
        tool={currentToolForDialog}
        onSave={handleSaveTool} 
        isEditing={!!currentToolForDialog}
      />
    </div>
  );
};

export default Agentes;
