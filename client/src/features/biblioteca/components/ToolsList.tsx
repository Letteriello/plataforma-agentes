import { Loader2 } from 'lucide-react';
import React, { useCallback,useEffect, useState } from 'react';
import { toast } from 'sonner';

import toolService, { type PaginatedToolsDTO, type ToolDTO } from '@/features/tools/services/toolService';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface ToolsListProps {
  onEditTool: (tool: ToolDTO) => void;
  refreshTrigger: number;
}

export const ToolsList: React.FC<ToolsListProps> = ({ onEditTool, refreshTrigger }) => {
  const [tools, setTools] = useState<ToolDTO[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [limitPerPage] = useState(10);
  const [, setTotalTools] = useState(0);
  const [toolToDelete, setToolToDelete] = useState<ToolDTO | null>(null);

  const fetchTools = useCallback(async (page = 0, limit = 10) => {
    setIsLoading(true);
    setError(null);
    try {
      const data: PaginatedToolsDTO = await toolService.getTools({
        skip: page * limit,
        limit: limit,
        includeSystemTools: true,
      });
      setTools(data.tools);
      setTotalTools(data.total_count);
      setCurrentPage(page);
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
  }, [fetchTools, currentPage, limitPerPage, refreshTrigger]);

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

  return (
    <>
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
            ) : tools.length > 0 ? (
              tools.map((tool) => (
                <TableRow key={tool.id}>
                  <TableCell className="font-medium">{tool.name}</TableCell>
                  <TableCell>{tool.description || '-'}</TableCell>
                  <TableCell>{tool.is_system_tool ? 'Sim' : 'Não'}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" onClick={() => onEditTool(tool)} className="mr-2">Editar</Button>
                    {!tool.is_system_tool && (
                      <Button variant="destructive" size="sm" onClick={() => setToolToDelete(tool)}>
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
    </>
  );
};