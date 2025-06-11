import React, { useState, useEffect } from 'react'
import { TestRunList } from '@/components/qa-panel/TestRunList'
import { TestRunDetailsModal } from '@/components/qa-panel/TestRunDetailsModal'
import { TestRun, TestCase } from '@/types/qa'

export const QAPanelPage: React.FC = () => {
  const [testRuns, setTestRuns] = useState<TestRun[]>([])
  const [testCases, setTestCases] = useState<TestCase[]>([])
  const [isModalOpen, setModalOpen] = useState(false)
  const [selectedTestRun, setSelectedTestRun] = useState<TestRun | null>(null)

  // TODO: Fetch test runs from API
  useEffect(() => {
    // setTestRuns(fetchedRuns);
  }, [])

  const handleViewDetails = (testRun: TestRun) => {
    setSelectedTestRun(testRun)
    // TODO: Fetch test cases for the selected run from an API
    // setTestCases(fetchedCasesForRun);
    setModalOpen(true)
  }

  const handleCloseModal = () => {
    setModalOpen(false)
    setSelectedTestRun(null)
    setTestCases([]) // Clear cases on modal close
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
