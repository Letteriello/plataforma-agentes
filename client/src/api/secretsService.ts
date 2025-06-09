import apiClient from './apiClient';

interface SaveApiKeyPayload {
  serviceName: string;
  apiKey: string;
}

export const saveApiKey = async (serviceName: string, apiKey: string): Promise<void> => {
  try {
    await apiClient.post<void>('/secrets/save', { serviceName, apiKey } as SaveApiKeyPayload);
    // The backend doesn't exist, so this part might not be reached if the request fails.
    // If the mock server or actual backend returns a 2xx status, this will proceed.
    console.log('API key saved successfully via secretsService');
  } catch (error) {
    console.error('Failed to save API key via secretsService:', error);
    // Re-throw the error so the component can handle it (e.g., show an error message)
    // Or handle it more specifically here if needed
    throw error;
  }
};
