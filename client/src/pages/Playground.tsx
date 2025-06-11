import { ChatInterface, ReasoningPanel } from '@/components/chat';

export default function PlaygroundPage() {
  return (
    <div className="flex h-[calc(100vh-theme(spacing.16))] flex-col">
      <ChatInterface RightPanelComponent={ReasoningPanel} />
    </div>
  );
}
