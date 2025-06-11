import apiClient from '@/api/apiClient';
import type { Secret, SecretCreate } from '@/types/secrets';

/**
 * Fetches the list of all secret names from the backend.
 * @returns A promise that resolves to an array of secrets.
 */
export const listSecrets = async (): Promise<Secret[]> => {
  const response = await apiClient.get<Secret[]>('/secrets');
  return response.data;
};

/**
 * Creates or updates a secret in the vault.
 * @param payload - The secret data including name and value.
 * @returns A promise that resolves to the created secret metadata.
 */
export const createSecret = async (payload: SecretCreate): Promise<Secret> => {
  const response = await apiClient.post<Secret>('/secrets', payload);
  return response.data;
};

/**
 * Deletes a secret from the vault by its name.
 * @param secretName - The name of the secret to delete.
 * @returns A promise that resolves when the secret is deleted.
 */
export const deleteSecret = async (secretName: string): Promise<void> => {
  await apiClient.delete(`/secrets/${secretName}`);
};
