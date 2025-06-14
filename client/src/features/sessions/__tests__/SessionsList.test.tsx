import { fireEvent, render, screen } from '@testing-library/react'
import SessionsList from '../components/SessionsList'
import mockSessions from '@/data/mock-sessions.json'

describe('SessionsList', () => {
  it('renders sessions from mock data', () => {
    render(<SessionsList />)
    mockSessions.forEach(session => {
      expect(screen.getByText(session.id)).toBeInTheDocument()
      expect(screen.getByText(session.agentName)).toBeInTheDocument()
    })
  })

  it('allows deleting a session', () => {
    render(<SessionsList />)
    const deleteButtons = screen.getAllByRole('button', { name: 'Excluir' })
    fireEvent.click(deleteButtons[0])
    expect(screen.queryByText(mockSessions[0].id)).not.toBeInTheDocument()
  })
})
