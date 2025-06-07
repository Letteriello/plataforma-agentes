/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts', // Arquivo de setup para os testes
    // Opcional: se você quiser que o Vitest observe mudanças nos arquivos de teste e os re-execute automaticamente
    // watch: true,
  },
});
