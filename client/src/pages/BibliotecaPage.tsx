import { PlusCircle } from 'lucide-react';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { ToolDTO } from '@/api/toolService';
import { MemoryManagement } from '@/components/biblioteca/MemoryManagement';
import { ToolsList } from '@/components/biblioteca/ToolsList';
import { CreateKnowledgeBaseDialog } from '@/components/memoria/CreateKnowledgeBaseDialog';
import { UploadDocumentDialog } from '@/components/memoria/UploadDocumentDialog';
import { CreateOrEditToolDialog } from '@/components/tools/CreateOrEditToolDialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useMemoryModule } from '@/hooks/useMemoryModule';
import { KnowledgeBaseType } from '@/types/memory';

const BibliotecaPage = () => {
  const navigate = useNavigate();
  const { '*': currentTab = 'ferramentas' } = useParams();

  // State for Tools
  const [isToolDialogOpen, setIsToolDialogOpen] = useState(false);
  const [editingTool, setEditingTool] = useState<ToolDTO | null>(null);
  const [refreshTools, setRefreshTools] = useState(0);

  // State for Memory
  const {
    createKnowledgeBase,
    uploadDocuments,
    isUploadingDocuments,
    uploadDialogOpen,
    setUploadDialogOpen,
    createDialogOpen,
    setCreateDialogOpen,
    selectedKnowledgeBase,
  } = useMemoryModule();

  const handleTabChange = (value: string) => {
    navigate(`/biblioteca/${value}`);
  };

  const openNewToolDialog = () => {
    setEditingTool(null);
    setIsToolDialogOpen(true);
  };

  const openEditToolDialog = (tool: ToolDTO) => {
    setEditingTool(tool);
    setIsToolDialogOpen(true);
  };

  const openNewKnowledgeBaseDialog = () => {
    setCreateDialogOpen(true);
  };

  const handleToolFormSubmit = () => {
    setIsToolDialogOpen(false);
    setRefreshTools(prev => prev + 1); // Trigger a refresh in ToolsList
  };

  const handleCreateKnowledgeBase = async (data: {
    name: string;
    description?: string;
    type: KnowledgeBaseType;
    baseModel?: string;
  }) => {
    await createKnowledgeBase(data);
    setCreateDialogOpen(false);
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Biblioteca de Recursos</h1>
        {currentTab === 'ferramentas' ? (
          <Button onClick={openNewToolDialog}>
            <PlusCircle className="mr-2 h-4 w-4" /> Nova Ferramenta
          </Button>
        ) : (
          <Button onClick={openNewKnowledgeBaseDialog}>
            <PlusCircle className="mr-2 h-4 w-4" /> Nova Base de Conhecimento
          </Button>
        )}
      </div>

      <Tabs value={currentTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="ferramentas">Ferramentas</TabsTrigger>
          <TabsTrigger value="memoria">Memória</TabsTrigger>
        </TabsList>
        <TabsContent value="ferramentas" className="mt-4">
          <ToolsList onEditTool={openEditToolDialog} refreshTrigger={refreshTools} />
        </TabsContent>
        <TabsContent value="memoria" className="mt-4">
          <MemoryManagement />
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <CreateOrEditToolDialog
        isOpen={isToolDialogOpen}
        onOpenChange={setIsToolDialogOpen}
        tool={editingTool}
        onSuccess={handleToolFormSubmit}
      />

      <CreateKnowledgeBaseDialog
        isOpen={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSubmit={handleCreateKnowledgeBase}
      />

      {selectedKnowledgeBase && (
        <UploadDocumentDialog
          isOpen={uploadDialogOpen}
          onOpenChange={setUploadDialogOpen}
          knowledgeBase={selectedKnowledgeBase}
          onUpload={uploadDocuments}
          isUploading={isUploadingDocuments}
        />
      )}
    </div>
  );
};

export default BibliotecaPage;
