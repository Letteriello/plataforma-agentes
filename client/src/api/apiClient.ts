import axios from 'axios';
import { getApiBaseUrlFromEnv } from '../config'; // Adjust path if necessary

const apiClient = axios.create({
  baseURL: getApiBaseUrlFromEnv(),
});

export default apiClient;
