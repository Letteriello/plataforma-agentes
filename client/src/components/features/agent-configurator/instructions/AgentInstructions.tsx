/**
 * @file AgentInstructions.tsx
 * @description Componente para configurar as instruções principais (prompt) de um agente.
 */
import React, { useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

import { EditInstructionDialog } from './EditInstructionDialog'

interface AgentInstructionsProps {
  instruction: string
  onInstructionSave: (newInstruction: string) => void
}

export const AgentInstructions: React.FC<AgentInstructionsProps> = ({
  instruction,
  onInstructionSave,
}) => {
  const [isInstructionDialogOpen, setIsInstructionDialogOpen] = useState(false)

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Instruções do Agente</CardTitle>
          <CardDescription>
            Defina o comportamento principal, persona e como o agente deve
            operar.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <Label htmlFor="instructionDisplay">
                Instrução Principal (Prompt)
              </Label>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsInstructionDialogOpen(true)}
              >
                Editar Instrução
              </Button>
            </div>
            <Textarea
              id="instructionDisplay"
              value={instruction}
              readOnly
              placeholder="Ex: Você é um assistente prestativo que responde perguntas sobre o clima..."
              rows={4}
              className="mt-1 resize-none bg-muted cursor-pointer"
              onClick={() => setIsInstructionDialogOpen(true)}
            />
          </div>
        </CardContent>
      </Card>

      <EditInstructionDialog
        isOpen={isInstructionDialogOpen}
        onOpenChange={setIsInstructionDialogOpen}
        initialInstruction={instruction}
        onSave={onInstructionSave}
      />
    </>
  )
}
