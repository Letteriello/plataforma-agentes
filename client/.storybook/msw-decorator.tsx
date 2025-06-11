import { useEffect } from 'react';
import { mswDecorator } from 'msw-storybook-addon';

// This is a workaround for a bug in msw-storybook-addon
// that causes it to not work correctly in some environments.
// We need to manually initialize the worker.
if (typeof global.process === 'undefined') {
  const { worker } = require('../src/mocks/browser');
  worker.start();
}

export const decorators = [mswDecorator];
