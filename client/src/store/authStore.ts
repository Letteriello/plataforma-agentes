import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
};

type AuthState = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
};

type AuthActions = {
  login: (email: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  clearError: () => void;
  initialize: () => void;
};

// Tipo para o estado persistido
type PersistedAuthState = Pick<AuthState, 'user' | 'token' | 'isAuthenticated'>;

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

import apiClient from '../api/apiClient';

// Criando o store com tipagem simplificada
type SetState = (partial: (state: AuthState & AuthActions) => Partial<AuthState & AuthActions>, replace?: boolean) => void;

const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set: SetState) => ({
      ...initialState,
      
      login: async (email, password) => { // Added password parameter
        set({ isLoading: true, error: null });
        try {
          const response = await apiClient.post('/auth/login', { email, password });
          // Assuming the response data contains user and token
          let { user, token } = response.data;

          // --- Temporary modification for RBAC testing ---
          if (user && typeof user.role === 'undefined') {
            console.warn("User object from backend is missing 'role'. Assigning 'admin' for testing.");
            user.role = 'admin'; // Assign a default role if missing
          } else if (!user) { // If user is null/undefined from backend
            console.warn("User object not returned from backend. Using mock admin for testing.");
            user = { id: 'mock-id', name: 'Mock Admin', email: email, role: 'admin' };
            token = token || 'mock-admin-token'; // Ensure token exists if user was mocked
          }
          // --- End of temporary modification ---

          set({ user, token, isAuthenticated: true, isLoading: false });
        } catch (error: any) {
          // Assuming error.response.data.message contains the error message
          const errorMessage = error.response?.data?.message || 'Login failed';
          set({ error: errorMessage, isLoading: false, isAuthenticated: false });
        }
      },
      
      logout: () => {
        set({
          ...initialState,
          token: null,
          isAuthenticated: false,
        });
      },
      
      setUser: (user: User | null) => set({ user }),
      setToken: (token: string | null) => set({ 
        token, 
        isAuthenticated: !!token 
      }),
      clearError: () => set({ error: null }),
      
      initialize: () => {
        const storedAuth = localStorage.getItem('auth-storage');
        if (storedAuth) {
          try {
            const parsed = JSON.parse(storedAuth) as { state: PersistedAuthState };
            if (parsed.state?.token) {
              set({
                user: parsed.state.user,
                token: parsed.state.token,
                isAuthenticated: parsed.state.isAuthenticated,
                isLoading: false,
              });
            }
          } catch (error) {
            console.error('Erro ao inicializar autenticação:', error);
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
      })
    }
  )
);

export { useAuthStore };
