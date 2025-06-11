import React, { useState, useEffect } from 'react'
import { AuditLogList } from '@/components/audit-logs/AuditLogList'
import { AuditLog } from '@/types/auditLog'

export const AuditLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([])

  // TODO: Fetch logs from API
  useEffect(() => {
    // setLogs(fetchedLogs);
  }, [])

  return (
    <div className="p-6 space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">Logs de Auditoria</h2>
        <p className="text-muted-foreground">
          Visualize o registro imutável de todas as ações realizadas na
          plataforma.
        </p>
      </div>
      <section>
        {/* TODO: Add filter components here */}
        <AuditLogList logs={logs} />
      </section>
    </div>
  )
}

export default AuditLogsPage // Add default export
