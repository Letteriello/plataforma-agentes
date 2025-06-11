import apiClient from '@/api/apiClient';
import type { SecretDTO } from '@/types/secrets';

export const storeSecret = async (payload: SecretDTO): Promise<void> => {
  await apiClient.post('/secrets', payload)
}
