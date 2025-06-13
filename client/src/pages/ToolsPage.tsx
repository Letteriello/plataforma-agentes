import { Edit,MoreHorizontal, PlusCircle, Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { LoadingSpinner } from '@/components/ui';
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
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';
import { deleteTool, getTools, Tool } from '@/services/toolService';

export const ToolsPage: React.FC = () => {
  const [tools, setTools] = useState<Tool[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toolToDelete, setToolToDelete] = useState<Tool | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const fetchTools = async () => {
    try {
      setIsLoading(true);
      // Fetch only user-owned tools by default
      const paginatedTools = await getTools(1, 100, true);
      setTools(paginatedTools.items);
      setError(null);
    } catch (err) {
      setError('Falha ao carregar as ferramentas.');
      toast({
        title: 'Erro',
        description: 'Não foi possível buscar suas ferramentas customizadas.',
        variant: 'destructive',
      });
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTools();
  }, []);

  const handleDeleteTool = async () => {
    if (!toolToDelete) return;

    try {
      await deleteTool(toolToDelete.id);
      toast({
        title: 'Sucesso',
        description: `A ferramenta "${toolToDelete.name}" foi deletada.`,
      });
      setToolToDelete(null);
      fetchTools(); // Refresh list after deletion
    } catch (err) {
      toast({
        title: 'Erro',
        description: `Não foi possível deletar a ferramenta "${toolToDelete.name}".`,
        variant: 'destructive',
      });
      console.error(err);
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner />
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center text-destructive py-8">
          <p>{error}</p>
          <Button onClick={fetchTools} className="mt-4">Tentar Novamente</Button>
        </div>
      );
    }

    if (tools.length === 0) {
      return (
        <div className="text-center py-8">
          <h3 className="text-lg font-semibold">Nenhuma ferramenta customizada encontrada.</h3>
          <p className="text-muted-foreground mt-2">Crie sua primeira ferramenta para começar.</p>
          <Button className="mt-4" onClick={() => navigate('/tools/new')}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Criar Nova Ferramenta
          </Button>
        </div>
      );
    }

    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead className="hidden md:table-cell">Descrição</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tools.map((tool) => (
            <TableRow key={tool.id}>
              <TableCell className="font-medium">{tool.name}</TableCell>
              <TableCell>{tool.type}</TableCell>
              <TableCell className="hidden md:table-cell max-w-sm truncate">{tool.description}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Abrir menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => navigate(`/tools/edit/${tool.id}`)}>
                      <Edit className="mr-2 h-4 w-4" />
                      <span>Editar</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onClick={() => setToolToDelete(tool)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      <span>Deletar</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  return (
    <>
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Gerenciador de Ferramentas</h2>
            <p className="text-muted-foreground">
              Crie e gerencie suas ferramentas customizadas para expandir as capacidades dos seus agentes.
            </p>
          </div>
          <Button onClick={() => navigate('/tools/new')}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Criar Nova Ferramenta
          </Button>
        </div>
        <div className="border rounded-lg bg-card">
          {renderContent()}
        </div>
      </div>
      
      <AlertDialog open={!!toolToDelete} onOpenChange={() => setToolToDelete(null)}>
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
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleDeleteTool}
            >
              Deletar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ToolsPage;
