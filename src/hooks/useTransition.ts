import { useEffect, useState, useCallback, useRef } from 'react';

type TransitionState = 'entering' | 'entered' | 'exiting' | 'exited';

interface UseTransitionOptions {
  duration?: number;
  delay?: number;
  onEnter?: () => void;
  onExit?: () => void;
}

interface TransitionProps {
  style: {
    transition: string;
    opacity: number;
    transform: string;
  };
  'aria-hidden': boolean;
}

interface UseTransitionConfig {
  isVisible: boolean;
  options?: UseTransitionOptions;
}

export const prefersReducedMotion = typeof window !== 'undefined'
  ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
  : false;

export function useTransition({ isVisible, options = {} }: UseTransitionConfig) {
  const {
    duration = 300,
    delay = 0,
    onEnter,
    onExit,
  } = options;

  const [state, setState] = useState<TransitionState>(
    isVisible ? 'entered' : 'exited'
  );
  const [isRendered, setIsRendered] = useState(isVisible);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const isMountedRef = useRef(true);

  const cleanup = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = undefined;
    }
  }, []);

  const updateVisibility = useCallback((visible: boolean) => {
    if (!isMountedRef.current) return;

    cleanup();

    if (visible) {
      setIsRendered(true);
      setState('entering');
      onEnter?.();

      timeoutRef.current = setTimeout(() => {
        if (isMountedRef.current) {
          setState('entered');
        }
      }, duration);
    } else {
      setState('exiting');
      onExit?.();

      timeoutRef.current = setTimeout(() => {
        if (isMountedRef.current) {
          setState('exited');
          setIsRendered(false);
        }
      }, duration);
    }
  }, [duration, onEnter, onExit, cleanup]);

  useEffect(() => {
    if (delay > 0) {
      const delayTimeout = setTimeout(() => {
        updateVisibility(isVisible);
      }, delay);
      return () => clearTimeout(delayTimeout);
    } else {
      updateVisibility(isVisible);
    }
  }, [isVisible, delay, updateVisibility]);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      cleanup();
    };
  }, [cleanup]);

  const getTransitionProps = useCallback((): TransitionProps => {
    const transitionStyle = prefersReducedMotion 
      ? 'none' 
      : `opacity ${duration}ms, transform ${duration}ms`;
    
    return {
      style: {
        transition: transitionStyle,
        opacity: state === 'entering' || state === 'entered' ? 1 : 0,
        transform: state === 'entering' || state === 'entered'
          ? 'translateY(0) scale(1)'
          : 'translateY(10px) scale(0.95)',
      },
      'aria-hidden': !isVisible,
    };
  }, [duration, state, isVisible]);

  return {
    state,
    isRendered,
    getTransitionProps,
    updateVisibility,
  };
}
