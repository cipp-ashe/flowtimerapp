import { describe, test, expect, jest, beforeEach } from '@jest/globals';
import { createHookTester } from '../../testUtils/hookTester';
import { useTimerMetrics } from '../timer/useTimerMetrics';

describe('useTimerMetrics', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2025-02-03T12:00:00.000Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('initializes with default values', () => {
    const { result } = createHookTester(useTimerMetrics)(300);

    expect(result.metrics.expectedTime).toBe(300);
    expect(result.metrics.actualDuration).toBe(0);
    expect(result.metrics.pauseCount).toBe(0);
    expect(result.metrics.favoriteQuotes).toBe(0);
    expect(result.metrics.pausedTime).toBe(0);
    expect(result.metrics.extensionTime).toBe(0);
    expect(result.metrics.netEffectiveTime).toBe(0);
    expect(result.metrics.efficiencyRatio).toBe(0);
    expect(result.metrics.completionStatus).toBe('Completed On Time');
  });

  test('updates metrics correctly', () => {
    const { result } = createHookTester(useTimerMetrics)(300);

    result.updateMetrics({
      startTime: new Date('2025-02-03T12:00:00.000Z'),
      actualDuration: 150,
      pauseCount: 1,
      favoriteQuotes: 2,
      pausedTime: 30,
      extensionTime: 60,
      lastPauseTimestamp: null
    });

    expect(result.metrics.actualDuration).toBe(150);
    expect(result.metrics.pauseCount).toBe(1);
    expect(result.metrics.favoriteQuotes).toBe(2);
    expect(result.metrics.pausedTime).toBe(30);
    expect(result.metrics.extensionTime).toBe(60);
  });

  test('calculates final metrics correctly for early completion', async () => {
    const { result } = createHookTester(useTimerMetrics)(300);

    result.updateMetrics({
      startTime: new Date('2025-02-03T12:00:00.000Z'),
      actualDuration: 150,
      pauseCount: 1,
      favoriteQuotes: 0,
      pausedTime: 0,
      extensionTime: 0,
      lastPauseTimestamp: null
    });

    await result.calculateFinalMetrics(new Date('2025-02-03T12:02:30.000Z')); // 2.5 minutes later

    expect(result.metrics.netEffectiveTime).toBe(150);
    expect(result.metrics.completionStatus).toBe('Completed Early');
  });

  test('calculates final metrics correctly for late completion', async () => {
    const { result } = createHookTester(useTimerMetrics)(300);

    result.updateMetrics({
      startTime: new Date('2025-02-03T12:00:00.000Z'),
      actualDuration: 450,
      pauseCount: 2,
      favoriteQuotes: 1,
      pausedTime: 60,
      extensionTime: 0,
      lastPauseTimestamp: null
    });

    await result.calculateFinalMetrics(new Date('2025-02-03T12:07:30.000Z')); // 7.5 minutes later

    expect(result.metrics.netEffectiveTime).toBe(390); // 450 - 60 (paused time)
    expect(result.metrics.completionStatus).toBe('Completed Late');
  });

  test('handles paused time correctly', () => {
    const { result } = createHookTester(useTimerMetrics)(300);

    result.updateMetrics({
      startTime: new Date('2025-02-03T11:58:00.000Z'), // Started 2 minutes ago
      actualDuration: 100,
      pauseCount: 1,
      favoriteQuotes: 0,
      pausedTime: 50,
      extensionTime: 0,
      lastPauseTimestamp: new Date('2025-02-03T12:00:00.000Z')
    });

    expect(result.metrics.pauseCount).toBe(1);
    expect(result.metrics.pausedTime).toBe(50);
  });

  test('handles extension time correctly', () => {
    const { result } = createHookTester(useTimerMetrics)(300);

    result.updateMetrics({
      startTime: new Date('2025-02-03T12:00:00.000Z'),
      actualDuration: 300,
      pauseCount: 0,
      favoriteQuotes: 0,
      pausedTime: 0,
      extensionTime: 120,
      lastPauseTimestamp: null
    });

    expect(result.metrics.extensionTime).toBe(120);
    expect(result.metrics.expectedTime).toBe(300); // Initial duration remains unchanged
  });
});
