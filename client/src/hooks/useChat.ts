import { useState } from 'react';
import { useSessionStore } from '@/store/sessionStore';
import chatService from '@/api/chatService';
import { Session, ChatMessage } from '@/types';

export interface UseChatReturn {
  sessions: Session[];
  activeSession: Session | null;
  messages: ChatMessage[];
  isLoading: boolean;
  error: Error | null;
  sendMessage: (text: string) => Promise<void>;
  switchSession: (sessionId: string) => void;
}

export const useChat = (): UseChatReturn => {
  const { sessions, activeSessionId, setActiveSession } = useSessionStore();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const activeSession = sessions.find(s => s.id === activeSessionId) || null;

  const sendMessage = async (text: string) => {
    if (!activeSession) return;
    setIsLoading(true);
    try {
      const msg = await chatService.sendMessage(activeSession.id, { text, sender: 'user', timestamp: new Date().toISOString() });
      setMessages(prev => [...prev, msg]);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  const switchSession = (id: string) => {
    setActiveSession(id);
    setMessages([]);
  };

  return { sessions, activeSession, messages, isLoading, error, sendMessage, switchSession };
};

export default useChat;
