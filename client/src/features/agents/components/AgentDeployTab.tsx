// client/src/components/agents/AgentDeployTab.tsx
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export default function AgentDeployTab() {
  const endpoint = '/api/v1/agents/{agentId}/invoke'

  return (
    <Card>
      <CardHeader>
        <CardTitle>Deploy</CardTitle>
        <CardDescription>
          Promote this agent and view its API endpoint.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-sm text-muted-foreground">Endpoint:</p>
        <pre className="bg-muted p-2 rounded text-sm font-mono">{endpoint}</pre>
      </CardContent>
    </Card>
  )
}
