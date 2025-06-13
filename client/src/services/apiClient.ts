import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1', // '/api/v1' será tratado pelo proxy do Vite em dev
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token JWT, se existir
// apiClient.interceptors.request.use((config) => {
//   const token = localStorage.getItem('authToken'); // Ou de onde você gerencia o token
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

export default apiClient;
