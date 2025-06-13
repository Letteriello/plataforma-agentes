import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import eslintPluginReact from 'eslint-plugin-react';
import reactRefresh from 'eslint-plugin-react-refresh';
import eslintPluginSimpleImportSort from 'eslint-plugin-simple-import-sort';
import globals from 'globals';
import tseslint from 'typescript-eslint';

// Final, stable configuration
export default tseslint.config(
  {
    ignores: ['dist', '.storybook/dist', 'node_modules_old'],
  },

  // Base configs
  js.configs.recommended,

  // React specific configuration
  {
    files: ['src/**/*.{ts,tsx}', 'src/**/*.stories.tsx'],
    plugins: {
      react: eslintPluginReact,
      'react-refresh': reactRefresh,
      'jsx-a11y': jsxA11y,
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
      globals: Object.fromEntries(
        Object.entries(globals.browser).map(([key, value]) => [key.trim(), value])
      ),
    },
    rules: {
      ...eslintPluginReact.configs.recommended.rules,
      ...jsxA11y.configs.recommended.rules,
      'react-refresh/only-export-components': 'warn',
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },

  // Override for TypeScript files to use TypeScript-aware rules
  {
    files: ['src/**/*.{ts,tsx}'],
    // TypeScript-specific rules
    plugins: {
      '@typescript-eslint': tseslint.plugin,
    },
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: path.dirname(fileURLToPath(import.meta.url)),
      },
    },
    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { varsIgnorePattern: '^_', argsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },

  // Config files
  {
    files: ['**/*.js', '*.config.js'],
    languageOptions: {
      globals: { ...globals.node },
    },
    rules: {
      '@typescript-eslint/no-var-requires': 'off',
    },
  },

  // Import sorting
  {
    plugins: {
      'simple-import-sort': eslintPluginSimpleImportSort,
    },
    rules: {
      'simple-import-sort/imports': 'warn',
      'simple-import-sort/exports': 'warn',
    },
  },
);
