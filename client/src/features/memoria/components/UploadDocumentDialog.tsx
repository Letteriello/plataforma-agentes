import { File, Upload, X } from 'lucide-react'
import React, { useRef,useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'

interface UploadDocumentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpload: (files: File[]) => void
  knowledgeBaseName?: string
  isUploading: boolean // Renamed from isParentUploading for clarity, maps to useMemoryModule.isUploadingDocuments
}

export function UploadDocumentDialog({
  open,
  onOpenChange,
  onUpload,
  knowledgeBaseName,
  isUploading, // Consuming the prop
}: UploadDocumentDialogProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  // Local isUploading state removed, will rely on the prop.
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Resetar o estado quando o diálogo é fechado
  const handleOpenChange = (openState: boolean) => {
    if (!openState) {
      // Only reset files if not currently uploading.
      // If it closes WHILE uploading, the parent controls this,
      // but good practice to avoid clearing if an upload is hypothetically active.
      if (!isUploading) {
        setSelectedFiles([])
      }
    }
    onOpenChange(openState)
  }

  // Manipular a seleção de arquivos
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileArray = Array.from(e.target.files)
      setSelectedFiles((prev) => [...prev, ...fileArray])
    }
  }

  // Remover um arquivo da lista
  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  // Manipular o envio do formulário
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedFiles.length === 0 || isUploading) return // Prevent submit if uploading

    // setIsUploading(true); // Removed, parent state will handle this via prop
    onUpload(selectedFiles)
    // The dialog is typically closed by the parent setting 'open' to false
    // after onUpload completes (or leads to isUploading changing).
    // If onUpload is synchronous and quick, and parent doesn't immediately close,
    // selectedFiles could be cleared here if desired, but current setup is fine.
  }

  // Abrir o seletor de arquivos
  const triggerFileInput = () => {
    if (isUploading) return // Prevent opening file dialog if uploading
    fileInputRef.current?.click()
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Upload de Documentos</DialogTitle>
            <DialogDescription>
              {knowledgeBaseName
                ? `Adicione documentos à base de conhecimento "${knowledgeBaseName}".`
                : 'Adicione documentos à base de conhecimento.'}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
          <div
            role="button"
            tabIndex={0}
            className={`border-2 border-dashed rounded-lg p-6 text-center ${
              isUploading
                ? 'cursor-not-allowed bg-muted/20'
                : 'cursor-pointer hover:bg-muted/50'
            } transition-colors`}
            onClick={triggerFileInput}
            onKeyDown={(e) => e.key === 'Enter' && triggerFileInput()}
          >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                multiple
                accept=".pdf,.doc,.docx,.txt,.md,.csv,.json,.html"
                disabled={isUploading} // Disable file input
              />
              <Upload
                className={`h-10 w-10 mx-auto mb-2 ${isUploading ? 'text-muted-foreground/50' : 'text-muted-foreground'}`}
              />
              <p
                className={`text-sm font-medium mb-1 ${isUploading ? 'text-muted-foreground/50' : ''}`}
              >
                Clique para selecionar arquivos
              </p>
              <p className="text-xs text-muted-foreground">
                Suporta PDF, Word, TXT, Markdown, CSV, JSON e HTML
              </p>
            </div>

            {selectedFiles.length > 0 && (
              <div className="space-y-2">
                <Label>Arquivos selecionados</Label>
                <div className="max-h-[200px] overflow-y-auto space-y-2 border rounded-md p-2">
                  {selectedFiles.map((file, index) => (
                    <div
                      key={`${file.name}-${index}`}
                      className="flex items-center justify-between bg-muted/40 p-2 rounded"
                    >
                      <div className="flex items-center overflow-hidden">
                        <File
                          className={`h-4 w-4 mr-2 flex-shrink-0 ${isUploading ? 'text-muted-foreground/50' : ''}`}
                        />
                        <span
                          className={`text-sm truncate ${isUploading ? 'text-muted-foreground/50' : ''}`}
                        >
                          {file.name}
                        </span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                        disabled={isUploading} // Disable remove button
                      >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Remover</span>
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isUploading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isUploading || selectedFiles.length === 0}
            >
              {isUploading ? 'Enviando...' : 'Enviar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
