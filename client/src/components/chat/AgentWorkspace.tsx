import { useChatStore } from '@/store/chatStore'

export function AgentWorkspace() {
  const { activeArtifact } = useChatStore()

  const renderArtifact = () => {
    if (!activeArtifact) {
      return (
        <p className="text-sm text-muted-foreground">
          Nenhum artefato para exibir.
        </p>
      )
    }

    switch (activeArtifact.type) {
      case 'code':
        return (
          <pre className="p-4 bg-muted rounded-md text-sm whitespace-pre-wrap">
            {activeArtifact.content}
          </pre>
        )
      case 'table':
        return <p>Renderização de Tabela aqui.</p> // Placeholder
      case 'chart':
        return <p>Renderização de Gráfico aqui.</p> // Placeholder
      default:
        return (
          <p className="text-sm text-muted-foreground">
            Tipo de artefato não suportado.
          </p>
        )
    }
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-3 border-b">
        {' '}
        {/* Added border-b for separation like CardHeader */}
        <h2 className="text-lg font-semibold">Área de Trabalho</h2>
      </div>
      <div className="p-3 flex-1 overflow-y-auto">{renderArtifact()}</div>
    </div>
  )
}
