import { vi } from 'vitest'

import { mockInitialAgents } from '@/data/mocks/mock-initial-agents'
import { AgentType,AnyAgentConfig } from '@/types/core/agent' // Using core types

import { useAgentStore } from './agentStore'

// Helper to reset store state before each test if needed, though not strictly necessary for all tests.
// Zustand stores are global. For true isolation, you might re-create or use specific reset actions.
// For this store, its own actions can bring it to a known state.
const getInitialState = () => useAgentStore.getState()

describe('agentStore', () => {
  const originalCrypto = global.crypto

  beforeEach(() => {
    // Reset the store to a state reflecting only the initial mock load for consistency.
    // This ensures that tests don't interfere with each other if they modify the global store state.
    useAgentStore.setState({
      ...getInitialState(),
      agents: [...mockInitialAgents],
      activeAgent: null,
      error: null,
      isLoading: false,
    })

    // Mock crypto.randomUUID if it's used for ID generation and not available in test env (e.g. older Node)
    // Modern Vitest/Jest with JSDOM usually provide it.
    if (!global.crypto) {
      global.crypto = {
        randomUUID: () => Math.random().toString(36).substring(2, 15),
      } as unknown as Crypto
    }
  })

  afterAll(() => {
    global.crypto = originalCrypto // Restore original crypto if mocked
  })

  it('should initialize with mockInitialAgents', () => {
    const { agents } = useAgentStore.getState()
    // The store loads mockInitialAgents at the time of its definition.
    expect(agents.length).toBe(mockInitialAgents.length)
    expect(agents).toEqual(
      expect.arrayContaining(
        mockInitialAgents.map((agent) => expect.objectContaining(agent)),
      ),
    )
  })

  it('loadAgents should replace all existing agents', () => {
    const { loadAgents } = useAgentStore.getState()
    const newAgents: AnyAgentConfig[] = [
      {
        id: 'new1',
        name: 'New Agent 1',
        type: AgentType.LLM,
        model: 'm1',
        instruction: 'i1',
        version: '1',
      },
    ]
    loadAgents(newAgents)
    const { agents } = useAgentStore.getState()
    expect(agents).toEqual(newAgents)
    expect(agents.length).toBe(1)
  })

  it('addAgent should add an agent to the list', () => {
    const { addAgent, agents: initialAgents } = useAgentStore.getState()
    const newAgentData: Partial<AnyAgentConfig> = {
      name: 'Brand New Agent',
      type: AgentType.LLM,
      model: 'm2',
      instruction: 'i2',
      version: '1',
    }

    // Mock crypto.randomUUID for predictable ID if agent has no ID
    const mockUUID = 'mock-uuid-123'
    const originalRandomUUID = crypto.randomUUID
    ;(global.crypto as unknown as { randomUUID: () => string }).randomUUID = vi.fn(() => mockUUID)

    addAgent(newAgentData as AnyAgentConfig)

    const { agents } = useAgentStore.getState()
    expect(agents.length).toBe(initialAgents.length + 1)
    const addedAgent = agents.find((a) => a.name === 'Brand New Agent')
    expect(addedAgent).toBeDefined()
    expect(addedAgent?.id).toBe(mockUUID) // Check if ID was generated

    // Test adding an agent that already has an ID
    const agentWithId: AnyAgentConfig = {
      id: 'predefined-id',
      name: 'Agent With ID',
      type: AgentType.LLM,
      model: 'm3',
      instruction: 'i3',
      version: '1',
    }
    addAgent(agentWithId)
    const { agents: agentsAfterWithId } = useAgentStore.getState()
    expect(agentsAfterWithId.length).toBe(initialAgents.length + 2)
    expect(agentsAfterWithId.find((a) => a.id === 'predefined-id')).toEqual(
      agentWithId,
    )

    ;(global.crypto as unknown as { randomUUID: () => string }).randomUUID = originalRandomUUID // Restore
  })

  it('removeAgent should remove an agent by ID', () => {
    const { removeAgent, agents: initialAgents } = useAgentStore.getState()
    const agentToRemove = mockInitialAgents[0] // Assuming at least one agent in mocks
    expect(agentToRemove).toBeDefined()

    removeAgent(agentToRemove.id)

    const { agents } = useAgentStore.getState()
    expect(agents.length).toBe(initialAgents.length - 1)
    expect(agents.find((a) => a.id === agentToRemove.id)).toBeUndefined()
  })

  it('removeAgent should clear activeAgent if it is the one being removed', () => {
    const { removeAgent, setActiveAgent } = useAgentStore.getState()
    const agentToActivateAndRemove = mockInitialAgents[0]

    setActiveAgent(agentToActivateAndRemove)
    expect(useAgentStore.getState().activeAgent).toEqual(
      agentToActivateAndRemove,
    )

    removeAgent(agentToActivateAndRemove.id)

    expect(useAgentStore.getState().activeAgent).toBeNull()
  })

  it('removeAgent should not affect activeAgent if a different agent is removed', () => {
    const { removeAgent, setActiveAgent } = useAgentStore.getState()
    if (mockInitialAgents.length < 2) {
      return // Skip if not enough agents
    }
    const activeAgentToKeep = mockInitialAgents[0]
    const agentToRemove = mockInitialAgents[1]

    setActiveAgent(activeAgentToKeep)
    expect(useAgentStore.getState().activeAgent).toEqual(activeAgentToKeep)

    removeAgent(agentToRemove.id)
    expect(useAgentStore.getState().activeAgent).toEqual(activeAgentToKeep)
  })

  it('updateAgent should modify an existing agent', () => {
    const { updateAgent } = useAgentStore.getState()
    const agentToUpdate = JSON.parse(JSON.stringify(mockInitialAgents[0])) // Deep clone
    const updatedName = 'Updated Agent Name'
    agentToUpdate.name = updatedName

    updateAgent(agentToUpdate)

    const { agents } = useAgentStore.getState()
    const updatedAgentFromStore = agents.find((a) => a.id === agentToUpdate.id)
    expect(updatedAgentFromStore).toBeDefined()
    expect(updatedAgentFromStore?.name).toBe(updatedName)
  })

  it('updateAgent should update activeAgent if it is the one being modified', () => {
    const { updateAgent, setActiveAgent } = useAgentStore.getState()
    const agentToActivateAndUpdate = JSON.parse(
      JSON.stringify(mockInitialAgents[0]),
    )

    setActiveAgent(agentToActivateAndUpdate)
    expect(useAgentStore.getState().activeAgent?.id).toBe(
      agentToActivateAndUpdate.id,
    )

    const updatedName = 'Super Updated Active Agent'
    agentToActivateAndUpdate.name = updatedName
    updateAgent(agentToActivateAndUpdate)

    const { activeAgent } = useAgentStore.getState()
    expect(activeAgent).toBeDefined()
    expect(activeAgent?.name).toBe(updatedName)
  })

  it('setActiveAgent should set an agent as active using agent object', () => {
    const { setActiveAgent } = useAgentStore.getState()
    const agentToActivate = mockInitialAgents[0]
    setActiveAgent(agentToActivate)
    expect(useAgentStore.getState().activeAgent).toEqual(agentToActivate)
  })

  it('setActiveAgent should set an agent as active using agent ID', () => {
    const { setActiveAgent } = useAgentStore.getState()
    const agentToActivate = mockInitialAgents[0]
    setActiveAgent(agentToActivate.id)
    expect(useAgentStore.getState().activeAgent).toEqual(agentToActivate)
  })

  it('setActiveAgent should set activeAgent to null if ID is not found', () => {
    const { setActiveAgent } = useAgentStore.getState()
    setActiveAgent('non-existent-id')
    expect(useAgentStore.getState().activeAgent).toBeNull()
  })

  it('setActiveAgent should set activeAgent to null when null is passed', () => {
    const { setActiveAgent } = useAgentStore.getState()
    setActiveAgent(mockInitialAgents[0]) // Set an active agent first
    expect(useAgentStore.getState().activeAgent).not.toBeNull()

    setActiveAgent(null)
    expect(useAgentStore.getState().activeAgent).toBeNull()
  })
})
