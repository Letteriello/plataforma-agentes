/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      {
        find: '@',
        replacement: path.resolve(__dirname, './src')
      },
      {
        find: '@components',
        replacement: path.resolve(__dirname, './src/components')
      },
      {
        find: '@pages',
        replacement: path.resolve(__dirname, './src/pages')
      },
      {
        find: '@lib',
        replacement: path.resolve(__dirname, './src/lib')
      }
    ]
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom']
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
    coverage: {
      reporter: ['text', 'json', 'html'],
    },
  },
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-tooltip', 'class-variance-authority', 'clsx', 'tailwind-merge'],
        },
      },
    },
  },
});
