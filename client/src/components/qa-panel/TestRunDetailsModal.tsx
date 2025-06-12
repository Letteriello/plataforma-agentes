/**
 * @file Modal para exibir os detalhes de uma execução de teste, incluindo todos os casos de teste.
 */

import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { TestRun, TestCase, TestCaseStatus } from '@/types/qa'

interface TestRunDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  testRun: TestRun | null
  testCases: TestCase[]
}

const getStatusBadgeVariant = (
  status: TestCaseStatus,
): 'default' | 'destructive' | 'secondary' | 'outline' => {
  switch (status) {
    case TestCaseStatus.Passed:
      return 'default'
    case TestCaseStatus.Failed:
      return 'destructive'
    case TestCaseStatus.Running:
      return 'outline'
    case TestCaseasi.Skipped:
      return 'secondary'
    default:
      return 'secondary'
  }
}

export const TestRunDetailsModal: React.FC<TestRunDetailsModalProps> = ({ isOpen, onClose, testRun, testCases }) => {
  if (!testRun) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Detalhes da Execução: {testRun.id}</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Caso de Teste</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Duração (ms)</TableHead>
                <TableHead>Saída</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {testCases.map((tc) => (
                <TableRow key={tc.id}>
                  <TableCell className="font-medium">{tc.description}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(tc.status)}>{tc.status}</Badge>
                  </TableCell>
                  <TableCell>{tc.duration}</TableCell>
                  <TableCell className="font-mono text-xs">{tc.actualOutput}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
