import { memo } from "react";
import { TimerCircle } from "../timer/TimerCircle";
import { TimerCircleProps } from "@/types/timer";

interface TimerDisplayProps {
  circleProps: Omit<TimerCircleProps, "size">;
  size: "normal" | "large";
  onClick?: () => void;
  isRunning: boolean;
}

export const TimerDisplay = memo(({
  circleProps,
  size,
  onClick,
  isRunning
}: TimerDisplayProps) => {
  const handleClick = () => {
    if (isRunning && onClick) {
      onClick();
    }
  };

  return (
    <div 
      className={`focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${isRunning ? 'cursor-pointer' : ''}`}
      onClick={handleClick}
      onTouchEnd={handleClick}
      role="button"
      tabIndex={0}
    >
      <TimerCircle 
        size={size}
        {...circleProps}
      />
    </div>
  );
});

TimerDisplay.displayName = 'TimerDisplay';