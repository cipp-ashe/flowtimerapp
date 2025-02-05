import { useState, useCallback, useEffect, useRef } from 'react';
import { toast } from "sonner";
import { TimerMetrics } from '@/types/metrics';

interface UseTimerOptions {
  initialDuration: number;
  onTimeUp?: () => void;
  onDurationChange?: (minutes: number) => void;
}

interface UseTimerReturn {
  timeLeft: number;
  minutes: number;
  isRunning: boolean;
  metrics: TimerMetrics;
  start: () => void;
  pause: () => void;
  reset: () => void;
  addTime: (minutes: number) => void;
  setMinutes: (minutes: number) => void;
  completeTimer: () => void;
}

export const useTimer = ({
  initialDuration,
  onTimeUp,
  onDurationChange,
}: UseTimerOptions): UseTimerReturn => {
  // Ensure initial duration is positive
  const validInitialDuration = Math.max(60, initialDuration);
  const [timeLeft, setTimeLeft] = useState<number>(validInitialDuration);
  const [minutes, setMinutesState] = useState(Math.floor(validInitialDuration / 60));
  const [isRunning, setIsRunning] = useState(false);
  const [metrics, setMetrics] = useState<TimerMetrics>({
    startTime: null,
    endTime: null,
    pauseCount: 0,
    expectedTime: validInitialDuration,
    actualDuration: 0,
    favoriteQuotes: 0,
    pausedTime: 0,
    lastPauseTimestamp: null,
    extensionTime: 0,
    netEffectiveTime: 0,
    efficiencyRatio: 0,
    completionStatus: 'Completed On Time'
  });

  const isMountedRef = useRef(true);
  const intervalRef = useRef<NodeJS.Timeout>();

  // Handle duration updates
  useEffect(() => {
    if (!isMountedRef.current) return;

    const validDuration = Math.max(60, initialDuration); // Minimum 1 minute
    setTimeLeft(validDuration);
    setMinutesState(Math.floor(validDuration / 60));
    setMetrics(prev => ({
      ...prev,
      expectedTime: validDuration
    }));

    return () => {
      setIsRunning(false);
    };
  }, [initialDuration]);

  const setMinutes = useCallback((newMinutes: number) => {
    if (!isMountedRef.current) return;

    // Clamp minutes between 1 and 60
    const clampedMinutes = Math.max(1, Math.min(60, newMinutes));
    const newSeconds = clampedMinutes * 60;
    
    setMinutesState(clampedMinutes);
    setTimeLeft(newSeconds);
    setMetrics(prev => ({
      ...prev,
      expectedTime: newSeconds
    }));
    
    if (onDurationChange) {
      onDurationChange(clampedMinutes);
    }
  }, [onDurationChange]);

  const start = useCallback(() => {
    if (!isMountedRef.current) return;

    setIsRunning(true);
    setMetrics(prev => ({
      ...prev,
      startTime: prev.startTime || new Date(),
    }));
    toast.success("Timer started ⏱️🚀");
  }, []);

  const pause = useCallback(() => {
    if (!isMountedRef.current) return;

    setIsRunning(false);
    setMetrics(prev => ({
      ...prev,
      pauseCount: prev.pauseCount + 1,
      lastPauseTimestamp: new Date()
    }));
  }, []);

  const reset = useCallback(() => {
    if (!isMountedRef.current) return;

    const newSeconds = minutes * 60;
    setIsRunning(false);
    setTimeLeft(newSeconds);
    setMetrics({
      startTime: null,
      endTime: null,
      pauseCount: 0,
      expectedTime: newSeconds,
      actualDuration: 0,
      favoriteQuotes: 0,
      pausedTime: 0,
      lastPauseTimestamp: null,
      extensionTime: 0,
      netEffectiveTime: 0,
      efficiencyRatio: 0,
      completionStatus: 'Completed On Time'
    });
  }, [minutes]);

  const addTime = useCallback((additionalMinutes: number) => {
    if (!isMountedRef.current) return;

    const additionalSeconds = additionalMinutes * 60;
    setTimeLeft(prev => prev + additionalSeconds);
    setMinutesState(prev => prev + additionalMinutes);
    setMetrics(prev => ({
      ...prev,
      extensionTime: prev.extensionTime + additionalSeconds,
      expectedTime: prev.expectedTime + additionalSeconds
    }));
    toast.success(`+${additionalMinutes}m added ⌛💪`);
  }, []);

  const completeTimer = useCallback(() => {
    if (!isMountedRef.current) return;

    setIsRunning(false);
    setMetrics(prev => ({
      ...prev,
      endTime: new Date(),
      actualDuration: prev.startTime 
        ? Math.floor((Date.now() - prev.startTime.getTime()) / 1000)
        : prev.actualDuration,
    }));
  }, []);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        if (!isMountedRef.current) return;

        setTimeLeft((time) => {
          if (time <= 1) {
            completeTimer();
            onTimeUp?.();
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = undefined;
      }
    };
  }, [isRunning, timeLeft, onTimeUp, completeTimer]);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = undefined;
      }
    };
  }, []);

  return {
    timeLeft,
    minutes,
    isRunning,
    metrics,
    start,
    pause,
    reset,
    addTime,
    setMinutes,
    completeTimer,
  };
};
