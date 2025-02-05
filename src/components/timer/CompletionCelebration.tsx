import { TimerConfetti } from "./TimerConfetti";
import { TimerStateMetrics } from "@/types/metrics";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogTitle,
} from "../ui/dialog";
import { Timer, Clock, Pause, Quote, type LucideIcon } from "lucide-react";
import { Button } from "../ui/button";

interface CompletionCelebrationProps {
  metrics: TimerStateMetrics;
  onComplete: () => void;
}

export const CompletionCelebration = ({
  metrics,
  onComplete,
}: CompletionCelebrationProps) => {
  const formatDuration = (seconds: number) => {
    // Ensure we're working with a valid number
    if (typeof seconds !== 'number' || isNaN(seconds)) {
      console.warn('Invalid duration received:', seconds);
      return '0 secs';
    }

    const totalSeconds = Math.round(seconds);
    if (totalSeconds < 60) {
      return `${totalSeconds} sec${totalSeconds !== 1 ? 's' : ''}`;
    }
    
    const minutes = Math.floor(totalSeconds / 60);
    const remainingSeconds = totalSeconds % 60;
    
    if (minutes < 60) {
      return remainingSeconds > 0
        ? `${minutes}m ${remainingSeconds}s`
        : `${minutes} min${minutes !== 1 ? 's' : ''}`;
    }
    
    const hours = Math.floor(minutes / 60);
    const remainingMins = minutes % 60;
    return `${hours}h ${remainingMins > 0 ? `${remainingMins}m` : ''}`;
  };

  const MetricItem = ({ icon: Icon, label, value }: { icon: LucideIcon, label: string, value: string }) => (
    <div className="flex items-center gap-2 p-2 bg-muted/30 rounded-lg hover:bg-muted/40 transition-colors duration-300">
      <div className="p-1.5 bg-primary/10 rounded-full">
        <Icon className="h-3.5 w-3.5 text-primary" />
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="font-medium text-xs">{value}</p>
      </div>
    </div>
  );

  if (!metrics) return null;

  const safeMetrics = {
    expectedTime: metrics.expectedTime ?? 0,
    actualDuration: metrics.actualDuration ?? 0,
    netEffectiveTime: metrics.netEffectiveTime ?? 0,
    efficiencyRatio: metrics.efficiencyRatio ?? 0,
    pauseCount: metrics.pauseCount ?? 0,
    favoriteQuotes: metrics.favoriteQuotes ?? 0,
    pausedTime: metrics.pausedTime ?? 0,
    extensionTime: metrics.extensionTime ?? 0,
    completionStatus: metrics.completionStatus ?? 'Completed',
  };

  return (
    <>
      {/* Background and confetti layer */}
      <div className="fixed inset-0 z-[1]">
        <div className="absolute inset-0 bg-background/95 backdrop-blur-md" />
        <TimerConfetti
          show={true}
          width={window.innerWidth}
          height={window.innerHeight}
        />
      </div>

      {/* Modal layer */}
      <div className="fixed inset-0 z-[2] flex items-center justify-center p-4">
        <Dialog open={true} onOpenChange={onComplete}>
          <DialogContent className="max-w-[85vw] sm:max-w-md w-full bg-background/95 backdrop-blur-sm border-primary/20">
            <DialogHeader className="space-y-1">
              <DialogTitle className="text-center text-lg sm:text-xl">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">
                  Task Complete! 🎉
                </span>
              </DialogTitle>
              <DialogDescription className="text-center text-sm">
                Great work on completing your task!
              </DialogDescription>
            </DialogHeader>
            
            <div className="py-2">
              <p className="text-xs sm:text-sm text-muted-foreground text-center mb-3">
                Here's how your session went
              </p>

              <div className="grid gap-1.5">
                <MetricItem
                  icon={Timer}
                  label="Planned Duration"
                  value={formatDuration(safeMetrics.expectedTime)}
                />
                
                <MetricItem
                  icon={Clock}
                  label="Total Time Spent"
                  value={formatDuration(safeMetrics.actualDuration)}
                />

                <MetricItem
                  icon={Clock}
                  label="Active Working Time"
                  value={formatDuration(safeMetrics.netEffectiveTime)}
                />

                <div className="text-[10px] sm:text-xs text-muted-foreground text-center">
                  Efficiency Score: {safeMetrics.efficiencyRatio.toFixed(1)}%
                  {safeMetrics.efficiencyRatio > 80 && " 🎯"}
                  {safeMetrics.efficiencyRatio > 95 && " 🌟"}
                </div>

                <MetricItem
                  icon={Pause}
                  label="Focus Breaks"
                  value={`${safeMetrics.pauseCount} ${safeMetrics.pauseCount === 1 ? 'break' : 'breaks'} (${formatDuration(safeMetrics.pausedTime)})`}
                />

                {safeMetrics.extensionTime > 0 && (
                  <MetricItem
                    icon={Timer}
                    label="Added Time"
                    value={formatDuration(safeMetrics.extensionTime)}
                  />
                )}

                <MetricItem
                  icon={Quote}
                  label="Inspiring Quotes"
                  value={`${safeMetrics.favoriteQuotes} ${safeMetrics.favoriteQuotes === 1 ? 'quote' : 'quotes'} saved`}
                />
              </div>
            </div>

            <div className="flex justify-center">
              <Button
                onClick={onComplete}
                className="bg-gradient-to-r from-primary to-purple-500 hover:from-purple-500 hover:to-primary transition-all duration-300 hover:scale-105"
              >
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

CompletionCelebration.displayName = 'CompletionCelebration';
