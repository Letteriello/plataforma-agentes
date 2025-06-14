import { FileText, Loader2,Plus, Search } from 'lucide-react'
import { useState } from 'react'

import { CreateKnowledgeBaseDialog } from '@/features/memoria/components/CreateKnowledgeBaseDialog'
import { DocumentsTable } from '@/features/memoria/components/DocumentsTable'
import { KnowledgeBaseCard } from '@/features/memoria/components/KnowledgeBaseCard'
import { UploadDocumentDialog } from '@/features/memoria/components/UploadDocumentDialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useMemoryModule } from '@/features/memoria/hooks/useMemoryModule'
import { KnowledgeBase, KnowledgeBaseType } from '@/types/memory'

export default function MemoriaPage() {
  const [activeTab, setActiveTab] = useState('knowledge-bases')
  const [isCreating, setIsCreating] = useState(false)

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
    createKnowledgeBase,
    uploadDocuments,
    deleteDocument,
    handleSelectKnowledgeBase,
    handleAddDocument,
  } = useMemoryModule()

  const handleCreateKnowledgeBase = async (data: {
    name: string;
    description?: string | undefined;
    type: KnowledgeBaseType;
    baseModel?: string | undefined;
  }) => {
    setIsCreating(true)
    try {
      await createKnowledgeBase(data)
      setCreateDialogOpen(false) // Fecha o diálogo em caso de sucesso
    } catch (error) {
      // O erro já é exibido pelo toast no hook, mas podemos logar aqui se necessário
      console.error('Falha ao criar a base de conhecimento:', error)
    } finally {
      setIsCreating(false)
    }
  }

  const handleUpload = async (files: File[]) => {
    // A lógica de upload já está no hook, que também lida com o estado de loading
    try {
      await uploadDocuments(files)
      setUploadDialogOpen(false) // Fecha o diálogo em caso de sucesso
    } catch (error) {
      console.error('Falha ao fazer upload dos documentos:', error)
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Memória</h1>
        <CreateKnowledgeBaseDialog
          open={createDialogOpen}
          onOpenChange={setCreateDialogOpen}
          onSubmit={(data) => handleCreateKnowledgeBase(data)}
          isSubmitting={isCreating}
        />
        <UploadDocumentDialog
          open={uploadDialogOpen}
          onOpenChange={setUploadDialogOpen}
          onUpload={handleUpload}
          knowledgeBaseName={selectedKnowledgeBase?.name || ''}
          isUploading={isUploadingDocuments}
        />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="knowledge-bases">
            Bases de Conhecimento
          </TabsTrigger>
          <TabsTrigger value="documents">
            Documentos da Base Selecionada
          </TabsTrigger>
        </TabsList>

        <TabsContent value="knowledge-bases" className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Buscar base de conhecimento..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button onClick={() => setCreateDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Nova Base de Conhecimento
            </Button>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : knowledgeBases.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {knowledgeBases.map((kb: KnowledgeBase) => (
                <KnowledgeBaseCard
                  key={kb.id}
                  knowledgeBase={kb}
                  onSelect={() => {
                    handleSelectKnowledgeBase(kb)
                    setActiveTab('documents')
                  }}
                  onAddDocument={() => handleAddDocument(kb)}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-10">
                  <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">
                    Nenhuma base de conhecimento encontrada
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Comece criando uma nova base para seus agentes.
                  </p>
                  <Button
                    className="mt-4"
                    onClick={() => setCreateDialogOpen(true)}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Nova Base de Conhecimento
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          {selectedKnowledgeBase &&
          selectedKnowledgeBase.type === KnowledgeBaseType.RAG ? (
            <DocumentsTable
              documents={documents}
              isLoading={isLoadingDocuments}
              onDeleteDocument={deleteDocument}
            />
          ) : (
            <Card>
              <CardContent className="pt-6">
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
