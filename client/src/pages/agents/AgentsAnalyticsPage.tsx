import { AgentSubNav } from '@/features/agents/components/AgentSubNav'; // Added
import { TokenUsageCard } from '@/features/dashboard/components/TokenUsageCard';

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
