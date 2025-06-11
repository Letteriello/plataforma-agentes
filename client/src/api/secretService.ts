import apiClient from '@/api/apiClient'
import { SecretDTO } from '@/types/api'

export const storeSecret = async (payload: SecretDTO): Promise<void> => {
  await apiClient.post('/secrets', payload)
}
