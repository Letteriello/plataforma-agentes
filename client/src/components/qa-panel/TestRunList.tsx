import React from 'react'
import { TestRun } from '@/types/qa'

interface TestRunListProps {
  testRuns: TestRun[]
  onViewDetails: (testRun: TestRun) => void
}

const getStatusBadge = (status: 'passed' | 'failed' | 'running') => {
  const styles = {
    passed: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800',
    running: 'bg-blue-100 text-blue-800',
  }
  return (
    <span
      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${styles[status]}`}
    >
      {status}
    </span>
  )
}

export const TestRunList: React.FC<TestRunListProps> = ({
  testRuns,
  onViewDetails,
}) => {
  return (
    <div className="border rounded-lg">
      <table className="min-w-full divide-y divide-border">
        <thead className="bg-muted/50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Agente
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Status
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Resumo
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Data
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Ações
            </th>
          </tr>
        </thead>
        <tbody className="bg-background divide-y divide-border">
          {testRuns.map((run) => (
            <tr key={run.id}>
              <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                {run.agentName}
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-sm">
                {getStatusBadge(run.status)}
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-sm text-muted-foreground">
                {run.summary.passed}/{run.summary.totalTests} passaram
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-sm text-muted-foreground">
                {new Date(run.completedAt).toLocaleString()}
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  className="btn btn-sm btn-outline"
                  onClick={() => onViewDetails(run)}
                >
                  Ver Detalhes
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
