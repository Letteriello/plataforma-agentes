import { FileCode, FileImage,FileText, Trash2 } from 'lucide-react'
import React from 'react'

import { Document, DocumentStatus } from '@/api/memoryService'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface DocumentsTableProps {
  documents: Document[]
  onDeleteDocument?: (documentId: string) => void
}

export function DocumentsTable({
  documents,
  onDeleteDocument,
}: DocumentsTableProps) {
  // Função para determinar o ícone com base no tipo de conteúdo
  const getFileIcon = (contentType?: string) => {
    if (!contentType) return <FileText className="h-4 w-4" />

    if (contentType.includes('image')) {
      return <FileImage className="h-4 w-4" />
    } else if (
      contentType.includes('application/json') ||
      contentType.includes('text/html')
    ) {
      return <FileCode className="h-4 w-4" />
    } else {
      return <FileText className="h-4 w-4" />
    }
  }

  // Função para determinar a variante do badge com base no status
  const getStatusVariant = (status: DocumentStatus) => {
    switch (status) {
      case 'Processando':
        return 'outline'
      case 'Processado':
        return 'default'
      case 'Erro':
        return 'destructive'
      default:
        return 'secondary'
    }
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Tamanho</TableHead>
            <TableHead>Data de Upload</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {documents.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={5}
                className="text-center py-6 text-muted-foreground"
              >
                Nenhum documento encontrado
              </TableCell>
            </TableRow>
          ) : (
            documents.map((doc) => (
              <TableRow key={doc.id}>
                <TableCell>
                  <div className="flex items-center">
                    {getFileIcon(doc.contentType)}
                    <span className="ml-2">{doc.name}</span>
                  </div>
                </TableCell>
                <TableCell>{doc.size}</TableCell>
                <TableCell>
                  {new Date(doc.uploadDate).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                  })}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={getStatusVariant(doc.status as DocumentStatus)}
                  >
                    {doc.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  {onDeleteDocument && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeleteDocument(doc.id)}
                      disabled={doc.status === 'Processando'}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Excluir</span>
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
