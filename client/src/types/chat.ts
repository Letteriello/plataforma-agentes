export interface Artifact {
  type: 'code' | 'table' | 'chart';
  language?: string;
  content?: string;
  data?: unknown;
}

export interface ChatMessage {
  id: string
  text: string
  sender: 'user' | 'agent' | 'system'
  timestamp: string
  senderName?: string
  avatarSeed?: string
  type?: 'text' | 'agent_thought' | 'artifact';
  artifact?: Artifact
}

export interface Session {
  id: string
  agentId: string
  createdAt: string
}

/**
 * Represents a file attached to a message.
 */
export interface Attachment {
  id: string;
  fileName: string;
  fileType: string; // e.g., 'image/png', 'application/pdf'
  size: number; // in bytes
  url: string; // URL to access the file
}
