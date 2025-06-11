import React, { useState, useEffect } from 'react'
import {
  AutonomySpectrumSelector,
  AutonomyLevel,
} from '../components/governance/AutonomySpectrumSelector'
import { ApprovalInbox } from '../components/governance/ApprovalInbox'
import { ApprovalHistoryModal } from '../components/governance/ApprovalHistoryModal'
import { ApprovalItem, HistoryItem } from '@/types/governance'

export const GovernancePage: React.FC = () => {
  const [autonomyLevel, setAutonomyLevel] =
    useState<AutonomyLevel>('Semi-Autônomo')
  const [approvals, setApprovals] = useState<ApprovalItem[]>([])
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [isHistoryModalOpen, setHistoryModalOpen] = useState(false)

  // TODO: Fetch initial data from API
  useEffect(() => {
    // setApprovals(fetchedApprovals);
    // setHistory(fetchedHistory);
  }, [])

  const handleApprove = (id: string) => {
    // TODO: API call to approve
    setApprovals(approvals.filter((item) => item.id !== id))
  }

  const handleReject = (id: string) => {
    // TODO: API call to reject
    setApprovals(approvals.filter((item) => item.id !== id))
  }

  const handleViewHistory = () => {
    // TODO: Potentially fetch fresh history data here
    setHistoryModalOpen(true)
  }

  return (
    <div className="p-6 space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">Governança e Autonomia</h2>
      </div>

      <section>
        <h3 className="text-xl font-semibold mb-3">
          Espectro de Autonomia do Agente
        </h3>
        <p className="text-muted-foreground mb-4">
          Configure o nível de autonomia para a execução de tarefas dos agentes.
        </p>
        <AutonomySpectrumSelector
          value={autonomyLevel}
          onChange={setAutonomyLevel}
        />
      </section>

      <section>
        <h3 className="text-xl font-semibold mb-3">
          Caixa de Aprovações Pendentes
        </h3>
        <p className="text-muted-foreground mb-4">
          Revise e aprove ou rejeite as ações dos agentes que requerem
          supervisão humana.
        </p>
        <ApprovalInbox
          items={approvals}
          onApprove={handleApprove}
          onReject={handleReject}
          onViewHistory={handleViewHistory}
        />
      </section>

      <ApprovalHistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setHistoryModalOpen(false)}
        history={history}
      />
    </div>
  )
}
