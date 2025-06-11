import React, { useState, useEffect } from 'react'
import { Secret } from '@/types/secret'

interface SecretFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (secret: Omit<Secret, 'id' | 'createdAt'>) => void
  secretToEdit?: Secret | null
}

export const SecretFormModal: React.FC<SecretFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  secretToEdit,
}) => {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [value, setValue] = useState('')

  useEffect(() => {
    if (secretToEdit) {
      setName(secretToEdit.name)
      setDescription(secretToEdit.description)
      setValue('********') // Don't expose the real value
    } else {
      setName('')
      setDescription('')
      setValue('')
    }
  }, [secretToEdit, isOpen])

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({ name, description, value }) // In a real app, 'value' would be handled more securely
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-background rounded shadow-lg w-full max-w-md p-6 relative">
        <button
          className="absolute top-2 right-2 btn btn-sm btn-ghost"
          onClick={onClose}
          aria-label="Fechar"
        >
          ×
        </button>
        <h3 className="font-semibold mb-4">
          {secretToEdit ? 'Editar Credencial' : 'Adicionar Nova Credencial'}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="secret-name"
              className="block text-sm font-medium mb-1"
            >
              Nome
            </label>
            <input
              id="secret-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input w-full"
              required
            />
          </div>
          <div>
            <label
              htmlFor="secret-description"
              className="block text-sm font-medium mb-1"
            >
              Descrição
            </label>
            <input
              id="secret-description"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input w-full"
            />
          </div>
          <div>
            <label
              htmlFor="secret-value"
              className="block text-sm font-medium mb-1"
            >
              Valor
            </label>
            <input
              id="secret-value"
              type="password"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="input w-full"
              required
            />
            <p className="text-xs text-muted-foreground mt-1">
              O valor será armazenado de forma segura e não será exibido
              novamente.
            </p>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <button type="button" className="btn btn-outline" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary">
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
