import React, { useState, useEffect } from 'react'
import {
  AutonomySpectrumSelector,
  AutonomyLevel,
} from '../components/governance/AutonomySpectrumSelector'
import { ApprovalInbox } from '../components/governance/ApprovalInbox'
import { ApprovalHistoryModal } from '../components/governance/ApprovalHistoryModal'
import { AuditLogTable } from '@/components/governance/AuditLogTable' // Import the new component
import { ApprovalItem, HistoryItem, AuditLog } from '@/types/governance'
import { useToast } from '@/components/ui/use-toast'
import {
  getAutonomyLevel,
  setAutonomyLevel as apiSetAutonomyLevel,
  getPendingApprovals,
  approveAction,
  rejectAction,
  getApprovalHistory,
  getAuditLogs, // Import the new service function
} from '@/api/governanceService'

const GovernancePage: React.FC = () => {
  const { toast } = useToast()
  const [autonomyLevel, setAutonomyLevel] =
    useState<AutonomyLevel>('Semi-Autônomo')
  const [approvals, setApprovals] = useState<ApprovalItem[]>([])
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]) // Add state for audit logs
  const [isHistoryModalOpen, setHistoryModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      setIsLoading(true)
      const [autonomyData, approvalsData, historyData, auditLogsData] = await Promise.all([
        getAutonomyLevel(),
        getPendingApprovals(),
        getApprovalHistory(),
        getAuditLogs(), // Fetch audit logs
      ])
      setAutonomyLevel(autonomyData.autonomyLevel)
      setApprovals(approvalsData)
      setHistory(historyData)
      setAuditLogs(auditLogsData) // Set audit logs state
      setError(null)
    } catch (err) {
      setError('Falha ao carregar os dados de governança.')
      toast({ variant: 'destructive', title: 'Erro', description: 'Não foi possível buscar os dados do servidor.' })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSetAutonomyLevel = async (level: AutonomyLevel) => {
    try {
      await apiSetAutonomyLevel(level)
      setAutonomyLevel(level)
      toast({ title: 'Sucesso', description: `Nível de autonomia definido para ${level}.` })
    } catch (error) {
      toast({ variant: 'destructive', title: 'Erro', description: 'Falha ao atualizar o nível de autonomia.' })
    }
  }

  const handleApprove = async (id: string) => {
    try {
      await approveAction(id)
      toast({ title: 'Ação Aprovada', description: 'A ação do agente foi aprovada com sucesso.' })
      fetchData() // Refresh data
    } catch (error) {
      toast({ variant: 'destructive', title: 'Erro', description: 'Falha ao aprovar a ação.' })
    }
  }

  const handleReject = async (id: string) => {
    const reason = prompt('Por favor, informe o motivo da rejeição:')
    if (reason && reason.trim() !== '') {
      try {
        await rejectAction(id, reason)
        toast({ variant: 'default', title: 'Ação Rejeitada', description: 'A ação do agente foi rejeitada.' })
        fetchData() // Refresh data
      } catch (error) {
        toast({ variant: 'destructive', title: 'Erro', description: 'Falha ao rejeitar a ação.' })
      }
    } else if (reason !== null) {
      toast({ variant: 'destructive', title: 'Atenção', description: 'O motivo da rejeição não pode estar em branco.' })
    }
  }

  const handleViewHistory = () => {
    setHistoryModalOpen(true)
  }

  return (
    <div className="p-6 space-y-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">
          Governança e Autonomia
        </h2>
      </div>

      <section>
        <div className="space-y-2">
          <h3 className="text-xl font-semibold tracking-tight">
            Espectro de Autonomia do Agente
          </h3>
          <p className="text-muted-foreground">
            Configure o nível de autonomia para a execução de tarefas dos agentes.
          </p>
        </div>
        <div className="mt-4">
          <AutonomySpectrumSelector
            value={autonomyLevel}
            onChange={handleSetAutonomyLevel}
          />
        </div>
      </section>

      <section>
        <div className="space-y-2">
          <h3 className="text-xl font-semibold tracking-tight">
            Caixa de Aprovações Pendentes
          </h3>
          <p className="text-muted-foreground">
            Revise e aprove ou rejeite as ações dos agentes que requerem
            supervisão humana.
          </p>
        </div>
        <div className="mt-4">
          {isLoading ? (
            <p>Carregando aprovações...</p>
          ) : error ? (
            <p className="text-destructive">{error}</p>
          ) : (
            <ApprovalInbox
              items={approvals}
              onApprove={handleApprove}
              onReject={handleReject}
              onViewHistory={handleViewHistory}
            />
          )}
        </div>
      </section>

      <ApprovalHistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setHistoryModalOpen(false)}
        history={history}
      />

      <section>
        <div className="space-y-2">
          <h3 className="text-xl font-semibold tracking-tight">
            Painel de Logs de Auditoria
          </h3>
          <p className="text-muted-foreground">
            Visualize todas as ações importantes realizadas por usuários e agentes na plataforma.
          </p>
        </div>
        <div className="mt-4">
        {isLoading ? (
            <p>Carregando logs de auditoria...</p>
          ) : error ? (
            <p className="text-destructive">{error}</p>
          ) : (
            <AuditLogTable logs={auditLogs} />
          )}
        </div>
      </section>
    </div>
  )
}

export default GovernancePage;
