import { ChatInterface, ReasoningPanel, SessionPanel } from '@/components/chat'

export default function PlaygroundPage() {
  return (
    <div className="flex h-[calc(100vh-theme(spacing.16))] flex-col">
      <ChatInterface
        LeftPanelComponent={SessionPanel}
        RightPanelComponent={ReasoningPanel}
      />
    </div>
  )
}
