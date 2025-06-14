import { act, renderHook } from '@testing-library/react';
import { vi } from 'vitest';

import chatService from '@/features/chat/services/chatService';
import { useSessionStore } from '@/features/chat/store/sessionStore';
import { type ChatMessage, type Session } from '@/types';

import { useChat } from './useChat';

vi.mock('@/features/chat/store/sessionStore');
// Correctly mock the service and the function that is actually used.
vi.mock('@/features/chat/services/chatService', () => ({
  default: {
    addMessageToSession: vi.fn(),
  },
}));

describe('useChat', () => {
  const mockSetActiveSession = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useSessionStore as unknown as vi.Mock).mockReturnValue({
      sessions: [{ id: '1', name: 's1' } as Session],
      activeSessionId: '1',
      setActiveSession: mockSetActiveSession,
    });
    // Mock the return value for the correct function.
    vi.mocked(chatService.addMessageToSession).mockResolvedValue({
      id: 'm1',
      text: 'hello',
      sender: 'user',
      timestamp: 'now',
    } as ChatMessage);
  });

  it('sendMessage calls service and updates messages', async () => {
    const { result } = renderHook(() => useChat());
    await act(async () => {
      await result.current.sendMessage('hello');
    });
    // Expect the correct function to have been called.
    expect(chatService.addMessageToSession).toHaveBeenCalledWith('1', {
      text: 'hello',
      sender: 'user',
      timestamp: expect.any(String),
    });
    expect(result.current.messages).toHaveLength(1);
  });

  it('switchSession clears messages and sets active session', () => {
    const { result } = renderHook(() => useChat());
    act(() => {
      result.current.switchSession('2');
    });
    expect(mockSetActiveSession).toHaveBeenCalledWith('2');
    expect(result.current.messages).toEqual([]);
  });
});
