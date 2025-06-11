import { renderHook, act } from '@testing-library/react'
import { vi } from 'vitest'
import { useChat } from './useChat'
import { useSessionStore } from '@/store/sessionStore'
import chatService from '@/api/chatService'
import { Session, ChatMessage } from '@/types'

vi.mock('@/store/sessionStore')
vi.mock('@/api/chatService')

describe('useChat', () => {
  const mockSetActiveSession = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    ;(useSessionStore as unknown as vi.Mock).mockReturnValue({
      sessions: [{ id: '1', name: 's1' } as Session],
      activeSessionId: '1',
      setActiveSession: mockSetActiveSession,
    })
    ;(chatService.sendMessage as unknown as vi.Mock).mockResolvedValue({
      id: 'm1',
      text: 'hello',
      sender: 'user',
      timestamp: 'now',
    } as ChatMessage)
  })

  it('sendMessage calls service and updates messages', async () => {
    const { result } = renderHook(() => useChat())
    await act(async () => {
      await result.current.sendMessage('hello')
    })
    expect(chatService.sendMessage).toHaveBeenCalledWith('1', {
      text: 'hello',
      sender: 'user',
      timestamp: expect.any(String),
    })
    expect(result.current.messages).toHaveLength(1)
  })

  it('switchSession clears messages and sets active session', () => {
    const { result } = renderHook(() => useChat())
    act(() => {
      result.current.switchSession('2')
    })
    expect(mockSetActiveSession).toHaveBeenCalledWith('2')
    expect(result.current.messages).toEqual([])
  })
})
