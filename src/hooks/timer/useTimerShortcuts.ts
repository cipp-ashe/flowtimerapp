import { useEffect, useCallback } from 'react';
import { toast } from 'sonner';

interface UseTimerShortcutsProps {
  isRunning: boolean;
  onToggle: () => void;
  onComplete?: () => void;
  onAddTime?: () => void;
  enabled?: boolean;
}

export const useTimerShortcuts = ({
  isRunning,
  onToggle,
  onComplete,
  onAddTime,
  enabled = true,
}: UseTimerShortcutsProps) => {
  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    // Don't trigger shortcuts if typing in an input
    if (
      event.target instanceof HTMLInputElement ||
      event.target instanceof HTMLTextAreaElement ||
      !enabled
    ) {
      return;
    }

    switch (event.key.toLowerCase()) {
      case ' ':  // Space
      case 'k': // Common video player shortcut
        event.preventDefault();
        onToggle();
        toast.info(`Timer ${isRunning ? 'paused ⏸️' : 'started ▶️'}`);
        break;
      
      case 'c':
        if (isRunning && onComplete) {
          event.preventDefault();
          onComplete();
          toast.info('Timer completed ⏱️✨');
        }
        break;
      
      case 'a':
        if (isRunning && onAddTime) {
          event.preventDefault();
          onAddTime();
          toast.info('Added time ⌛');
        }
        break;

      default:
        break;
    }
  }, [isRunning, onToggle, onComplete, onAddTime, enabled]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

  // Return keyboard shortcuts info for UI display
  return {
    shortcuts: [
      { key: 'Space/K', action: 'Start/Pause' },
      { key: 'C', action: 'Complete (when running)' },
      { key: 'A', action: 'Add time (when running)' },
    ],
  };
};
