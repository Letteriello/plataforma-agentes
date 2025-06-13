import { FileText, Loader2,Plus, Search } from 'lucide-react';
import { useState } from 'react';

import { DocumentsTable } from '@/components/memoria/DocumentsTable';
import { KnowledgeBaseCard } from '@/components/memoria/KnowledgeBaseCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useMemoryModule } from '@/hooks/useMemoryModule';
import { KnowledgeBaseType } from '@/types/memory';

export const MemoryManagement = () => {
  const {
    knowledgeBases,
    documents,
    selectedKnowledgeBase,
    isLoading,
    isLoadingDocuments,
    searchTerm,
    setSearchTerm,
    deleteDocument,
    handleSelectKnowledgeBase,
    handleAddDocument,
  } = useMemoryModule();

  return (
    <Tabs defaultValue="knowledge-bases" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="knowledge-bases">Bases de Conhecimento</TabsTrigger>
        <TabsTrigger value="documents">Documentos</TabsTrigger>
      </TabsList>
      <TabsContent value="knowledge-bases">
        <div className="flex justify-between items-center mb-4">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar bases..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        {isLoading ? (
          <div className="flex justify-center items-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : knowledgeBases.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {knowledgeBases.map((kb) => (
              <KnowledgeBaseCard
                key={kb.id}
                knowledgeBase={kb}
                onSelect={() => handleSelectKnowledgeBase(kb)}
                onAddDocument={() => handleAddDocument(kb)}
                isSelected={selectedKnowledgeBase?.id === kb.id}
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
  );
};