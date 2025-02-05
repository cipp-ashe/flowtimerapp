import { describe, test, expect, jest, beforeEach } from '@jest/globals';
import { createHookTester } from '../../testUtils/hookTester';
import { useTransition } from '../useTransition';

describe('useTransition', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    // Mock matchMedia for reduced motion
    window.matchMedia = jest.fn().mockImplementation(query => ({
      matches: query === '(prefers-reduced-motion: reduce)',
      addListener: jest.fn(),
      removeListener: jest.fn(),
    }));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('initializes with default state', () => {
    const { result } = createHookTester(useTransition)({
      isVisible: false,
      options: { duration: 300 }
    });

    expect(result.state).toBe('exited');
    const { style } = result.getTransitionProps();
    expect(style.transition).toBe('opacity 300ms, transform 300ms');
  });

  test('handles visibility changes', () => {
    const { result, rerender } = createHookTester(useTransition)({
      isVisible: false,
      options: { duration: 300 }
    });

    // Initial state
    expect(result.state).toBe('exited');

    // Update to show
    result.updateVisibility(true);
    rerender();
    expect(result.state).toBe('entering');

    // After duration
    jest.advanceTimersByTime(300);
    rerender();
    expect(result.state).toBe('entered');

    // Update to hide
    result.updateVisibility(false);
    rerender();
    expect(result.state).toBe('exiting');

    // After duration
    jest.advanceTimersByTime(300);
    rerender();
    expect(result.state).toBe('exited');
  });

  test('handles delayed transitions', () => {
    const { result, rerender } = createHookTester(useTransition)({
      isVisible: false,
      options: { 
        duration: 300,
        delay: 100 
      }
    });

    // Initial state
    expect(result.state).toBe('exited');

    // Update to show
    result.updateVisibility(true);
    rerender();

    // Before delay
    jest.advanceTimersByTime(50);
    rerender();
    expect(result.state).toBe('exited');

    // After delay
    jest.advanceTimersByTime(50);
    rerender();
    expect(result.state).toBe('entering');

    // After duration
    jest.advanceTimersByTime(300);
    rerender();
    expect(result.state).toBe('entered');
  });

  test('respects reduced motion preferences', () => {
    window.matchMedia = jest.fn().mockImplementation(() => ({
      matches: true,
      addListener: jest.fn(),
      removeListener: jest.fn(),
    }));

    const { result } = createHookTester(useTransition)({
      isVisible: true,
      options: { duration: 300 }
    });

    const { style } = result.getTransitionProps();
    expect(style.transition).toBe('none');
  });

  test('cleans up timeouts', () => {
    const { result, rerender } = createHookTester(useTransition)({
      isVisible: false,
      options: { duration: 300 }
    });

    // Initial state
    expect(result.state).toBe('exited');

    // Start enter transition
    result.updateVisibility(true);
    rerender();
    expect(result.state).toBe('entering');

    // Start exit transition before enter completes
    result.updateVisibility(false);
    rerender();
    expect(result.state).toBe('exiting');

    // After duration
    jest.advanceTimersByTime(300);
    rerender();
    expect(result.state).toBe('exited');
  });
});
