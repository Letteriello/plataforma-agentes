

export interface ContextPanelProperty {
  label: string
  value: string | number | React.ReactNode // Permitir ReactNode para valores mais ricos
}

export type ContextPanelStatus =
  | 'active'
  | 'inactive'
  | 'pending'
  | 'error'
  | 'success'
  | 'warning'
  | 'info'

export interface ContextPanelData {
  id: string // Um identificador único para o item em contexto
  title: string
  description?: string
  imageUrl?: string // URL para uma imagem (avatar, ícone do item)
  status?: {
    text: ContextPanelStatus
    label?: string // Ex: "Status", "Disponibilidade"
  }
  properties?: ContextPanelProperty[]
  // Poderíamos adicionar mais campos conforme necessário, como ações (botões)
  // actions?: Array<{ label: string; onClick: () => void; variant?: string }>;
}

// Exemplo de como poderia ser usado:
// const agentContextData: ContextPanelData = {
//   id: 'agent-007',
//   title: 'Agente Alpha',
//   description: 'Agente especializado em análise de dados e relatórios.',
//   imageUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=alpha',
//   status: { text: 'active', label: 'Disponibilidade' },
//   properties: [
//     { label: 'Última Atividade', value: '2025-06-06 10:30' },
//     { label: 'Tarefas Atribuídas', value: 5 },
//     { label: 'Modelo IA', value: 'Nexus-GPT-4o' },
//   ],
// };
