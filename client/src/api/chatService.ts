import { Session, ChatMessage } from '@/types';
import { useSessionStore } from '@/store/sessionStore';

export interface IChatService {
  /** Lista as sess\u00f5es de um usu\u00e1rio */
  fetchSessions(userId: string): Promise<Session[]>;
  /** Carrega mensagens de uma sess\u00e3o */
  fetchSessionMessages(sessionId: string): Promise<ChatMessage[]>;
  /** Envia uma mensagem */
  sendMessage(sessionId: string, message: Omit<ChatMessage, 'id'>): Promise<ChatMessage>;
  /** Inicia uma nova sess\u00e3o */
  startNewSession(userId: string, agentId: string): Promise<Session>;
}

const SIM_DELAY = 300;
const delay = (ms: number) => new Promise(r => setTimeout(r, ms));

export const chatService: IChatService = {
  async fetchSessions(_userId: string) {
    await delay(SIM_DELAY);
    const { sessions } = useSessionStore.getState();
    return [...sessions];
  },

  async fetchSessionMessages(sessionId: string) {
    await delay(SIM_DELAY);
    const { sessions } = useSessionStore.getState();
    const session = sessions.find(s => s.id === sessionId);
    return session ? (session as any).messages || [] : [];
  },

  async sendMessage(sessionId: string, message: Omit<ChatMessage, 'id'>) {
    await delay(SIM_DELAY);
    const newMessage: ChatMessage = { id: crypto.randomUUID(), ...message };
    // aqui apenas retorna a mensagem, implementa\u00e7\u00e3o real iria atualizar o store
    return newMessage;
  },

  async startNewSession(_userId: string, agentId: string) {
    await delay(SIM_DELAY);
    const newSession: Session = {
      id: crypto.randomUUID(),
      agentId,
      createdAt: new Date().toISOString(),
    } as Session;
    return newSession;
  },
};

export default chatService;
