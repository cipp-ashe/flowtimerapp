import { Button } from "@/components/ui/button";
import { Clock, Plus, Check, Sparkles } from "lucide-react";
import { TimerControlsProps } from "@/types/timer";
import { memo } from "react";

export const TimerControls = memo(({
  isRunning,
  onToggle,
  onComplete,
  onAddTime,
  isPaused = false,
  showAddTime = false,
  size = "normal",
  toggleButtonA11yProps,
  completeButtonA11yProps,
  addTimeButtonA11yProps,
  pauseTimeLeft = 0,
}: TimerControlsProps) => {
  const iconSize = size === "large" ? "h-5 w-5" : "h-4 w-4";
  const buttonSize = size === "large" ? "px-5 py-3" : "px-4 py-2";

  const formatPauseTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-2 flex flex-col items-center w-full">
      <div className="w-full flex justify-center">
        <Button
          onClick={() => {
            if (onToggle) onToggle();
          }}
          className={`bg-gradient-to-r from-primary to-purple-500 hover:from-purple-500 hover:to-primary ${buttonSize} w-full relative z-50`}
          {...toggleButtonA11yProps}
        >
          {isRunning ? (
            <>
              <Clock className={`mr-2 ${iconSize}`} />
              Pause
            </>
          ) : (
            <>
              <Sparkles className={`mr-2 ${iconSize}`} />
              {isPaused ? 'Resume' : 'Start'}
              {isPaused && pauseTimeLeft > 0 && (
                <span className="ml-2 text-sm text-foreground">
                  ({formatPauseTime(pauseTimeLeft)})
                </span>
              )}
            </>
          )}
        </Button>
      </div>
      {(isRunning || isPaused) && (
        <div className="w-full flex gap-2">
          <Button
            onClick={onComplete}
            variant="outline"
            className={`border-primary/20 hover:bg-primary/20 ${buttonSize} flex-1`}
            {...completeButtonA11yProps}
          >
            <Check className={`mr-2 ${iconSize}`} />
            {showAddTime ? "Complete" : "Complete Early"}
          </Button>
          {showAddTime && onAddTime && (
            <Button
              onClick={onAddTime}
              variant="outline"
              className={`border-primary/20 hover:bg-primary/20 ${buttonSize} flex-1`}
              {...addTimeButtonA11yProps}
            >
              <Plus className={`mr-2 ${iconSize}`} />
              Add 5m
            </Button>
          )}
        </div>
      )}
    </div>
  );
});

TimerControls.displayName = 'TimerControls';
