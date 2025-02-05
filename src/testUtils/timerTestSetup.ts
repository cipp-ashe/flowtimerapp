import { jest } from '@jest/globals';

// Shared state storage for mocked hooks
const mockStates = new Map<string, any>();
let stateCounter = 0;

// Mock setState function that updates the stored state
export const mockSetState = jest.fn((newValue: any) => {
  const key = (mockSetState as any).currentKey;
  if (typeof newValue === 'function') {
    mockStates.set(key, newValue(mockStates.get(key)));
  } else {
    mockStates.set(key, newValue);
  }
});

// Mock useState that uses the stored state
export const mockUseState = jest.fn((initialValue: any) => {
  const key = `state_${stateCounter++}`;
  (mockSetState as any).currentKey = key;
  
  if (!mockStates.has(key)) {
    mockStates.set(key, initialValue);
  }
  
  return [mockStates.get(key), mockSetState];
});

// Mock useRef that maintains value between renders
export const mockUseRef = jest.fn((initialValue: any) => {
  const key = `ref_${stateCounter++}`;
  if (!mockStates.has(key)) {
    mockStates.set(key, { current: initialValue });
  }
  return mockStates.get(key);
});

// Mock useEffect that executes the effect function
export const mockUseEffect = jest.fn((effect: Function, deps?: any[]) => {
  const cleanup = effect();
  if (cleanup) {
    return cleanup;
  }
});

// Mock useCallback that returns the original function
export const mockUseCallback = jest.fn((fn: Function, deps?: any[]) => fn);

// Setup function to reset all mocks and state
export const setupTimerTests = () => {
  mockStates.clear();
  stateCounter = 0;
  mockSetState.mockClear();
  mockUseState.mockClear();
  mockUseRef.mockClear();
  mockUseEffect.mockClear();
  mockUseCallback.mockClear();

  // Mock React hooks
  jest.mock('react', () => ({
    useState: mockUseState,
    useEffect: mockUseEffect,
    useCallback: mockUseCallback,
    useRef: mockUseRef
  }));

  // Mock sonner toast
  jest.mock('sonner', () => ({
    __esModule: true,
    toast: jest.fn()
  }));
};

// Cleanup function to restore all mocks
export const cleanupTimerTests = () => {
  jest.clearAllMocks();
  mockStates.clear();
  stateCounter = 0;
};
