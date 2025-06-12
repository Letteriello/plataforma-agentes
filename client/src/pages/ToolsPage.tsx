import React, { useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { PlusCircle, Loader2, Pencil, Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

import toolService, { ToolDTO, PaginatedToolsDTO, CreateToolDTO, UpdateToolDTO } from '@/api/toolService';
import { CreateOrEditToolDialog } from '@/components/tools/CreateOrEditToolDialog';

const ToolsPage: React.FC = () => {
  const [tools, setTools] = useState<ToolDTO[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [limitPerPage, setLimitPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [editingTool, setEditingTool] = useState<ToolDTO | null>(null);
  const [toolToDelete, setToolToDelete] = useState<ToolDTO | null>(null);

  const fetchTools = useCallback(async (page = 1, size = 10) => {
    setIsLoading(true);
    setError(null);
    try {
      const data: PaginatedToolsDTO = await toolService.getTools({
        page: page,
        size: size,
        includeSystemTools: true,
      });
      setTools(data.items);
      setCurrentPage(data.page);
      setTotalPages(data.total_pages);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch tools';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTools(currentPage, limitPerPage);
  }, [fetchTools, currentPage, limitPerPage]);

  const handleCreateOrUpdateTool = async (data: CreateToolDTO | UpdateToolDTO) => {
    setIsSubmitting(true);
    try {
      if (editingTool) {
        await toolService.updateTool(editingTool.id, data as UpdateToolDTO);
        toast.success(`Ferramenta "${data.name}" atualizada com sucesso.`);
      } else {
        await toolService.createTool(data as CreateToolDTO);
        toast.success(`Ferramenta "${data.name}" criada com sucesso.`);
      }
      setIsDialogOpen(false);
      setEditingTool(null);
      fetchTools(currentPage, limitPerPage);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'A operação falhou';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditDialog = (tool: ToolDTO) => {
    setEditingTool(tool);
    setIsDialogOpen(true);
  };

  const openNewDialog = () => {
    setEditingTool(null);
    setIsDialogOpen(true);
  };

  const handleDeleteTool = async () => {
    if (!toolToDelete) return;

    try {
      await toolService.deleteTool(toolToDelete.id);
      toast.success(`Ferramenta "${toolToDelete.name}" deletada com sucesso.`);
      fetchTools(currentPage, limitPerPage); // Refresh the list
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete tool';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setToolToDelete(null);
    }
  };

  const handleDeleteConfirmation = () => {
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteCancel = () => {
    setIsDeleteDialogOpen(false);
    setToolToDelete(null);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Gerenciamento de Ferramentas</h1>
        <Button onClick={openNewDialog}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Nova Ferramenta
        </Button>
      </div>

      <CreateOrEditToolDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSubmit={handleCreateOrUpdateTool}
        isSubmitting={isSubmitting}
        editingTool={editingTool}
      />

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Ferramenta de Sistema</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  <Loader2 className="mx-auto h-8 w-8 animate-spin text-muted-foreground" />
                </TableCell>
              </TableRow>
            ) : (
              tools.length > 0 ? (
                tools.map((tool) => (
                  <TableRow key={tool.id}>
                    <TableCell className="font-medium">{tool.name}</TableCell>
                    <TableCell>{tool.description || '-'}</TableCell>
                    <TableCell>{tool.is_system_tool ? 'Sim' : 'Não'}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" onClick={() => openEditDialog(tool)} className="mr-2">
                        <Pencil className="h-4 w-4 mr-2" />
                        Editar
                    <Button variant="outline" size="sm" onClick={() => openEditDialog(tool)} className="mr-2">
                      <Pencil className="h-4 w-4 mr-2" />
                      Editar
                    </Button>
                    {!tool.is_system_tool && (
                      <Button variant="destructive" size="sm" onClick={() => setToolToDelete(tool)}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Deletar
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center">Nenhuma ferramenta encontrada.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {/* TODO: Add pagination controls */}

      <AlertDialog open={!!toolToDelete} onOpenChange={(open) => !open && setToolToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso irá deletar permanentemente a ferramenta
              <span className="font-semibold"> {toolToDelete?.name}</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteTool}>Deletar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ToolsPage;
