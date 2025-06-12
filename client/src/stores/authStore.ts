import {create} from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface AuthState {
  token: string | null;
  setToken: (token: string | null) => void;
  // Você pode adicionar mais estados relacionados à autenticação aqui, como:
  // isAuthenticated: boolean;
  // user: User | null; // Onde User é uma interface/tipo para os dados do usuário
  // login: (userData: User, token: string) => void;
  // logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      setToken: (token) => set({ token }),
      // Implementações de exemplo para login/logout se você adicionar user/isAuthenticated:
      // isAuthenticated: false,
      // user: null,
      // login: (userData, token) => set({ isAuthenticated: true, user: userData, token }),
      // logout: () => set({ isAuthenticated: false, user: null, token: null }),
    }),
    {
      name: 'auth-storage', // Nome da chave no localStorage
      storage: createJSONStorage(() => localStorage), // Usar localStorage
      partialize: (state) => ({ token: state.token }), // Apenas persistir o token
    }
  )
);

// Para usar a store em seus componentes:
// import { useAuthStore } from './path/to/authStore';
// const { token, setToken } = useAuthStore();
// const token = useAuthStore(state => state.token);
