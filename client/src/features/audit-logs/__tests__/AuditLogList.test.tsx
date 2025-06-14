import { render, screen } from '@testing-library/react'
import { AuditLogList } from '../components/AuditLogList'
import type { AuditLog } from '@/types/common'

const sampleLogs: AuditLog[] = [
  {
    id: '1',
    timestamp: '2024-06-01T12:00:00Z',
    actor: { type: 'user', id: 'u1', name: 'User One' },
    action: 'login',
    details: { info: 'Logged in' },
  },
  {
    id: '2',
    timestamp: '2024-06-02T10:00:00Z',
    actor: { type: 'agent', id: 'a1', name: 'Agent One' },
    action: 'update',
    details: { field: 'name' },
  },
]

describe('AuditLogList', () => {
  it('shows empty message when no logs', () => {
    render(<AuditLogList logs={[]} />)
    expect(screen.getByText('Nenhum log de auditoria encontrado.')).toBeInTheDocument()
  })

  it('renders a row for each log entry', () => {
    render(<AuditLogList logs={sampleLogs} />)
    expect(screen.getAllByRole('row')).toHaveLength(sampleLogs.length + 1) // +1 for header
    expect(screen.getByText('User One')).toBeInTheDocument()
    expect(screen.getByText('Agent One')).toBeInTheDocument()
  })
})
