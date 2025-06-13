import { Loader2 } from 'lucide-react'
import * as React from 'react'

import { Button } from '@/components/ui/button'
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger
} from '@/components/ui/dialog'

interface FormDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  trigger?: React.ReactNode
  title: string
  description: string
  children: React.ReactNode
  onSubmit: (event: React.FormEvent) => void
  isSubmitting: boolean
  submitButtonText?: string
  cancelButtonText?: string
}

export const FormDialog: React.FC<FormDialogProps> = ({
  isOpen,
  onOpenChange,
  trigger,
  title,
  description,
  children,
  onSubmit,
  isSubmitting,
  submitButtonText = 'Salvar',
  cancelButtonText = 'Cancelar',
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">{children}</div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              {cancelButtonText}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {submitButtonText}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
