import apiClient from '@/api/apiClient'
export interface SecretDTO {
  name: string
  value: string
}

export const storeSecret = async (payload: SecretDTO): Promise<void> => {
  await apiClient.post('/secrets', payload)
}
