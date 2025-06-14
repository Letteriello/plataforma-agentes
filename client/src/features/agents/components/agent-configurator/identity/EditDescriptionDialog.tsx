/**
 * @file EditDescriptionDialog.tsx
 * @description Dialog para editar a descrição de um agente.
 */
import React, { useEffect,useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'

interface EditDescriptionDialogProps {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
  initialDescription: string
  onSave: (newDescription: string) => void
}

export const EditDescriptionDialog: React.FC<EditDescriptionDialogProps> = ({
  isOpen,
  onOpenChange,
  initialDescription,
  onSave,
}) => {
  const [description, setDescription] = useState(initialDescription)

  useEffect(() => {
    if (isOpen) {
      setDescription(initialDescription)
    }
  }, [isOpen, initialDescription])

  const handleSave = () => {
    onSave(description)
    onOpenChange(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Editar Descrição do Agente</DialogTitle>
          <DialogDescription>
            Forneça uma descrição clara e concisa sobre o que seu agente faz,
            seus objetivos e suas capacidades.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Textarea
            id="agent-description-editor"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descreva o propósito e as capacidades do seu agente..."
            rows={10}
            className="min-h-[200px]"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>Salvar Descrição</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
