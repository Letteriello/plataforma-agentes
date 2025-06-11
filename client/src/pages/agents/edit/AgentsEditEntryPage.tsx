import { useParams } from 'react-router-dom'
import { AgentEditor } from '@/components/agents/AgentEditor'
import { AgentsLayout } from '@/components/agents/AgentsLayout'

export function EditAgentPage() {
  const { id } = useParams<{ id: string }>()

  return (
    <AgentsLayout>
      <AgentEditor mode="edit" />
    </AgentsLayout>
  )
}

export default EditAgentPage
