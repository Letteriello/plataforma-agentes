import axios from 'axios'
import React, { useEffect,useState } from 'react'

import { listAuditLogs } from '@/api/auditLogService'
import { AuditLogList } from '@/components/audit-logs/AuditLogList'
import { useToast } from '@/components/ui/use-toast'
import { AuditLog } from '@/types/auditLog'

interface ApiErrorResponse {
  detail?: string
}

export const AuditLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const fetchAuditLogs = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const data = await listAuditLogs()
        setLogs(data)
      } catch (err) {
        let errorMessage = 'Falha ao carregar os logs de auditoria.'
        if (axios.isAxiosError(err) && err.response) {
          const errorData = err.response.data as ApiErrorResponse
          errorMessage = `${errorMessage} Detalhes: ${
            errorData.detail || err.message
          }`
        }
        setError(errorMessage)
        toast({
          variant: 'destructive',
          title: 'Erro de Auditoria',
          description: errorMessage,
        })
      } finally {
        setIsLoading(false)
      }
    }

    void fetchAuditLogs()
  }, [toast])

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
