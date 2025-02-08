import React from 'react';
import { Button } from "@/components/ui/button";
import { Maximize2 } from "lucide-react";
import { TimerDisplay } from "../TimerDisplay";
import { cn } from "@/lib/utils";

export interface CornerTimerViewProps {
  taskName: string;
  timerCircleProps: {
    isRunning: boolean;
    timeLeft: number;
    minutes: number;
    circumference: number;
    isStateLoaded: boolean; // Add isStateLoaded to timerCircleProps
    onClick?: () => void; // Add onClick prop here
  };
  onExpand: () => void;
}

export const CornerTimerView = ({
  taskName,
  timerCircleProps,
  onExpand
}: CornerTimerViewProps) => {
  return (
    <div className="flex flex-col h-full w-[250px]" style={{ WebkitAppRegion: 'drag' } as React.CSSProperties}>
      {/* Draggable title bar */}
      <div className="h-8 bg-background/50 backdrop-blur-sm flex items-center px-4">
        <span className="text-xs text-muted-foreground font-medium">
          Focus Timer
        </span>
      </div>
      
      <div className={cn(
        "flex-1 flex flex-col items-center justify-center gap-6 p-4",
        "bg-background/90 backdrop-blur-md"
      )}>
        {timerCircleProps.isStateLoaded && (
          <div className="relative scale-150" style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}>
            <TimerDisplay
              circleProps={timerCircleProps}
              size="small"
              isRunning={timerCircleProps.isRunning}
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={onExpand}
              className="absolute -top-2 -right-2 h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
              title="Expand timer"
            >
              <Maximize2 className="h-4 w-4" />
            </Button>
          </div>
        )}

        {timerCircleProps.isStateLoaded && (
          <p className="text-base font-semibold text-foreground truncate max-w-full text-center" style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}>
            {taskName}
          </p>
        )}
      </div>
    </div>
  );
};
