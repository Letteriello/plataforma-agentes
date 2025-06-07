import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"; // DialogTrigger não é usado pois abrimos programaticamente, DialogClose removido pois não é exportado/usado

// TODO: Definir tipos mais robustos para o estado do agente e ferramentas
interface AgentToolParameter {
  id: string;
  name: string;
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  description: string;
  required: boolean;
  defaultValue?: string | number | boolean;
}

interface SafetySetting {
  id: string; // Para a chave React e identificação única na UI
  category: string; // Ex: HARM_CATEGORY_SEXUALLY_EXPLICIT
  threshold: string; // Ex: BLOCK_NONE, BLOCK_LOW_AND_ABOVE, etc.
}

interface AgentTool {
  id: string;
  name: string;
  description: string;
  parameters: AgentToolParameter[];
  returnType: string; // Ou um schema mais complexo
}

interface AgentState {
  name: string;
  description: string;
  model: string;
  instruction: string;
  // generate_content_config
  temperature: number;
  maxOutputTokens: number;
  topP: number;
  topK: number;
  safetySettings: SafetySetting[];
  // tools
  tools: AgentTool[];
  // advanced
  inputSchema: string;
  outputSchema: string;
  outputKey: string;
  includeContents: 'default' | 'none';
  planner: string; // Simplificado
  codeExecutor: string; // Simplificado
}

const initialAgentState: AgentState = {
  name: '',
  description: '',
  model: 'gemini-pro', // Default model
  instruction: '',
  temperature: 0.7,
  maxOutputTokens: 2048,
  topP: 1,
  topK: 40,
  safetySettings: [],
  tools: [],
  inputSchema: '',
  outputSchema: '',
  outputKey: '',
  includeContents: 'default',
  planner: '',
  codeExecutor: '',
};

