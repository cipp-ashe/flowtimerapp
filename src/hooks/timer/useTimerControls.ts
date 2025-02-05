import { useCallback } from 'react';
import { TimerStateMetrics } from '@/types/metrics';
import { TIMER_CONSTANTS } from '@/types/timer';

interface UseTimerControlsParams {
  timeLeft: number;
  isRunning: boolean;
  metrics: TimerStateMetrics;
  onStart: () => void;
  onPause: () => void;
  onComplete: () => void;
  onAddTime?: (minutes: number) => void;
}

export const useTimerControls = ({
  timeLeft,
  isRunning,
  metrics,
  onStart,
  onPause,
  onComplete,
  onAddTime,
}: UseTimerControlsParams) => {
  const handleToggle = useCallback(() => {
    if (isRunning) {
      onPause();
    } else {
      onStart();
    }
  }, [isRunning, onPause, onStart]);

  const handleComplete = useCallback(() => {
    onComplete();
  }, [onComplete]);

  const handleAddTime = useCallback(() => {
    if (onAddTime) {
      onAddTime(TIMER_CONSTANTS.ADD_TIME_MINUTES);
    }
  }, [onAddTime]);

  const showAddTimeButton = timeLeft < TIMER_CONSTANTS.ADD_TIME_MINUTES * 60;

  return {
    handleToggle,
    handleComplete,
    handleAddTime,
    showAddTimeButton,
    isPaused: !isRunning && metrics.startTime !== null,
  };
};