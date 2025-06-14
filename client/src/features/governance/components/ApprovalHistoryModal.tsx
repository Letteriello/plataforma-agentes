import React from 'react'

interface ApprovalHistoryItem {
  date: string
  user: string
  action: 'approved' | 'rejected'
  comment?: string
}

interface ApprovalHistoryModalProps {
  isOpen: boolean
  onClose: () => void
  history: ApprovalHistoryItem[]
}

export const ApprovalHistoryModal: React.FC<ApprovalHistoryModalProps> = ({
  isOpen,
  onClose,
  history,
}) => {
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-background rounded shadow-lg w-full max-w-md p-6 relative">
        <button
          className="absolute top-2 right-2 btn btn-sm btn-outline"
          onClick={onClose}
          aria-label="Fechar"
        >
          ×
        </button>
        <h3 className="font-semibold mb-4">Histórico de Aprovações</h3>
        <ul className="space-y-2">
          {history.length === 0 ? (
            <li className="text-muted-foreground">
              Nenhum histórico disponível.
            </li>
          ) : (
            history.map((item, idx) => (
              <li key={idx} className="border rounded p-2 flex flex-col">
                <div className="flex justify-between text-xs">
                  <span>{new Date(item.date).toLocaleString()}</span>
                  <span>{item.user}</span>
                </div>
                <div
                  className={`mt-1 font-semibold ${item.action === 'approved' ? 'text-green-600' : 'text-red-600'}`}
                >
                  {item.action === 'approved' ? 'Aprovado' : 'Rejeitado'}
                </div>
                {item.comment && (
                  <div className="text-xs mt-1">Comentário: {item.comment}</div>
                )}
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  )
}
