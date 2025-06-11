import React from 'react'
import { TestRun, TestCase } from '@/types/qa'

interface TestRunDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  testRun: TestRun | null
  // In a real app, you'd fetch test cases based on testRun.id
  testCases: TestCase[]
}

const getTestCaseStatusIcon = (status: 'passed' | 'failed') => {
  return status === 'passed' ? (
    <span className="text-green-500">✔</span>
  ) : (
    <span className="text-red-500">✖</span>
  )
}

export const TestRunDetailsModal: React.FC<TestRunDetailsModalProps> = ({
  isOpen,
  onClose,
  testRun,
  testCases,
}) => {
  if (!isOpen || !testRun) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-background rounded shadow-lg w-full max-w-2xl p-6 relative">
        <button
          className="absolute top-2 right-2 btn btn-sm btn-ghost"
          onClick={onClose}
          aria-label="Fechar"
        >
          ×
        </button>
        <h3 className="font-semibold mb-1">Detalhes da Execução de Teste</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Agente: {testRun.agentName}
        </p>

        <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
          {testCases.map((tc) => (
            <div key={tc.id} className="border rounded p-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  {getTestCaseStatusIcon(tc.status)}
                  <span className="font-medium">{tc.description}</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {tc.duration}ms
                </span>
              </div>
              {tc.status === 'failed' && tc.error && (
                <pre className="mt-2 text-xs bg-red-50 text-red-700 p-2 rounded font-mono">
                  {tc.error}
                </pre>
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-end pt-4">
          <button type="button" className="btn btn-outline" onClick={onClose}>
            Fechar
          </button>
        </div>
      </div>
    </div>
  )
}
