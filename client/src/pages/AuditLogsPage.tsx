import React, { useState, useEffect } from 'react'
import { AuditLogList } from '@/components/audit-logs/AuditLogList'
import { AuditLog } from '@/types/auditLog'
import { listAuditLogs } from '@/api/auditLogService'
import { toast } from '@/components/ui/use-toast'

export const AuditLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAuditLogs = async () => {
      try {
        setIsLoading(true)
        const data = await listAuditLogs()
        setLogs(data)
        setError(null)
      } catch (err) {
        const errorMessage = 'Falha ao carregar os logs de auditoria.'
        setError(errorMessage)
        toast({ variant: 'destructive', title: 'Erro', description: errorMessage })
      } finally {
        setIsLoading(false)
      }
    }

    fetchAuditLogs()
  }, [])

  return (
    <div className="p-6 space-y-8">
      <header>
        <h2 className="text-3xl font-bold tracking-tight">Logs de Auditoria</h2>
        <p className="text-muted-foreground mt-1">
          Visualize o registro imutável de todas as ações realizadas na
          plataforma.
        </p>
      </header>
      <section>
        {/* TODO: Add filter components here */}
        {isLoading ? (
          <div className="text-center py-8">Carregando logs...</div>
        ) : error ? (
          <div className="text-center py-8 text-destructive">{error}</div>
        ) : (
          <AuditLogList logs={logs} />
        )}
      </section>
    </div>
  )
}

export default AuditLogsPage
