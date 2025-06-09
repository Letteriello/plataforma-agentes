// client/src/config.ts
export const getApiBaseUrlFromEnv = (): string => {
  // This line will still be problematic if config.ts itself is processed by Jest
  // without proper transformation for import.meta.env.
  // However, we will be MOCKING this module in tests, so Jest won't execute this directly.
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  if (!baseUrl) {
    // This error might occur during actual application runtime if env var is missing,
    // but not during tests if mocked correctly.
    throw new Error("VITE_API_BASE_URL is not defined in environment variables.");
  }
  return baseUrl;
};
