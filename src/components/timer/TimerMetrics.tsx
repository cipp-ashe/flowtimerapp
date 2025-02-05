import { TimerMetrics } from "@/types/metrics";
import { Clock, Pause, Quote } from "lucide-react";

interface TimerMetricsDisplayProps {
  metrics: TimerMetrics;
  isRunning: boolean;
}

const formatTime = (seconds: number): string => {
  if (seconds === 0) return "0s";
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  if (minutes === 0) return `${remainingSeconds}s`;
  if (remainingSeconds === 0) return `${minutes}m`;
  return `${minutes}m ${remainingSeconds}s`;
};

export const TimerMetricsDisplay = ({ metrics, isRunning }: TimerMetricsDisplayProps) => {
  if (!metrics) return null;

  return (
    <div className="text-sm text-muted-foreground space-y-2 pt-2">
      <div className="flex items-center gap-2">
        <Clock className="h-4 w-4" />
        <span>
          {metrics.extensionTime > 0 && (
            <span className="text-primary">
              +{formatTime(metrics.extensionTime)} added •{" "}
            </span>
          )}
          {formatTime(metrics.pausedTime)} paused
        </span>
      </div>
      
      <div className="flex items-center gap-2">
        <Pause className="h-4 w-4" />
        <span>
          {metrics.pauseCount} {metrics.pauseCount === 1 ? 'break' : 'breaks'} taken
        </span>
      </div>
      
      {metrics.favoriteQuotes > 0 && (
        <div className="flex items-center gap-2">
          <Quote className="h-4 w-4" />
          <span>{metrics.favoriteQuotes} quotes saved</span>
        </div>
      )}
    </div>
  );
};
