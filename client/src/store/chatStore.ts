import { create } from 'zustand'
import { ChatMessage, Artifact } from '../components/chat/types' // Import ChatMessage and Artifact

export interface Conversation {
  id: string;      // Session ID
  agentId: string; // Agent ID, crucial for sending messages
  agentName: string;
  lastMessage: string;
}

interface ChatStore {
  conversations: Conversation[]
  selectedConversationId: string | null
  messages: ChatMessage[] // Add messages state
  activeArtifact: Artifact | null
  setSelectedConversationId: (id: string | null) => void
  loadConversations: (conversations: Conversation[]) => void
  loadMessages: (messages: ChatMessage[]) => void // Add loadMessages action
  addMessage: (message: ChatMessage) => void // Add addMessage action
  addConversation: (conversation: Conversation) => void
  renameConversation: (id: string, newName: string) => void
  deleteConversation: (id: string) => void
  setActiveArtifact: (artifact: Artifact | null) => void
}

export const useChatStore = create<ChatStore>((set) => ({
  conversations: [],
  selectedConversationId: null,
  messages: [], // Initialize messages
  activeArtifact: null,
  setSelectedConversationId: (id) => {
    // When a conversation is selected, we clear the messages.
    // The UI component will be responsible for fetching the messages for the selected conversation.
    set({
      selectedConversationId: id,
      messages: [],
    })
  },
  loadConversations: (conversations) => set({ conversations }),
  loadMessages: (messages) => set({ messages }), // Implement loadMessages
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })), // Implement addMessage
  addConversation: (conversation) =>
    set((state) => ({ conversations: [...state.conversations, conversation] })),
  renameConversation: (id, newName) =>
    set((state) => ({
      conversations: state.conversations.map((c) =>
        c.id === id ? { ...c, agentName: newName } : c,
      ),
    })),
  deleteConversation: (id) =>
    set((state) => {
      const remaining = state.conversations.filter((c) => c.id !== id)
      const isSelected = state.selectedConversationId === id
      return {
        conversations: remaining,
        selectedConversationId: isSelected
          ? null
          : state.selectedConversationId,
        messages: isSelected ? [] : state.messages,
      }
    }),
  setActiveArtifact: (artifact) => set({ activeArtifact: artifact }),
}))
