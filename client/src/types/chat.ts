export interface ChatMessage {
  id: string; // Real ID from backend, or temporary ID for user messages
  text: string;
  sender: 'user' | 'agent' | 'system';
  timestamp: string;
  senderName?: string;
  avatarSeed?: string;
  isStreaming?: boolean; // True if this message is currently being streamed
  streamId?: string;     // Client-generated ID to associate chunks with a message
}

export interface Session {
  id: string;
  agentId: string;
  createdAt: string;
}
