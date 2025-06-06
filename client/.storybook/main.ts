import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-links',
    '@storybook/addon-interactions',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
  typescript: {
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      compilerOptions: {
        allowSyntheticDefaultImports: false,
        esModuleInterop: true,
      },
      propFilter: (prop) => {
        // Filter out node_modules except @radix-ui packages
        if (prop.parent) {
          return !prop.parent.fileName?.includes('node_modules');
        }
        return true;
      },
    },
  },
  async viteFinal(config) {
    return {
      ...config,
      define: { 'process.env': {} },
    };
  },
};

export default config;
