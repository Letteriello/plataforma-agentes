import React, { useState, useEffect } from 'react'
import { SecretList } from '@/components/secrets-vault/SecretList'
import { SecretFormModal } from '@/components/secrets-vault/SecretFormModal'
import { Secret } from '@/types/secret'

export const SecretsVaultPage: React.FC = () => {
  const [secrets, setSecrets] = useState<Secret[]>([])
  const [isModalOpen, setModalOpen] = useState(false)
  const [secretToEdit, setSecretToEdit] = useState<Secret | null>(null)

  // TODO: Fetch secrets from API
  useEffect(() => {
    // setSecrets(fetchedSecrets);
  }, [])

  const handleAdd = () => {
    setSecretToEdit(null)
    setModalOpen(true)
  }

  const handleEdit = (secret: Secret) => {
    setSecretToEdit(secret)
    setModalOpen(true)
  }

  const handleDelete = (id: string) => {
    // TODO: Replace with API call
    setSecrets(secrets.filter((s) => s.id !== id))
  }

  const handleSave = (secretData: Omit<Secret, 'id' | 'createdAt'>) => {
    // TODO: Replace with API call
    if (secretToEdit) {
      setSecrets(
        secrets.map((s) =>
          s.id === secretToEdit.id ? { ...s, ...secretData } : s,
        ),
      )
    } else {
      const newSecret: Secret = {
        ...secretData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      }
      setSecrets([...secrets, newSecret])
    }
  }

  return (
    <div className="p-6 space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">Cofre de Credenciais</h2>
        <p className="text-muted-foreground">
          Gerencie com segurança as chaves de API e outras credenciais para seus
          agentes.
        </p>
      </div>
      <section>
        <SecretList
          secrets={secrets}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
        <SecretFormModal
          isOpen={isModalOpen}
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
          secretToEdit={secretToEdit}
        />
      </section>
    </div>
  )
}

export default SecretsVaultPage
