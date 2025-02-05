# Testing Guide

## Test Structure

The project uses a comprehensive testing setup with both Jest and custom test utilities for different testing scenarios.

### Test Utilities

1. **HookTester (`src/testUtils/hookTester.ts`)**
   - Custom utility for testing React hooks
   - Provides mock React environment with state management
   - Supports useState, useEffect, and useCallback
   - Includes methods for:
     - State management
     - Effect handling
     - Time advancement simulation
     - State inspection

2. **TestRunner (`src/testUtils/testRunner.ts`)**
   - Custom test runner with Jest-like syntax
   - Supports describe, test, beforeEach, and afterEach blocks
   - Includes comprehensive assertion utilities:
     - toBe: Strict equality comparison
     - toEqual: Deep equality comparison
     - toContain: Array/string inclusion check
     - toBeTruthy/toBeFalsy: Truthiness checks
     - toThrow: Exception testing
     - Numeric comparisons (greater/less than)

### Jest Configuration

```typescript
// jest.config.ts highlights
{
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
}
```

### Test Environment Setup

The project includes comprehensive test environment setup in `setupTests.ts`:

1. **Testing Library Extensions**
   - Adds Jest DOM matchers
   - Custom matcher types for TypeScript

2. **Browser API Mocks**
   ```typescript
   // Mock window.matchMedia
   window.matchMedia = (query) => ({
     matches: false,
     media: query,
     // ... other MediaQueryList properties
   });

   // Mock Audio API
   class MockAudio {
     play(): Promise<void> {
       return Promise.resolve();
     }
   }

   // Mock IntersectionObserver
   class MockIntersectionObserver {
     observe(): void {}
     unobserve(): void {}
     disconnect(): void {}
   }
   ```

3. **Global Test Setup**
   - Clears all mocks before each test
   - Sets up global browser API mocks
   - Provides TypeScript type extensions

## Writing Tests

### Hook Testing Example

```typescript
import { createHookTester } from '../testUtils/hookTester';
import { useTimer } from '../hooks/timer/useTimer';

describe('useTimer', () => {
  const createTimer = createHookTester(useTimer);

  test('initializes with correct duration', () => {
    const { result } = createTimer({ initialDuration: 300 });
    expect(result.timeLeft).toBe(300);
    expect(result.minutes).toBe(5);
    expect(result.isRunning).toBeFalsy();
  });

  test('handles time updates', () => {
    const { result } = createTimer({ initialDuration: 300 });
    result.start();
    expect(result.isRunning).toBeTruthy();
    result.pause();
    expect(result.isRunning).toBeFalsy();
  });

  test('adds time correctly', () => {
    const { result } = createTimer({ initialDuration: 300 });
    const initialTime = result.timeLeft;
    result.addTime(5); // Add 5 minutes
    expect(result.timeLeft).toBe(initialTime + 300);
  });

  test('handles cleanup on unmount', () => {
    const { result, rerender } = createTimer({ initialDuration: 300 });
    result.start();
    expect(result.isRunning).toBeTruthy();
    rerender(); // Simulate unmount
    expect(result.isRunning).toBeFalsy();
  });
});
```

Key features demonstrated:
- State initialization testing
- Action handlers (start/pause)
- Time manipulation
- Cleanup verification
- Edge case handling

### Component Testing Example

```typescript
import { describe, test, expect } from '../../testUtils/testRunner';
import { TimerCircle } from '../TimerCircle';

describe('TimerCircle Component', () => {
  const defaultProps = {
    size: 'normal' as const,
    isRunning: false,
    timeLeft: 300,
    minutes: 5,
    circumference: 2 * Math.PI * 45,
  };

  test('renders with correct time format', () => {
    const result = TimerCircle(defaultProps);
    const timeString = formatTime(defaultProps.timeLeft);
    expect(result).toBeTruthy();
    expect(JSON.stringify(result)).toContain(timeString);
  });

  test('uses correct size classes', () => {
    const normalResult = TimerCircle(defaultProps);
    const largeResult = TimerCircle({ ...defaultProps, size: 'large' });
    expect(JSON.stringify(normalResult)).toContain('w-48');
    expect(JSON.stringify(largeResult)).toContain('w-96');
  });

  test('applies running styles when active', () => {
    const runningResult = TimerCircle({ ...defaultProps, isRunning: true });
    expect(JSON.stringify(runningResult)).toContain('active');
  });

  test('calculates progress correctly', () => {
    const halfwayProps = {
      ...defaultProps,
      timeLeft: 150, // Half of total time
    };
    const result = TimerCircle(halfwayProps);
    expect(JSON.stringify(result)).toContain(
      (defaultProps.circumference * 0.5).toString()
    );
  });
});
```

