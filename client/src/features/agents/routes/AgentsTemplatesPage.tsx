import { AgentSubNav } from '@/features/agents/components/AgentSubNav'; // Added
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AgentTemplatesPage() {
  return (
    <>
      <AgentSubNav /> {/* Added */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Template Exemplo</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Breve descri\u00e7\u00e3o do template.
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
