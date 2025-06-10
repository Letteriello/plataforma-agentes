// Em client/src/components/chat/ChatInterface.tsx
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { ConversationList } from './ConversationList'
import { MessageList } from './MessageList'
import { ChatInput } from './ChatInput'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

export const ChatInterface = () => {
  // Mock do agente selecionado - isso virá do seu state manager
  const selectedAgent = { name: 'Agente de Vendas', status: 'Online' }

  return (
    <ResizablePanelGroup direction="horizontal" className="flex-1 rounded-lg border">
      <ResizablePanel defaultSize={25} minSize={20}>
        <div className="flex h-full flex-col p-2">
          <h2 className="p-2 text-lg font-semibold">Conversas</h2>
          {/* 1. PAINEL DE CONVERSAS (ESQUERDA) */}
          <ConversationList />
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={75}>
        <div className="flex h-full flex-col">
          {/* 2. HEADER DO CHAT */}
          <header className="flex items-center gap-4 border-b p-4">
            <Avatar>
              <AvatarFallback>{selectedAgent.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{selectedAgent.name}</p>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="border-green-500 text-green-500">
                  {selectedAgent.status}
                </Badge>
              </div>
            </div>
          </header>

          {/* 3. LISTA DE MENSAGENS (CENTRO) */}
          <div className="flex-1 overflow-y-auto p-4">
            <MessageList />
          </div>

          {/* 4. ENTRADA DE TEXTO (ABAIXO) */}
          <div className="border-t p-4">
            <ChatInput />
          </div>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}
