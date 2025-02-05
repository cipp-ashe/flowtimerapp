import { describe, test, expect, jest } from '@jest/globals';
import { useTimerControls } from '../timer/useTimerControls';
import { createHookTester } from '../../testUtils/hookTester';
import { TIMER_CONSTANTS } from '@/types/timer';
import { TimerStateMetrics } from '@/types/metrics';

const createBaseMetrics = (overrides = {}): TimerStateMetrics => ({
  startTime: null,
  endTime: null,
  pauseCount: 0,
  isPaused: false,
  pausedTime: 0,
  pausedTimeLeft: null,
  extensionTime: 0,
  expectedTime: 300,
  actualDuration: 0,
  netEffectiveTime: 0,
  completionStatus: 'Completed On Time',
  lastPauseTimestamp: null,
  favoriteQuotes: 0,
  efficiencyRatio: 100,
  ...overrides
});

interface MockHandlers {
  onStart: jest.Mock;
  onPause: jest.Mock;
  onComplete: jest.Mock;
  onAddTime: jest.Mock;
}

const createMockHandlers = (): MockHandlers => ({
  onStart: jest.fn(),
  onPause: jest.fn(),
  onComplete: jest.fn(),
  onAddTime: jest.fn(),
});

describe('useTimerControls', () => {
  test('initializes with correct state', () => {
    const mockHandlers = createMockHandlers();

    const { result, rerender } = createHookTester(useTimerControls)({
      timeLeft: 300,
      isRunning: false,
      metrics: createBaseMetrics(),
      ...mockHandlers,
    });

    rerender();
    expect(result.isPaused).toBe(false);
    expect(result.showAddTimeButton).toBe(false);
  });

  test('handles toggle correctly when stopped', () => {
    const mockHandlers = createMockHandlers();

    const { result, rerender } = createHookTester(useTimerControls)({
      timeLeft: 300,
      isRunning: false,
      metrics: createBaseMetrics(),
      ...mockHandlers,
    });

    result.handleToggle();
    rerender();

    expect(mockHandlers.onStart).toHaveBeenCalledTimes(1);
    expect(mockHandlers.onPause).not.toHaveBeenCalled();
  });

  test('handles toggle correctly when running', () => {
    const mockHandlers = createMockHandlers();

    const startTime = new Date();
    const { result, rerender } = createHookTester(useTimerControls)({
      timeLeft: 300,
      isRunning: true,
      metrics: createBaseMetrics({
        startTime,
      }),
      ...mockHandlers,
    });

    result.handleToggle();
    rerender();

    expect(mockHandlers.onStart).not.toHaveBeenCalled();
    expect(mockHandlers.onPause).toHaveBeenCalledTimes(1);
  });

  test('shows add time button when time is low', () => {
    const mockHandlers = createMockHandlers();

    const startTime = new Date();
    const { result, rerender } = createHookTester(useTimerControls)({
      timeLeft: 60, // 1 minute left
      isRunning: true,
      metrics: createBaseMetrics({
        startTime,
      }),
      ...mockHandlers,
    });

    rerender();
    expect(result.showAddTimeButton).toBe(true);

    result.handleAddTime();
    rerender();

    expect(mockHandlers.onAddTime).toHaveBeenCalledWith(TIMER_CONSTANTS.ADD_TIME_MINUTES);
  });

  test('hides add time button when plenty of time left', () => {
    const mockHandlers = createMockHandlers();

    const startTime = new Date();
    const { result, rerender } = createHookTester(useTimerControls)({
      timeLeft: 600, // 10 minutes left
      isRunning: true,
      metrics: createBaseMetrics({
        startTime,
        expectedTime: 600,
      }),
      ...mockHandlers,
    });

    rerender();
    expect(result.showAddTimeButton).toBe(false);
  });

  test('handles completion correctly', () => {
    const mockHandlers = createMockHandlers();

    const startTime = new Date();
    const { result, rerender } = createHookTester(useTimerControls)({
      timeLeft: 300,
      isRunning: true,
      metrics: createBaseMetrics({
        startTime,
      }),
      ...mockHandlers,
    });

    result.handleComplete();
    rerender();

    expect(mockHandlers.onComplete).toHaveBeenCalledTimes(1);
  });

  test('correctly identifies paused state', () => {
    const mockHandlers = createMockHandlers();

    const startTime = new Date();
    const { result, rerender } = createHookTester(useTimerControls)({
      timeLeft: 300,
      isRunning: false,
      metrics: createBaseMetrics({
        startTime,
      }),
      ...mockHandlers,
    });

    rerender();
    expect(result.isPaused).toBe(true);
  });
});
