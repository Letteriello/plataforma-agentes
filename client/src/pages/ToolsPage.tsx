import React, { useState, useEffect } from 'react'
import { toolService } from '@/api/toolService'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
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

import { Tool } from '@/types'
export default function FerramentasPage() {
  const [tools, setTools] = useState<Tool[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [newTool, setNewTool] = useState<{ name: string; description: string }>(
    {
      name: '',
      description: '',
    },
  )

  useEffect(() => {
    const fetchTools = async () => {
      try {
        setIsLoading(true)
        const fetchedTools = await toolService.fetchTools()
        setTools(fetchedTools)
        setError(null)
      } catch (err) {
        setError('Failed to fetch tools.')
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTools()
  }, [])

  const filteredTools = tools.filter((tool) =>
    tool.name.toLowerCase().includes(search.toLowerCase()),
  )

  const handleSave = () => {
    if (!newTool.name.trim()) return
    const id = `${newTool.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`
    setTools([
      ...tools,
      { id, name: newTool.name, description: newTool.description },
    ])
    setNewTool({ name: '', description: '' })
    setDialogOpen(false)
  }

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
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>Nova Ferramenta</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Nova Ferramenta</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="tool-name">Nome</Label>
                  <Input
                    id="tool-name"
                    value={newTool.name}
                    onChange={(e) =>
                      setNewTool({ ...newTool, name: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="tool-desc">Descrição</Label>
                  <Textarea
                    id="tool-desc"
                    value={newTool.description}
                    onChange={(e) =>
                      setNewTool({ ...newTool, description: e.target.value })
                    }
                  />
                </div>
              </div>
              <DialogFooter className="pt-4">
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSave}>Salvar</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
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
