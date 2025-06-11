import React from 'react'
import { ApprovalItem } from '../../types/governance'

interface ApprovalInboxProps {
  items: ApprovalItem[]
  onApprove: (id: string) => void
  onReject: (id: string) => void
  onViewHistory?: (id: string) => void
}

export const ApprovalInbox: React.FC<ApprovalInboxProps> = ({
  items,
  onApprove,
  onReject,
  onViewHistory,
}) => {
  return (
    <div className="space-y-4">
      {items.length === 0 ? (
        <div className="text-muted-foreground">Nenhuma aprovação pendente.</div>
      ) : (
        items.map((item) => (
          <div
            key={item.id}
            className="border rounded p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-background"
          >
            <div>
              <div className="font-semibold">{item.agentName}</div>
              <div className="text-sm text-muted-foreground">
                Ação: {item.action}
              </div>
              <div className="text-xs mt-1">{item.context}</div>
              <div className="text-xs text-muted-foreground mt-1">
                Criado em: {new Date(item.createdAt).toLocaleString()}
              </div>
            </div>
            <div className="flex gap-2 items-center">
              <button
                className="btn btn-success"
                onClick={() => onApprove(item.id)}
              >
                Aprovar
              </button>
              <button
                className="btn btn-destructive"
                onClick={() => onReject(item.id)}
              >
                Rejeitar
              </button>
              {onViewHistory && (
                <button
                  className="btn btn-outline"
                  onClick={() => onViewHistory(item.id)}
                >
                  Histórico
                </button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  )
}
