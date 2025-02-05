import { jest } from '@jest/globals';

// Mock sonner toast with proper types
export const mockToast = {
  error: jest.fn(),
  success: jest.fn(),
  message: jest.fn(),
  promise: jest.fn(),
  custom: jest.fn(),
  dismiss: jest.fn()
};

// Function to call toast like the real implementation
const toastFunction = jest.fn().mockImplementation((message: string) => {
  mockToast.message(message);
  return { id: 'mock-toast-id' };
});

// Add all properties to the toast function
Object.assign(toastFunction, mockToast);

// Setup mock for sonner module
jest.mock('sonner', () => ({
  __esModule: true,
  toast: toastFunction
}));

// Setup function to reset all mocks
export const setupMocks = () => {
  // Reset all mock implementations
  mockToast.error.mockReset();
  mockToast.success.mockReset();
  mockToast.message.mockReset();
  mockToast.promise.mockReset();
  mockToast.custom.mockReset();
  mockToast.dismiss.mockReset();
  toastFunction.mockClear();
};

// Mock Audio with proper types
export const mockAudioElement = {
  addEventListener: jest.fn((event: string, handler: EventListener) => {
    if (event === 'canplaythrough') {
      handler(new Event('canplaythrough'));
    }
  }),
  removeEventListener: jest.fn(),
  load: jest.fn(),
  play: jest.fn().mockResolvedValue(undefined),
  pause: jest.fn(),
  currentTime: 0
};

// @ts-ignore - partial mock
global.Audio = jest.fn(() => mockAudioElement);

// Mock console methods
export const mockConsole = {
  log: jest.spyOn(console, 'log').mockImplementation(() => {}),
  error: jest.spyOn(console, 'error').mockImplementation(() => {}),
  warn: jest.spyOn(console, 'warn').mockImplementation(() => {}),
  info: jest.spyOn(console, 'info').mockImplementation(() => {})
};

// Setup function to reset console mocks
export const resetConsoleMocks = () => {
  mockConsole.log.mockReset();
  mockConsole.error.mockReset();
  mockConsole.warn.mockReset();
  mockConsole.info.mockReset();
};
