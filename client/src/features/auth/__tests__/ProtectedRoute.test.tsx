import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { vi } from 'vitest'
import ProtectedRoute from '../components/ProtectedRoute'
import { useAuthStore } from '@/store/authStore'

vi.mock('@/store/authStore')

describe('ProtectedRoute', () => {
  it('redirects to login when no token', () => {
    (useAuthStore as unknown as vi.Mock).mockReturnValue({ token: null })
    render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route element={<ProtectedRoute />}> 
            <Route path="/protected" element={<div>Protected</div>} />
          </Route>
          <Route path="/login" element={<div>Login</div>} />
        </Routes>
      </MemoryRouter>,
    )
    expect(screen.getByText('Login')).toBeInTheDocument()
  })

  it('renders outlet when token exists', () => {
    (useAuthStore as unknown as vi.Mock).mockReturnValue({ token: 'abc' })
    render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route element={<ProtectedRoute />}> 
            <Route path="/protected" element={<div>Protected</div>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    )
    expect(screen.getByText('Protected')).toBeInTheDocument()
  })
})
