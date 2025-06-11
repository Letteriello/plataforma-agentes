import { AgentsDashboard } from '@/components/agents/AgentsDashboard';
import { AgentSubNav } from '@/components/agents/AgentSubNav'; // Added

export function AgentsPage() {
  return (
    <>
      <AgentSubNav /> {/* Added */}
      <AgentsDashboard />
    </>
  );
}

export default AgentsPage;
