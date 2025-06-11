import React from 'react'
import { ApprovalItem } from '../../types/governance'
import { Button } from '@/components/ui/button'

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
            <div className="flex gap-2 items-center flex-shrink-0">
              <Button size="sm" onClick={() => onApprove(item.id)}>
                Aprovar
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onReject(item.id)}
              >
                Rejeitar
              </Button>
              {onViewHistory && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onViewHistory(item.id)}
                >
                  Histórico
                </Button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  )
}
