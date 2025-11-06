/**
 * Jest test setup file
 * Runs before each test suite
 */

import '@testing-library/jest-dom';

// Mock window.postMessage for iframe tests
global.postMessage = jest.fn();

// Setup default window properties
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});
