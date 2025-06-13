import axios from 'axios';

// Supondo que você terá uma store Zustand para autenticação
// O caminho pode variar dependendo da estrutura do seu projeto
import { useAuthStore } from '../stores/authStore'; // Ajuste o caminho conforme necessário

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1', // Fallback para dev
});

// Interceptador de requisição para adicionar o token JWT
apiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token; // Pega o token da store
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Opcional: Interceptador de resposta para lidar com erros de autenticação (ex: 401)
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Exemplo: Token expirado ou inválido
      // Aqui você pode limpar o token da store e redirecionar para a página de login
      useAuthStore.getState().setToken(null); // Supondo que você tenha uma action setToken
      // window.location.href = '/login'; // Ou use o router do seu framework
      console.error('Unauthorized, logging out.'); // Removido redirecionamento direto para evitar problemas de SSR/testes
      // É importante não redirecionar se o erro 401 for da própria página de login
      if (error.config.url !== '/auth/token' && error.config.url !== '/auth/register') { // Evita loop de redirecionamento
         // A lógica de redirecionamento deve ser tratada no nível da aplicação (ex: em um componente de Rota Protegida ou no hook que faz a chamada)
         // Exemplo: disparar um evento customizado ou atualizar um estado global que a UI observa para redirecionar.
         // window.location.assign('/login'); // Evitar isso diretamente aqui.
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
