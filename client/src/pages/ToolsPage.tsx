import React, { useState, useEffect } from 'react'
import {
  fetchTools,
  createTool,
  updateTool,
  deleteTool,
  ToolDTO,
  CreateToolDTO,
} from '@/api/toolService'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { PlusCircle, Edit, Trash2 } from 'lucide-react'
import { PageTitle } from '@/components/ui/page-title'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from '@/components/ui/table'

const ToolsPage: React.FC = () => {
  const [tools, setTools] = useState<ToolDTO[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingTool, setEditingTool] = useState<ToolDTO | null>(null)
  const [search, setSearch] = useState('')

  const loadTools = async () => {
    try {
      setIsLoading(true)
      const fetchedTools = await fetchTools()
      setTools(fetchedTools)
    } catch (err) {
      setError('Failed to fetch tools.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadTools()
  }, [])

  const handleAddNew = () => {
    setEditingTool(null)
    setIsFormOpen(true)
  }

  const handleEdit = (tool: ToolDTO) => {
    setEditingTool(tool)
    setIsFormOpen(true)
  }

  const handleDelete = async (toolId: string) => {
    if (window.confirm('Are you sure you want to delete this tool?')) {
      try {
        await deleteTool(toolId)
        setTools(tools.filter((t) => t.id !== toolId))
      } catch (error) {
        setError('Failed to delete tool.')
      }
    }
  }

  const handleFormClose = () => {
    setIsFormOpen(false)
    setEditingTool(null)
  }

  const handleSave = async (toolData: CreateToolDTO) => {
    try {
      if (editingTool) {
        await updateTool(editingTool.id, toolData)
      } else {
        await createTool(toolData)
      }
      handleFormClose()
      loadTools() // Refresh the list
    } catch (error) {
      setError('Failed to save tool.')
    }
  }

  const filteredTools = tools.filter((tool) =>
    tool.name.toLowerCase().includes(search.toLowerCase()),
  )

  if (isLoading) return <div>Loading...</div>
  if (error) return <div className="text-destructive">{error}</div>

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Ferramentas</h1>
        <div className="flex gap-2">
          <Input
            placeholder="Buscar ferramenta..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-xs"
          />
          <Button onClick={handleAddNew}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Adicionar Ferramenta
          </Button>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Minhas Ferramentas</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Descrição</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTools.map((tool) => (
                <TableRow key={tool.id} className="cursor-pointer">
                  <TableCell className="font-medium">{tool.name}</TableCell>
                  <TableCell>{tool.description}</TableCell>
                </TableRow>
              ))}
              {filteredTools.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={2}
                    className="text-center py-6 text-muted-foreground"
                  >
                    Nenhuma ferramenta encontrada
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
