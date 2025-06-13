import React from 'react'

import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { AuditLog } from '@/types/governance'

interface AuditLogTableProps {
  logs: AuditLog[]
}

const formatTimestamp = (isoString: string) => {
  return new Date(isoString).toLocaleString('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'medium',
  })
}

export const AuditLogTable: React.FC<AuditLogTableProps> = ({ logs }) => {
  if (!logs || logs.length === 0) {
    return <p className="text-muted-foreground">Nenhum log de auditoria encontrado.</p>
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Timestamp</TableHead>
          <TableHead>Ator</TableHead>
          <TableHead>Ação</TableHead>
          <TableHead>Detalhes</TableHead>
          <TableHead>IP</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {logs.map((log) => (
          <TableRow key={log.id}>
            <TableCell>{formatTimestamp(log.timestamp)}</TableCell>
            <TableCell>
              <div className="flex flex-col">
                <span className="font-medium">{log.actor.name}</span>
                <Badge variant={log.actor.type === 'user' ? 'secondary' : 'outline'}>
                  {log.actor.type}
                </Badge>
              </div>
            </TableCell>
            <TableCell>
              <Badge variant="default">{log.action}</Badge>
            </TableCell>
            <TableCell>
              <pre className="text-xs bg-muted p-2 rounded-md overflow-x-auto">
                {JSON.stringify(log.details, null, 2)}
              </pre>
            </TableCell>
            <TableCell>{log.ipAddress || 'N/A'}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
