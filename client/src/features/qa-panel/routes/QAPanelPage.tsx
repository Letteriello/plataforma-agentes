import React, { useEffect,useState } from 'react'

import { TestRunDetailsModal } from '@/features/qa-panel/components/TestRunDetailsModal'
import { TestRunList } from '@/features/qa-panel/components/TestRunList'
import { TestCase, TestCaseStatus,TestRun } from '@/types/qa'

// Mock Data para simulação
const mockTestCases: TestCase[] = [
  {
    id: 'tc-001',
    description: 'Verifica a saudação inicial do agente',
    input: { query: 'Olá' },
    expectedOutput: 'Olá! Como posso ajudar?',
    actualOutput: 'Olá! Como posso ajudar?',
    status: TestCaseStatus.Passed,
    duration: 120,
  },
  {
    id: 'tc-002',
    description: 'Testa a busca de informações sobre o produto X',
    input: { query: 'Me fale sobre o produto X' },
    expectedOutput: 'O produto X é uma solução inovadora para...',
    actualOutput: 'O produto X é uma solução inovadora para...',
    status: TestCaseStatus.Passed,
    duration: 450,
  },
  {
    id: 'tc-003',
    description: 'Testa a resposta para uma pergunta fora de escopo',
    input: { query: 'Qual a capital da Mongólia?' },
    expectedOutput: 'Desculpe, não tenho essa informação.',
    actualOutput: 'A capital da Mongólia é Ulaanbaatar.', // Falha
    status: TestCaseStatus.Failed,
    duration: 250,
    error: 'O agente respondeu a uma pergunta fora do escopo definido.',
  },
]

const mockTestRuns: TestRun[] = [
  {
    id: 'run-a4b1c8',
    agentId: 'agent-001',
    agentName: 'Agente de Vendas Pro',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // Ontem
    totalTests: 3,
    passed: 2,
    failed: 1,
    skipped: 0,
    duration: 820,
    testCases: mockTestCases,
  },
  {
    id: 'run-d9e2f7',
    agentId: 'agent-002',
    agentName: 'Assistente de Suporte Técnico',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // Anteontem
    totalTests: 5,
    passed: 5,
    failed: 0,
    skipped: 0,
    duration: 1540,
  },
]

export const QAPanelPage: React.FC = () => {
  const [testRuns, setTestRuns] = useState<TestRun[]>([])
  const [testCases, setTestCases] = useState<TestCase[]>([])
  const [isModalOpen, setModalOpen] = useState(false)
  const [selectedTestRun, setSelectedTestRun] = useState<TestRun | null>(null)

  // Simula o fetch dos dados da API
  useEffect(() => {
    setTestRuns(mockTestRuns)
  }, [])

  const handleViewDetails = (testRun: TestRun) => {
    setSelectedTestRun(testRun)
    // Em um cenário real, aqui seria feito o fetch dos casos de teste para o `testRun.id`
    // Para a simulação, usamos os dados já disponíveis no mock.
    setTestCases(testRun.testCases || [])
    setModalOpen(true)
  }

  const handleCloseModal = () => {
    setModalOpen(false)
    setSelectedTestRun(null)
    setTestCases([]) // Limpa os casos de teste ao fechar o modal
  }

  return (
    <div className="p-6 space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">Painel de QA Contínua</h2>
        <p className="text-muted-foreground">
          Monitore a qualidade e o desempenho dos seus agentes através dos
          resultados de testes contínuos.
        </p>
      </div>
      <section>
        <TestRunList testRuns={testRuns} onViewDetails={handleViewDetails} />
        <TestRunDetailsModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          testRun={selectedTestRun}
          testCases={testCases}
        />
      </section>
    </div>
  )
}

export default QAPanelPage
