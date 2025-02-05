// Types for mock React hooks environment
export type SetStateAction<T> = T | ((prev: T) => T);
export type EffectCallback = () => (void | (() => void));
export type DependencyList = ReadonlyArray<unknown>;
export type CleanupFunction = () => void;

// Generic function type with explicit unknown parameters
export type AnyFunction = {
  (...args: unknown[]): unknown;
};

export interface HookStates {
  [key: string]: unknown;
}

export interface HookTester<T> {
  result: T;
  rerender: () => void;
  advanceTime: (ms: number) => void;
  getState: <S>(key: string) => S;
}

export interface TestResult {
  total: number;
  passed: number;
  failed: number;
}

export interface TestSuite {
  name: string;
  tests: Array<{ name: string; fn: () => void | Promise<void> }>;
  beforeEach?: () => void;
  afterEach?: () => void;
}
