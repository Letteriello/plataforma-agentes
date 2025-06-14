import { Database, FileText, Settings,Upload } from 'lucide-react'
import React from 'react'

import { KnowledgeBase, KnowledgeBaseType } from '@/features/memoria/services/memoryService'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

interface KnowledgeBaseCardProps {
  knowledgeBase: KnowledgeBase
  onAddDocument?: (knowledgeBaseId: string) => void
  onConfigure?: (knowledgeBaseId: string) => void
}

export function KnowledgeBaseCard({
  knowledgeBase,
  onAddDocument,
  onConfigure,
}: KnowledgeBaseCardProps) {
  const isRAG = knowledgeBase.type === KnowledgeBaseType.RAG

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{knowledgeBase.name}</CardTitle>
            <CardDescription className="mt-1 line-clamp-2">
              {knowledgeBase.description}
            </CardDescription>
          </div>
          <Badge variant={isRAG ? 'default' : 'secondary'}>
            {knowledgeBase.type}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="text-sm text-muted-foreground">
          {isRAG ? (
            <div className="flex items-center">
              <FileText className="mr-2 h-4 w-4" />
              <span>{knowledgeBase.documents} documentos</span>
            </div>
          ) : (
            <div className="flex items-center">
              <Database className="mr-2 h-4 w-4" />
              <span>Base: {knowledgeBase.baseModel}</span>
            </div>
          )}
          <div className="mt-1">
            Última atualização:{' '}
            {new Date(knowledgeBase.updatedAt).toLocaleDateString('pt-BR')}
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <div className="flex justify-between w-full">
          {isRAG && onAddDocument && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onAddDocument(knowledgeBase.id)}
            >
              <Upload className="mr-2 h-4 w-4" />
              Adicionar Documento
            </Button>
          )}
          {onConfigure && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onConfigure(knowledgeBase.id)}
              className={isRAG ? 'ml-auto' : ''}
            >
              <Settings className="mr-2 h-4 w-4" />
              Configurar
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}
