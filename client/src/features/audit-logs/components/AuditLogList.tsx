import React from 'react'

import { AuditLog } from '@/types/common'

interface AuditLogListProps {
  logs: AuditLog[]
}

export const AuditLogList: React.FC<AuditLogListProps> = ({ logs }) => {
  return (
    <div className="border rounded-lg">
      <table className="min-w-full divide-y divide-border">
        <thead className="bg-muted/50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Timestamp
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Ator
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Ação
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Detalhes
            </th>
          </tr>
        </thead>
        <tbody className="bg-background divide-y divide-border">
          {logs.length === 0 ? (
            <tr>
              <td
                colSpan={4}
                className="px-4 py-8 text-center text-muted-foreground"
              >
                Nenhum log de auditoria encontrado.
              </td>
            </tr>
          ) : (
            logs.map((log) => (
              <tr key={log.id}>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-muted-foreground">
                  {new Date(log.timestamp).toLocaleString()}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm">
                  <div className="font-medium">{log.actor.name}</div>
                  <div className="text-xs text-muted-foreground">
                    ({log.actor.type}: {log.actor.id})
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm font-mono bg-muted/30 rounded-sm">
                  {log.action}
                </td>
                <td className="px-4 py-4 text-sm text-muted-foreground font-mono">
                  <pre className="text-xs bg-muted/20 p-2 rounded">
                    {JSON.stringify(log.details, null, 2)}
                  </pre>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      {/* Pagination controls will go here */}
    </div>
  )
}
