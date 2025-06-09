// Stub de apiClient para centralizar requisições HTTP
// Substitua por configuração real de axios ou fetch conforme necessário
import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/api', // ajuste conforme necessário
  timeout: 10000,
});

export default apiClient;
