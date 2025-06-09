import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Pencil } from 'lucide-react';
import { AgentType } from '@/types/agent';

interface AgentBasicInfoFormProps {
  name: string;
  description: string;
  type: AgentType;
  onNameChange: (name: string) => void;
  onEditDescription: () => void; // Callback to open the dialog in parent
  onTypeChange: (type: AgentType) => void;
}

const AgentBasicInfoForm: React.FC<AgentBasicInfoFormProps> = ({
  name,
  description,
  type,
  onNameChange,
  onEditDescription,
  onTypeChange,
}) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-gray-900">Informações Básicas</h2>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="agent-name">Nome do Agente</Label>
          <Input
            id="agent-name"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
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
                    onClick={onEditDescription}
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
            value={description}
            placeholder="Descreva o que seu agente faz, suas capacidades e quaisquer características notáveis."
            className="min-h-[80px] mt-1"
            readOnly // Description is edited via dialog
          />
        </div>

        <div>
          <Label htmlFor="agent-type">Tipo de Agente</Label>
          <Select
            value={type}
            onValueChange={(value) => onTypeChange(value as AgentType)}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Selecione o tipo de agente" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={AgentType.LLM}>LLM Agent</SelectItem>
              <SelectItem value={AgentType.SEQUENTIAL}>Sequential Agent</SelectItem>
              <SelectItem value={AgentType.A2A}>A2A Agent</SelectItem>
              <SelectItem value={AgentType.PARALLEL}>Parallel Agent</SelectItem>
              {/* Add other agent types as needed */}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default AgentBasicInfoForm;
