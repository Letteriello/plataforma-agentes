import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card' // Keep Card related imports
import { Badge } from '@/components/ui/badge' // Keep Badge
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
// Table related imports will be used by DocumentsTable component, not directly here for mock data
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Plus,
  Search,
  FileText,
  Database,
  Upload,
  Settings,
  Trash2,
  Loader2,
} from 'lucide-react'
import { useMemoryModule } from '@/hooks/useMemoryModule'
import { KnowledgeBaseCard } from '@/components/memoria/KnowledgeBaseCard'
import { UploadDocumentDialog } from '@/components/memoria/UploadDocumentDialog'
import { DocumentsTable } from '@/components/memoria/DocumentsTable'
import { KnowledgeBaseType } from '@/api/memoryService'

// Mock data removed

export default function MemoriaPage() {
  const [activeTab, setActiveTab] = useState('knowledge-bases')

  const {
    knowledgeBases,
    documents,
    selectedKnowledgeBase,
    isLoading,
    isLoadingDocuments,
    isUploadingDocuments,
    uploadDialogOpen,
    setUploadDialogOpen,
    createDialogOpen,
    setCreateDialogOpen,
    searchTerm,
    setSearchTerm,
    loadKnowledgeBases, // Though hook loads on mount, can be used for refresh
    loadDocuments,
    createKnowledgeBase,
    uploadDocuments,
    handleAddDocument,
  } = useMemoryModule()

  const [newKbForm, setNewKbForm] = useState({
    name: '',
    description: '',
    type: KnowledgeBaseType.RAG,
    baseModel: '',
  })

  const handleNewKbFormChange = (field: string, value: string) => {
    setNewKbForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleNewKbTypeChange = (value: string) => {
    const type = Object.values(KnowledgeBaseType).includes(
      value as KnowledgeBaseType,
    )
      ? (value as KnowledgeBaseType)
      : KnowledgeBaseType.RAG
    setNewKbForm((prev) => ({
      ...prev,
      type: type,
      baseModel: type === KnowledgeBaseType.RAG ? '' : prev.baseModel,
    }))
  }

  const submitCreateKnowledgeBase = async () => {
    if (!newKbForm.name.trim()) return
    await createKnowledgeBase({
      name: newKbForm.name,
      description: newKbForm.description,
      type: newKbForm.type,
      ...(newKbForm.type === KnowledgeBaseType.FINETUNING && {
        baseModel: newKbForm.baseModel || 'default-model',
      }),
    })
    setNewKbForm({
      name: '',
      description: '',
      type: KnowledgeBaseType.RAG,
      baseModel: '',
    })
  }

  useEffect(() => {
    if (
      selectedKnowledgeBase &&
      selectedKnowledgeBase.type === KnowledgeBaseType.RAG
    ) {
      loadDocuments(selectedKnowledgeBase.id)
    }
    // The hook itself handles clearing documents or setting them based on selection,
    // so no explicit clearing needed here for non-RAG types in this effect.
  }, [selectedKnowledgeBase, loadDocuments])

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Memória</h1>
        <div className="flex gap-2">
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar bases..." // Updated placeholder
              className="pl-8"
              value={searchTerm} // Use hook's state
              onChange={(e) => setSearchTerm(e.target.value)} // Use hook's setter
            />
          </div>
          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            {' '}
            {/* Use hook's state/setter */}
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nova Base de Conhecimento
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Criar Nova Base de Conhecimento</DialogTitle>
                <DialogDescription>
                  Crie uma nova base de conhecimento para armazenar e organizar
                  informações que seus agentes poderão acessar.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="kb-name">Nome</Label>
                  <Input
                    id="kb-name"
                    value={newKbForm.name} // Use newKbForm state
                    onChange={(e) =>
                      handleNewKbFormChange('name', e.target.value)
                    }
                    placeholder="Ex: Documentação do Produto"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="kb-description">Descrição</Label>
                  <Textarea
                    id="kb-description"
                    value={newKbForm.description} // Use newKbForm state
                    onChange={(e) =>
                      handleNewKbFormChange('description', e.target.value)
                    }
                    placeholder="Descreva o propósito desta base de conhecimento"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="kb-type">Tipo</Label>
                  <Select
                    value={newKbForm.type} // Use newKbForm state
                    onValueChange={handleNewKbTypeChange} // Use new handler
                  >
                    <SelectTrigger id="kb-type">
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={KnowledgeBaseType.RAG}>
                        RAG (Retrieval-Augmented Generation)
                      </SelectItem>
                      <SelectItem value={KnowledgeBaseType.FINETUNING}>
                        Fine-Tuning
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {newKbForm.type === KnowledgeBaseType.FINETUNING && ( // Conditional field for Fine-Tuning
                  <div className="space-y-2">
                    <Label htmlFor="kb-base-model">
                      Modelo Base (Opcional)
                    </Label>
                    <Input
                      id="kb-base-model"
                      value={newKbForm.baseModel}
                      onChange={(e) =>
                        handleNewKbFormChange('baseModel', e.target.value)
                      }
                      placeholder="Ex: gemini-1.0-pro"
                    />
                    <p className="text-xs text-muted-foreground">
                      Especifique o modelo base se estiver criando uma base para
                      fine-tuning.
                    </p>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setCreateDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={submitCreateKnowledgeBase}
                  disabled={!newKbForm.name.trim() || isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  Criar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <UploadDocumentDialog
        open={uploadDialogOpen}
        onOpenChange={setUploadDialogOpen}
        onUpload={uploadDocuments}
        knowledgeBaseName={selectedKnowledgeBase?.name}
        isUploading={isUploadingDocuments}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="knowledge-bases">
            Bases de Conhecimento
          </TabsTrigger>
          {/* Updated tab title for documents */}
          <TabsTrigger value="documents">
            Documentos da Base Selecionada
          </TabsTrigger>
        </TabsList>

        <TabsContent value="knowledge-bases" className="space-y-4">
          {/* Loading indicator */}
          {isLoading && (
            <div className="flex justify-center items-center p-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}

          {/* Render knowledge bases if not loading and data is available */}
          {!isLoading && knowledgeBases.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {knowledgeBases.map((kb) => (
                <KnowledgeBaseCard
                  key={kb.id}
                  knowledgeBase={kb}
                  onAddDocument={() => handleAddDocument(kb.id)} // Use hook's function
                  onSettingsClick={(id) =>
                    console.log('Settings clicked for', id)
                  } // Placeholder
                  // onDeleteClick={(id) => deleteKnowledgeBase(id)} // Example for delete, ensure deleteKnowledgeBase is destructured from hook if used
                />
              ))}
            </div>
          ) : (
            // Empty state if not loading and no data
            !isLoading && (
              <div className="text-center py-10">
                <Database className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">
                  Nenhuma base de conhecimento encontrada
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {searchTerm
                    ? 'Tente ajustar sua pesquisa'
                    : 'Crie uma nova base de conhecimento para começar'}
                </p>
                {/* Ensure setCreateDialogOpen is used for the button */}
                <Button
                  className="mt-4"
                  onClick={() => setCreateDialogOpen(true)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Nova Base de Conhecimento
                </Button>
              </div>
            )
          )}
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          {/* This table will now show documents for the selectedKnowledgeBase */}
          {selectedKnowledgeBase &&
          selectedKnowledgeBase.type === KnowledgeBaseType.RAG ? (
            <DocumentsTable
              documents={documents}
              isLoading={isLoadingDocuments}
              // Ensure deleteDocument is destructured from useMemoryModule if you implement this
              onDeleteDocument={
                (docId) => console.log('Delete docId:', docId) /* Placeholder */
              }
            />
          ) : (
            <Card>
              <CardContent className="pt-6">
                {' '}
                {/* Added pt-6 for padding like other empty/info states */}
                <div className="text-center py-10">
                  <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">
                    Nenhum documento para exibir
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {selectedKnowledgeBase &&
                    selectedKnowledgeBase.type !== KnowledgeBaseType.RAG
                      ? `Bases do tipo "${selectedKnowledgeBase.type}" não listam documentos aqui.`
                      : 'Selecione uma base de conhecimento do tipo RAG na aba anterior para ver seus documentos.'}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
