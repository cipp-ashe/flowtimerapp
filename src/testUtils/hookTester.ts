import {
  SetStateAction,
  EffectCallback,
  DependencyList,
  CleanupFunction,
  AnyFunction,
  HookStates,
  HookTester
} from './types';

export class HookEnvironment {
  private states: HookStates = {};
  private effects: EffectCallback[] = [];
  private cleanups: (CleanupFunction | undefined)[] = [];
  private currentEffect = 0;

  private stateIndex = 0;
  private effectIndex = 0;
  private prevDeps: Array<DependencyList | undefined> = [];

  useState<T>(initialValue: T): [T, (value: SetStateAction<T>) => void] {
    const index = this.stateIndex++;
    if (!(index in this.states)) {
      this.states[index] = typeof initialValue === 'function' ? initialValue() : initialValue;
    }
    
    const setState = (value: SetStateAction<T>) => {
      const nextState = value instanceof Function ? value(this.states[index] as T) : value;
      if (this.states[index] !== nextState) {
        this.states[index] = nextState;
        this.rerender();
      }
    };
    
    return [this.states[index] as T, setState];
  }

  useEffect(effect: EffectCallback, deps?: DependencyList): void {
    const index = this.effectIndex++;
    const prevDeps = this.prevDeps[index];
    const hasChanged = !prevDeps || !deps || 
      deps.length !== prevDeps.length ||
      deps.some((dep, i) => !Object.is(dep, prevDeps[i]));

    if (hasChanged) {
      // Cleanup previous effect
      if (this.cleanups[index]) {
        this.cleanups[index]();
      }
      this.effects[index] = effect;
      const cleanup = effect();
      if (typeof cleanup === 'function') {
        this.cleanups[index] = cleanup;
      }
    }
    this.prevDeps[index] = deps;
  }

  useCallback<T extends AnyFunction>(callback: T, deps?: DependencyList): T {
    return callback;
  }

  useMemo<T>(factory: () => T, deps?: DependencyList): T {
    return factory();
  }

  useRef<T>(initialValue: T) {
    const index = this.stateIndex++;
    if (!(index in this.states)) {
      this.states[index] = { current: initialValue };
    }
    return this.states[index] as { current: T };
  }

  getState<S>(key: string): S {
    return this.states[key] as S;
  }

  rerender(): void {
    this.stateIndex = 0;
    this.effectIndex = 0;
    
    // Run effects that have changed
    this.effects.forEach((effect, i) => {
      if (effect) {
        if (this.cleanups[i]) {
          this.cleanups[i]();
        }
        const cleanup = effect();
        if (typeof cleanup === 'function') {
          this.cleanups[i] = cleanup;
        }
      }
    });
  }

  cleanup(): void {
    this.cleanups.forEach(cleanup => cleanup && cleanup());
    this.states = {};
    this.effects = [];
    this.cleanups = [];
    this.stateIndex = 0;
    this.effectIndex = 0;
    this.prevDeps = [];
  }
}

export function createHookTester<TParams extends unknown[], TResult>(
  hook: (...args: TParams) => TResult
): (params: TParams[0]) => HookTester<TResult> {
  return (params: TParams[0]) => {
    const env = new HookEnvironment();

    // Import mockReactHooks from setupTests
    const { mockReactHooks } = require('../setupTests');

    // Set up hook implementations for this test
    mockReactHooks.useState.mockImplementation(env.useState.bind(env));
    mockReactHooks.useEffect.mockImplementation(env.useEffect.bind(env));
    mockReactHooks.useCallback.mockImplementation(env.useCallback.bind(env));
    mockReactHooks.useMemo.mockImplementation(env.useMemo.bind(env));
    mockReactHooks.useRef.mockImplementation(env.useRef.bind(env));

    // Run hook with mocked React environment
    let currentResult = hook.call(null, params);

    return {
      result: currentResult,
      rerender: () => {
        env.rerender();
        currentResult = hook.call(null, params);
        return currentResult;
      },
      advanceTime: (ms: number) => {
        jest.advanceTimersByTime(ms);
        env.rerender();
        currentResult = hook.call(null, params);
        return currentResult;
      },
      cleanup: () => {
        env.cleanup();
      },
      getState: <S>(key: string): S => env.getState<S>(key)
    };
  };
}
