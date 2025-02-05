import React, { memo } from "react";
import { MinutesInputProps } from "../../types/timer";
import { MinutesButton } from "./MinutesButton";
import { MinutesDisplay } from "./MinutesDisplay";
import { useMinutesHandlers } from "../../hooks/useMinutesHandlers";

export const MinutesInput = memo(({
  minutes,
  onMinutesChange,
  minMinutes,
  maxMinutes,
  onBlur
}: MinutesInputProps) => {
  const {
    handleIncrement,
    handleDecrement,
    handleInputChange,
    handleBlur
  } = useMinutesHandlers({
    minutes,
    onMinutesChange,
    minMinutes,
    maxMinutes,
    onBlur
  });

  return (
    <div className="flex items-center justify-center gap-2">
      <MinutesButton
        direction="down"
        onClick={handleDecrement}
        onTouchStart={handleDecrement}
        disabled={minutes <= minMinutes}
        aria-label="Decrease minutes"
      />
      
      <MinutesDisplay
        minutes={minutes}
        onChange={handleInputChange}
        onBlur={handleBlur}
        minMinutes={minMinutes}
        maxMinutes={maxMinutes}
      />

      <MinutesButton
        direction="up"
        onClick={handleIncrement}
        onTouchStart={handleIncrement}
        disabled={minutes >= maxMinutes}
        aria-label="Increase minutes"
      />
    </div>
  );
});

MinutesInput.displayName = 'MinutesInput';
