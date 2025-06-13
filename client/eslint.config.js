import path from 'node:path';
import { fileURLToPath } from 'node:url';

import js from '@eslint/js';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import eslintPluginReact from 'eslint-plugin-react';
import eslintPluginReactHooks from 'eslint-plugin-react-hooks'; // Adicionado
// import reactRefresh from 'eslint-plugin-react-refresh'; // Removido temporariamente se não estiver usando Vite HMR com ESLint plugin
import eslintPluginSimpleImportSort from 'eslint-plugin-simple-import-sort';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  // 1. Configurações Globais de Ignorar
  {
    ignores: [
      'dist/**/*',
      'node_modules/**/*',
      '.venv/**/*',
      'eslint.config.js', // Ignora a si mesmo
      'vite.config.ts',
      'postcss.config.js',
      'tailwind.config.js',
      '.storybook/**/*', // Storybook pode ter sua própria config de lint
      'coverage/**/*',
      'public/**/*',
    ],
  },

  // 2. Configurações Base (ESLint Recomendado)
  js.configs.recommended,

  // 3. Configurações TypeScript (Aplicado a todos os arquivos .ts, .tsx, .mts, .cts)
  // Usando recommendedTypeChecked para regras que exigem informações de tipo
  ...tseslint.configs.recommendedTypeChecked.map(config => ({
    ...config,
    files: ['src/**/*.{ts,tsx,mts,cts}'], // Aplicar a todos os arquivos TS/TSX na pasta src
    languageOptions: {
      ...config.languageOptions,
      parser: tseslint.parser,
      parserOptions: {
        ...config.languageOptions?.parserOptions,
        project: ['./tsconfig.json', './tsconfig.node.json'], // Inclui ambos os tsconfigs
        tsconfigRootDir: path.dirname(fileURLToPath(import.meta.url)),
      },
    },
  })),
  // Regras TypeScript adicionais ou overrides
  {
    files: ['src/**/*.{ts,tsx,mts,cts}'],
    rules: {
      'no-unused-vars': 'off', // Desabilitado para dar preferência à regra TypeScript
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      // Regras de type-aware que podem ser muito restritivas inicialmente (ajustar conforme necessário)
      '@typescript-eslint/no-unsafe-assignment': 'warn',
      '@typescript-eslint/no-unsafe-member-access': 'warn',
      '@typescript-eslint/no-unsafe-call': 'warn',
      '@typescript-eslint/no-unsafe-return': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
      // Permite const assertions em literais de objeto
      '@typescript-eslint/prefer-as-const': 'warn',
    },
  },

  // 4. Configurações React e JSX (Aplicado a arquivos .jsx e .tsx)
  {
    files: ['src/**/*.{jsx,tsx}'],
    plugins: {
      react: eslintPluginReact,
      'jsx-a11y': jsxA11y,
      'react-hooks': eslintPluginReactHooks, // Adicionado plugin
      // 'react-refresh': reactRefresh, // Se estiver usando Vite HMR com ESLint plugin
    },
    languageOptions: {
      globals: {
        ...globals.browser, // Globais do navegador para componentes React
      },
    },
    settings: {
      react: {
        version: 'detect', // Detecta automaticamente a versão do React
      },
    },
    // Aplicar configurações recomendadas do React
    ...eslintPluginReact.configs.recommended.rules, // Espalhar regras diretamente
    ...eslintPluginReact.configs['jsx-runtime'].rules, // Para o novo JSX runtime
    ...jsxA11y.configs.recommended.rules, // Regras de acessibilidade
    rules: {
      // Sobrescreve ou adiciona regras específicas do React aqui
      'react/prop-types': 'off', // Desnecessário com TypeScript
      'react/react-in-jsx-scope': 'off', // Para o novo JSX runtime
      'react-hooks/rules-of-hooks': 'error', // Regras dos Hooks
      'react-hooks/exhaustive-deps': 'warn', // Checagem de dependências dos Hooks
      // 'react-refresh/only-export-components': [ // Se usando react-refresh
      //   'warn',
      //   { allowConstantExport: true },
      // ],
    },
  },

  // 5. Configuração para Ordenação de Imports (Aplicado a todos os tipos de arquivos de script)
  {
    files: ['src/**/*.{ts,tsx,js,jsx,mjs,cjs}'],
    plugins: {
      'simple-import-sort': eslintPluginSimpleImportSort,
    },
    rules: {
      'simple-import-sort/imports': 'warn',
      'simple-import-sort/exports': 'warn',
    },
  },

  // 6. Configuração para Arquivos de Teste (Vitest)
  {
    files: [
      'src/**/*.test.{ts,tsx,js,jsx}',
      'src/**/*.spec.{ts,tsx,js,jsx}',
      'src/setupTests.ts', // Se você tiver um arquivo de setup
      'src/**/__tests__/**/*.{ts,tsx,js,jsx}',
      'src/**/?(*.)+(spec|test).{ts,tsx,js,jsx}',
    ],
    languageOptions: {
      globals: {
        ...globals.node, // Testes geralmente rodam em ambiente Node
        ...globals.vitest, // Adiciona globais do Vitest (vi, describe, it, etc.)
      },
    },
    rules: {
      // Relaxar algumas regras para arquivos de teste
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-empty-function': 'off', // Permite funções vazias (ex: mocks)
      '@typescript-eslint/no-non-null-assertion': 'off', // Permite uso de '!' para non-null assertions
    },
  },

  // 7. Configuração para Arquivos de Configuração do Projeto (ex: vite.config.ts, tailwind.config.js)
  {
    files: ['*.config.{js,ts,cjs,mjs}', '.storybook/**/*.{js,ts,cjs,mjs}'], // Inclui arquivos de config na raiz e no .storybook
    languageOptions: {
      globals: {
        ...globals.node, // Arquivos de configuração geralmente rodam em Node
      },
    },
    rules: {
      '@typescript-eslint/no-var-requires': 'off', // Permite require em arquivos .js
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
    },
  },

  // 8. Regras Globais Finais (Aplicadas a todos os arquivos não ignorados, após todas as outras configs)
  {
    rules: {
      'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
      // Outras regras globais que você queira aplicar
    },
  }
);