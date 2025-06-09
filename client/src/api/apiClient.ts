import axios from 'axios';
import { useAuthStore } from '../store/authStore'; // Import useAuthStore

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { // Added headers
    'Content-Type': 'application/json',
  },
});

// Interceptor de requisição para adicionar o token JWT
apiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de resposta (opcional, para tratamento global de erros)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Tratamento de erros globais aqui (ex: logging, redirect para login em 401)
    console.error('API Error:', error.response?.data || error.message);

    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      useAuthStore.getState().logout();
      // Check if running in a browser environment before using window.location
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
