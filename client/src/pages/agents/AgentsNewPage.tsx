import { AgentEditor } from '@/components/agents/AgentEditor'
import { AgentsLayout } from '@/components/agents/AgentsLayout'

export function NewAgentPage() {
  return (
    <AgentsLayout>
      <AgentEditor mode="create" />
    </AgentsLayout>
  )
}

export default NewAgentPage
