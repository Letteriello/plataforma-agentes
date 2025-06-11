import React from 'react'

interface ApprovalItemCardProps {
  agentName: string
  action: string
  context: string
  status: 'pending' | 'approved' | 'rejected'
  createdAt: string
  onApprove: () => void
  onReject: () => void
  onViewHistory?: () => void
}

export const ApprovalItemCard: React.FC<ApprovalItemCardProps> = ({
  agentName,
  action,
  context,
  status,
  createdAt,
  onApprove,
  onReject,
  onViewHistory,
}) => {
  return (
    <div
      className={`border rounded p-4 bg-background flex flex-col gap-2 ${status === 'pending' ? '' : 'opacity-60'}`}
    >
      <div className="font-semibold">{agentName}</div>
      <div className="text-sm text-muted-foreground">Ação: {action}</div>
      <div className="text-xs">{context}</div>
      <div className="text-xs text-muted-foreground">
        Criado em: {new Date(createdAt).toLocaleString()}
      </div>
      <div className="flex gap-2 mt-2">
        {status === 'pending' && (
          <>
            <button className="btn btn-success" onClick={onApprove}>
              Aprovar
            </button>
            <button className="btn btn-destructive" onClick={onReject}>
              Rejeitar
            </button>
          </>
        )}
        {onViewHistory && (
          <button className="btn btn-outline" onClick={onViewHistory}>
            Histórico
          </button>
        )}
      </div>
    </div>
  )
}
