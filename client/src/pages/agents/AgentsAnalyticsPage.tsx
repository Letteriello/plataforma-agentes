import { AgentSubNav } from '@/components/agents/AgentSubNav'; // Added
import { TokenUsageCard } from '@/components/dashboard/TokenUsageCard';

export default function AgentAnalyticsPage() {
  return (
    <>
      <AgentSubNav /> {/* Added */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Analytics</h2>
        <TokenUsageCard data={[]} />
      </div>
    </>
  );
}
