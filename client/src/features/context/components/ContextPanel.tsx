
import { Avatar, AvatarFallback,AvatarImage } from '@/components/ui/avatar'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator' // Pode ser útil
import { StatusBadge } from '@/components/ui/StatusBadge'

import type { ContextPanelData, ContextPanelProperty } from '@/features/context/types'

interface ContextPanelProps {
  data: ContextPanelData | null
  // isLoading?: boolean;
}

export function ContextPanel({ data }: ContextPanelProps) {
  if (!data) {
    return (
      <div className="flex h-full items-center justify-center p-6 text-center">
        <span className="text-sm font-semibold text-muted-foreground">
          Nenhum item selecionado para exibir detalhes.
        </span>
      </div>
    )
  }

  // Extrair dados para facilitar o uso
  const { title, description, imageUrl, status, properties } = data

  return (
    // O Card em si já deve ter bg-card e bordas apropriadas do shadcn/ui se configurado
    // Adicionamos h-full e overflow-y-auto para garantir que o painel role se o conteúdo for grande
    // e ocupe toda a altura disponível no ResizablePanel do MainLayout.
    // O padding p-6 será aplicado pelo CardContent ou podemos adicionar ao Card se necessário.
    // O ResizablePanel no MainLayout já tem p-6, então o Card pode não precisar de padding adicional.
    // Vamos assumir que o ResizablePanel já cuida do padding externo e o CardContent do interno.
    <Card className="h-full flex flex-col border-0 shadow-none rounded-none">
      {' '}
      {/* Removendo bordas/sombra/raio padrão do Card se ele estiver dentro de um painel já estilizado */}
      <CardHeader className="flex flex-row items-start gap-4 p-6">
        {' '}
        {/* Ajustado para p-6 */}
        {imageUrl && (
          <Avatar className="h-16 w-16">
            {' '}
            {/* Tamanho do Avatar */}
            <AvatarImage src={imageUrl} alt={title} />
            <AvatarFallback>
              {title.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        )}
        <div className="flex-1">
          <CardTitle className="text-lg font-semibold mb-1">{title}</CardTitle>{' '}
          {/* Ajustado para text-lg font-semibold */}{' '}
          {/* Tipografia do Design System */}
          {description && (
            <CardDescription className="text-sm text-muted-foreground mb-2">
              {description}
            </CardDescription>
          )}
          {status && (
            <div className="flex items-center">
              {status.label && (
                <span className="text-xs text-muted-foreground mr-2">
                  {status.label}:
                </span>
              )}
              <StatusBadge
                status={status.text}
                className="text-xs px-2 py-0.5"
              />
              {/* Ajustei o className para text-xs e padding menor para se assemelhar ao size="sm" do Badge anterior */}
              {/* O StatusBadge já lida com a capitalização e ícone. */}
            </div>
          )}
        </div>
      </CardHeader>
      <Separator /> {/* Separador entre header e content */}
      <CardContent className="p-6 flex-1 overflow-y-auto">
        {' '}
        {/* Padding e scroll para o conteúdo */}
        {properties && properties.length > 0 ? (
          <div className="space-y-4">
            {properties.map((prop: ContextPanelProperty, index: number) => (
              <div key={index} className="flex flex-col text-sm">
                <span className="font-medium text-muted-foreground">
                  {prop.label}
                </span>
                <span className="text-foreground mt-0.5">
                  {
                    typeof prop.value === 'string' ||
                    typeof prop.value === 'number'
                      ? prop.value
                      : prop.value /* Assume que é ReactNode */
                  }
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Nenhuma propriedade adicional para exibir.
          </p>
        )}
      </CardContent>
      {/* CardFooter poderia ser usado para ações contextuais no futuro */}
      {/* <CardFooter className="p-6 pt-0">
        <p>Ações aqui...</p>
      </CardFooter> */}
    </Card>
  )
}
