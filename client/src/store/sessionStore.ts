import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Tipos principais
type Agent = {
  id: string;
  name: string;
  role: string;
  description?: string;
  status: 'online' | 'offline' | 'busy' | 'error';
  lastActive?: string;
  config?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
};

type Session = {
  id: string;
  name: string;
  agents: Agent[];
  activeAgentId?: string;
  createdAt: string;
  updatedAt: string;
};

type SessionState = {
  sessions: Session[];
  activeSessionId: string | null;
  activeAgentId: string | null;
  isLoading: boolean;
  error: string | null;
};

type SessionActions = {
  createSession: (name: string) => Promise<Session>;
  updateSession: (id: string, updates: Partial<Omit<Session, 'id' | 'createdAt'>>) => void;
  deleteSession: (id: string) => void;
  setActiveSession: (id: string | null) => void;
  createAgent: (sessionId: string, agentData: Omit<Agent, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Agent>;
  updateAgent: (sessionId: string, agentId: string, updates: Partial<Omit<Agent, 'id' | 'createdAt'>>) => void;
  deleteAgent: (sessionId: string, agentId: string) => void;
  setActiveAgent: (agentId: string | null) => void;
  clearError: () => void;
};

type SessionStore = SessionState & SessionActions;

type PersistedSessionState = Pick<SessionState, 'sessions' | 'activeSessionId' | 'activeAgentId'>;

const initialState: SessionState = {
  sessions: [],
  activeSessionId: null,
  activeAgentId: null,
  isLoading: false,
  error: null,
};

export const useSessionStore = create<SessionStore>(
  persist(
    (set, get) => ({
      ...initialState,

      createSession: async (name: string) => {
        set({ isLoading: true, error: null });
        try {
          // Simulando chamada à API
          await new Promise(resolve => setTimeout(resolve, 500));
          
          const newSession: Session = {
            id: `sess_${Date.now()}`,
            name,
            agents: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          set(state => ({
            sessions: [...state.sessions, newSession],
            activeSessionId: newSession.id,
            isLoading: false,
          }));

          return newSession;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to create session';
          set({ error: errorMessage, isLoading: false });
          throw new Error(errorMessage);
        }
      },

      updateSession: (id: string, updates: Partial<Omit<Session, 'id' | 'createdAt'>>) => {
        set(state => ({
          sessions: state.sessions.map(session => 
            session.id === id 
              ? { ...session, ...updates, updatedAt: new Date().toISOString() }
              : session
          ),
        }));
      },

      deleteSession: (id: string) => {
        set(state => {
          const newSessions = state.sessions.filter(session => session.id !== id);
          const newState: Partial<SessionState> = { sessions: newSessions };
          
          if (state.activeSessionId === id) {
            newState.activeSessionId = newSessions[0]?.id || null;
            newState.activeAgentId = null;
          }
          
          return newState as SessionState;
        });
      },

      setActiveSession: (id: string | null) => {
        set({ 
          activeSessionId: id,
          activeAgentId: null, // Reset active agent when changing sessions
        });
      },

      createAgent: async (sessionId: string, agentData: Omit<Agent, 'id' | 'createdAt' | 'updatedAt'>) => {
        set({ isLoading: true, error: null });
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          
          const newAgent: Agent = {
            id: `agent_${Date.now()}`,
            ...agentData,
            status: 'offline',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          set(state => ({
            sessions: state.sessions.map(session => 
              session.id === sessionId
                ? { 
                    ...session, 
                    agents: [...session.agents, newAgent],
                    updatedAt: new Date().toISOString(),
                  }
                : session
            ),
            isLoading: false,
          }));

          return newAgent;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to create agent';
          set({ error: errorMessage, isLoading: false });
          throw new Error(errorMessage);
        }
      },

      updateAgent: (sessionId: string, agentId: string, updates: Partial<Omit<Agent, 'id' | 'createdAt'>>) => {
        set(state => ({
          sessions: state.sessions.map(session => 
            session.id === sessionId
              ? {
                  ...session,
                  agents: session.agents.map(agent =>
                    agent.id === agentId
                      ? { ...agent, ...updates, updatedAt: new Date().toISOString() }
                      : agent
                  ),
                  updatedAt: new Date().toISOString(),
                }
              : session
          ),
        }));
      },

      deleteAgent: (sessionId: string, agentId: string) => {
        set(state => {
          const updatedSessions = state.sessions.map(session => {
            if (session.id === sessionId) {
              const updatedAgents = session.agents.filter(agent => agent.id !== agentId);
              return {
                ...session,
                agents: updatedAgents,
                activeAgentId: session.activeAgentId === agentId ? null : session.activeAgentId,
                updatedAt: new Date().toISOString(),
              };
            }
            return session;
          });

          return {
            sessions: updatedSessions,
            activeAgentId: state.activeAgentId === agentId ? null : state.activeAgentId,
          };
        });
      },

      setActiveAgent: (agentId: string | null) => {
        set({ activeAgentId: agentId });
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'session-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state: SessionState): PersistedSessionState => ({
        sessions: state.sessions,
        activeSessionId: state.activeSessionId,
        activeAgentId: state.activeAgentId,
      }),
    }
  )
);
