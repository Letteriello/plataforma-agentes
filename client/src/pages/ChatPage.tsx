// client/src/pages/ChatPage.tsx
import React, { useState } from 'react'; // Import useState
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import { ConversationList, MessageDisplayArea, MessageInput } from '@/components/chat'; // Import components
import type { ChatMessage } from '@/components/chat'; // Import type ChatMessage
import { getInitialMessages, initialActiveConversationId } from '@/components/chat/mockData';

console.log('ChatPage module loaded');

const ChatPage: React.FC = () => {
  const [activeConversationId, setActiveConversationId] = useState<string | null>(initialActiveConversationId);
  const [messages, setMessages] = useState<ChatMessage[]>(() => 
    getInitialMessages(initialActiveConversationId)
  );

  const handleAddMessage = (newMessageData: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(), // Simple unique ID for now
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }), // Formatted timestamp
      ...newMessageData,
    };
    setMessages((prevMessages) => [...prevMessages, newMessage]);

    // Simular resposta do agente se a mensagem for do usuário
    if (newMessageData.sender === 'user') {
      setTimeout(() => {
        const userMessageText = newMessageData.text.toLowerCase();
        let agentResponseText = `Recebi sua mensagem: "${newMessageData.text}". Como posso ajudar?`; // Resposta padrão

        if (userMessageText.includes('nexus') || userMessageText.includes('plano')) {
          agentResponseText = 'O Plano Nexus é nossa solução completa para desenvolvimento de agentes inteligentes. Gostaria de saber mais sobre preços ou funcionalidades específicas?';
        } else if (userMessageText.includes('ajuda') || userMessageText.includes('suporte')) {
          agentResponseText = 'Claro, posso ajudar! Qual é a sua dúvida ou problema específico?';
        } else if (userMessageText.includes('olá') || userMessageText.includes('oi') || userMessageText.includes('bom dia') || userMessageText.includes('boa tarde') || userMessageText.includes('boa noite')) {
          agentResponseText = 'Olá! Em que posso ser útil hoje?';
        }

        const agentResponse: Omit<ChatMessage, 'id' | 'timestamp'> = {
          text: agentResponseText,
          sender: 'agent',
          senderName: 'Agente ProAtivo', // Nome atualizado
          avatarSeed: 'AgentProActiveBot' // Seed atualizado
        };
        handleAddMessage(agentResponse);
      }, 1500);
    }
  };

  const handleSelectConversation = (conversationId: string) => {
    setActiveConversationId(conversationId);
    // Carrega as mensagens da conversa selecionada
    const conversationMessages = getInitialMessages(conversationId);
    setMessages(conversationMessages);
  };
  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="h-full max-h-[calc(100vh-4rem-2rem)] w-full rounded-lg border border-border bg-background text-foreground"
      // Assumindo Topbar h-16 (4rem) e MainLayout p-4 (py-4 -> 2rem)
      // Changed border and bg-card to bg-background to match MainLayout style for the group
    >
      <ResizablePanel defaultSize={25} minSize={20} maxSize={40}>
        {/* Conteúdo da Lista de Conversas */}
        <ConversationList activeConversationId={activeConversationId} onSelectConversation={handleSelectConversation} />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={75}>
        <ResizablePanelGroup direction="vertical">
          <ResizablePanel defaultSize={80} minSize={50}>
            {/* Conteúdo da Área de Mensagens */}
            <MessageDisplayArea messages={messages} />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={20} minSize={15} maxSize={25}>
            {/* Conteúdo do Campo de Entrada */}
            <MessageInput onSendMessage={handleAddMessage} />
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default ChatPage;