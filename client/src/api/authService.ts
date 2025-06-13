import apiClient from './apiClient'; // Nosso apiClient configurado
import { useAuthStore } from '../stores/authStore'; // Nossa store Zustand
import { supabase } from '../lib/supabaseClient'; // Importa o cliente Supabase

// Tipos para os dados de login e registro (podem vir de um arquivo de tipos compartilhado)
interface LoginCredentials {
  email: string; // No backend, o form_data espera 'username' para o email
  password: string;
}

interface TokenResponse {
  access_token: string;
  token_type: string;
}

interface UserRegistrationData {
  email: string;
  password: string;
  // fullName?: string; // Se você adicionar mais campos ao registro
}

// Supabase retorna dados do usuário no registro, podemos definir um tipo para isso
interface RegisteredUser {
  id: string; // ou uuid.UUID se você importar a lib uuid no frontend
  email: string;
  created_at: string; // ou Date se você transformar
}

export const loginUser = async (credentials: LoginCredentials): Promise<void> => {
  // O backend espera 'username' e 'password' como form-data para o endpoint /auth/token
  // O Axios por padrão envia JSON, então precisamos formatar como FormData
  const formData = new FormData();
  formData.append('username', credentials.email);
  formData.append('password', credentials.password);

  try {
    const { data } = await apiClient.post<TokenResponse>('/auth/token', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded', // Necessário para OAuth2PasswordRequestForm
      },
    });
    if (data.access_token) {
      useAuthStore.getState().setToken(data.access_token);
      // Opcional: buscar dados do usuário aqui e armazená-los na store também
    }
  } catch (error) {
    console.error('Login failed:', error);
    // Limpar token em caso de falha (embora o interceptor de resposta já possa fazer isso para 401)
    useAuthStore.getState().setToken(null);
    throw error; // Re-lançar para que o componente de UI possa lidar com o erro
  }
};

export const registerUser = async (userData: UserRegistrationData): Promise<RegisteredUser> => {
  const { data, error } = await supabase.auth.signUp({
    email: userData.email,
    password: userData.password,
  });

  if (error) {
    console.error('Supabase registration failed:', error.message);
    throw error;
  }

  if (!data.user) {
    throw new Error('Registration succeeded but no user data was returned.');
  }
  
  // A UI deve informar o usuário para checar seu email para confirmação.
  // A função retorna os dados do usuário do Supabase, que correspondem à interface RegisteredUser.
  return data.user as RegisteredUser;
};


export const logoutUser = (): void => {
  useAuthStore.getState().setToken(null);
  // Opcional: redirecionar para a página de login ou home
  // window.location.href = '/login';
};

export default {
  loginUser,
  registerUser,
  logoutUser,
};
