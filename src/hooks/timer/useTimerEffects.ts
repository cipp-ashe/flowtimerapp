import { useEffect } from 'react';

interface UseTimerEffectsProps {
  timeLeft?: number;
  isRunning?: boolean;
  taskName: string;
  resetStates: () => void;
}

export const useTimerEffects = ({
  taskName,
  resetStates,
  isRunning,
}: UseTimerEffectsProps) => {
  // Reset states when task changes and timer is not running
  useEffect(() => {
    if (!isRunning) {
      resetStates();
    }
    return () => resetStates();
  }, [taskName, resetStates, isRunning]);
};