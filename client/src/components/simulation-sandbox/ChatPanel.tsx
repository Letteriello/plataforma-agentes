import React, { useRef, useEffect } from 'react'
import { ChatMessage } from '@/types/simulation'

interface ChatPanelProps {
  messages: ChatMessage[]
  onSendMessage: (message: string) => void
}

export const ChatPanel: React.FC<ChatPanelProps> = ({
  messages,
  onSendMessage,
}) => {
  const messageEndRef = useRef<null | HTMLDivElement>(null)
  const inputRef = useRef<null | HTMLInputElement>(null)

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputRef.current?.value) {
      onSendMessage(inputRef.current.value)
      inputRef.current.value = ''
    }
  }

  return (
    <div className="border rounded-lg flex flex-col h-full">
      <div className="p-4 border-b">
        <h3 className="font-semibold">Chat com o Agente</h3>
      </div>
      <div className="flex-grow p-4 space-y-4 overflow-y-auto">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`rounded-lg px-4 py-2 max-w-xs lg:max-w-md ${msg.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={messageEndRef} />
      </div>
      <div className="p-4 border-t">
        <form onSubmit={handleFormSubmit} className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            placeholder="Digite sua mensagem..."
            className="input flex-grow"
          />
          <button type="submit" className="btn btn-primary">
            Enviar
          </button>
        </form>
      </div>
    </div>
  )
}
