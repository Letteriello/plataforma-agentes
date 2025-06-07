import React, { useState } from 'react';
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ToolSelector } from '@/components/agents/tools';

// Assuming shadcn/ui components are available.
// For now, let's use a placeholder div if Card is not found by the linter.
// import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'; // Example import

interface AgentConfiguratorProps {
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
