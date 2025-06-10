import { create } from 'zustand';
import { ChatMessage } from '../components/chat/types'; // Import ChatMessage
import { getInitialMessages } from '../components/chat/mockData'; // Import mock messages function

export interface Conversation {
  id: string;
  agentName: string;
  lastMessage: string;
}

interface ChatStore {
  conversations: Conversation[];
  selectedConversationId: string | null;
  messages: ChatMessage[]; // Add messages state
  setSelectedConversationId: (id: string | null) => void;
  loadConversations: (conversations: Conversation[]) => void;
  loadMessages: (messages: ChatMessage[]) => void; // Add loadMessages action
  addMessage: (message: ChatMessage) => void; // Add addMessage action
}

export const useChatStore = create<ChatStore>((set, get) => ({
  conversations: [],
  selectedConversationId: null,
  messages: [], // Initialize messages
  setSelectedConversationId: (id) => {
    set({ selectedConversationId: id });
    if (id === null) {
      set({ messages: [] }); // Clear messages if id is null
    } else {
      const mockMessages = getInitialMessages(id); // Fetch messages for the new id
      set({ messages: mockMessages });
    }
  },
  loadConversations: (conversations) => set({ conversations }),
  loadMessages: (messages) => set({ messages }), // Implement loadMessages
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })), // Implement addMessage
}));
