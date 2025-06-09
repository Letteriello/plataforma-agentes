/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), visualizer({ filename: 'dist/bundle-analysis.html', open: false })],
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
      provider: 'v8', // Explicitly set provider
      reporter: ['text', 'json-summary', 'html', 'lcov'], // Added json-summary and lcov
      lines: 80,
      functions: 80,
      branches: 80,
      statements: 80,
      // Optional: Define include/exclude patterns for more focused coverage
      // These examples target src components and hooks, excluding tests, stories, and mocks.
      include: [
        'src/components/**/*.{ts,tsx}',
        'src/hooks/**/*.{ts,tsx}',
        'src/pages/**/*.{ts,tsx}',
        'src/lib/**/*.{ts,tsx}',
        'src/store/**/*.{ts,tsx}',
        'src/api/**/*.{ts,tsx}', // If you want to cover API service files
        'src/routes/**/*.{ts,tsx}', // If you have routing logic to cover
        'src/App.tsx', // Cover main App component
      ],
      exclude: [
        'src/**/*.test.{ts,tsx}', // Standard exclusion for test files
        'src/**/*.stories.{ts,tsx}', // Standard exclusion for storybook files
        'src/mocks/**', // Exclude MSW mocks
        'src/setupTests.ts', // Exclude test setup
        'src/**/index.ts', // Often barrel files are excluded if they only re-export
        'src/vite-env.d.ts',
        'src/main.tsx', // Entry point, often minimal logic
        'src/components/ui/**', // Assuming UI components from ShadCN/Radix are well-tested by their maintainers
                                // Or if you have customized them heavily, you might want to include them.
        'src/types/**', // Type definitions
        'src/theme/**', // Theme definitions
        'src/data/**', // Mock data
        // Add other specific files or patterns to exclude if necessary
        'src/components/theme-provider.tsx', // Example of excluding a specific provider
      ],
      // Ensure coverage is collected even for files not directly imported in tests
      // This is important for accurate overall coverage.
      all: true,
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
