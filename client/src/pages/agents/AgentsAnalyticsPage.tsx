import { AgentsLayout } from '@/components/agents/AgentsLayout'
import { TokenUsageCard } from '@/components/dashboard/TokenUsageCard'

export default function AgentAnalyticsPage() {
  return (
    <AgentsLayout>
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Analytics</h2>
        <TokenUsageCard data={[]} />
      </div>
    </AgentsLayout>
  )
}