const Agentes: React.FC = () => {
  const [agentState, setAgentState] = useState<AgentState>(initialAgentState);
  const [isToolDialogOpen, setIsToolDialogOpen] = useState(false);
  const [editingToolIndex, setEditingToolIndex] = useState<number | null>(null); // null para nova ferramenta, índice para editar
  const [currentEditingTool, setCurrentEditingTool] = useState<AgentTool | null>(null);

  // Estados para o modal de Descrição do Agente
  const [isDescriptionDialogOpen, setIsDescriptionDialogOpen] = useState(false);
  const [currentEditingDescription, setCurrentEditingDescription] = useState('');

  // Estados para o modal de Instrução Principal
  const [isInstructionDialogOpen, setIsInstructionDialogOpen] = useState(false);
  const [currentEditingInstruction, setCurrentEditingInstruction] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setAgentState(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: keyof AgentState, value: string) => {
    setAgentState(prev => ({ ...prev, [name]: value }));
  };

  const handleNumberInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAgentState(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };

  const openToolDialog = (index?: number) => {
    if (index !== undefined && agentState.tools[index]) {
      setCurrentEditingTool({ ...agentState.tools[index] });
      setEditingToolIndex(index);
    } else {
      // Nova ferramenta
      setCurrentEditingTool({
        id: `tool-new-${Date.now()}`,
        name: '',
        description: '',
        parameters: [],
        returnType: ''
      });
      setEditingToolIndex(null);
    }
    setIsToolDialogOpen(true);
  };

  const closeToolDialog = () => {
    setIsToolDialogOpen(false);
    setCurrentEditingTool(null);
    setEditingToolIndex(null);
  };

  const addTool = () => {
    openToolDialog(); // Abre o dialog para uma nova ferramenta
  };

  const removeTool = (toolIndex: number) => {
    setAgentState(prev => ({
      ...prev,
      tools: prev.tools.filter((_, index) => index !== toolIndex)
    }));
  };

  const handleToolChange = (toolIndex: number, fieldName: keyof AgentTool, value: string) => {
    setAgentState(prev => {
      const newTools = [...prev.tools];
      newTools[toolIndex] = { ...newTools[toolIndex], [fieldName]: value };
      return { ...prev, tools: newTools };
    });
  };

  // Dummy function for now, to be implemented
  const addToolParameter = (toolIndex: number) => {
    console.log(`TODO: Add parameter to tool ${toolIndex}`);
    // Placeholder: Add a new empty parameter to the tool
    setAgentState(prev => {
      const newTools = [...prev.tools];
      const newParameters = [...newTools[toolIndex].parameters, {
        id: `param-${Date.now()}`,
        name: '',
        type: 'string' as 'string' | 'number' | 'boolean' | 'object' | 'array',
        description: '',
        required: false,
        defaultValue: ''
      }];
      newTools[toolIndex] = { ...newTools[toolIndex], parameters: newParameters };
      return { ...prev, tools: newTools };
    });
  };

  const handleToolParameterChange = (
    toolIndex: number, 
    paramIndex: number, 
    fieldName: keyof AgentToolParameter | string, // string for checkbox case
    value: string | boolean
  ) => {
    setAgentState(prev => {
      const newTools = [...prev.tools];
      const newParameters = [...newTools[toolIndex].parameters];
      // Type assertion to satisfy TypeScript for fieldName as keyof AgentToolParameter
      (newParameters[paramIndex] as any)[fieldName] = value;
      newTools[toolIndex] = { ...newTools[toolIndex], parameters: newParameters };
      return { ...prev, tools: newTools };
    });
  };

  const removeToolParameter = (toolIndex: number, paramIndex: number) => {
    setAgentState(prev => {
      const newTools = [...prev.tools];
      const newParameters = newTools[toolIndex].parameters.filter((_, index) => index !== paramIndex);
      newTools[toolIndex] = { ...newTools[toolIndex], parameters: newParameters };
      return { ...prev, tools: newTools };
    });
  };

  const addSafetySetting = () => {
    setAgentState(prev => ({
      ...prev,
      safetySettings: [...prev.safetySettings, {
        id: `safety-${Date.now()}`,
        category: '',
        threshold: 'BLOCK_NONE' // Default threshold
      }]
    }));
  };

  const removeSafetySetting = (index: number) => {
    setAgentState(prev => ({
      ...prev,
      safetySettings: prev.safetySettings.filter((_, i) => i !== index)
    }));
  };

  const handleSafetySettingChange = (index: number, fieldName: keyof SafetySetting, value: string) => {
    setAgentState(prev => {
      const newSafetySettings = [...prev.safetySettings];
      newSafetySettings[index] = { ...newSafetySettings[index], [fieldName]: value };
      return { ...prev, safetySettings: newSafetySettings };
    });
  };

  const handleSaveTool = () => {
    if (!currentEditingTool) return;

    // Validação básica dentro do dialog
    if (!currentEditingTool.name.trim()) {
      alert("O nome da ferramenta é obrigatório.");
      return;
    }

    setAgentState(prev => {
      const newTools = [...prev.tools];
      if (editingToolIndex !== null) {
        // Editando ferramenta existente
        newTools[editingToolIndex] = { ...currentEditingTool, id: newTools[editingToolIndex].id }; // Mantém o ID original
      } else {
        // Adicionando nova ferramenta
        newTools.push({ ...currentEditingTool, id: `tool-${Date.now()}-${Math.random().toString(36).substring(2, 7)}` });
      }
      return { ...prev, tools: newTools };
    });
    closeToolDialog();
  };

  // Handlers para o modal de Descrição do Agente
  const openDescriptionDialog = () => {
    setCurrentEditingDescription(agentState.description);
    setIsDescriptionDialogOpen(true);
  };

  const closeDescriptionDialog = () => {
    setIsDescriptionDialogOpen(false);
    // Não é necessário resetar currentEditingDescription aqui, pois será pego do agentState ao reabrir
  };

  const handleSaveDescription = () => {
    setAgentState(prev => ({ ...prev, description: currentEditingDescription }));
    closeDescriptionDialog();
  };

  // Handlers para o modal de Instrução Principal
  const openInstructionDialog = () => {
    setCurrentEditingInstruction(agentState.instruction);
    setIsInstructionDialogOpen(true);
  };

  const closeInstructionDialog = () => {
    setIsInstructionDialogOpen(false);
  };

  const handleSaveInstruction = () => {
    setAgentState(prev => ({ ...prev, instruction: currentEditingInstruction }));
    closeInstructionDialog();
  };

  const handleSubmit = () => {
    // Validação básica
    const { name, model, instruction } = agentState;
    if (!name.trim() || !model.trim() || !instruction.trim()) {
      let missingFields = [];
      if (!name.trim()) missingFields.push("Nome do Agente");
      if (!model.trim()) missingFields.push("Modelo Base");
      if (!instruction.trim()) missingFields.push("Instruções do Agente");
      alert(`Por favor, preencha os campos obrigatórios: ${missingFields.join(', ')}.`);
      return;
    }

    // TODO: Adicionar validações mais detalhadas para ferramentas, parâmetros, etc.

    console.log("Agent State Submitted:", JSON.stringify(agentState, null, 2));
    alert("Configurações do Agente validadas e salvas no console! Verifique o log para a estrutura JSON completa.");
    // TODO: Implementar a lógica de envio para o backend ou armazenamento
  };

  return (
    // Removido o div container externo, o Card agora é o elemento raiz.
    // As classes max-w-4xl e mx-auto foram removidas do Card para que ele ocupe a largura disponível.
    <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Configurar Agente de IA</CardTitle>
          <CardDescription>Defina os parâmetros para o seu agente utilizando o Google ADK.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <Tabs defaultValue="identidade" className="w-full">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 mb-4">
              <TabsTrigger value="identidade">Identidade</TabsTrigger>
              <TabsTrigger value="instrucoes">Instruções</TabsTrigger>
              <TabsTrigger value="geracao">Geração</TabsTrigger>
              <TabsTrigger value="seguranca">Segurança</TabsTrigger>
              <TabsTrigger value="ferramentas">Ferramentas</TabsTrigger>
              <TabsTrigger value="avancado">Avançado</TabsTrigger>
            </TabsList>

            <TabsContent value="identidade" className="pt-4">
              {/* Identidade do Agente */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Identidade do Agente</CardTitle>
                  <CardDescription>Informações básicas para identificar e descrever seu agente.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nome do Agente (Obrigatório)</Label>
                    <Input id="name" name="name" value={agentState.name} onChange={handleInputChange} placeholder="Ex: meu_agente_financeiro" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="description">Descrição do Agente</Label>
                      <Button variant="outline" size="sm" onClick={openDescriptionDialog}>Editar Descrição</Button>
                    </div>
                    <Textarea 
                      id="descriptionDisplay" // ID diferente para não conflitar com o do modal
                      name="descriptionDisplay" 
                      value={agentState.description} 
                      readOnly 
                      placeholder="Ex: Um agente para ajudar com cotações de ações."
                      rows={3} // Menos linhas para exibição
                      className="mt-1 resize-none bg-slate-50 dark:bg-slate-800/60 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <Label htmlFor="model">Modelo LLM (Obrigatório)</Label>
                    <Select name="model" value={agentState.model} onValueChange={(value) => handleSelectChange('model', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um modelo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gemini-pro">Gemini Pro</SelectItem>
                        <SelectItem value="gemini-1.0-pro">Gemini 1.0 Pro</SelectItem>
                        <SelectItem value="gemini-1.5-pro-latest">Gemini 1.5 Pro (Latest)</SelectItem>
                        <SelectItem value="gemini-1.5-flash-latest">Gemini 1.5 Flash (Latest)</SelectItem>
                        {/* Adicionar outros modelos conforme necessário */}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="instrucoes" className="pt-4">
              {/* Instruções do Agente */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Instruções do Agente</CardTitle>
                  <CardDescription>Defina o comportamento principal, persona e como o agente deve operar.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="instruction">Instrução Principal (Prompt)</Label>
                      <Button variant="outline" size="sm" onClick={openInstructionDialog}>Editar Instrução</Button>
                    </div>
                    <Textarea
                      id="instructionDisplay" // ID diferente para não conflitar com o do modal
                      name="instructionDisplay"
                      value={agentState.instruction}
                      readOnly
                      placeholder="Ex: Você é um assistente prestativo que responde perguntas sobre o clima..."
                      rows={4} // Menos linhas para exibição
                      className="mt-1 resize-none bg-slate-50 dark:bg-slate-800/60 cursor-not-allowed"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="geracao" className="pt-4">
              {/* Configurações de Geração */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Configurações de Geração</CardTitle>
                  <CardDescription>Ajuste fino dos parâmetros de geração de resposta do LLM.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="temperature">Temperatura</Label>
                      <Input id="temperature" name="temperature" type="number" value={agentState.temperature} onChange={handleNumberInputChange} placeholder="Ex: 0.7" step="0.1" />
                      <p className="text-sm text-muted-foreground mt-1">Controla a aleatoriedade. Menor = mais determinístico.</p>
                    </div>
                    <div>
                      <Label htmlFor="maxOutputTokens">Máximo de Tokens de Saída</Label>
                      <Input id="maxOutputTokens" name="maxOutputTokens" type="number" value={agentState.maxOutputTokens} onChange={handleNumberInputChange} placeholder="Ex: 2048" />
                      <p className="text-sm text-muted-foreground mt-1">Comprimento máximo da resposta gerada.</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="topP">Top P</Label>
                      <Input id="topP" name="topP" type="number" value={agentState.topP} onChange={handleNumberInputChange} placeholder="Ex: 1" step="0.1" />
                      <p className="text-sm text-muted-foreground mt-1">Controla a diversidade via amostragem nucleus.</p>
                    </div>
                    <div>
                      <Label htmlFor="topK">Top K</Label>
                      <Input id="topK" name="topK" type="number" value={agentState.topK} onChange={handleNumberInputChange} placeholder="Ex: 40" />
                      <p className="text-sm text-muted-foreground mt-1">Filtra os tokens menos prováveis.</p>
                    </div>
                  </div>

                  {/* Sub-seção de Configurações de Segurança */}
                  <div className="pt-4 mt-4 border-t">
                    <h4 className="text-md font-semibold mb-2">Configurações de Segurança (Safety Settings)</h4>
                    <p className="text-sm text-muted-foreground mb-3">Defina categorias de dano e os limites de bloqueio correspondentes.</p>
                    {agentState.safetySettings.map((setting, index) => (
                      <Card key={setting.id} className="mb-3 p-3 bg-slate-100 dark:bg-slate-700/50">
                        <div className="flex justify-between items-center mb-2">
                          <p className="text-sm font-medium">Regra de Segurança #{index + 1}</p>
                          <Button variant="ghost" size="sm" onClick={() => removeSafetySetting(index)}>
                            Remover Regra
                          </Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <Label htmlFor={`safety-category-${index}`}>Categoria de Dano</Label>
                            <Input 
                              id={`safety-category-${index}`} 
                              name="category" 
                              value={setting.category} 
                              onChange={(e) => handleSafetySettingChange(index, 'category', e.target.value)} 
                              placeholder="Ex: HARM_CATEGORY_HARASSMENT"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`safety-threshold-${index}`}>Limite de Bloqueio</Label>
                            <Select 
                              name="threshold" 
                              value={setting.threshold} 
                              onValueChange={(value) => handleSafetySettingChange(index, 'threshold', value)}
                            >
                              <SelectTrigger id={`safety-threshold-${index}`}>
                                <SelectValue placeholder="Selecione o limite" />
                              </SelectTrigger>
                              <SelectContent>
                                {/* Valores de exemplo baseados na documentação do Google AI */}
                                <SelectItem value="BLOCK_NONE">BLOCK_NONE</SelectItem>
                                <SelectItem value="BLOCK_ONLY_HIGH">BLOCK_ONLY_HIGH</SelectItem>
                                <SelectItem value="BLOCK_MEDIUM_AND_ABOVE">BLOCK_MEDIUM_AND_ABOVE</SelectItem>
                                <SelectItem value="BLOCK_LOW_AND_ABOVE">BLOCK_LOW_AND_ABOVE</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </Card>
                    ))}
                    <Button variant="outline" size="sm" onClick={addSafetySetting} className="mt-2 w-full">
                      Adicionar Nova Regra de Segurança
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="seguranca" className="pt-4">
              {/* Configurações de Segurança */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Configurações de Segurança</CardTitle>
                  <CardDescription>Defina categorias de dano e os limites de bloqueio correspondentes.</CardDescription>
                </CardHeader>
                <CardContent>
                  {agentState.safetySettings.map((setting, index) => (
                    <Card key={setting.id} className="mb-3 p-3 bg-slate-100 dark:bg-slate-700/50">
                      <div className="flex justify-between items-center mb-2">
                        <p className="text-sm font-medium">Regra de Segurança #{index + 1}</p>
                        <Button variant="ghost" size="sm" onClick={() => removeSafetySetting(index)}>
                          Remover Regra
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <Label htmlFor={`safety-category-${index}`}>Categoria de Dano</Label>
                          <Input 
                            id={`safety-category-${index}`} 
                            name="category" 
                            value={setting.category} 
                            onChange={(e) => handleSafetySettingChange(index, 'category', e.target.value)} 
                            placeholder="Ex: HARM_CATEGORY_HARASSMENT"
                          />
                        </div>
                        <div>
                          <Label htmlFor={`safety-threshold-${index}`}>Limite de Bloqueio</Label>
                          <Select 
                            name="threshold" 
                            value={setting.threshold} 
                            onValueChange={(value) => handleSafetySettingChange(index, 'threshold', value)}
                          >
                            <SelectTrigger id={`safety-threshold-${index}`}>
                              <SelectValue placeholder="Selecione o limite" />
                            </SelectTrigger>
                            <SelectContent>
                              {/* Valores de exemplo baseados na documentação do Google AI */}
                              <SelectItem value="BLOCK_NONE">BLOCK_NONE</SelectItem>
                              <SelectItem value="BLOCK_ONLY_HIGH">BLOCK_ONLY_HIGH</SelectItem>
                              <SelectItem value="BLOCK_MEDIUM_AND_ABOVE">BLOCK_MEDIUM_AND_ABOVE</SelectItem>
                              <SelectItem value="BLOCK_LOW_AND_ABOVE">BLOCK_LOW_AND_ABOVE</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </Card>
                  ))}
                  <Button variant="outline" size="sm" onClick={addSafetySetting} className="mt-2 w-full">
                    Adicionar Nova Regra de Segurança
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="ferramentas" className="pt-4">
              {/* Ferramentas do Agente */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Ferramentas do Agente</CardTitle>
                  <CardDescription>Defina as ferramentas que o agente pode utilizar para interagir ou obter informações.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {agentState.tools.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">Nenhuma ferramenta adicionada.</p>
                  )}
                  <Accordion type="multiple" className="w-full">
                    {agentState.tools.map((tool, toolIndex) => (
                      <AccordionItem value={`tool-${tool.id}`} key={tool.id}>
                        <AccordionTrigger className="hover:no-underline bg-slate-50 dark:bg-slate-800/50 px-4 py-3 rounded-md data-[state=open]:rounded-b-none data-[state=open]:border-b border-slate-200 dark:border-slate-700 flex justify-between items-center w-full">
                          <span className="text-lg font-semibold">Ferramenta: {tool.name || 'Nova Ferramenta'}</span>
                          <div className="ml-auto flex items-center space-x-2">
                            <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); openToolDialog(toolIndex); }} className="mr-2">
                              Editar
                            </Button>
                            <Button variant="destructive" size="sm" onClick={(e) => { e.stopPropagation(); removeTool(toolIndex); }}>
                              Remover
                            </Button>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="pt-0 pb-4 px-4 bg-slate-50 dark:bg-slate-800/50 rounded-b-md border-x border-b border-slate-200 dark:border-slate-700">
                          <div className="space-y-4 pt-4">
                            <div>
                              <Label htmlFor={`tool-name-${toolIndex}`}>Nome da Ferramenta</Label>
                              <Input 
                                id={`tool-name-${toolIndex}`} 
                                name="name" 
                                value={tool.name} 
                                readOnly 
                                placeholder="Ex: get_current_weather"
                              />
                            </div>
                            <div>
                              <Label htmlFor={`tool-description-${toolIndex}`}>Descrição da Ferramenta</Label>
                              <Textarea 
                                id={`tool-description-${toolIndex}`} 
                                name="description" 
                                value={tool.description} 
                                readOnly 
                                placeholder="Ex: Obtém o clima atual para uma localidade específica."
                              />
                            </div>
                            <div>
                              <Label htmlFor={`tool-returnType-${toolIndex}`}>Tipo de Retorno da Ferramenta</Label>
                              <Input 
                                id={`tool-returnType-${toolIndex}`} 
                                name="returnType" 
                                value={tool.returnType} 
                                readOnly 
                                placeholder='Ex: string ou JSON schema {"type": "object", ...}'
                              />
                            </div>
                            <div className="space-y-3 pt-3 border-t mt-4">
                              <h4 className="font-semibold">Parâmetros da Ferramenta:</h4>
                              {tool.parameters.length === 0 && <p className="text-sm text-muted-foreground">Nenhum parâmetro definido.</p>}
                              {tool.parameters.map((param, paramIndex) => (
                                <Card key={param.id} className="p-3 bg-slate-100 dark:bg-slate-700/50">
                                  <div className="flex justify-between items-center mb-2">
                                    <p className="text-sm font-medium">Parâmetro #{paramIndex + 1}</p>
                                    <Button variant="ghost" size="sm" onClick={() => removeToolParameter(toolIndex, paramIndex)}>
                                      Remover Parâmetro
                                    </Button>
                                  </div>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div>
                                      <Label htmlFor={`tool-${toolIndex}-param-name-${paramIndex}`}>Nome do Parâmetro</Label>
                                      <Input 
                                        id={`tool-${toolIndex}-param-name-${paramIndex}`} 
                                        name="name" 
                                        value={param.name} 
                                        onChange={(e) => handleToolParameterChange(toolIndex, paramIndex, 'name', e.target.value)} 
                                        placeholder="Ex: location"
                                      />
                                    </div>
                                    <div>
                                      <Label htmlFor={`tool-${toolIndex}-param-type-${paramIndex}`}>Tipo</Label>
                                      <Select 
                                        name="type" 
                                        value={param.type} 
                                        onValueChange={(value) => handleToolParameterChange(toolIndex, paramIndex, 'type', value as AgentToolParameter['type'])}
                                      >
                                        <SelectTrigger id={`tool-${toolIndex}-param-type-${paramIndex}`}>
                                          <SelectValue placeholder="Selecione o tipo" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="string">String</SelectItem>
                                          <SelectItem value="number">Number</SelectItem>
                                          <SelectItem value="boolean">Boolean</SelectItem>
                                          <SelectItem value="object">Object (JSON)</SelectItem>
                                          <SelectItem value="array">Array (JSON)</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </div>
                                  <div className="mt-3">
                                    <Label htmlFor={`tool-${toolIndex}-param-description-${paramIndex}`}>Descrição do Parâmetro</Label>
                                    <Textarea 
                                      id={`tool-${toolIndex}-param-description-${paramIndex}`} 
                                      name="description" 
                                      value={param.description} 
                                      onChange={(e) => handleToolParameterChange(toolIndex, paramIndex, 'description', e.target.value)} 
                                      placeholder="Ex: A cidade e estado, ex: San Francisco, CA"
                                      rows={2}
                                    />
                                  </div>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                                    <div>
                                      <Label htmlFor={`tool-${toolIndex}-param-defaultValue-${paramIndex}`}>Valor Padrão (Opcional)</Label>
                                      <Input 
                                        id={`tool-${toolIndex}-param-defaultValue-${paramIndex}`} 
                                        name="defaultValue" 
                                        value={String(param.defaultValue ?? '')} 
                                        onChange={(e) => handleToolParameterChange(toolIndex, paramIndex, 'defaultValue', e.target.value)} 
                                        placeholder="Ex: metric"
                                      />
                                    </div>
                                    <div className="flex items-center space-x-2 mt-3 md:mt-auto">
                                      <input 
                                        type="checkbox" 
                                        id={`tool-${toolIndex}-param-required-${paramIndex}`} 
                                        name="required" 
                                        checked={param.required} 
                                        onChange={(e) => handleToolParameterChange(toolIndex, paramIndex, 'required', e.target.checked)} 
                                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                      />
                                      <Label htmlFor={`tool-${toolIndex}-param-required-${paramIndex}`} className="text-sm font-medium">
                                        Obrigatório
                                      </Label>
                                    </div>
                                  </div>
                                </Card>
                              ))}
                              <Button variant="outline" size="sm" onClick={() => addToolParameter(toolIndex)} className="mt-3 w-full">
                                Adicionar Novo Parâmetro à Ferramenta #{toolIndex + 1}
                              </Button>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                  <Button onClick={addTool} className="w-full">Adicionar Nova Ferramenta</Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="avancado" className="pt-4">
              {/* Configurações Avançadas */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Configurações Avançadas</CardTitle>
                  <CardDescription>Ajustes detalhados para estruturação de dados, contexto, planejamento e execução.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="inputSchema">Schema de Entrada (JSON)</Label>
                    <Textarea 
                      id="inputSchema" 
                      name="inputSchema" 
                      value={agentState.inputSchema} 
                      onChange={handleInputChange} 
                      placeholder="Defina o schema JSON para a entrada do agente (opcional)" 
                      rows={4} 
                    />
                    <p className="text-sm text-muted-foreground mt-1">Opcional. Define a estrutura JSON esperada para a entrada do agente.</p>
                  </div>
                  <div>
                    <Label htmlFor="outputSchema">Schema de Saída (JSON)</Label>
                    <Textarea 
                      id="outputSchema" 
                      name="outputSchema" 
                      value={agentState.outputSchema} 
                      onChange={handleInputChange} 
                      placeholder="Defina o schema JSON para a saída do agente (opcional)" 
                      rows={4} 
                    />
                    <p className="text-sm text-muted-foreground mt-1">Opcional. Define a estrutura JSON desejada para a saída. Usar isso desabilita ferramentas.</p>
                  </div>
                  <div>
                    <Label htmlFor="outputKey">Chave de Saída</Label>
                    <Input 
                      id="outputKey" 
                      name="outputKey" 
                      value={agentState.outputKey} 
                      onChange={handleInputChange} 
                      placeholder="Ex: found_capital (usado com Schema de Saída)" 
                    />
                    <p className="text-sm text-muted-foreground mt-1">Opcional. Chave para armazenar a saída estruturada no estado da sessão.</p>
                  </div>
                  <div>
                    <Label htmlFor="includeContents">Gerenciamento de Contexto (include_contents)</Label>
                    <Select name="includeContents" value={agentState.includeContents} onValueChange={(value) => handleSelectChange('includeContents', value as 'default' | 'none')}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o modo de contexto" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="default">Padrão (envia histórico relevante)</SelectItem>
                        <SelectItem value="none">Nenhum (agente opera sem histórico)</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-muted-foreground mt-1">Controla se o histórico da conversa é enviado ao LLM.</p>
                  </div>
                  <div>
                    <Label htmlFor="planner">Planejador (Planner)</Label>
                    <Input 
                      id="planner" 
                      name="planner" 
                      value={agentState.planner} 
                      onChange={handleInputChange} 
                      placeholder="Referência/Nome do BasePlanner (opcional)" 
                    />
                    <p className="text-sm text-muted-foreground mt-1">Opcional. Habilita raciocínio multi-etapas.</p>
                  </div>
                  <div>
                    <Label htmlFor="codeExecutor">Executor de Código (CodeExecutor)</Label>
                    <Input 
                      id="codeExecutor" 
                      name="codeExecutor" 
                      value={agentState.codeExecutor} 
                      onChange={handleInputChange} 
                      placeholder="Referência/Nome do BaseCodeExecutor (opcional)" 
                    />
                    <p className="text-sm text-muted-foreground mt-1">Opcional. Permite ao agente executar blocos de código.</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button onClick={handleSubmit} size="lg">Salvar Configuração do Agente</Button>
        </CardFooter>
      </Card>

      {/* Dialog para Editar Descrição do Agente */}
      <Dialog open={isDescriptionDialogOpen} onOpenChange={setIsDescriptionDialogOpen}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>Editar Descrição do Agente</DialogTitle>
            <DialogDescription>
              Forneça uma descrição clara e concisa sobre o que seu agente faz, seus objetivos e suas capacidades.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Textarea
              id="currentEditingDescription"
              value={currentEditingDescription}
              onChange={(e) => setCurrentEditingDescription(e.target.value)}
              placeholder="Descreva o propósito e as capacidades do seu agente..."
              rows={10}
              className="min-h-[200px]"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeDescriptionDialog}>Cancelar</Button>
            <Button onClick={handleSaveDescription}>Salvar Descrição</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog para Editar Instrução Principal */}
      <Dialog open={isInstructionDialogOpen} onOpenChange={setIsInstructionDialogOpen}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>Editar Instrução Principal (Prompt)</DialogTitle>
            <DialogDescription>
              Defina o comportamento central, a persona e as diretrizes operacionais para o seu agente.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Textarea
              id="currentEditingInstruction"
              value={currentEditingInstruction}
              onChange={(e) => setCurrentEditingInstruction(e.target.value)}
              placeholder="Ex: Você é um assistente amigável e eficiente, especializado em fornecer informações sobre produtos de tecnologia..."
              rows={15}
              className="min-h-[300px]"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeInstructionDialog}>Cancelar</Button>
            <Button onClick={handleSaveInstruction}>Salvar Instrução</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog para Adicionar/Editar Ferramenta */}
      {isToolDialogOpen && (
        <Dialog>
          <DialogContent>
            <DialogTitle>Adicionar/Editar Ferramenta</DialogTitle>
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
          </DialogContent>
          <DialogFooter>
            <Button variant="outline" onClick={closeToolDialog}>Cancelar</Button>
            <Button onClick={handleSaveTool}>Salvar Ferramenta</Button>
          </DialogFooter>
        </Dialog>
      )}
    </Card>
  );
};

export default Agentes;
