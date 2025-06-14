
import type { ContextPanelData } from '@/features/context/types'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select' // Supondo que Select está em ui/select

interface AgentSelectorProps {
  agents: Pick<ContextPanelData, 'id' | 'title'>[] // Apenas ID e título são necessários
  selectedAgentId: string | null
  onSelectAgent: (agentId: string | null) => void // Callback para atualizar o ID selecionado
  className?: string
}

export function AgentSelector({
  agents,
  selectedAgentId,
  onSelectAgent,
  className,
}: AgentSelectorProps) {
  const handleValueChange = (value: string) => {
    // O componente Select do shadcn/ui retorna a string do valor.
    // Se tivermos um item para "Nenhum", seu valor pode ser uma string específica.
    onSelectAgent(value === 'none' ? null : value)
  }

  return (
    <div className={className}>
      <Select
        value={selectedAgentId || 'none'} // "none" como valor para placeholder se selectedAgentId for null
        onValueChange={handleValueChange}
      >
        <SelectTrigger className="w-[280px]">
          {' '}
          {/* Largura pode ser ajustada */}
          <SelectValue placeholder="Selecione um Agente..." />
        </SelectTrigger>
        <SelectContent>
          {/* Opção para desmarcar ou mostrar placeholder */}
          {/* <SelectItem value="none">Nenhum Agente Selecionado</SelectItem> */}
          {agents.map((agent) => (
            <SelectItem key={agent.id} value={agent.id}>
              {agent.title}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
