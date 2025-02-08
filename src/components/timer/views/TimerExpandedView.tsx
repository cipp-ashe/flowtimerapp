import * as React from "react";
import { Card } from "../../ui/card";
import { TimerDisplay } from "../TimerDisplay";
import { TimerControls } from "../controls/TimerControls";
import { TimerMetricsDisplay } from "../TimerMetrics";
import { QuoteDisplay } from "../../quotes/QuoteDisplay";
import { Quote } from "@/types/timer";
import { TimerStateMetrics } from "@/types/metrics";
import { NotesEditor } from "../../notes/NotesEditor";
import { useNotes, type Note } from "@/hooks/useNotes";
import { CollapsibleNotesList } from "@/components/notes/components/CollapsibleNotesList";

interface TimerExpandedViewProps {
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
    onAddTime: () => void;
    metrics: TimerStateMetrics;
    showAddTime: boolean;
    size: "large";
  };
  metrics: TimerStateMetrics;
  onClose: () => void;
  onLike: () => void;
  favorites: Quote[];
  setFavorites: React.Dispatch<React.SetStateAction<Quote[]>>;
}

export interface TimerExpandedViewRef {
  saveNotes: () => void;
}

export const TimerExpandedView = React.memo(React.forwardRef<TimerExpandedViewRef, TimerExpandedViewProps>(({
  taskName,
  timerCircleProps,
  timerControlsProps: originalTimerControlsProps,
  metrics,
  onClose,
  onLike,
  favorites,
  setFavorites,
}, ref) => {
  const { 
    notes, 
    selectedNote, 
    selectNoteForEdit,
    currentContent,
    updateCurrentContent,
    updateNote,
    addNote,
    clearSelectedNote
  } = useNotes();
  
  const timerControlsProps = originalTimerControlsProps;

  const handleSave = () => {
    if (!currentContent.trim()) return;

    if (selectedNote) {
      updateNote(selectedNote.id, currentContent);
      clearSelectedNote();
    } else {
      addNote();
      clearSelectedNote();
    }
    updateCurrentContent('');
  };

  React.useImperativeHandle(ref, () => ({
    saveNotes: () => {
      if (currentContent.trim()) {
        handleSave();
      }
    }
  }));

  return (
    <div className="relative w-full max-w-[900px] mx-auto px-4 py-4 z-[101] flex flex-col gap-4 h-[90vh] overflow-x-hidden">
      <QuoteDisplay 
        showAsOverlay
        currentTask={taskName}
        onLike={onLike}
        favorites={favorites}
        setFavorites={setFavorites}
      />

      <Card className="bg-card/90 backdrop-blur-md shadow-lg p-6 border-primary/20">
        <div className="flex flex-col justify-center">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500 tracking-tight">
              {taskName}
            </h1>
          </div>
        
          <div className="relative">
            <div className="absolute top-2 right-2">
              <TimerMetricsDisplay 
                metrics={metrics}
                isRunning={timerCircleProps.isRunning}
              />
            </div>

            <div className="flex flex-col items-center gap-8">
              <TimerDisplay
                circleProps={timerCircleProps}
                size="large"
                isRunning={timerCircleProps.isRunning}
              />

              <div className="w-full flex justify-center">
                <div className="w-[372px]">
                  <TimerControls {...timerControlsProps} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Card className="bg-card/90 backdrop-blur-md shadow-lg border-primary/20 flex-1">
        <div className="p-6 h-full flex flex-col">
          <h2 className="text-lg font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">
            Task Notes
          </h2>
          <div className="flex-1 overflow-hidden bg-background/50 rounded-lg border border-primary/10 p-4">
            <div className="h-full flex flex-col gap-6" onClick={e => e.stopPropagation()}>
              <NotesEditor 
                selectedNote={selectedNote}
                content={currentContent}
                onChange={updateCurrentContent}
                onSave={handleSave}
                isEditing={!!selectedNote}
              />
              <CollapsibleNotesList 
                notes={notes}
                onEditNote={selectNoteForEdit}
                inExpandedView={true}
              />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}));

TimerExpandedView.displayName = 'TimerExpandedView';

