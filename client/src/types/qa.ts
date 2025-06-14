/**
 * @file Contém as definições de tipo para o Painel de QA Contínua.
 */

/**
 * Enum para os possíveis status de um caso de teste.
 */
export enum TestCaseStatus {
  Passed = 'Passed',
  Failed = 'Failed',
  Running = 'Running',
  Skipped = 'Skipped',
}

/**
 * Representa um único caso de teste dentro de uma execução de teste.
 */
export interface TestCase {
  id: string
  description: string
  input: Record<string, unknown> // Entrada fornecida ao agente
  expectedOutput: string // Saída esperada
  actualOutput: string // Saída real do agente
  status: TestCaseStatus
  duration: number // Duração em milissegundos
  error?: string | null // Mensagem de erro, se houver
}

/**
 * Representa uma execução completa de testes para um agente específico.
 */
export interface TestRun {
  id: string
  agentId: string
  agentName: string
  timestamp: string // Data e hora no formato ISO 8601
  totalTests: number
  passed: number
  failed: number
  skipped: number
  duration: number // Duração total em segundos
  testCases?: TestCase[] // Opcional, pode ser carregado sob demanda
}
