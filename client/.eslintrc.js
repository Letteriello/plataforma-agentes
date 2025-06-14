module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ['@typescript-eslint', 'react', 'react-hooks', 'jsx-a11y', 'import'],
  settings: {
    react: {
      version: 'detect',
    },
    'import/resolver': {
      typescript: {
        project: './tsconfig.json',
      },
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
  rules: {
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    'import/no-unresolved': ['error', { commonjs: true, amd: true, ignore: ['^@/'] }],
    'import/order': [
      'warn',
      {
        groups: ['builtin', 'external', 'internal', ['parent', 'sibling', 'index'], 'object', 'type'],
        pathGroups: [
          {
            pattern: '@/**',
            group: 'internal',
          },
        ],
        pathGroupsExcludedImportTypes: ['builtin'],
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],
    'import/no-restricted-paths': [
      'error',
      {
        zones: [
          {
            target: './src/**/*',
            from: './src/api/agentService',
            message: "Import 'agentService' from '@/features/agents/services/agentService' instead.",
          },
          {
            target: './src/**/*',
            from: './src/api/chatService',
            message: "Import 'chatService' from '@/features/chat/services/chatService' instead.",
          },
          {
            target: './src/**/*',
            from: './src/api/dashboardService',
            message: "Import 'dashboardService' from '@/features/dashboard/services/dashboardService' instead.",
          },
          {
            target: './src/**/*',
            from: './src/api/memoryService',
            message: "Import 'memoryService' from '@/features/memoria/services/memoryService' instead.",
          },
          {
            target: './src/**/*',
            from: './src/api/secretService',
            message: "Import 'secretService' from '@/features/secrets-vault/services/secretService' instead.",
          },
          {
            target: './src/**/*',
            from: './src/api/toolService',
            message: "Import 'toolService' from '@/features/tools/services/toolService' instead.",
          },
          {
            target: './src/**/*',
            from: './src/api/auditLogService',
            message: "Import 'auditLogService' from '@/features/audit-logs/services/auditLogService' instead.",
          },
          {
            target: './src/**/*',
            from: './src/api/authService',
            message: "Import 'authService' from '@/features/auth/services/authService' instead.",
          },
          {
            target: './src/**/*',
            from: './src/api/governanceService',
            message: "Import 'governanceService' from '@/features/governance/services/governanceService' instead.",
          },
        ],
      },
    ],
    // Adicione outras regras personalizadas aqui, se necessário
  },
  ignorePatterns: ['node_modules/', 'dist/', '.eslintrc.js', 'vite.config.ts', 'postcss.config.js', 'tailwind.config.js'],
};
