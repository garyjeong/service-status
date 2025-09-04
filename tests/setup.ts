import { expect, afterEach, beforeAll } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// extends Vitest's expect method with methods from react-testing-library
expect.extend(matchers);

// runs a cleanup after each test case (e.g. clearing jsdom)
afterEach(() => {
  cleanup();
});

// Mock IntersectionObserver
beforeAll(() => {
  Object.defineProperty(window, 'IntersectionObserver', {
    writable: true,
    value: class IntersectionObserver {
      constructor() {}
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  });

  // Mock ResizeObserver
  Object.defineProperty(window, 'ResizeObserver', {
    writable: true,
    value: class ResizeObserver {
      constructor() {}
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  });

  // Mock fetch for integration tests
  global.fetch = async (url: string | URL | Request) => {
    console.warn(`Mock fetch called with: ${url}`);
    return new Response(JSON.stringify({ status: { indicator: 'operational' } }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  };

  // Mock console methods for cleaner test output
  const originalWarn = console.warn;
  console.warn = (...args) => {
    // Filter out specific warnings we expect during tests
    const message = args.join(' ');
    if (
      message.includes('Warning: Could not access') ||
      message.includes('Network issue accessing') ||
      message.includes('Mock fetch called with')
    ) {
      return;
    }
    originalWarn.apply(console, args);
  };
});
