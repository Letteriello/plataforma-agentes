/**
 * @file Componente para listar as execuções de teste em uma tabela.
 */

import React from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { TestRun } from '@/types/qa'
import { format } from 'date-fns'

interface TestRunListProps {
  testRuns: TestRun[]
  onViewDetails: (testRun: TestRun) => void
}

const getStatusVariant = (run: TestRun): 'default' | 'destructive' | 'secondary' => {
  if (run.failed > 0) return 'destructive'
  if (run.passed === run.totalTests) return 'default' // 'default' is green in this context
  return 'secondary'
}

export const TestRunList: React.FC<TestRunListProps> = ({ testRuns, onViewDetails }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID da Execução</TableHead>
          <TableHead>Agente</TableHead>
          <TableHead>Data</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Progresso</TableHead>
          <TableHead className="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {testRuns.map((run) => (
          <TableRow key={run.id}>
            <TableCell className="font-mono">{run.id}</TableCell>
            <TableCell>{run.agentName}</TableCell>
            <TableCell>{format(new Date(run.timestamp), 'dd/MM/yyyy HH:mm')}</TableCell>
            <TableCell>
              <Badge variant={getStatusVariant(run)}>
                {run.failed > 0 ? 'Falhou' : 'Passou'}
              </Badge>
            </TableCell>
            <TableCell>
              {run.passed} / {run.totalTests} aprovados
            </TableCell>
            <TableCell className="text-right">
              <Button variant="outline" size="sm" onClick={() => onViewDetails(run)}>
                Ver Detalhes
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
