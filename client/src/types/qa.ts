export interface TestRun {
  id: string
  agentId: string
  agentName: string
  startedAt: string
  completedAt: string
  status: 'passed' | 'failed' | 'running'
  summary: {
    totalTests: number
    passed: number
    failed: number
  }
}

export interface TestCase {
  id: string
  description: string
  status: 'passed' | 'failed'
  duration: number // in ms
  logs?: string
  error?: string
}
