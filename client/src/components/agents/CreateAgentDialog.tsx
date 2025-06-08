import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AgentType } from '@/types/agent';

interface CreateAgentDialogProps {
  onConfirm: (name: string, type: AgentType) => void;
}

export const CreateAgentDialog = ({ onConfirm }: CreateAgentDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [agentName, setAgentName] = useState('');
  const [agentType, setAgentType] = useState<AgentType>(AgentType.LLM);

  const handleConfirm = () => {
    if (agentName.trim()) {
      onConfirm(agentName, agentType);
      setIsOpen(false);
      setAgentName('');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>+ Criar Agente</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Criar Novo Agente</DialogTitle>
          <DialogDescription>
            Dê um nome e escolha o tipo do seu agente para começar a configuração.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Nome
            </Label>
            <Input
              id="name"
              value={agentName}
              onChange={(e) => setAgentName(e.target.value)}
              className="col-span-3"
              placeholder="Ex: Agente de Atendimento"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="type" className="text-right">
              Tipo
            </Label>
            <div className="col-span-3">
              <Select value={agentType} onValueChange={(v) => setAgentType(v as AgentType)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={AgentType.LLM}>Agente LLM</SelectItem>
                  <SelectItem value={AgentType.Sequential}>Workflow Sequencial</SelectItem>
                  <SelectItem value={AgentType.Parallel}>Workflow Paralelo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleConfirm} disabled={!agentName.trim()}>
            Criar e Configurar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateAgentDialog;
