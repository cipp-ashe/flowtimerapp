import '@testing-library/jest-dom';
import { beforeEach, jest } from '@jest/globals';

// Mock event listeners that can be used across tests
global.mockAddEventListener = jest.fn();
global.mockRemoveEventListener = jest.fn();

// Extend global types
declare global {
  var mockAddEventListener: jest.Mock;
  var mockRemoveEventListener: jest.Mock;
}

// Mock window.matchMedia
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
    dispatchEvent: jest.fn(() => true),
  })),
});

// Mock React hooks with state persistence
const states = new Map<string, any>();
let stateCounter = 0;

// Get actual React module
const actualReact = jest.requireActual('react');

// Mock React
jest.mock('react', () => ({
  // JSX Support
  default: actualReact,
  jsx: actualReact.jsx,
  jsxs: actualReact.jsxs,
  createElement: actualReact.createElement,
  Fragment: actualReact.Fragment,
  
  // Component Support
  Component: actualReact.Component,
  PureComponent: actualReact.PureComponent,
  memo: actualReact.memo,
  forwardRef: actualReact.forwardRef,
  
  // Context Support
  createContext: actualReact.createContext,
  useContext: actualReact.useContext,

  // Hooks with state persistence
  useState: (initial: any) => {
    const key = `state_${stateCounter++}`;
    if (!states.has(key)) {
      states.set(key, initial);
    }
    const setState = (value: any) => {
      states.set(key, typeof value === 'function' ? value(states.get(key)) : value);
    };
    return [states.get(key), setState];
  },
  useEffect: (effect: () => void | (() => void)) => effect(),
  useCallback: (callback: any) => callback,
  useMemo: (factory: any) => factory(),
  useRef: (initial: any) => ({ current: initial }),
}));

// Mock sonner toast
interface ToastFn {
  (message: string): { id: string };
  error: jest.Mock;
  success: jest.Mock;
  message: jest.Mock;
}

const mockToast = Object.assign(
  jest.fn(() => ({ id: 'mock-toast-id' })),
  {
    error: jest.fn(),
    success: jest.fn(),
    message: jest.fn(),
  }
) as ToastFn;

jest.mock('sonner', () => ({
  __esModule: true,
  toast: mockToast
}));

beforeEach(() => {
  // Reset all mocks and state
  jest.clearAllMocks();
  states.clear();
  stateCounter = 0;
});
