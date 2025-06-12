import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input'; // Example, may need more form components
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner'; // Assuming sonner is used for toasts, similar to AgentEditor

import toolService, { ToolDTO, PaginatedToolsDTO, CreateToolDTO, UpdateToolDTO, ToolParameterCreateDTO } from '@/api/toolService';

const ToolsPage: React.FC = () => {
  const [tools, setTools] = useState<ToolDTO[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // State for pagination (example, can be expanded)
  const [currentPage, setCurrentPage] = useState(0);
  const [limitPerPage, setLimitPerPage] = useState(10);
  const [totalTools, setTotalTools] = useState(0);

  // State for Create/Edit Dialog
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [editingTool, setEditingTool] = useState<ToolDTO | null>(null);
  // Form state for new/editing tool (simplified for now)
  const [toolName, setToolName] = useState('');
  const [toolDescription, setToolDescription] = useState('');
  // TODO: Add state for parameters and return_type_schema

  const fetchTools = async (page = 0, limit = 10) => {
    setIsLoading(true);
    setError(null);
    try {
      const data: PaginatedToolsDTO = await toolService.getTools({
        skip: page * limit,
        limit: limit,
        includeSystemTools: true, // Or make this configurable
      });
      setTools(data.tools);
      setTotalTools(data.total_count);
      setCurrentPage(page);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch tools';
      setError(errorMessage);
      toast.error(`Error fetching tools: ${errorMessage}`);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchTools(currentPage, limitPerPage);
  }, [currentPage, limitPerPage]);

  const handleCreateOrUpdateTool = async () => {
    if (!toolName.trim()) {
      toast.error('Tool name is required.');
      return;
    }
    setIsLoading(true);
    // Simplified payload
    const payload: CreateToolDTO | UpdateToolDTO = {
      name: toolName,
      description: toolDescription || undefined,
      parameters: [], // TODO: Implement parameter input
      // return_type_schema: {} // TODO: Implement return type schema input
    };

    try {
      if (editingTool) {
        await toolService.updateTool(editingTool.id, payload as UpdateToolDTO);
        toast.success(`Tool '${toolName}' updated successfully.`);
      } else {
        await toolService.createTool(payload as CreateToolDTO);
        toast.success(`Tool '${toolName}' created successfully.`);
      }
      setIsDialogOpen(false);
      setEditingTool(null);
      fetchTools(currentPage, limitPerPage); // Refresh list
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Operation failed';
      toast.error(`Error: ${errorMessage}`);
    }
    setIsLoading(false);
  };

  const openEditDialog = (tool: ToolDTO) => {
    setEditingTool(tool);
    setToolName(tool.name);
    setToolDescription(tool.description || '');
    // TODO: Populate parameter and return_type_schema states
    setIsDialogOpen(true);
  };

  const openNewDialog = () => {
    setEditingTool(null);
    setToolName('');
    setToolDescription('');
    // TODO: Clear parameter and return_type_schema states
    setIsDialogOpen(true);
  };

  const handleDeleteTool = async (toolId: string, toolNameStr: string) => {
    if (window.confirm(`Are you sure you want to delete the tool "${toolNameStr}"?`)) {
      setIsLoading(true);
      try {
        await toolService.deleteTool(toolId);
        toast.success(`Tool '${toolNameStr}' deleted successfully.`);
        fetchTools(currentPage, limitPerPage); // Refresh list
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to delete tool';
        toast.error(`Error: ${errorMessage}`);
      }
      setIsLoading(false);
    }
  };

  if (isLoading && !tools.length) return <p>Loading tools...</p>;
  if (error) return <p>Error loading tools: {error}</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Manage Tools</h1>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button onClick={openNewDialog} className="mb-4">Create New Tool</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingTool ? 'Edit Tool' : 'Create New Tool'}</DialogTitle>
            <DialogDescription>
              {editingTool ? `Update the details for '${editingTool.name}'.` : 'Fill in the details for the new tool.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="name" className="text-right">Name</label>
              <Input id="name" value={toolName} onChange={(e) => setToolName(e.target.value)} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="description" className="text-right">Description</label>
              <Input id="description" value={toolDescription} onChange={(e) => setToolDescription(e.target.value)} className="col-span-3" />
            </div>
            {/* TODO: Add inputs for parameters and return_type_schema */}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button type="submit" onClick={handleCreateOrUpdateTool} disabled={isLoading}>
              {isLoading ? 'Saving...' : (editingTool ? 'Save Changes' : 'Create Tool')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>System Tool</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tools.map((tool) => (
            <TableRow key={tool.id}>
              <TableCell>{tool.name}</TableCell>
              <TableCell>{tool.description || '-'}</TableCell>
              <TableCell>{tool.is_system_tool ? 'Yes' : 'No'}</TableCell>
              <TableCell>
                <Button variant="outline" size="sm" onClick={() => openEditDialog(tool)} className="mr-2">Edit</Button>
                {!tool.is_system_tool && (
                  <Button variant="destructive" size="sm" onClick={() => handleDeleteTool(tool.id, tool.name)} disabled={isLoading}>
                    {isLoading ? 'Deleting...' : 'Delete'}
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {/* TODO: Add pagination controls */}
      {tools.length === 0 && !isLoading && <p className="text-center mt-4">No tools found.</p>}
    </div>
  );
};

export default ToolsPage;
