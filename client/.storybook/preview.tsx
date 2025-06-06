import type { Preview } from '@storybook/react';
import { withThemeByDataAttribute } from '@storybook/addon-styling';

// Import global styles
import '../src/app/globals.css';

// Configure viewports for responsive testing
const customViewports = {
  mobile: {
    name: 'Mobile',
    styles: {
      width: '375px',
      height: '667px',
    },
  },
  tablet: {
    name: 'Tablet',
    styles: {
      width: '768px',
      height: '1024px',
    },
  },
  desktop: {
    name: 'Desktop',
    styles: {
      width: '1440px',
      height: '1024px',
    },
  },
};

const preview: Preview = {
  parameters: {
    // Disable automatic docs generation for now
    docs: { 
      toc: true,
    },
    // Configure viewports
    viewport: {
      viewports: customViewports,
      defaultViewport: 'desktop',
    },
    // Action handling
    actions: { 
      argTypesRegex: '^on[A-Z].*',
    },
    // Control configuration
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /$/,
      },
      expanded: true,
    },
    // Background configuration
    backgrounds: {
      default: 'dark',
      values: [
        {
          name: 'light',
          value: '#ffffff',
        },
        {
          name: 'dark',
          value: '#0f172a',
        },
      ],
    },
    // Layout configuration
    layout: 'centered',
    // Disable addon panels by default
    options: {
      storySort: {
        order: ['Introduction', 'Components'],
      },
      showPanel: true,
      panelPosition: 'right',
    },
  },
};

// Apply theme decorator
export const decorators = [
  withThemeByDataAttribute({
    themes: {
      light: 'light',
      dark: 'dark',
    },
    defaultTheme: 'dark',
    attributeName: 'data-theme',
  }),
];

export default preview;
