import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import eslintPluginReact from 'eslint-plugin-react'
import eslintPluginSimpleImportSort from 'eslint-plugin-simple-import-sort'

export default tseslint.config(
  {
    ignores: ['dist', '.storybook/dist', 'node_modules_old'],
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
      },
    },
  },
  js.configs.recommended, // Global defaults
  ...tseslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,

  // React specific configurations for TSX files
  {
    files: ['**/*.{ts,tsx}'],
    ...eslintPluginReact.configs.flat.recommended, // React recommended settings
    ...jsxA11y.flatConfigs.recommended, // Accessibility settings
    // Note: extends is not standard in flat config objects like this, settings are usually spread or set directly.
    // js.configs.recommended and tseslint.configs.recommended are already applied globally.
    languageOptions: {
      ...eslintPluginReact.configs.flat.recommended.languageOptions, // Spread to ensure JSX features, etc.
      ...(jsxA11y.flatConfigs.recommended.languageOptions || {}),
      globals: {},
      parserOptions: {
        // Ensure JSX is enabled
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      react: eslintPluginReact, // Make sure react plugin is explicitly available if not already by spread
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'jsx-a11y': jsxA11y,
    },
    rules: {
      // Rules from eslintPluginReact.configs.flat.recommended and jsxA11y.flatConfigs.recommended are spread.
      // Override or add specific rules below.
      ...reactHooks.configs.recommended.rules,
      '@typescript-eslint/no-explicit-any': 'warn',
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      'react/react-in-jsx-scope': 'off', // Common for new JSX transform
      'react/prop-types': 'off', // Often turned off in TypeScript projects
    },
    settings: {
      // Settings for react plugin, e.g. version
      react: {
        version: 'detect',
      },
    },
  },

  // Configuration for simple-import-sort
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      'simple-import-sort': eslintPluginSimpleImportSort,
    },
    rules: {
      'simple-import-sort/imports': 'warn',
      'simple-import-sort/exports': 'warn',
    },
  },
)