Key features demonstrated:
- Props validation
- Style and class testing
- State-dependent rendering
- Visual calculations
- Component composition

## Test Coverage Requirements

Current coverage is significantly below requirements:

```
------------------------|---------|----------|---------|---------|-------------------
File                    | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
------------------------|---------|----------|---------|---------|-------------------
All files              |    3.69 |     2.26 |    2.92 |    3.47 |
```

Target coverage requirements (not currently met):
- Minimum 80% coverage required for:
  - Branches (currently 2.26%)
  - Functions (currently 2.92%)
  - Lines (currently 3.47%)
  - Statements (currently 3.69%)

Key areas needing test coverage:
1. Hooks
   - Timer hooks (useTimer, useTimerState, useTimerControls, etc.)
   - Audio hooks (useAudio)
   - Task management hooks (useTaskManager, useTaskOperations)
   - Quote management hooks (useQuoteManager)

2. Components
   - Timer components (TimerDisplay, TimerCircle, etc.)
   - Task components (TaskList, TaskRow, etc.)
   - Quote components (QuoteDisplay)

3. Utilities
   - Time formatting (timeUtils)
   - Summary formatting (summaryFormatter)
   - Test utilities (hookTester, testRunner)

## Running Tests

Since this project uses ES modules, tests need to be run with the experimental VM modules flag:

```bash
# Run all tests
npm test
# Which runs: node --experimental-vm-modules node_modules/jest/bin/jest.js

# Run tests with coverage report
npm run test:coverage
# Which runs: node --experimental-vm-modules node_modules/jest/bin/jest.js --coverage

# Run specific test file
npm test -- src/components/__tests__/TimerCircle.test.tsx

# Run tests in watch mode
npm run test:watch
# Which runs: node --experimental-vm-modules node_modules/jest/bin/jest.js --watch
```

Note: The test scripts are configured to handle ES modules properly. This is necessary because:
1. The project uses `"type": "module"` in package.json
2. Jest needs the `--experimental-vm-modules` flag to support ES modules
3. The direct path to Jest binary is used to ensure proper execution

## Best Practices

1. **Test Organization**
   - Place tests in `__tests__` directories near the code they test
   - Use descriptive test file names: `ComponentName.test.tsx`
   - Group related tests using describe blocks
   - Use clear test descriptions that explain the expected behavior

2. **Hook Testing**
   - Use HookTester for complex hook logic
   - Test state updates and side effects
   - Verify cleanup functions are called
   - Test edge cases and error conditions

3. **Component Testing**
   - Test rendering and user interactions
   - Verify accessibility features
   - Test error boundaries
   - Check component lifecycle behavior

4. **Mocking**
   - Mock external dependencies
   - Use Jest mock functions for callbacks
   - Mock browser APIs when needed
   - Create test data factories for complex objects

5. **Assertions**
   - Use specific assertions over generic ones
   - Test both positive and negative cases
   - Verify error states and messages
   - Check boundary conditions

## Common Testing Patterns

### Testing Async Operations

```typescript
test('handles async operations', async () => {
  const { result } = createHookTester(useAsyncHook);
  await result.fetchData();
  expect(result.data).toBeDefined();
  expect(result.loading).toBe(false);
});
```

### Testing Error Handling

```typescript
test('handles errors gracefully', () => {
  const { result } = createHookTester(useErrorProne);
  expect(() => result.throwError()).toThrow('Expected error');
});
```

### Testing Side Effects

```typescript
test('cleans up side effects', () => {
  const cleanup = jest.fn();
  const { result } = createHookTester(useEffect);
  result.rerender();
  expect(cleanup).toHaveBeenCalled();
});
```

## Debugging Tests

1. Use `console.log` in tests (removed in production)
2. Use Jest's `--verbose` flag for detailed output
3. Use the debugger statement in tests
4. Check Jest snapshot files for unexpected changes

## Continuous Integration

- Tests run automatically on pull requests
- Coverage reports generated and checked
- Failed tests block merging
- Test results posted as PR comments
