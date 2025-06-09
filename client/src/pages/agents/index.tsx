import { AgentsDashboard } from '@/components/agents/AgentsDashboard';
import { AgentsLayout } from '@/components/agents/AgentsLayout';

export function AgentsPage() {
  return (
    <AgentsLayout>
      <AgentsDashboard />
    </AgentsLayout>
  );
}

export default AgentsPage;
