/**
 * Represents a secret returned by the API (value is not exposed).
 */
export interface Secret {
  name: string;
}

/**
 * Data Transfer Object for creating or updating a secret.
 */
export interface SecretCreate {
  name: string;
  value: string;
}
