export interface TimerMetrics {
  startTime: Date | null;
  endTime: Date | null;
  pauseCount: number;
  expectedTime: number;  // Renamed from originalDuration for clarity
  actualDuration: number;
  favoriteQuotes: number;
  pausedTime: number;
  lastPauseTimestamp: Date | null;
  extensionTime: number;
  netEffectiveTime: number;  // Computed as: actualDuration - pausedTime + extensionTime
  efficiencyRatio: number;   // Computed as: (expectedTime / netEffectiveTime) * 100
  completionStatus: 'Completed Early' | 'Completed On Time' | 'Completed Late';
}

export interface MetricsDisplayProps {
  metrics: TimerMetrics;
  taskName: string;
}

export interface TimerStateMetrics extends TimerMetrics {
  isPaused: boolean;
  pausedTimeLeft: number | null;
}