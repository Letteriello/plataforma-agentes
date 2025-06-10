import '@testing-library/jest-dom';
import { toHaveNoViolations } from 'jest-axe';
import { server } from './mocks/server';
import { resetMockAgentsDB } from './mocks/handlers'; // Import the reset function
import { vi } from 'vitest';

expect.extend(toHaveNoViolations);

// Establish API mocking before all tests.
// Using { onUnhandledRequest: 'error' } will make tests fail if a request is made that doesn't have a handler.
// This is good for catching unexpected requests. You can change to 'warn' or 'bypass' if needed.
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

// Reset any request handlers that run once and exist between tests.
// Also, reset the mock database before each test to ensure test isolation.
afterEach(() => {
  server.resetHandlers();
  resetMockAgentsDB(); // Reset the in-memory DB to its initial state
});

// Clean up after the tests are finished.
afterAll(() => server.close());

// Mock matchMedia for components that might use it (e.g., responsive components in Radix UI)
// This is a common setup item for testing environments.
if (!window.matchMedia) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(), // deprecated
      removeListener: vi.fn(), // deprecated
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

// Mock ResizeObserver - common for UI components
if (!window.ResizeObserver) {
  window.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }));
}

// Mock IntersectionObserver - common for UI components
if (!window.IntersectionObserver) {
  window.IntersectionObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
    root: null,
    rootMargin: '',
    thresholds: [],
    takeRecords: vi.fn(() => []),
  }));
}


// If your tests involve timers (e.g., testing loading states with delay from MSW)
// you might want to use Vitest's fake timers globally or per-test.
// Example of global setup:
// beforeEach(() => {
//   vi.useFakeTimers();
// });
// afterEach(() => {
//   vi.runOnlyPendingTimers(); // Ensure all pending timers are executed
//   vi.useRealTimers();
// });
