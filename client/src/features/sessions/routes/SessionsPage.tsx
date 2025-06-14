import { MoreHorizontal } from 'lucide-react'
import React, { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import mockSessions from '@/data/mock-sessions.json'

interface SessionRecord {
  id: string
  agentName: string
  createdAt: string
  lastActivity: string
}

export default function SessionsPage() {
  const [sessions, setSessions] = useState<SessionRecord[]>(
    mockSessions as SessionRecord[],
  )

  const handleDelete = (id: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== id))
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Sess\u00f5es</h1>
      <Card>
        <CardHeader>
          <CardTitle>Hist\u00f3rico de Sess\u00f5es</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[500px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID da Sess\u00e3o</TableHead>
                  <TableHead>Agente</TableHead>
                  <TableHead>In\u00edcio</TableHead>
                  <TableHead>\u00daltima Atividade</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {sessions.map((session) => (
                  <TableRow key={session.id}>
                    <TableCell className="font-mono font-medium">
                      {session.id}
                    </TableCell>
                    <TableCell>{session.agentName}</TableCell>
                    <TableCell>
                      {new Date(session.createdAt).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {new Date(session.lastActivity).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Ver Detalhes</DropdownMenuItem>
                          <DropdownMenuItem>Exportar</DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(session.id)}
                          >
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {sessions.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center py-6 text-muted-foreground"
                    >
                      Nenhuma sess\u00e3o encontrada
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
