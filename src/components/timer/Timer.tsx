import * as React from "react";
import type { TimerState as ElectronTimerState } from "@/types/electron";
import type { CornerTimerViewProps } from "./views/CornerTimerView";
import type { TimerCircleProps } from "@/types/timer";

type ViewMode = 'compact' | 'expanded' | 'corner';

interface LocalTimerState {
  viewMode: ViewMode;
  selectedSound: SoundOption;
  minutes: number;
  isRunning: boolean;
  pauseTimeLeft: number;
  isStateLoaded: boolean; // Add isStateLoaded to the state
}
import { useAudio } from "@/hooks/useAudio";
import { useTimerState } from "@/hooks/timer/useTimerState";
import { TimerStateMetrics } from "@/types/metrics";
import { CompletionCelebration } from "./CompletionCelebration";
import { FloatingQuotes } from "../quotes/FloatingQuotes";
import { Minimize2, ArrowLeftRight } from "lucide-react";
import { TIMER_CONSTANTS, SOUND_OPTIONS, type SoundOption, type Quote } from "@/types/timer";
import { TimerExpandedView, TimerExpandedViewRef } from "./views/TimerExpandedView";
import { TimerCompactView } from "./views/TimerCompactView";
import { CornerTimerView } from "./views/CornerTimerView";
import { toast } from "sonner";
import { DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { TimerCompletionDialog, TimerCompletionDialogContent } from "./TimerCompletionDialog";
import { Button } from "../ui/button";

const { MIN_MINUTES, MAX_MINUTES, ADD_TIME_MINUTES, CIRCLE_CIRCUMFERENCE } = TIMER_CONSTANTS;

interface ExtendedTimerProps {
  // Timer configuration
  duration: number;
  taskName: string;
  cornerMode?: boolean;

  // Callbacks
  onComplete: (metrics: TimerStateMetrics) => void;
  onAddTime: () => void;
  onDurationChange?: (minutes: number) => void;

  // Quotes management
  favorites: Quote[];
  setFavorites: React.Dispatch<React.SetStateAction<Quote[]>>;
}

interface TimerState {
  viewMode: ViewMode;
  selectedSound: SoundOption;
  minutes: number;
  isRunning: boolean;
  pauseTimeLeft: number;
}

export const Timer = ({
  duration,
  taskName,
  onComplete,
  onAddTime,
  onDurationChange,
  favorites = [],
  setFavorites,
  cornerMode = false
}: ExtendedTimerProps) => {
  // Initialize viewMode based on cornerMode prop
  const [timerState, setTimerState] = React.useState<LocalTimerState>({
    viewMode: cornerMode ? 'corner' : 'compact',
    selectedSound: "bell",
    minutes: duration ? Math.floor(duration / 60) : 25,
    isRunning: false,
    pauseTimeLeft: 0,
    isStateLoaded: !cornerMode
  });


  const previousViewModeRef = React.useRef<'compact' | 'expanded' | 'corner'>(timerState.viewMode);
  const [showCompletion, setShowCompletion] = React.useState(false);
  const [showConfirmation, setShowConfirmation] = React.useState(false);
  const [completionMetrics, setCompletionMetrics] = React.useState<TimerStateMetrics | null>(null);
  const pauseTimerRef = React.useRef<NodeJS.Timeout>();
  const durationInSeconds = timerState.minutes * 60;

  const {
    timeLeft,
    minutes,
    isRunning,
    metrics,
    start,
    pause,
    incrementFavorites,
    addTime: addMinutes,
    setMinutes,
    completeTimer,
    reset: resetTimer,
  } = useTimerState({
    initialDuration: durationInSeconds,
    onTimeUp: async () => {
      try {
        pause();
        setShowConfirmation(true);
      } catch (error) {
        console.error('Error in timer completion flow:', error);
        toast.error("An error occurred while completing the timer ⚠️");
      }
    },
    onDurationChange,
  });

  // Update viewMode when cornerMode prop changes
  React.useEffect(() => {
    if (cornerMode) {
      previousViewModeRef.current = timerState.viewMode;
      setTimerState(prev => ({ ...prev, viewMode: 'corner' }));
    } else if (timerState.viewMode === 'corner') {
      setTimerState(prev => ({
        ...prev,
        viewMode: previousViewModeRef.current === 'corner' ? 'compact' : previousViewModeRef.current
      }));
    }
  }, [cornerMode, timerState.viewMode]);

  const handleEnterCornerMode = React.useCallback(() => {
    previousViewModeRef.current = timerState.viewMode;
    setTimerState(prev => ({ ...prev, viewMode: 'corner' }));
  }, [timerState.viewMode]);

  const handleExitCornerMode = React.useCallback(() => {
    setTimerState(prev => ({
      ...prev,
      viewMode: previousViewModeRef.current === 'corner' ? 'compact' : previousViewModeRef.current
    }));
  }, []);


  const { play: playSound, testSound, isLoadingAudio } = useAudio({
    audioUrl: SOUND_OPTIONS[timerState.selectedSound],
    options: {
      onError: (error) => {
        console.error("Audio error:", error);
        toast.error("Could not play sound. Please check your browser settings. 🔇");
      },
    },
  });

  const expandedViewRef = React.useRef<TimerExpandedViewRef>(null);

  const handleTimerCompletion = React.useCallback(async () => {
    try {
      if (timerState.viewMode === 'expanded') {
        expandedViewRef.current?.saveNotes();
      }

      const finalMetrics = await completeTimer();
      if (!finalMetrics) {
        toast.error("An error occurred while completing the timer ⚠️");
        return;
      }
      await playSound();
      setTimeout(() => {
        setCompletionMetrics(finalMetrics);
        setShowCompletion(true);
      }, 0);
    } catch (error) {
      console.error('Error in timer completion flow:', error);
      toast.error("An error occurred while completing the timer ⚠️");
    }
  }, [completeTimer, playSound, timerState.viewMode]);

  const handleComplete = React.useCallback(async () => {
    setShowConfirmation(false);
    await handleTimerCompletion();
  }, [handleTimerCompletion]);

  const handleAddTimeAndContinue = React.useCallback(() => {
    setShowConfirmation(false);
    addMinutes(ADD_TIME_MINUTES);
    if (typeof onAddTime === 'function') {
      onAddTime();
    }
    start();
    toast.success(`Added ${ADD_TIME_MINUTES} minutes. Keep going! ⌛💪`);
  }, [addMinutes, onAddTime, start]);

  React.useEffect(() => {
    if (duration) {
      const newMinutes = Math.floor(duration / 60);
      setTimerState(prev => ({
        ...prev, minutes: newMinutes
      }));
    }
  }, [duration]);

  const handleMinutesChange = React.useCallback((newMinutes: number) => {
    const clampedMinutes = Math.min(Math.max(newMinutes, 1), 60);
    setTimerState(prev => ({
      ...prev, minutes: clampedMinutes
    }));
    setMinutes(clampedMinutes);
    if (onDurationChange) {
      onDurationChange(clampedMinutes);
    }
  }, [setMinutes, onDurationChange]);

  const handleStart = React.useCallback(() => {
    if (pauseTimerRef.current) {
      clearInterval(pauseTimerRef.current);
      setTimerState(prev => ({
        ...prev, pauseTimeLeft: 0
      }));
    }
    start();
  }, [start]);

  const handlePause = React.useCallback(() => {
    pause();
    setTimerState(prev => ({
      ...prev, pauseTimeLeft: 300 // 5 minutes in seconds
    }));
    pauseTimerRef.current = setInterval(() => {
      setTimerState(prev => {
        if (prev.pauseTimeLeft <= 1) {
          clearInterval(pauseTimerRef.current);
          playSound();
          return { ...prev, pauseTimeLeft: 0 };
        }
        return { ...prev, pauseTimeLeft: prev.pauseTimeLeft - 1 };
      });
    }, 1000);
  }, [pause, playSound]);

  React.useEffect(() => {
    return () => {
      if (pauseTimerRef.current) {
        clearInterval(pauseTimerRef.current);
      }
    };
  }, []);

  const handleToggle = React.useCallback((fromExpanded = false) => {
    if (isRunning) {
      handlePause();
    } else {
      handleStart();
      if (!fromExpanded) {
        setTimerState(prev => ({
          ...prev, viewMode: 'expanded'
        }));
      }
    }
  }, [isRunning, handlePause, handleStart]);

  const handleCloseCompletion = React.useCallback(() => {
    if (!completionMetrics) return;

    if (typeof onComplete === 'function') {
      onComplete(completionMetrics);
    }

    setShowCompletion(false);
    setTimerState(prev => ({
      ...prev, viewMode: 'compact'
    }));
    setCompletionMetrics(null);
    resetTimer();

    toast.success("Task completed! You're crushing it! 🎯🎉");
  }, [onComplete, completionMetrics, resetTimer]);

  const handleAddTime = React.useCallback(() => {
    addMinutes(ADD_TIME_MINUTES);
    if (typeof onAddTime === 'function') {
      onAddTime();
    }
    toast.success(`Added ${ADD_TIME_MINUTES} minutes. Keep going! ⌛💪`);
  }, [addMinutes, onAddTime]);

  // Listen for timer state updates from other windows
  React.useEffect(() => {
    const handleTimerStateUpdate = (event: CustomEvent<ElectronTimerState>) => {
      const state = event.detail;

      // Update metrics first to ensure proper state
      if (state.metrics) {
        const updatedMetrics = {
          ...state.metrics,
          startTime: state.metrics.startTime ? new Date(state.metrics.startTime) : null,
          endTime: state.metrics.endTime ? new Date(state.metrics.endTime) : null,
          lastPauseTimestamp: state.metrics.lastPauseTimestamp ? new Date(state.metrics.lastPauseTimestamp) : null
        };
        // Note: metrics update is handled by useTimerState internally
      }

      // Update time and minutes
      setTimerState(prev => ({
        ...prev, minutes: state.minutes
      }));
      setMinutes(state.minutes);

      // Update running state last
      if (state.isRunning && !isRunning) {
        setTimeout(() => start(), 50);
      } else if (!state.isRunning && isRunning) {
        pause();
      }
    };

    if (cornerMode) { // Only add listener in cornerMode
      window.addEventListener('timer-state-update', handleTimerStateUpdate as EventListener);
      return () => {
        window.removeEventListener('timer-state-update', handleTimerStateUpdate as EventListener);
      };
    } else {
      setTimerState(prev => ({ ...prev, isStateLoaded: true })); // For non-corner mode, state is immediately loaded
    }
  }, [start, pause, setMinutes, isRunning, cornerMode]);

  const timerCirclePropsOnClick = () => {
    if (isRunning || metrics.isPaused) {
      setTimerState(prev => ({
        ...prev, viewMode: 'expanded'
      }));
    }
  };

  const timerCircleProps: CornerTimerViewProps['timerCircleProps'] = {
    isRunning,
    timeLeft,
    minutes,
    circumference: CIRCLE_CIRCUMFERENCE,
    onClick: timerCirclePropsOnClick,
    isStateLoaded: timerState.isStateLoaded,
    ...(timerState.viewMode !== 'corner' ? { onClick: timerCirclePropsOnClick } : {}), // Conditionally add onClick
  };

  const timerControlsProps = {
    isRunning,
    onToggle: handleToggle,
    isPaused: metrics.isPaused,
    onComplete: handleComplete,
    onAddTime: handleAddTime,
    metrics,
    showAddTime: timerState.viewMode === 'expanded',
    size: timerState.viewMode === 'expanded' ? "large" as const : "normal" as const,
    pauseTimeLeft: timerState.pauseTimeLeft,
  };

  if (showCompletion && completionMetrics) {
    return (
      <CompletionCelebration
        metrics={completionMetrics}
        onComplete={handleCloseCompletion}
      />
    );
  }

  return (
    <>
      {timerState.viewMode === 'corner' && (
        <CornerTimerView
          taskName={taskName}
          timerCircleProps={timerCircleProps}
          onExpand={handleExitCornerMode}
        />
      )}

      {timerState.viewMode === 'expanded' && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden">
          {/* Fixed background with backdrop blur */}
          <div className="fixed inset-0 bg-background/95 backdrop-blur-md transition-opacity duration-300" />

          {/* Floating quotes container */}
          <div className="fixed inset-0 pointer-events-none overflow-hidden">
            <FloatingQuotes favorites={favorites} />
          </div>

          <div className="fixed top-6 right-6 flex items-center gap-2 z-[102]">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleEnterCornerMode}
              className="p-2 text-muted-foreground hover:text-foreground transition-all duration-300 hover:scale-110"
              title="Switch to corner view"
            >
              <ArrowLeftRight className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTimerState(prev => ({
                ...prev, viewMode: 'compact'
              }))}
              className="p-2 text-muted-foreground hover:text-foreground transition-all duration-300 hover:scale-110"
              title="Switch to compact view"
            >
              <Minimize2 className="h-5 w-5" />
            </Button>
          </div>

          <TimerExpandedView
            ref={expandedViewRef}
            taskName={taskName}
            timerCircleProps={timerCircleProps}
            timerControlsProps={{
              ...timerControlsProps,
              size: "large",
              onToggle: () => handleToggle(true)
            }}
            metrics={metrics}
            onClose={() => setTimerState(prev => ({
              ...prev, viewMode: 'compact'
            }))}
            onLike={incrementFavorites}
            favorites={favorites}
            setFavorites={setFavorites}
            handleEnterCornerMode={handleEnterCornerMode} // Pass handleEnterCornerMode
            handleExitCornerMode={handleExitCornerMode} // Pass handleExitCornerMode
          />
        </div>
      )}

      {timerState.viewMode === 'compact' && (
        <div>
          <TimerCompactView
            taskName={taskName}
            timerCircleProps={timerCircleProps}
            timerControlsProps={{ ...timerControlsProps, size: "normal" }}
            metrics={metrics}
            internalMinutes={timerState.minutes}
            onMinutesChange={handleMinutesChange}
            selectedSound={timerState.selectedSound}
            onSoundChange={(sound) => setTimerState(prev => ({ ...prev, selectedSound: sound }))}
            onTestSound={testSound}
            isLoadingAudio={isLoadingAudio}
            onExpand={() => {
              if (isRunning || metrics.isPaused) {
                setTimerState(prev => ({ ...prev, viewMode: 'expanded' }));
              }
            }}
            onLike={incrementFavorites}
            favorites={favorites}
            setFavorites={setFavorites}
          />

          <TimerCompletionDialog open={showConfirmation} onOpenChange={setShowConfirmation}>
            <TimerCompletionDialogContent className="flex flex-col gap-4 p-6">
              <DialogHeader>
                <DialogTitle>Timer Complete</DialogTitle>
                <DialogDescription>
                  Are you finished with this task, or would you like to add more time?
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="flex flex-col sm:flex-row gap-2 mt-6">
                <Button
                  variant="outline"
                  onClick={handleAddTimeAndContinue}
                  className="w-full sm:w-auto"
                >
                  Add 5 Minutes
                </Button>
                <Button
                  onClick={handleComplete}
                  className="w-full sm:w-auto bg-gradient-to-r from-primary to-purple-500 hover:from-purple-500 hover:to-primary"
                >
                  Complete Task
                </Button>
              </DialogFooter>
            </TimerCompletionDialogContent>
          </TimerCompletionDialog>
        </div>
      )}
    </>
  );
};

Timer.displayName = 'Timer';
