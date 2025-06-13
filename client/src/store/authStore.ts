import { create } from 'zustand'
import { createJSONStorage,persist } from 'zustand/middleware'

type User = {
  id: string
  name: string
  email: string
  role: string
  avatar?: string
}

type AuthState = {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

type AuthActions = {
  login: (email: string) => Promise<void>
  logout: () => void
  setUser: (user: User | null) => void
  setToken: (token: string | null) => void
  clearError: () => void
  initialize: () => void
}

// Tipo para o estado persistido
type PersistedAuthState = Pick<AuthState, 'user' | 'token' | 'isAuthenticated'>

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
}

// Criando o store com tipagem simplificada
type SetState = (
  partial: (state: AuthState & AuthActions) => Partial<AuthState & AuthActions>,
  replace?: boolean,
) => void

const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set: SetState) => ({
      ...initialState,

      login: async (email: string) => {
        set({ isLoading: true, error: null })

        try {
          // Simulação de chamada de API
          await new Promise((resolve) => setTimeout(resolve, 1000))

          // Dados simulados
          const mockUser = {
            id: '1',
            name: 'Usuário de Teste',
            email: email,
            role: 'admin',
          }

          const mockToken = 'mock-jwt-token'

          set({
            user: mockUser,
            token: mockToken,
            isAuthenticated: true,
            isLoading: false,
          })
        } catch (error) {
          set({
            error:
              error instanceof Error ? error.message : 'Falha ao fazer login',
            isLoading: false,
          })
          throw error
        }
      },

      logout: () => {
        set({
          ...initialState,
          token: null,
          isAuthenticated: false,
        })
      },

      setUser: (user: User | null) => set({ user }),
      setToken: (token: string | null) =>
        set({
          token,
          isAuthenticated: !!token,
        }),
      clearError: () => set({ error: null }),

      initialize: () => {
        const storedAuth = localStorage.getItem('auth-storage')
        if (storedAuth) {
          try {
            const parsed = JSON.parse(storedAuth) as {
              state: PersistedAuthState
            }
            if (parsed.state?.token) {
              set({
                user: parsed.state.user,
                token: parsed.state.token,
                isAuthenticated: parsed.state.isAuthenticated,
                isLoading: false,
              })
            }
          } catch (error) {
            console.error('Erro ao inicializar autenticação:', error)
          }
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state: any) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
)

export { useAuthStore }
