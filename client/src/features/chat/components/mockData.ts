import type { ChatMessage } from './types'

export interface ConversationMock {
  id: string
  name: string
  messages: ChatMessage[]
  lastMessagePreview?: string
}

export const mockConversationsData: Record<string, ConversationMock> = {
  'conv-alpha-01': {
    id: 'conv-alpha-01',
    name: 'Agente Alpha',
    lastMessagePreview: 'O agente está raciocinando...',
    messages: [
      {
        id: 'msg1-alpha',
        text: 'Olá! Esta é uma mensagem mock de um agente.',
        sender: 'agent',
        timestamp: '10:00',
        senderName: 'Agente Alpha',
        avatarSeed: 'agente-alpha-seed',
      },
      {
        id: 'msg2-alpha',
        text: 'Oi, Agente Alpha! Esta é uma resposta do usuário.',
        sender: 'user',
        timestamp: '10:01',
        avatarSeed: 'user-seed-123',
      },
      {
        id: 'msg3-alpha',
        text: 'Como posso te ajudar hoje?',
        sender: 'agent',
        timestamp: '10:02',
        senderName: 'Agente Alpha',
        avatarSeed: 'agente-alpha-seed',
      },
      {
        id: 'msg4-alpha',
        text: '',
        sender: 'agent',
        timestamp: '10:03',
        senderName: 'Agente Alpha',
        avatarSeed: 'agente-alpha-seed',
        type: 'agent_thought',
      },
    ],
  },
  'conv-beta-02': {
    id: 'conv-beta-02',
    name: 'Agente Beta',
    lastMessagePreview: 'Entendido. Processando sua nova solicitação...',
    messages: [
      {
        id: 'msg1-beta',
        text: 'Olá! Eu sou o Agente Beta. Em que posso ajudar?',
        sender: 'agent',
        timestamp: '09:30',
        senderName: 'Agente Beta',
        avatarSeed: 'agente-beta-seed',
      },
      {
        id: 'msg2-beta',
        text: 'Preciso de ajuda com uma solicitação.',
        sender: 'user',
        timestamp: '09:31',
        avatarSeed: 'user-seed-123',
      },
      {
        id: 'msg3-beta',
        text: 'Claro! Por favor, me conte mais detalhes sobre o que você precisa.',
        sender: 'agent',
        timestamp: '09:32',
        senderName: 'Agente Beta',
        avatarSeed: 'agente-beta-seed',
      },
      {
        id: 'msg4-beta',
        text: 'Preciso configurar um novo agente no sistema.',
        sender: 'user',
        timestamp: '09:33',
        avatarSeed: 'user-seed-123',
      },
      {
        id: 'msg5-beta',
        text: 'Entendido. Processando sua nova solicitação...',
        sender: 'agent',
        timestamp: '09:34',
        senderName: 'Agente Beta',
        avatarSeed: 'agente-beta-seed',
      },
    ],
  },
  'conv-geral-03': {
    id: 'conv-geral-03',
    name: 'Chat Geral',
    lastMessagePreview: 'Bem-vindo ao chat!',
    messages: [
      {
        id: 'msg1-geral',
        text: 'Bem-vindo ao Chat Geral! Aqui você pode conversar com a equipe.',
        sender: 'system',
        timestamp: '08:00',
        senderName: 'Sistema',
        avatarSeed: 'system',
      },
      {
        id: 'msg2-geral',
        text: 'Olá pessoal! Alguém pode me ajudar com uma dúvida sobre o projeto?',
        sender: 'user',
        timestamp: '08:15',
        avatarSeed: 'user-seed-123',
      },
    ],
  },
}

export const initialActiveConversationId = 'conv-alpha-01'

export const getInitialMessages = (conversationId: string): ChatMessage[] => {
  return mockConversationsData[conversationId]?.messages || []
}

export const getConversationList = (): ConversationMock[] => {
  return Object.values(mockConversationsData)
}
