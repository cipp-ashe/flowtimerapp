import { memo } from "react";
import { Card } from "../../ui/card";
import { TimerHeader } from "../TimerHeader";
import { TimerDisplay } from "../TimerDisplay";
import { TimerControls } from "../controls/TimerControls";
import { TimerMetricsDisplay } from "../TimerMetrics";
import { QuoteDisplay } from "../../quotes/QuoteDisplay";
import { MinutesInput } from "../../minutes/MinutesInput";
import { SoundSelector } from "../../SoundSelector";
import { Quote, SoundOption } from "@/types/timer";
import { TimerStateMetrics } from "@/types/metrics";

interface TimerCompactViewProps {
  taskName: string;
  timerCircleProps: {
    isRunning: boolean;
    timeLeft: number;
    minutes: number;
    circumference: number;
  };
  timerControlsProps: {
    isRunning: boolean;
    onToggle: () => void;
    onComplete: () => void;
    onAddTime?: () => void;
    metrics: TimerStateMetrics;
    showAddTime: boolean;
    size: "normal";
  };
  metrics: TimerStateMetrics;
  internalMinutes: number;
  onMinutesChange: (minutes: number) => void;
  selectedSound: SoundOption;
  onSoundChange: (sound: SoundOption) => void;
  onTestSound: () => void;
  isLoadingAudio: boolean;
  onExpand: () => void;
  onLike: () => void;
  favorites: Quote[];
  setFavorites: React.Dispatch<React.SetStateAction<Quote[]>>;
}

export const TimerCompactView = memo(({
  taskName,
  timerCircleProps,
  timerControlsProps,
  metrics,
  internalMinutes,
  onMinutesChange,
  selectedSound,
  onSoundChange,
  onTestSound,
  isLoadingAudio,
  onExpand,
  onLike,
  favorites,
  setFavorites,
}: TimerCompactViewProps) => {
  return (
    <Card className="p-4 w-full mx-auto bg-card/80 backdrop-blur-sm border-primary/20 shadow-lg sm:p-4">
      <div className="space-y-3 sm:space-y-4">
        <TimerHeader taskName={taskName} />

        <div className={`overflow-hidden transition-all duration-700 ${
          timerCircleProps.isRunning ? 'max-h-0 opacity-0' : 'max-h-[500px] opacity-100'
        }`}>
          <div className="flex flex-col items-center space-y-3 pt-1">
            <MinutesInput
              minutes={internalMinutes}
              onMinutesChange={onMinutesChange}
              minMinutes={1}
              maxMinutes={60}
            />

            <SoundSelector
              selectedSound={selectedSound}
              onSoundChange={onSoundChange}
              onTestSound={onTestSound}
              isLoadingAudio={isLoadingAudio}
            />
          </div>
        </div>

        <TimerDisplay
          circleProps={timerCircleProps}
          size="normal"
          onClick={onExpand}
          isRunning={timerCircleProps.isRunning}
        />

        <TimerControls {...timerControlsProps} />

        <TimerMetricsDisplay
          metrics={metrics}
          isRunning={timerCircleProps.isRunning}
        />

        <QuoteDisplay
          currentTask={taskName}
          onLike={onLike}
          favorites={favorites}
          setFavorites={setFavorites}
        />
      </div>
    </Card>
  );
});

TimerCompactView.displayName = 'TimerCompactView';
