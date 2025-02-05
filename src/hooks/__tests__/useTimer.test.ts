import { describe, test, expect, jest, beforeEach, afterEach } from '@jest/globals';
import { createHookTester } from '../../testUtils/hookTester';
import { useTimer } from '../timer/useTimer';
import { setupTimerTests, cleanupTimerTests } from '../../testUtils/timerTestSetup';

describe('useTimer', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    setupTimerTests();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanupTimerTests();
  });

  test('initializes with correct duration', () => {
    const { result } = createHookTester(useTimer)({
      initialDuration: 300,
    });

    expect(result.timeLeft).toBe(300);
    expect(result.minutes).toBe(5);
    expect(result.isRunning).toBeFalsy();
    expect(result.metrics).toBeDefined();
    expect(result.metrics.expectedTime).toBe(300);
  });

  test('initializes with minimum duration if initialDuration is less than 60', () => {
    const { result } = createHookTester(useTimer)({
      initialDuration: 30,
    });

    expect(result.timeLeft).toBe(60);
    expect(result.minutes).toBe(1);
    expect(result.isRunning).toBeFalsy();
    expect(result.metrics).toBeDefined();
    expect(result.metrics.expectedTime).toBe(60);
  });

  test('handles time updates correctly', () => {
    const { result, rerender } = createHookTester(useTimer)({
      initialDuration: 300,
    });
    
    result.start();
    rerender();
    expect(result.isRunning).toBeTruthy();
    expect(result.metrics.startTime).toBeDefined();
    
    jest.advanceTimersByTime(1000);
    rerender();
    expect(result.timeLeft).toBe(299);
    
    result.pause();
    rerender();
    expect(result.isRunning).toBeFalsy();
    expect(result.metrics.pauseCount).toBe(1);
  });

  test('adds time correctly', () => {
    const { result, rerender } = createHookTester(useTimer)({
      initialDuration: 300,
    });
    
    result.start();
    rerender();
    
    jest.advanceTimersByTime(1000);
    rerender();
    
    result.addTime(5);
    rerender();
    
    expect(result.timeLeft).toBe(599); // 299 + (5 * 60)
    expect(result.metrics.extensionTime).toBe(300); // 5 minutes = 300 seconds
  });

  test('updates minutes and resets timeLeft', () => {
    const { result, rerender } = createHookTester(useTimer)({
      initialDuration: 300,
    });
    
    result.setMinutes(10);
    rerender();
    
    expect(result.minutes).toBe(10);
    expect(result.timeLeft).toBe(600); // 10 minutes = 600 seconds
    expect(result.metrics.expectedTime).toBe(600);
  });

  test('calls onTimeUp when timer completes', () => {
    const onTimeUp = jest.fn();
    const { result, rerender } = createHookTester(useTimer)({
      initialDuration: 2,
      onTimeUp,
    });

    result.start();
    rerender();
    
    jest.advanceTimersByTime(2000);
    rerender();
    
    expect(onTimeUp).toHaveBeenCalled();
    expect(result.timeLeft).toBe(0);
    expect(result.isRunning).toBeFalsy();
  });

  test('notifies of duration changes', () => {
    const onDurationChange = jest.fn();
    const { result, rerender } = createHookTester(useTimer)({
      initialDuration: 300,
      onDurationChange,
    });

    result.setMinutes(10);
    rerender();
    
    expect(onDurationChange).toHaveBeenCalledWith(10);
  });

  test('maintains state during pause/resume', () => {
    const { result, rerender } = createHookTester(useTimer)({
      initialDuration: 300,
    });
    
    result.start();
    rerender();
    expect(result.isRunning).toBeTruthy();
    
    jest.advanceTimersByTime(5000);
    rerender();
    const timeBeforePause = result.timeLeft;
    
    result.pause();
    rerender();
    expect(result.isRunning).toBeFalsy();
    expect(result.timeLeft).toBe(timeBeforePause);
    
    result.start();
    rerender();
    expect(result.isRunning).toBeTruthy();
    expect(result.timeLeft).toBe(timeBeforePause);
  });

  test('respects minimum and maximum minutes', () => {
    const { result, rerender } = createHookTester(useTimer)({
      initialDuration: 300,
    });
    
    result.setMinutes(0);
    rerender();
    expect(result.minutes).toBeGreaterThanOrEqual(1);
    
    result.setMinutes(100);
    rerender();
    expect(result.minutes).toBeLessThanOrEqual(60);
  });

  test('updates time correctly', () => {
    const { result, rerender } = createHookTester(useTimer)({
      initialDuration: 300,
    });
    
    result.start();
    rerender();
    expect(result.isRunning).toBeTruthy();
    
    jest.advanceTimersByTime(1000);
    rerender();
    expect(result.timeLeft).toBe(299);
  });

  test('handles cleanup on timer stop', () => {
    const { result, rerender } = createHookTester(useTimer)({
      initialDuration: 300,
    });
    
    result.start();
    rerender();
    expect(result.isRunning).toBeTruthy();
    
    result.completeTimer();
    rerender();
    expect(result.isRunning).toBeFalsy();
  });

  test('validates duration input', () => {
    const { result } = createHookTester(useTimer)({
      initialDuration: -100,
    });
    expect(result.timeLeft).toBeGreaterThan(0);
    expect(result.minutes).toBeGreaterThan(0);
  });
});
