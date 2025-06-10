import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useChatStore } from '@/store/chatStore';

export function AgentWorkspace() {
  const { activeArtifact } = useChatStore();

  const renderArtifact = () => {
    if (!activeArtifact) {
      return <p className="text-sm text-muted-foreground">Nenhum artefato para exibir.</p>;
    }

    switch (activeArtifact.type) {
      case 'code':
        return (
          <pre className="p-4 bg-muted rounded-md text-sm whitespace-pre-wrap">
            {activeArtifact.content}
          </pre>
        );
      case 'table':
        return <p>Renderização de Tabela aqui.</p>;
      case 'chart':
        return <p>Renderização de Gráfico aqui.</p>;
      default:
        return <p className="text-sm text-muted-foreground">Tipo de artefato não suportado.</p>;
    }
  };

  return (
    <Card className="h-full border-0 rounded-none">
      <CardHeader>
        <CardTitle>Área de Trabalho</CardTitle>
      </CardHeader>
      <CardContent>{renderArtifact()}</CardContent>
    </Card>
  );
}
