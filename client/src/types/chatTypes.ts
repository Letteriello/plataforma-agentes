// Corresponds to SenderType in Pydantic
export enum ChatMessageSenderType {
  USER = 'USER',
  AGENT = 'AGENT',
  SYSTEM = 'SYSTEM',
}

// Corresponds to ChatMessageBase and ChatMessageCreate in Pydantic
// For ChatMessageCreatePayload, session_id is handled by the service method context
export interface ChatMessageCreatePayload {
  content: string;
  sender_type: ChatMessageSenderType; // Should be 'USER' when client sends via postMessageToAgent
  content_metadata?: Record<string, unknown> | null;
  parent_message_id?: string | null; // UUID
}

// Corresponds to ChatMessageResponse in Pydantic
export interface ChatMessage {
  id: string; // UUID
  session_id: string; // UUID
  sender_type: ChatMessageSenderType;
  content: string;
  content_metadata?: Record<string, unknown> | null;
  parent_message_id?: string | null; // UUID
  created_at: string; // ISO datetime string
  updated_at: string; // ISO datetime string
  // Potentially 'children_messages' if we decide to fetch them eagerly
}

// Corresponds to ChatSessionCreate in Pydantic
export interface ChatSessionCreatePayload {
  agent_id: string; // UUID
  session_title?: string | null;
  session_metadata?: Record<string, unknown> | null;
}

// Corresponds to ChatSessionUpdate in Pydantic
export interface ChatSessionUpdatePayload {
  session_title?: string | null;
  session_metadata?: Record<string, unknown> | null;
  // archived?: boolean | null; // If we add this field later
}

// Corresponds to ChatSessionResponse in Pydantic
export interface ChatSession {
  id: string; // UUID
  user_id: string; // UUID
  agent_id: string; // UUID
  session_title?: string | null;
  session_metadata?: Record<string, unknown> | null;
  created_at: string; // ISO datetime string
  updated_at: string; // ISO datetime string
  // archived?: boolean; // If we add this field later
}

// Corresponds to ChatSessionDetailResponse in Pydantic
export interface ChatSessionDetail extends ChatSession {
  messages: ChatMessage[];
}

// You might also want a type for the user message payload for postMessageToAgent
// if it's slightly different (e.g., sender_type is fixed to USER)
export interface UserAgentMessagePayload {
    content: string;
  content_metadata?: Record<string, unknown> | null;
    // sender_type is implicitly 'USER'
}
