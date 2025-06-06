// client/src/components/context/ContextPanel.tsx
import React from 'react';
import { ContextPanelData, ContextPanelProperty } from './types';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator'; // Pode ser útil

interface ContextPanelProps {
  data: ContextPanelData | null;
  // isLoading?: boolean; 
}

// Função auxiliar para mapear status para variantes de Badge (pode ser expandida)
// Conforme o design_system.md: accent (ciano/verde) para online/sucesso, primary (azul) para default/info
// destructive (vermelho) para erro. Cinza (secondary) para inativo/pendente.
const getStatusBadgeVariant = (statusText?: ContextPanelData['status']['text']): React.ComponentProps<typeof Badge>['variant'] => {
  if (!statusText) return 'secondary';
  switch (statusText) {
    case 'active':
    case 'success':
      return 'default'; // Usar 'default' (accent/verde do Nexus) - precisa configurar no Tailwind
    case 'inactive':
      return 'secondary';
    case 'pending':
    case 'warning':
      return 'outline'; // Ou uma variante amarela customizada
    case 'error':
      return 'destructive';
    case 'info':
    default:
      return 'default'; // Usar 'default' (primary/azul do Nexus)
  }
};


export function ContextPanel({ data }: ContextPanelProps) {
  if (!data) {
    return (
      <div className="flex h-full items-center justify-center p-6 text-center">
        <span className="text-sm font-semibold text-muted-foreground">
          Nenhum item selecionado para exibir detalhes.
        </span>
      </div>
    );
  }

  // Extrair dados para facilitar o uso
  const { id, title, description, imageUrl, status, properties } = data;

  return (
    // O Card em si já deve ter bg-card e bordas apropriadas do shadcn/ui se configurado
    // Adicionamos h-full e overflow-y-auto para garantir que o painel role se o conteúdo for grande
    // e ocupe toda a altura disponível no ResizablePanel do MainLayout.
    // O padding p-6 será aplicado pelo CardContent ou podemos adicionar ao Card se necessário.
    // O ResizablePanel no MainLayout já tem p-6, então o Card pode não precisar de padding adicional.
    // Vamos assumir que o ResizablePanel já cuida do padding externo e o CardContent do interno.
    <Card className="h-full flex flex-col border-0 shadow-none rounded-none"> {/* Removendo bordas/sombra/raio padrão do Card se ele estiver dentro de um painel já estilizado */}
      <CardHeader className="flex flex-row items-start gap-4 p-6"> {/* Ajustado para p-6 */}
        {imageUrl && (
          <Avatar className="h-16 w-16"> {/* Tamanho do Avatar */}
            <AvatarImage src={imageUrl} alt={title} />
            <AvatarFallback>{title.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
        )}
        <div className="flex-1">
          <CardTitle className="text-lg font-semibold mb-1">{title}</CardTitle> {/* Ajustado para text-lg font-semibold */} {/* Tipografia do Design System */}
          {description && (
            <CardDescription className="text-sm text-muted-foreground mb-2">{description}</CardDescription>
          )}
          {status && (
            <div className="flex items-center">
              {status.label && <span className="text-xs text-muted-foreground mr-2">{status.label}:</span>}
              <Badge variant={getStatusBadgeVariant(status.text)} size="sm">
                {status.text.charAt(0).toUpperCase() + status.text.slice(1)}
              </Badge>
            </div>
          )}
        </div>
      </CardHeader>

      <Separator /> {/* Separador entre header e content */}

      <CardContent className="p-6 flex-1 overflow-y-auto"> {/* Padding e scroll para o conteúdo */}
        {properties && properties.length > 0 ? (
          <div className="space-y-4">
            {properties.map((prop: ContextPanelProperty, index: number) => (
              <div key={index} className="flex flex-col text-sm">
                <span className="font-medium text-muted-foreground">{prop.label}</span>
                <span className="text-foreground mt-0.5">
                  {typeof prop.value === 'string' || typeof prop.value === 'number' 
                    ? prop.value 
                    : prop.value /* Assume que é ReactNode */}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Nenhuma propriedade adicional para exibir.</p>
        )}
      </CardContent>
      
      {/* CardFooter poderia ser usado para ações contextuais no futuro */}
      {/* <CardFooter className="p-6 pt-0">
        <p>Ações aqui...</p>
      </CardFooter> */}
    </Card>
  );
}
