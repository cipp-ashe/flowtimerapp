import { useEffect, useCallback } from 'react';
import { TimerStateMetrics } from '@/types/metrics';
import { useTimer } from './useTimer';
import { useTimerMetrics } from './useTimerMetrics';

interface UseTimerStateProps {
  initialDuration: number;
  onTimeUp?: () => void;
  onDurationChange?: (minutes: number) => void;
}

export const useTimerState = ({
  initialDuration,
  onTimeUp,
  onDurationChange,
}: UseTimerStateProps) => {
  const {
    timeLeft,
    minutes,
    isRunning,
    metrics: timerMetrics,
    start,
    pause,
    reset: resetTimer,
    addTime: addTimeBase,
    setMinutes,
    completeTimer: completeTimerBase,
  } = useTimer({
    initialDuration,
    onTimeUp,
    onDurationChange,
  });

  const {
    metrics,
    updateMetrics,
    calculateFinalMetrics,
  } = useTimerMetrics(initialDuration);

  const startTimer = useCallback(() => {
    if (metrics.isPaused && metrics.lastPauseTimestamp) {
      const pauseDuration = Math.floor(
        (new Date().getTime() - metrics.lastPauseTimestamp.getTime()) / 1000
      );
      updateMetrics({
        pausedTime: metrics.pausedTime + pauseDuration,
        isPaused: false,
        pausedTimeLeft: null,
        lastPauseTimestamp: null,
      });
    } else {
      updateMetrics({
        startTime: metrics.startTime || new Date(),
        isPaused: false,
        pausedTimeLeft: null,
        lastPauseTimestamp: null,
      });
    }
    start();
  }, [metrics, start, updateMetrics]);

  const pauseTimer = useCallback(() => {
    if (metrics.isPaused || metrics.endTime) return;

    updateMetrics({
      isPaused: true,
      pausedTimeLeft: timeLeft,
      lastPauseTimestamp: new Date(),
      pauseCount: metrics.pauseCount + 1,
    });
    pause();
  }, [metrics, timeLeft, updateMetrics, pause]);

  const addTime = useCallback((additionalMinutes: number) => {
    if (metrics.endTime) {
      console.warn('Cannot add time to completed timer');
      return;
    }

    const additionalSeconds = additionalMinutes * 60;
    updateMetrics({
      extensionTime: metrics.extensionTime + additionalSeconds,
      expectedTime: metrics.expectedTime + additionalSeconds,
      pausedTimeLeft: metrics.isPaused ? timeLeft + additionalSeconds : metrics.pausedTimeLeft,
    });
    addTimeBase(additionalMinutes);
  }, [metrics, timeLeft, updateMetrics, addTimeBase]);

  const completeTimer = useCallback(async (): Promise<TimerStateMetrics> => {
    const finalMetrics = await calculateFinalMetrics(new Date());
    completeTimerBase();
    return finalMetrics;
  }, [calculateFinalMetrics, completeTimerBase]);

  const reset = useCallback(() => {
    resetTimer();
    updateMetrics({
      startTime: null,
      endTime: null,
      pauseCount: 0,
      expectedTime: minutes * 60,
      actualDuration: 0,
      favoriteQuotes: metrics.favoriteQuotes,
      pausedTime: 0,
      lastPauseTimestamp: null,
      extensionTime: 0,
      netEffectiveTime: 0,
      efficiencyRatio: 0,
      completionStatus: 'Completed On Time',
      isPaused: false,
      pausedTimeLeft: null,
    });
  }, [minutes, metrics.favoriteQuotes, resetTimer, updateMetrics]);

  const incrementFavorites = useCallback(() => {
    updateMetrics({
      favoriteQuotes: metrics.favoriteQuotes + 1,
    });
  }, [metrics.favoriteQuotes, updateMetrics]);

  return {
    timeLeft,
    minutes,
    isRunning,
    metrics,
    start: startTimer,
    pause: pauseTimer,
    reset,
    addTime,
    setMinutes,
    incrementFavorites,
    completeTimer,
  };
};