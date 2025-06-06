// client/src/pages/ChatPage.tsx
import React, { useState } from 'react'; // Import useState
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import { ConversationList, ChatInterface } from '@/components/chat'; // Import components
import type { ChatMessage } from '@/components/chat'; // Import type ChatMessage
import { getInitialMessages, initialActiveConversationId } from '@/components/chat/mockData';

console.log('ChatPage module loaded');

const ChatPage: React.FC = () => {
  const [activeConversationId, setActiveConversationId] = useState<string | null>(initialActiveConversationId);
  const [messages, setMessages] = useState<ChatMessage[]>(() => 
    getInitialMessages(initialActiveConversationId)
  );

  // This function will be passed to ChatInput within ChatInterface
  // It needs to be adapted if ChatInput's onSendMessage prop has a different signature
  const handleSendMessage = (messageText: string) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(), // Simple unique ID for now
      text: messageText,
      sender: 'user', // Assuming messages sent through ChatInput are from the user
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      senderName: 'Usuário', // Placeholder
      avatarSeed: 'User', // Placeholder
    };
    setMessages((prevMessages) => [...prevMessages, newMessage]);

    // Simular resposta do agente
    setTimeout(() => {
      const userMessageText = messageText.toLowerCase();
      let agentResponseText = `Recebi sua mensagem: "${messageText}". Como posso ajudar?`;

      if (userMessageText.includes('nexus') || userMessageText.includes('plano')) {
        agentResponseText = 'O Plano Nexus é nossa solução completa para desenvolvimento de agentes inteligentes. Gostaria de saber mais sobre preços ou funcionalidades específicas?';
      } else if (userMessageText.includes('ajuda') || userMessageText.includes('suporte')) {
        agentResponseText = 'Claro, posso ajudar! Qual é a sua dúvida ou problema específico?';
      } else if (userMessageText.includes('olá') || userMessageText.includes('oi') || userMessageText.includes('bom dia') || userMessageText.includes('boa tarde') || userMessageText.includes('boa noite')) {
        agentResponseText = 'Olá! Em que posso ser útil hoje?';
      }

      const agentMessage: ChatMessage = {
        id: Date.now().toString() + '-agent',
        text: agentResponseText,
        sender: 'agent',
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        senderName: 'Agente ProAtivo',
        avatarSeed: 'AgentProActiveBot',
      };
      setMessages((prevMessages) => [...prevMessages, agentMessage]);
    }, 1500);
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
        {/* ChatInterface now accepts messages and onSendMessage props */}
        <ChatInterface messages={messages} onSendMessage={handleSendMessage} />
        {/* The ChatInterface is expected to take messages and onSendMessage as props if we follow the previous pattern.
            However, the example ChatInterface in Step 2 did not define these props explicitly,
            instead it had mockMessages and a console.log for onSendMessage.
            For a real integration, ChatInterface should accept these.
            Let's assume for now ChatInterface is self-contained or we will modify it in a later step
            to accept messages and onSendMessage from ChatPage.

            If ChatInterface from Step 2 is used directly:
            It has its own mock messages and console.logs send.
            This means the messages state and handleSendMessage in ChatPage would not be used by ChatInterface
            unless ChatInterface is modified.

            Revisiting ChatInterface from Step 2:
            It takes NO props. It has its OWN mockMessages and its OWN console.log for sending.
            This means the state `messages` and `handleSendMessage` in `ChatPage` are now NOT connected to the UI.
            This needs to be rectified. ChatInterface should be a "dumb" component taking props.

            Let's modify ChatInterface (from step 2) to accept messages and onSendMessage.
            This was not part of *this* subtask, but is necessary for correct integration.
            The example for ChatInterface in *this* subtask (Step 3) is:
            <div style={{ height: 'calc(100vh - YOUR_HEADER_HEIGHT_IF_ANY)', width: '100%' }}>
              <ChatInterface />
            </div>
            This still implies ChatInterface is self-contained.

            Given the current ChatInterface definition (from Step 2 output):
            `const ChatInterface: React.FC = () => { ... }` takes no props.
            It uses its own `mockMessages`.
            Its `ChatInput` calls `console.log('Send:', msg)`.

            To make this work with ChatPage's state, ChatInterface MUST be modified.
            I will proceed with the current task of placing <ChatInterface />.
            Then, a follow-up task will be to make ChatInterface prop-driven.

            For now, the ChatPage's message state and send handler will be unused by the rendered UI.
            The ChatInterface will display its own internal mock messages.
          */}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default ChatPage;