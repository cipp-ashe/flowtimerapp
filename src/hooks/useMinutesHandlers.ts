import { useCallback } from "react";

interface UseMinutesHandlersProps {
  minutes: number;
  onMinutesChange: (minutes: number) => void;
  minMinutes: number;
  maxMinutes: number;
  onBlur?: () => void;
}

export const useMinutesHandlers = ({
  minutes,
  onMinutesChange,
  minMinutes,
  maxMinutes,
  onBlur
}: UseMinutesHandlersProps) => {
  const handleIncrement = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    const step = minutes < 5 ? 1 : 5;
    const newValue = Math.min(minutes + step, maxMinutes);
    console.log('Incrementing to:', newValue);
    onMinutesChange(newValue);
  }, [minutes, maxMinutes, onMinutesChange]);

  const handleDecrement = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    const step = minutes <= 5 ? 1 : 5;
    const newValue = Math.max(minutes - step, minMinutes);
    console.log('Decrementing to:', newValue);
    onMinutesChange(newValue);
  }, [minutes, minMinutes, onMinutesChange]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    console.log('Input value changed to:', value);
    
    if (value === '') {
      console.log('Empty input, setting to min minutes:', minMinutes);
      onMinutesChange(minMinutes);
      return;
    }

    const parsedValue = parseInt(value, 10);
    if (!isNaN(parsedValue)) {
      const clampedValue = Math.min(Math.max(parsedValue, minMinutes), maxMinutes);
      console.log('Setting minutes to:', clampedValue);
      onMinutesChange(clampedValue);
    }
  }, [minMinutes, maxMinutes, onMinutesChange]);

  const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    if (isNaN(minutes) || minutes < minMinutes) {
      onMinutesChange(minMinutes);
    } else if (minutes > maxMinutes) {
      onMinutesChange(maxMinutes);
    }
    onBlur?.();
  }, [minutes, minMinutes, maxMinutes, onMinutesChange, onBlur]);

  return {
    handleIncrement,
    handleDecrement,
    handleInputChange,
    handleBlur
  };
};