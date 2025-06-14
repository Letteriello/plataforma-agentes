import React from 'react'

import { Secret } from '@/types/common'

interface SecretListProps {
  secrets: Secret[]
  onAdd: () => void
  onEdit: (secret: Secret) => void
  onDelete: (id: string) => void
}

export const SecretList: React.FC<SecretListProps> = ({
  secrets,
  onAdd,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="border rounded-lg">
      <div className="p-4 border-b flex justify-between items-center">
        <h3 className="font-semibold">Credenciais Salvas</h3>
        <button className="btn btn-primary" onClick={onAdd}>
          Adicionar Nova
        </button>
      </div>
      <table className="min-w-full divide-y divide-border">
        <thead className="bg-muted/50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Nome
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Descrição
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Criado Em
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Ações
            </th>
          </tr>
        </thead>
        <tbody className="bg-background divide-y divide-border">
          {secrets.map((secret) => (
            <tr key={secret.id}>
              <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                {secret.name}
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-sm text-muted-foreground">
                {secret.description}
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-sm text-muted-foreground">
                {new Date(secret.createdAt).toLocaleDateString()}
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                <button
                  className="btn btn-sm btn-outline"
                  onClick={() => onEdit(secret)}
                >
                  Editar
                </button>
                <button
                  className="btn btn-sm btn-destructive-outline"
                  onClick={() => onDelete(secret.id)}
                >
                  Remover
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
