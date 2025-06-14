import { AgentsDashboard } from '@/features/agents/components/AgentsDashboard';
import { AgentSubNav } from '@/features/agents/components/AgentSubNav'; // Added

export function AgentsPage() {
  return (
    <>
      <AgentSubNav /> {/* Added */}
      <AgentsDashboard />
    </>
  );
}

export default AgentsPage;
