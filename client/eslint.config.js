import js from '@eslint/js';
import globals from 'globals';

// Helper function to sanitize global keys
const sanitizeGlobals = (globalSet) => {
  const sanitized = {};
  for (const key in globalSet) {
    if (Object.prototype.hasOwnProperty.call(globalSet, key)) {
      sanitized[key.trim()] = globalSet[key];
    }
  }
  return sanitized;
};
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';
import pluginJsxA11y from 'eslint-plugin-jsx-a11y';

export default [
  // Ignores
  {
    ignores: [
      "node_modules/",
      "dist/",
      ".venv/",
      ".storybook/dist/",
      "storybook-static/",
      "coverage/",
      "minimal-eslint.config.js"
    ]
  },
  // Base recommended rules
  js.configs.recommended,
  
  // TypeScript support
  ...tseslint.configs.recommended,

  // Environment setup
  {
    languageOptions: {
      globals: {
        ...sanitizeGlobals(globals.browser),
        ...sanitizeGlobals(globals.node)
      }
    }
  },

  // React specific linting
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      react: pluginReact,
      'jsx-a11y': pluginJsxA11y,
    },
    rules: {
      ...pluginReact.configs.recommended.rules,
      ...pluginJsxA11y.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off', // Not needed with React 17+ and new JSX transform
      'react/prop-types': 'off', // Often handled by TypeScript
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },

  // Custom rules
  {
    rules: {
      'no-console': 'warn',
      'react-hooks/exhaustive-deps': 'off' // Explicitly turn off the old rule
    }
  }
];