import React, { InputHTMLAttributes, useCallback, useState } from "react";
import { Input } from "../ui/input";

interface MinutesDisplayProps extends InputHTMLAttributes<HTMLInputElement> {
  minutes: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  minMinutes: number;
  maxMinutes: number;
}

export const MinutesDisplay = ({
  minutes,
  onChange,
  onBlur,
  minMinutes,
  maxMinutes,
  className,
  ...props
}: MinutesDisplayProps) => {
  const [inputValue, setInputValue] = useState(minutes.toString());
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d+$/.test(value)) {
      setInputValue(value);
    }
  }, []);

  const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    const value = e.target.value;
    
    if (value === '') {
      setInputValue(minMinutes.toString());
      const syntheticEvent = {
        ...e,
        target: { ...e.target, value: minMinutes.toString() }
      } as React.ChangeEvent<HTMLInputElement>;
      onChange(syntheticEvent);
    } else {
      const numValue = parseInt(value, 10);
      const clampedValue = Math.min(Math.max(numValue, minMinutes), maxMinutes);
      setInputValue(clampedValue.toString());
      const syntheticEvent = {
        ...e,
        target: { ...e.target, value: clampedValue.toString() }
      } as React.ChangeEvent<HTMLInputElement>;
      onChange(syntheticEvent);
    }
    onBlur(e);
  }, [minMinutes, maxMinutes, onChange, onBlur]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.currentTarget.blur();
    }
  }, []);

  const handleFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const displayValue = isFocused ? inputValue : minutes.toString();

  return (
    <div 
      className="relative w-20"
    >
      <Input
        type="text"
        inputMode="numeric"
        pattern="\d*"
        value={displayValue}
        onChange={handleChange}
        onBlur={handleBlur}
        onFocus={handleFocus}
        onKeyDown={handleKeyDown}
        className={`text-center font-mono bg-background/50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none touch-manipulation overflow-hidden ${className}`}
        aria-label="Minutes input"
        {...props}
      />
      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-muted-foreground pointer-events-none">
        min
      </span>
    </div>
  );
};
