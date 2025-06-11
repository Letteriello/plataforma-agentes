/**
 * @file EditInstructionDialog.tsx
 * @description Dialog para editar a instrução principal de um agente.
 */
import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

interface EditInstructionDialogProps {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
  initialInstruction: string
  onSave: (newInstruction: string) => void
}

export const EditInstructionDialog: React.FC<EditInstructionDialogProps> = ({
  isOpen,
  onOpenChange,
  initialInstruction,
  onSave,
}) => {
  const [instruction, setInstruction] = useState(initialInstruction)

  useEffect(() => {
    if (isOpen) {
      setInstruction(initialInstruction)
    }
  }, [isOpen, initialInstruction])

  const handleSave = () => {
    onSave(instruction)
    onOpenChange(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Editar Instrução Principal (Prompt)</DialogTitle>
          <DialogDescription>
            Defina o comportamento central, a persona e as diretrizes
            operacionais para o seu agente.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Textarea
            id="agent-instruction-editor"
            value={instruction}
            onChange={(e) => setInstruction(e.target.value)}
            placeholder="Ex: Você é um assistente amigável e eficiente..."
            rows={15}
            className="min-h-[300px]"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>Salvar Instrução</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
