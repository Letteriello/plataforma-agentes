import React, { useState, useEffect } from 'react'
import { ScenarioSelector } from '@/components/simulation-sandbox/ScenarioSelector'
import { ChatPanel } from '@/components/simulation-sandbox/ChatPanel'
import { ReasoningPanel } from '@/components/simulation-sandbox/ReasoningPanel'
import { Scenario, ChatMessage, ReasoningStep } from '@/types/simulation'

export const SimulationSandboxPage: React.FC = () => {
  const [scenarios, setScenarios] = useState<Scenario[]>([])
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [reasoningSteps, setReasoningSteps] = useState<ReasoningStep[]>([])
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>('')

  // TODO: Fetch scenarios from API
  useEffect(() => {
    // setScenarios(fetchedScenarios);
  }, [])

  // Effect to load initial data when a scenario is selected
  useEffect(() => {
    if (selectedScenarioId) {
      const selectedScenario = scenarios.find(
        (s) => s.id === selectedScenarioId,
      )
      if (selectedScenario) {
        // TODO: Fetch initial messages and steps from API based on scenario
        const initialMessage: ChatMessage = {
          id: 'msg-initial',
          text: selectedScenario.initialPrompt,
          sender: 'user',
          timestamp: new Date().toISOString(),
        }
        setMessages([initialMessage])
        setReasoningSteps([]) // Clear previous steps
      }
    } else {
      setMessages([])
      setReasoningSteps([])
    }
  }, [selectedScenarioId, scenarios])

  const handleSelectScenario = (scenarioId: string) => {
    setSelectedScenarioId(scenarioId)
  }

  const handleSendMessage = (message: string) => {
    const newUserMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      text: message,
      sender: 'user',
      timestamp: new Date().toISOString(),
    }
    setMessages((prev) => [...prev, newUserMessage])

    // TODO: Replace with actual agent interaction API call
    // Simulate agent response
    setTimeout(() => {
      const newReasoningStep: ReasoningStep = {
        id: `step-${Date.now()}`,
        thought: 'Analisando a nova mensagem do usuário...',
        timestamp: new Date().toISOString(),
      }
      setReasoningSteps((prev) => [...prev, newReasoningStep])

      const agentResponse: ChatMessage = {
        id: `agent-${Date.now()}`,
        text: 'Entendido. Processando sua solicitação...',
        sender: 'agent',
        timestamp: new Date().toISOString(),
      }
      setMessages((prev) => [...prev, agentResponse])
    }, 1000)
  }

  return (
    <div className="p-6 h-full flex flex-col space-y-4">
      <div>
        <h2 className="text-2xl font-bold mb-2">Sandbox de Simulação</h2>
        <p className="text-muted-foreground">
          Teste e depure seus agentes em um ambiente interativo.
        </p>
      </div>

      <ScenarioSelector
        scenarios={scenarios}
        onSelectScenario={handleSelectScenario}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow min-h-0">
        <ChatPanel messages={messages} onSendMessage={handleSendMessage} />
        <ReasoningPanel steps={reasoningSteps} />
      </div>
    </div>
  )
}

export default SimulationSandboxPage
