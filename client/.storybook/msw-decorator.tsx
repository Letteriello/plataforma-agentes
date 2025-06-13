import { mswDecorator } from 'msw-storybook-addon';

// This is a workaround for a bug in msw-storybook-addon
// that causes it to not work correctly in some environments.
// We need to manually initialize the worker.
if (typeof global.process === 'undefined') {
  import { worker } from '../src/mocks/browser';
  worker.start();

}

export const decorators = [mswDecorator];
