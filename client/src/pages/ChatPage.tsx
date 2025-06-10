// Em client/src/pages/ChatPage.tsx
import { ChatInterface } from '@/components/chat/ChatInterface'

const ChatPage = () => {
  return (
    <div className="flex h-[calc(100vh-theme(spacing.16))] flex-col">
      {/* O componente ChatInterface conterá toda a lógica e layout */}
      <ChatInterface />
    </div>
  )
}

export default ChatPage
