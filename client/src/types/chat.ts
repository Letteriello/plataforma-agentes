export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'agent' | 'system';
  timestamp: string;
  senderName?: string;
  avatarSeed?: string;
}

export interface Session {
  id: string;
  agentId: string;
  createdAt: string;
}
