import React from 'react'; // Import React
import type { Preview } from '@storybook/react';
import { withThemeByDataAttribute } from '@storybook/addon-styling';

// Import global styles
import '../src/index.css'; // Assuming global styles are in index.css or App.css
// import '../src/App.css'; // If you have App.css

// Import ToastProvider
import { ToastProvider } from '../src/components/ui/use-toast'; // Adjusted path
import { Toaster } from '../src/components/ui/toaster'; // Toaster needs to be rendered

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
        date: /Date$/, // Adjusted to match typical date prop names
      },
      expanded: true,
    },
    // Background configuration
    backgrounds: {
      default: 'dark', // Keep 'dark' as default if that's your preference
      values: [
        {
          name: 'light',
          value: '#ffffff',
        },
        {
          name: 'dark',
          value: '#0f172a', // Example dark background
        },
      ],
    },
    // Layout configuration
    layout: 'centered',
    // Disable addon panels by default
    options: {
      storySort: {
        order: ['Introduction', 'UI', 'Components'], // Added UI to sort order
      },
      showPanel: true,
      panelPosition: 'right',
    },
  },
};

// Apply theme decorator and ToastProvider
export const decorators = [
  // Theme decorator should ideally be outermost or ensure context compatibility
  withThemeByDataAttribute({
    themes: {
      light: 'light',
      dark: 'dark',
    },
    defaultTheme: 'dark',
    attributeName: 'data-theme', // Ensure this matches your ThemeProvider in the app
  }),
  // ToastProvider wraps each story, and Toaster is rendered globally for them
  (Story) => (
    <ToastProvider>
      <Story />
      <Toaster />
    </ToastProvider>
  ),
];

export default preview;
