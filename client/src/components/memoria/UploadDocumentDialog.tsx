import React, { useState, useRef } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, File, X } from 'lucide-react';

interface UploadDocumentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpload: (files: File[]) => void;
  knowledgeBaseName?: string;
}

export function UploadDocumentDialog({ 
  open, 
  onOpenChange, 
  onUpload,
  knowledgeBaseName 
}: UploadDocumentDialogProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Resetar o estado quando o diálogo é fechado
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setSelectedFiles([]);
      setIsUploading(false);
    }
    onOpenChange(open);
  };

  // Manipular a seleção de arquivos
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileArray = Array.from(e.target.files);
      setSelectedFiles(prev => [...prev, ...fileArray]);
    }
  };

  // Remover um arquivo da lista
  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Manipular o envio do formulário
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFiles.length === 0) return;
    
    setIsUploading(true);
    onUpload(selectedFiles);
    // Nota: O diálogo será fechado pelo componente pai após a conclusão do upload
  };

  // Abrir o seletor de arquivos
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

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
              className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={triggerFileInput}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                multiple
                accept=".pdf,.doc,.docx,.txt,.md,.csv,.json,.html"
              />
              <Upload className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm font-medium mb-1">Clique para selecionar arquivos</p>
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
                        <File className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span className="text-sm truncate">{file.name}</span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
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
  );
}