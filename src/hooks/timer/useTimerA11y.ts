import { useCallback, useRef, useEffect } from 'react';

interface UseTimerA11yProps {
  isRunning: boolean;
  timeLeft: number;
  taskName: string;
  isExpanded: boolean;
}

export const useTimerA11y = ({
  isRunning,
  timeLeft,
  taskName,
  isExpanded,
}: UseTimerA11yProps) => {
  const lastActiveElementRef = useRef<HTMLElement | null>(null);
  const timerRef = useRef<HTMLDivElement>(null);
  
  const formatTimeForA11y = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const minutesText = `${minutes} minute${minutes !== 1 ? 's' : ''}`;
    const secondsText = remainingSeconds > 0 ? ` and ${remainingSeconds} second${remainingSeconds !== 1 ? 's' : ''}` : '';
    return `${minutesText}${secondsText}`;
  };

  // Announce time changes less frequently to avoid overwhelming screen readers
  useEffect(() => {
    if (isRunning && timeLeft % 15 === 0) {
      const announcement = `${formatTimeForA11y(timeLeft)} remaining for ${taskName}`;
      const ariaLive = document.createElement('div');
      ariaLive.className = 'sr-only';
      ariaLive.setAttribute('aria-live', 'polite');
      ariaLive.textContent = announcement;
      document.body.appendChild(ariaLive);
      
      setTimeout(() => {
        document.body.removeChild(ariaLive);
      }, 1000);
    }
  }, [timeLeft, isRunning, taskName]);

  // Manage focus when expanding/collapsing
  useEffect(() => {
    if (isExpanded) {
      lastActiveElementRef.current = document.activeElement as HTMLElement;
      setTimeout(() => {
        timerRef.current?.focus();
      }, 100);
    } else if (lastActiveElementRef.current) {
      lastActiveElementRef.current.focus();
      lastActiveElementRef.current = null;
    }
  }, [isExpanded]);

  const getTimerA11yProps = useCallback(() => ({
    ref: timerRef,
    role: "timer",
    "aria-label": `Timer for ${taskName}`,
    "aria-live": "polite" as const,
    tabIndex: 0,
    "aria-expanded": isExpanded,
    "aria-valuemax": timeLeft,
    "aria-valuenow": timeLeft,
    "aria-valuetext": `${formatTimeForA11y(timeLeft)} remaining`,
  }), [taskName, isExpanded, timeLeft]);

  const getToggleButtonA11yProps = useCallback(() => ({
    "aria-label": `${isRunning ? 'Pause' : 'Start'} timer for ${taskName}`,
    "aria-pressed": isRunning,
  }), [isRunning, taskName]);

  const getCompleteButtonA11yProps = useCallback(() => ({
    "aria-label": `Complete ${taskName} timer early`,
  }), [taskName]);

  const getAddTimeButtonA11yProps = useCallback(() => ({
    "aria-label": `Add 5 minutes to ${taskName} timer`,
  }), [taskName]);

  return {
    getTimerA11yProps,
    getToggleButtonA11yProps,
    getCompleteButtonA11yProps,
    getAddTimeButtonA11yProps,
    formatTimeForA11y,
  };
};