import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import jsxA11y from 'eslint-plugin-jsx-a11y';

export default tseslint.config(
  { ignores: ['dist'] },
  // jsxA11y.configs.recommended, // Previous attempt
  {
    files: ['**/*.{ts,tsx}'],
    ...jsxA11y.flatConfigs.recommended, // Spread the recommended config
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    languageOptions: {
      // Merge languageOptions, jsxA11y might have its own specific ones (e.g., parserOptions for JSX)
      ...(jsxA11y.flatConfigs.recommended.languageOptions || {}),
      ecmaVersion: 2020,
      globals: Object.fromEntries(
        Object.entries(globals.browser).map(([key, value]) => [key.trim(), value])
      ),
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'jsx-a11y': jsxA11y, // Add the plugin here as per some flat config conventions
    },
    rules: {
      // Rules from jsxA11y.flatConfigs.recommended are spread.
      // Add other rules as needed.
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
)
